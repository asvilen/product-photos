#!/usr/bin/env python3
"""Royalty-free soundtrack for collection videos: a modern pop arrangement of a Mozart piece
(one per collection, see pieces/). The melodies are in the public domain and most viewers
half-recognise them; the arrangement is synthesised here.

render.mjs derives the song's form from the video's scenes:

    {"bpm": 110, "seed": 7, "piece": "nachtmusik",
     "sections": [["intro", 4], ["theme", 56], ["break", 8], ["build", 4], ["theme", 12], ["outro", 12]],
     "swooshes": [16, 24]}                    # in beats; each swoosh peaks on its beat

    python3 generate.py --plan plan.json --out music.wav

intro   tonic stabs under the hook, then silence and the piece's pickup note
theme   the piece's opening bars over pop drums; a later theme section starts again from the top
break   a quieter passage (piano and glockenspiel over a filtered pad)
build   a climbing string tremolo over the dominant, a snare roll, then the pickup into the theme
outro   the coda, landing on the final chord, then the piece's closing button
"""
import argparse
import importlib
import json
import wave

import numpy as np

SR = 44100
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def hz(name):
    m = 12 * (int(name[-1]) + 1) + NOTE[name[:-1]]
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------------------------------
# DSP building blocks

TABLE = 2048
_saw_tables = {}


def saw(freq, n, phase=0.0):
    """Band-limited sawtooth from a wavetable; freq may be an array (vibrato, sweeps)."""
    f = np.broadcast_to(np.asarray(freq, dtype=float), (n,))
    harmonics = int(max(1, min(128, SR * 0.45 / f.max())))
    harmonics = 1 << (harmonics.bit_length() - 1)
    if harmonics not in _saw_tables:
        ph = np.arange(TABLE) / TABLE
        k = np.arange(1, harmonics + 1)[:, None]
        table = (np.sin(2 * np.pi * k * ph) / k).sum(0) * (2 / np.pi)
        _saw_tables[harmonics] = np.append(table, table[0])
    ph = (phase + np.cumsum(f) / SR) % 1.0
    return np.interp(ph * TABLE, np.arange(TABLE + 1), _saw_tables[harmonics])


def env(n, attack=0.003, release=0.02):
    e = np.ones(n)
    a, r = max(1, min(n, int(attack * SR))), max(1, min(n, int(release * SR)))
    e[:a] = np.linspace(0, 1, a)
    e[n - r:] *= np.linspace(1, 0, r)
    return e


def lowpass(fc, order=2):
    return lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order))


def highpass(fc, order=2):
    return lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))


def bandpass(lo, hi):
    return lambda f: lowpass(hi)(f) * highpass(lo)(f)


def peak(fc, gain_db, octaves=1.0):
    g = 10 ** (gain_db / 20) - 1
    return lambda f: 1 + g * np.exp(-0.5 * (np.log2(np.maximum(f, 1) / fc) / (octaves / 2)) ** 2)


def fft_filter(x, gain):
    spec = np.fft.rfft(x, axis=-1) * gain(np.fft.rfftfreq(x.shape[-1], 1 / SR))
    return np.fft.irfft(spec, x.shape[-1], axis=-1)


def stft_filter(x, gain, n_fft=2048, hop=512):
    """Time-varying filter: gain(times[:, None], freqs[None, :]) is applied per STFT frame."""
    x = np.atleast_2d(x)
    n, pad, ratio = x.shape[1], n_fft, n_fft // hop
    frames = int(np.ceil((n + 2 * pad) / hop))
    total = (frames - 1) * hop + n_fft
    win = np.hanning(n_fft + 1)[:-1]
    idx = np.arange(n_fft)[None, :] + hop * np.arange(frames)[:, None]
    times = (np.arange(frames) * hop + n_fft / 2 - pad) / SR
    g = gain(times[:, None], np.fft.rfftfreq(n_fft, 1 / SR)[None, :])
    wsum = np.zeros(total)
    for j in range(ratio):
        count = len(range(j, frames, ratio))
        wsum[j * hop:j * hop + count * n_fft] += np.tile(win ** 2, count)
    out = np.zeros_like(x)
    for ch in range(x.shape[0]):
        xp = np.zeros(total)
        xp[pad:pad + n] = x[ch]
        y_frames = np.fft.irfft(np.fft.rfft(xp[idx] * win, axis=-1) * g, n_fft, axis=-1) * win
        y = np.zeros(total)
        for j in range(ratio):
            count = len(range(j, frames, ratio))
            y[j * hop:j * hop + count * n_fft] += y_frames[j::ratio].reshape(-1)
        out[ch] = y[pad:pad + n] / np.maximum(wsum[pad:pad + n], 1e-6)
    return out


def sweep_gain(center, width=0.6):
    return lambda t, f: np.exp(-0.5 * (np.log2(np.maximum(f, 20) / center(t)) / width) ** 2)


def convolve(x, ir):
    size = len(x) + len(ir)
    nfft = 1 << (size - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]


def pan2(sig, pan):
    return np.vstack([sig * np.cos((pan + 1) * np.pi / 4), sig * np.sin((pan + 1) * np.pi / 4)]) * np.sqrt(2)


# ---------------------------------------------------------------------------------------
# Instruments

def strings(f, dur, rng, trill=False, voices=3, soft=False):
    """Bowed string section: detuned saws with delayed vibrato (and an optional trill)."""
    n = int((dur + 0.14) * SR)
    t = np.arange(n) / SR
    vib_env = np.clip((t - 0.12) / 0.25, 0, 1)
    out = np.zeros((2, n))
    for v in range(voices):
        x = v / max(1, voices - 1) * 2 - 1
        semis = x * 0.07 + (0.11 + 0.05 * rng.random()) * vib_env * np.sin(2 * np.pi * (5.2 + 0.5 * rng.random()) * t + rng.uniform(0, 6.3))
        if trill:  # alternate with the note a whole tone up, starting from the upper note
            semis = semis + 2 * (0.5 + 0.5 * np.tanh(6 * np.cos(2 * np.pi * t / 0.13)))
        out += pan2(saw(f * 2 ** (semis / 12), n, rng.random()), x * 0.6)
    attack = min(0.15, dur * 0.4) if soft else min(0.06, max(0.012, dur * 0.22))
    shape = np.minimum(1, t / attack) * (0.85 + 0.15 * np.exp(-t * 3))
    hold = int(dur * SR)
    shape[hold:] *= np.exp(-(t[hold:] - dur) * 30)
    return out * shape / voices


def glock(f, rng):
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    sig = (np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) + 0.25 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 7)
           + 0.1 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t * 14))
    return sig * np.minimum(1, t / 0.0006) * env(n, 0.0005, 0.1)


def piano(f, dur, rng):
    """Two strings a hair apart per note, stretched partials and a soft hammer."""
    n = int((dur + 0.6) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for cents in (-0.7, 0.7):
        for k in range(1, 12):
            fk = f * 2 ** (cents / 1200) * k * np.sqrt(1 + 0.00015 * k * k)
            if fk > SR * 0.45:
                break
            out += (0.5 / k ** 1.8) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.3)) * np.exp(-(1.1 + 0.8 * k) * (f / 262) ** 0.35 * t)
    out += fft_filter(rng.standard_normal(n), bandpass(500, 3500)) * np.exp(-t * 160) * 0.05
    hold = int(dur * SR)
    out[hold:] *= np.exp(-(t[hold:] - dur) * 8)
    return out * np.minimum(1, t / 0.004)


def pad(freqs, dur, rng, attack=0.12, release=0.35):
    n = int((dur + release) * SR)
    out = np.zeros((2, n))
    for f in freqs:
        for v in range(5):
            x = v / 4 * 2 - 1
            out += pan2(saw(f * 2 ** (x * 0.15 / 12), n, rng.random()), x * 0.8)
    e = env(n, attack, release)
    return out * e / (len(freqs) * 5)


def bass_pluck(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    k = np.arange(1, int(min(40, SR * 0.45 / f)) + 1)[:, None]
    fc = 200 + 1800 * np.exp(-t * 16)
    amps = (1 / k) / np.sqrt(1 + ((k * f) / fc) ** 4)
    sig = (amps * np.sin(2 * np.pi * k * f * t)).sum(0)
    return sig * (0.55 + 0.45 * np.exp(-t * 10)) * env(n, 0.003, 0.03)


def sub(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.tanh(1.6 * np.sin(2 * np.pi * f * t)) / np.tanh(1.6) * env(n, 0.01, 0.05)


METAL = np.array([205.3, 304.4, 369.6, 522.7, 540.0, 800.0]) * 1.7


def metal(n):
    t = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * METAL[:, None] * t)).mean(0)


def kick(rng):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 48 + 170 * np.exp(-t * 38) + 20 * np.exp(-t * 6)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.0)
    click = fft_filter(rng.standard_normal(n), highpass(2500)) * np.exp(-t * 1500) * 0.45
    return np.tanh(1.6 * (body + click)) * env(n, 0.0005, 0.03)


def clap(rng):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    e = np.zeros(n)
    for i, off in enumerate((0, 0.011, 0.022, 0.033)):
        tt = t - off
        m = tt >= 0
        e[m] += np.exp(-tt[m] * (160 if i < 3 else 10)) * (0.7 if i < 3 else 1.0)
    noise = fft_filter(rng.standard_normal(n), bandpass(900, 8000)) * e
    snap = fft_filter(rng.standard_normal(n), bandpass(2000, 9000)) * np.exp(-t * 26) * 0.5
    return noise + snap + np.sin(2 * np.pi * 200 * t) * np.exp(-t * 35) * 0.35


def snare(rng, pitch=190.0):
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    noise = fft_filter(rng.standard_normal(n), bandpass(1500, 9000)) * np.exp(-t * 24)
    tone = (np.sin(2 * np.pi * pitch * t) + 0.4 * np.sin(2 * np.pi * pitch * 1.7 * t)) * np.exp(-t * 32)
    return (0.8 * noise + 0.5 * tone) * env(n, 0.0005, 0.02)


def rim(rng):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    return (fft_filter(rng.standard_normal(n), bandpass(1500, 5000)) * np.exp(-t * 90) + np.sin(2 * np.pi * 1750 * t) * np.exp(-t * 70) * 0.6)


def hat(rng):
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    src = fft_filter(0.5 * metal(n) + 0.8 * rng.standard_normal(n), highpass(7500, 3))
    return src * np.exp(-t * 65) * env(n, 0.0008, 0.01)


def tambourine(rng):
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    jingles = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6.3)) for f in (5200, 6300, 7400, 8800, 10100))
    src = fft_filter(0.5 * jingles + rng.standard_normal(n), highpass(5000, 2))
    return src * np.exp(-t * 32) * np.minimum(1, t / 0.004)


def shaker(rng):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return fft_filter(rng.standard_normal(n), bandpass(5500, 13000)) * np.minimum(1, t / 0.012) * np.exp(-t * 50)


def tom(rng, pitch):
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = pitch * (1 + 0.6 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    return body + fft_filter(rng.standard_normal(n), bandpass(1000, 6000)) * np.exp(-t * 60) * 0.2


def crash(rng, seconds=2.6):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    src = fft_filter(0.35 * metal(n) + rng.standard_normal(n), highpass(3200))
    return src * np.exp(-t * 1.9) * env(n, 0.001, 0.2)


def riser(rng, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = stft_filter(rng.standard_normal((2, n)), sweep_gain(lambda tt: 400 * (10000 / 400) ** np.clip(tt / dur, 0, 1), 0.55))
    return noise * (t / dur) ** 2.2 * env(n, 0.01, 0.005)


def swoosh(rng, dur=0.55, peak_at=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR

    def center(tt):
        u = np.clip(tt / dur, 0, 1)
        return np.where(u < peak_at, 500 * (6000 / 500) ** (u / peak_at), 6000 * (1200 / 6000) ** ((u - peak_at) / (1 - peak_at)))

    y = stft_filter(rng.standard_normal((2, n)), sweep_gain(center, 0.8), n_fft=1024, hop=256)
    u = t / dur
    y *= np.where(u < peak_at, (u / peak_at) ** 2, np.exp(-(u - peak_at) * 9))
    p = np.clip(u * 1.4 - 0.2, 0, 1)
    y[0] *= np.cos(p * np.pi / 2)
    y[1] *= np.sin(p * np.pi / 2)
    return y


def impact(rng):
    n = int(2.8 * SR)
    t = np.arange(n) / SR
    f = 32 + 60 * np.exp(-t * 4)
    boom = np.tanh(2.0 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2.4)
    thump = fft_filter(rng.standard_normal(n), lowpass(2200)) * np.exp(-t * 14) * 0.45
    tail = np.zeros(n)
    c = crash(rng)
    tail[:len(c)] = c
    return (boom * 0.85 + thump + 0.4 * tail) * env(n, 0.001, 0.3)


def reverse_crash(rng, dur):
    c = crash(rng, dur + 0.4)[::-1][-int(dur * SR):]
    return c * env(len(c), 0.05, 0.004)


# ---------------------------------------------------------------------------------------
# Arrangement

def arrange(plan):
    piece = importlib.import_module(f"pieces.{plan.get('piece', 'nachtmusik')}")
    rng = np.random.default_rng(plan.get('seed', 7))
    beat = 60 / plan['bpm']
    sections, b = [], 0
    for name, length in plan['sections']:
        sections.append((name, b, b + length))
        b += length
    total_beats = b
    n = int((total_beats * beat + 5) * SR)
    names = ('kick', 'drums', 'bass', 'sub', 'pad', 'keys', 'strings', 'lead', 'glock', 'solo', 'fx')
    buses = {k: np.zeros((2, n)) for k in names}
    send = np.zeros((2, n))
    kicks = []
    forte = np.zeros(n, bool)  # loud theme bars: the reference for balancing
    soft = np.zeros(n, bool)  # quiet theme bars, where the piano leads

    kits = {'kick': [kick(rng) for _ in range(2)], 'clap': [clap(rng) for _ in range(3)], 'rim': [rim(rng) for _ in range(2)],
            'hat': [hat(rng) for _ in range(4)], 'tamb': [tambourine(rng) for _ in range(3)], 'shaker': [shaker(rng) for _ in range(3)]}

    def pick(name):
        return kits[name][rng.integers(len(kits[name]))]

    def span(at, length):
        return slice(int(at * beat * SR), int((at + length) * beat * SR))

    def put(bus, sig, at, gain=1.0, pan=0.0, rev=0.0, offset=0.0, human=0.0):
        i = int(round((at * beat + offset + rng.uniform(-human, human)) * SR))
        sig = np.atleast_2d(sig)
        if sig.shape[0] == 1:
            sig = pan2(sig[0], pan)
        if i < 0:
            sig, i = sig[:, -i:], 0
        m = min(sig.shape[1], n - i)
        if m <= 0:
            return
        buses[bus][:, i:i + m] += sig[:, :m] * gain
        if rev:
            send[:, i:i + m] += sig[:, :m] * gain * rev

    def hit_kick(at, gain=1.0):
        put('kick', pick('kick'), at, gain)
        kicks.append(at * beat)

    def decaying(sig, rate):
        return sig * np.exp(-np.arange(sig.shape[-1]) / SR * rate)

    def melody(notes, at, style, main=True):
        for note in notes:
            off, length, name = note[:3]
            trill, grace = 'tr' in note[3:], 'grace' in note[3:]
            f, dur = hz(name), length * beat
            g = (0.6 if grace else 1.0 if off % 1 == 0 else 0.85) * (1.0 if main else 0.55)
            if style in ('unison', 'forte'):
                layers = [(1, 1.0)]
                if main:  # octaves below: the whole band for the opening, the violas otherwise
                    layers += [(0.5, 0.6), (0.25, 0.35)] if style == 'unison' else [(0.5, 0.45)]
                for k, lg in layers:
                    put('strings', strings(f * k, dur, rng, trill), at + off, gain=g * lg, rev=0.3, human=0.004)
                if main and not (trill or grace) and length >= 0.5:
                    put('glock', glock(f * 2, rng), at + off, gain=g, pan=0.25, rev=0.4)
            else:
                put('lead', piano(f, dur, rng), at + off, gain=0.9 * g, pan=-0.1, rev=0.35, human=0.003)
                if style == 'piano':
                    put('strings', strings(f, dur, rng, trill, soft=True), at + off, gain=0.3 * g, rev=0.35)
                elif main and not grace:
                    put('glock', glock(f * 2, rng), at + off, gain=0.5 * g, pan=0.3, rev=0.5)

    def harmony(chords, at, length, style='forte', stabs=True):
        """Pad + sub (+ piano stabs on beats 0 and 2) for a list of (beat, chord) within one bar."""
        loud = style in ('unison', 'forte')
        for j, (off, name) in enumerate(chords):
            end = min(length, chords[j + 1][0] if j + 1 < len(chords) else length)
            if off >= end:
                continue
            voicing, root = piece.CHORDS[name]
            freqs = [hz(x) for x in voicing]
            put('pad', pad(freqs, (end - off) * beat, rng), at + off, rev=0.25)
            put('sub', sub(hz(root), (end - off) * beat), at + off, gain=1.0 if loud else 0.7)
            if stabs:
                for s in [x for x in (0, 2) if off <= x < end] or [off]:
                    for i, fq in enumerate(freqs[1:]):
                        put('keys', piano(fq, 1.6 * beat, rng), at + s, gain=0.8, pan=-0.3 + 0.15 * i, rev=0.3, offset=0.006 * i)

    def drums(at, length, style, fill=False, kick_at=None):
        if style == 'break':
            for k in range(length):
                for q in (0, 0.5):
                    put('drums', pick('shaker'), at + k + q, gain=0.22 if q else 0.14, pan=-0.3)
                if k in (1, 3):
                    put('drums', pick('rim'), at + k, gain=0.4, rev=0.3)
            return
        loud = style in ('unison', 'forte')
        if kick_at is not None:  # kicks that follow the melody's rhythm
            for q in kick_at:
                if q < length:
                    hit_kick(at + q, 1.0 if q % 1 == 0 else 0.75)
        for k in range(length):
            if loud:
                if kick_at is None:
                    if k in (0, 2):
                        hit_kick(at + k)
                    if k == 1:
                        hit_kick(at + k + 0.5, 0.7)
                if k in (1, 3):
                    put('drums', pick('clap'), at + k, gain=0.9, rev=0.2)
                for q in (0, 0.5):
                    put('drums', pick('hat'), at + k + q, gain=0.3 if q else 0.2, pan=-0.2)
                for q in (0.25, 0.75):
                    put('drums', pick('tamb'), at + k + q, gain=0.16, pan=0.35)
            else:
                if k in (0, 2):
                    hit_kick(at + k, 0.8)
                if k in (1, 3):
                    put('drums', pick('rim'), at + k, gain=0.55, rev=0.25)
                for q in (0, 0.5):
                    put('drums', pick('hat'), at + k + q, gain=0.2 if q else 0.12, pan=-0.2)
        if fill and length == 4:  # a quick tom run where the melody rests
            for i, (q, p) in enumerate(((3, 196), (3.25, 165), (3.5, 131), (3.75, 110))):
                put('drums', tom(rng, p), at + q, gain=(0.55 + 0.1 * i) * (1 if loud else 0.6), pan=0.3 - 0.2 * i, rev=0.2)

    def play(bar, at, length):
        """One bar of the piece: melody (+ counter-voice), chords, bass and drums in its style."""
        style = bar['style']
        length = min(length, bar.get('length', 4))
        if style in ('unison', 'forte'):
            forte[span(at, length)] = True
        elif style == 'piano':
            soft[span(at, length)] = True
        melody(bar['melody'], at, style)
        melody(bar.get('second', []), at, style, main=False)
        harmony(bar['chords'], at, length, style, stabs=style in ('unison', 'forte'))
        for off, ln, note in bar['bass']:
            if off < length:
                put('bass', bass_pluck(hz(note), ln * beat * 0.9), at + off, gain={'break': 0.7, 'piano': 0.8}.get(style, 1.0))
        drums(at, length, style, fill=bar.get('fill', False), kick_at=bar.get('kicks'))

    def roll(start, length):
        hits, t = [], 0.0
        for until, step in ((0.5, 0.5), (0.75, 0.25), (1.0, 0.125)):
            while t < length * until - 1e-9:
                hits.append(t)
                t += step
        for h in hits:
            u = h / length
            put('drums', snare(rng, 180 + 150 * u), start + h, gain=0.3 + 0.6 * u, rev=0.25)

    def pickup(at):
        off, length, name = piece.PICKUP
        put('solo', strings(hz(name), length * beat, rng), at + off, rev=0.35)
        put('solo', strings(hz(name) / 2, length * beat, rng), at + off, gain=0.45, rev=0.35)

    def ending(at, end):
        """The final chord at `at`, then the piece's closing button; the last note rings out."""
        e = piece.ENDING
        voicing, root = piece.CHORDS[e['chord']]
        freqs = [hz(x) for x in voicing]
        ring = (end - at) * beat + 2.0
        put('fx', impact(rng), at, gain=0.9, rev=0.3)
        put('drums', crash(rng), at, gain=0.6, rev=0.3)
        hit_kick(at)
        for i, name in enumerate(e['top']):
            put('strings', strings(hz(name), beat, rng), at, gain=1.0 if i == 0 else 0.6, rev=0.35)
        chord = pad(freqs, ring, rng, release=ring * 0.6)
        put('pad', decaying(chord, 0.45), at, gain=1.2, rev=0.35)
        for i, fq in enumerate(freqs):
            put('keys', piano(fq, 2.5, rng), at, offset=0.012 * i, rev=0.4)
        for i, x in enumerate(e['sparkle']):
            put('glock', glock(hz(x), rng), at + i * 0.25, gain=1.2, pan=-0.3 + 0.2 * i, rev=0.5)
        put('sub', sub(hz(root), beat), at)
        put('bass', bass_pluck(hz(e['bass']), beat * 0.9), at)
        for off, length in e['button']:
            t = at + off
            last = length is None
            dur = (end - t) * beat + 1.0 if last else length * beat
            for i, name in enumerate(e['unison']):
                s = strings(hz(name), dur, rng)
                put('strings', decaying(s, 0.6) if last else s, t, gain=(1.0, 0.6, 0.35)[i], rev=0.4 if last else 0.3)
            put('bass', bass_pluck(hz(e['bass']), min(dur, 2.0) * 0.9), t)
            hit_kick(t, 1.0 if last else 0.75)
            if last:
                put('drums', crash(rng), t, gain=0.45, rev=0.3)
                put('sub', decaying(sub(hz(root), 2.5), 1.3), t)
                for i, fq in enumerate(freqs):
                    put('keys', piano(fq, 2.5, rng), t, gain=0.7, offset=0.01 * i, rev=0.4)

    for si, (name, s0, s1) in enumerate(sections):
        nxt = sections[si + 1][0] if si + 1 < len(sections) else None
        for bi, bs in enumerate(range(s0, s1, 4)):
            length = min(4, s1 - bs)
            if name == 'theme':
                bar = piece.THEME[bi % len(piece.THEME)]
                if bi == 0:
                    put('fx', impact(rng), bs, gain=0.8, rev=0.2)
                if bi == 0 or bar.get('crash'):
                    put('drums', crash(rng), bs, gain=0.5, rev=0.2)
                play(bar, bs, length)
            elif name == 'break':
                play(piece.BREAK[bi % len(piece.BREAK)], bs, length)
            elif name == 'intro':
                put('fx', impact(rng), bs, gain=0.7, rev=0.2)
                for k in range(length):
                    hit_kick(bs + k)
                    for fq in (hz(x) for x in piece.INTRO['stab']):
                        put('strings', strings(fq, 0.35 * beat, rng), bs + k, gain=0.55, rev=0.3)
                    if k in (1, 3):
                        put('drums', pick('clap'), bs + k, gain=0.8, rev=0.2)
                harmony([(0, piece.INTRO['chord'])], bs, length)
            elif name == 'build':
                bld = piece.BUILD
                harmony([(0, bld['chord'])], bs, length, stabs=False)
                for k in range(min(3, length)):
                    hit_kick(bs + k)
                for q in np.arange(0, length - 0.5, 0.5):  # pedal, getting louder
                    put('bass', bass_pluck(hz(bld['bass']), 0.45 * beat), bs + q, gain=0.5 + 0.4 * q / length)
                for off, ln, note in bld['line']:  # the climbing line as a swelling tremolo, in octaves
                    for q in np.arange(off, off + ln - 1e-9, 0.25):
                        u = q / length
                        for k, lg in ((1, 1.0), (0.5, 0.6)):
                            put('strings', strings(hz(note) * k, 0.22 * beat, rng), bs + q, gain=(0.35 + 0.45 * u) * lg, rev=0.3)
            elif name == 'outro' and bi < len(piece.OUTRO):
                play(piece.OUTRO[bi], bs, length)
        if name == 'outro':
            ending(s0 + piece.ENDING['at'], s1)

        # Into a theme: riser + roll, then silence except a lone pickup note.
        if nxt == 'theme':
            gap_at = s1 - 0.5
            if name == 'build':
                roll(s0, (s1 - s0) - 0.5)
                put('fx', riser(rng, (s1 - s0 - 0.5) * beat), s0, gain=0.5, rev=0.3)
            else:
                put('fx', riser(rng, 1.5 * beat), s1 - 2, gain=0.4, rev=0.3)
            put('fx', reverse_crash(rng, 0.75 * beat), s1 - 0.75, gain=0.35)
            pickup(s1 - 4)
            i0, i1 = int(gap_at * beat * SR), int(s1 * beat * SR)
            ramp = int(0.006 * SR)
            for k in ('kick', 'drums', 'bass', 'sub', 'pad', 'keys', 'strings', 'lead', 'glock'):
                buses[k][:, i0:i1] = 0
                buses[k][:, i0 - ramp:i0] *= np.linspace(1, 0, ramp)
            send[:, i0:i1] = 0

    for at in plan.get('swooshes', []):
        put('fx', swoosh(rng), at, gain=0.3, offset=-0.6 * 0.55, rev=0.2)

    # --- mix ---------------------------------------------------------------------------
    secs = [(name, s0 * beat, s1 * beat) for name, s0, s1 in sections]

    def pad_filter(tt, ff):
        fc = np.full(tt.shape, 5000.0)
        for name, a, b_ in secs:
            m = (tt >= a) & (tt < b_)
            u = (tt[m] - a) / (b_ - a)
            if name == 'break':
                fc[m] = 1300
            elif name == 'build':
                fc[m] = 900 * (7000 / 900) ** u
        return (1 / np.sqrt(1 + (ff / fc) ** 4)) * highpass(180)(ff)

    buses['pad'] = stft_filter(buses['pad'], pad_filter)
    body = lambda f: highpass(170)(f) * lowpass(8000)(f) * peak(2800, 2.5)(f) * peak(320, 1.5)(f)
    buses['strings'] = fft_filter(buses['strings'], body)
    buses['solo'] = fft_filter(buses['solo'], body)
    buses['lead'] = fft_filter(buses['lead'], highpass(160))
    buses['glock'] = fft_filter(buses['glock'], highpass(500))
    buses['keys'] = fft_filter(buses['keys'], highpass(120))

    def pump(depth, release=0.7):
        g = np.ones(n)
        att, r = int(0.005 * SR), int(release * beat * SR)
        curve = np.concatenate([np.linspace(1, 1 - depth, att), 1 - depth * (1 - np.linspace(0, 1, r)) ** 2])
        for kt in kicks:
            i = int(kt * SR) - att
            if 0 <= i < n:
                m = min(len(curve), n - i)
                g[i:i + m] = np.minimum(g[i:i + m], curve[:m])
        return g

    buses['pad'] *= pump(0.3)
    buses['sub'] *= pump(0.5)

    targets = {'kick': -15.0, 'sub': -21.0, 'bass': -20.0, 'pad': -25.0, 'keys': -24.5, 'strings': -18.0, 'glock': -29.0,
               'drums': -22.0, 'lead': -21.5}
    for k, db in targets.items():
        mask = soft if k == 'lead' else forte
        rms = np.sqrt(np.mean(buses[k][:, mask] ** 2)) + 1e-12
        g = 10 ** (db / 20) / rms
        buses[k] *= g
        if k == 'strings':
            buses['solo'] *= g  # the pickup note matches the section it introduces
    buses['fx'] *= 10 ** (-6 / 20) / (np.max(np.abs(buses['fx'])) + 1e-12)

    send_rms = np.sqrt(np.mean(send[:, forte] ** 2)) + 1e-12
    send *= 10 ** (-21 / 20) / send_rms
    ir_len = int(2.6 * SR)
    t_ir = np.arange(ir_len) / SR
    wet = np.zeros_like(send)
    for ch in range(2):
        ir = fft_filter(rng.standard_normal(ir_len) * np.exp(-2.7 * t_ir), lowpass(6500))
        ir = np.concatenate([np.zeros(int(0.022 * SR)), ir])
        wet[ch] = convolve(send[ch], ir / np.sqrt(np.sum(ir ** 2)))
    solo_wet = np.zeros_like(send)
    for ch in range(2):  # the lone pickup note gets its own reverb so the silence around it sings
        ir = fft_filter(rng.standard_normal(ir_len) * np.exp(-2.7 * t_ir), lowpass(6500))
        solo_wet[ch] = convolve(buses['solo'][ch], ir / np.sqrt(np.sum(ir ** 2)))

    mix = sum(buses.values()) + wet * 0.9 + solo_wet * 0.35
    mix *= 10 ** (-12.0 / 20) / (np.sqrt(np.mean(mix[:, forte] ** 2)) + 1e-12)
    mix = np.tanh(mix * 1.1) / 1.1
    mix = limiter(mix, 10 ** (-1.0 / 20))
    end = int((total_beats * beat + 1.5) * SR)
    mix = mix[:, :end]
    mix[:, -int(0.05 * SR):] *= np.linspace(1, 0, int(0.05 * SR))
    return mix


def limiter(x, ceiling, block=64, release=0.08):
    peak_ = np.abs(x).max(0)
    nb = int(np.ceil(len(peak_) / block))
    padded = np.zeros(nb * block)
    padded[: len(peak_)] = peak_
    need = np.minimum(1, ceiling / np.maximum(padded.reshape(nb, block).max(1), 1e-9))
    need = np.minimum(need, np.append(need[1:], 1.0))
    gains = np.empty(nb)
    cur, rel = 1.0, np.exp(-block / (release * SR))
    for i in range(nb):
        cur = need[i] if need[i] < cur else need[i] + (cur - need[i]) * rel
        gains[i] = cur
    g = np.interp(np.arange(len(peak_)), np.arange(nb) * block, gains)
    return np.clip(x * g, -ceiling, ceiling)


def write_wav(path, stereo):
    pcm = (np.clip(stereo.T, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--plan', required=True, help='JSON arrangement written by render.mjs')
    p.add_argument('--out', required=True)
    args = p.parse_args()
    with open(args.plan) as f:
        plan = json.load(f)
    write_wav(args.out, arrange(plan))


if __name__ == '__main__':
    main()
