"""Mozart, Eine kleine Nachtmusik (Serenade in G, K. 525), I. Allegro.

Melody, counter-voice and bass are taken from the violin and cello parts of the Mutopia
Project edition (public domain); bar numbers below are the score's. Chords and the pop
rhythm section are ours.

Notes are (beat, length in beats, pitch[, 'tr' trill | 'grace']). A bar's style picks the
instruments: 'unison' (everyone in octaves, like the opening), 'forte' (strings lead),
'piano' (piano lead over soft strings) or 'break' (piano and glockenspiel, no kick).
"""


def bar(melody, chords, bass, style='forte', **extra):
    return dict(melody=melody, chords=chords, bass=bass, style=style, **extra)


CHORDS = {  # pad voicing, sub root
    'G':    (('G3', 'B3', 'D4', 'G4', 'B4'), 'G1'),
    'G/B':  (('G3', 'B3', 'D4', 'G4', 'B4'), 'B1'),
    'C':    (('G3', 'C4', 'E4', 'G4', 'C5'), 'C2'),
    'D':    (('F#3', 'A3', 'D4', 'F#4', 'A4'), 'D2'),
    'D/A':  (('F#3', 'A3', 'D4', 'F#4', 'A4'), 'A1'),
    'D/F#': (('F#3', 'A3', 'D4', 'F#4', 'A4'), 'F#1'),
    'D7':   (('F#3', 'A3', 'C4', 'D4', 'F#4'), 'D2'),
    'D7/G': (('F#3', 'A3', 'C4', 'D4', 'F#4'), 'G1'),
    'D5':   (('D3', 'A3', 'D4', 'A4'), 'D2'),
    'Em':   (('G3', 'B3', 'E4', 'G4', 'B4'), 'E1'),
    'Am/C': (('E3', 'A3', 'C4', 'E4', 'A4'), 'C2'),
    'B7':   (('F#3', 'A3', 'B3', 'D#4', 'F#4'), 'B1'),
    'A7':   (('E3', 'G3', 'A3', 'C#4', 'E4'), 'A1'),
}

G_PEDAL = [(k * .5, .5, 'G2') for k in range(8)]
ROCKET_TURN = [(0, .5, 'G5', 'tr'), (.5, .5, 'F#5'), (1, 1.5, 'F#5'), (2.5, .5, 'A5'), (3, .5, 'C6'), (3.5, .5, 'F#5')]

THEME = [
    # 1-4: the famous opening, everyone in octaves.
    bar([(0, 1, 'G5'), (1.5, .5, 'D5'), (2, 1, 'G5'), (3.5, .5, 'D5')], [(0, 'G')],
        [(0, 1, 'G2'), (1.5, .5, 'D2'), (2, 1, 'G2'), (3.5, .5, 'D2')], 'unison',
        second=[(0, 1, 'B4'), (0, 1, 'D4')], kicks=[0, 1.5, 2, 3.5]),
    bar([(0, .5, 'G5'), (.5, .5, 'D5'), (1, .5, 'G5'), (1.5, .5, 'B5'), (2, 1, 'D6')], [(0, 'G')],
        [(0, .5, 'G2'), (.5, .5, 'D2'), (1, .5, 'G2'), (1.5, .5, 'B2'), (2, 1, 'D3')], 'unison', fill=True),
    bar([(0, 1, 'C6'), (1.5, .5, 'A5'), (2, 1, 'C6'), (3.5, .5, 'A5')], [(0, 'D7')],
        [(0, 1, 'C3'), (1.5, .5, 'A2'), (2, 1, 'C3'), (3.5, .5, 'A2')], 'unison', kicks=[0, 1.5, 2, 3.5]),
    bar([(0, .5, 'C6'), (.5, .5, 'A5'), (1, .5, 'F#5'), (1.5, .5, 'A5'), (2, 1, 'D5')], [(0, 'D7'), (2, 'D')],
        [(0, .5, 'C3'), (.5, .5, 'A2'), (1, .5, 'F#2'), (1.5, .5, 'A2'), (2, 1, 'D2')], 'unison', fill=True),
    # 5-10: the tune over the cellos' G pedal, answered on the dominant.
    bar([(0, .5, 'G5'), (1, 1.5, 'G5'), (2.5, .5, 'B5'), (3, .5, 'A5'), (3.5, .5, 'G5')], [(0, 'G')], G_PEDAL,
        second=[(0, .5, 'B4'), (0, .5, 'D4')], crash=True),
    bar(ROCKET_TURN, [(0, 'D7/G')], G_PEDAL),
    bar([(0, .5, 'A5'), (.5, .5, 'G5'), (1, 1.5, 'G5'), (2.5, .5, 'B5'), (3, .5, 'A5'), (3.5, .5, 'G5')], [(0, 'G')], G_PEDAL),
    bar(ROCKET_TURN, [(0, 'D7/G')], G_PEDAL),
    bar([(0, .5, 'G5'), (.5, .5, 'G5'), (1, .25, 'G5'), (1.25, .25, 'F#5'), (1.5, .25, 'E5'), (1.75, .25, 'F#5'),
         (2, .5, 'G5'), (2.5, .5, 'G5'), (3, .25, 'B5'), (3.25, .25, 'A5'), (3.5, .25, 'G5'), (3.75, .25, 'A5')],
        [(0, 'G'), (1, 'D/A'), (2, 'G/B'), (3, 'D/F#')],
        [(0, .5, 'G2'), (.5, .5, 'G2'), (1, .5, 'A2'), (1.5, .5, 'A2'), (2, .5, 'B2'), (2.5, .5, 'B2'), (3, .5, 'F#2'), (3.5, .5, 'F#2')]),
    bar([(0, .5, 'B5'), (.5, .5, 'B5'), (1, .25, 'D6'), (1.25, .25, 'C6'), (1.5, .25, 'B5'), (1.75, .25, 'C6'), (2, 1, 'D6')],
        [(0, 'G'), (1, 'D/A'), (2, 'G/B')],
        [(0, .5, 'G2'), (.5, .5, 'G2'), (1, .5, 'A2'), (1.5, .5, 'A2'), (2, 1, 'B2')], fill=True),
    # 11-14: quietly, the two violins in thirds, down to a cadence.
    bar([(0, 2, 'D5'), (2, 2, 'E5')], [(0, 'G'), (2, 'C')], [(0, 2, 'G2'), (2, 2, 'C3')], 'piano',
        second=[(0, 2, 'B4'), (2, 2, 'C5')]),
    bar([(-.12, .12, 'D5', 'grace'), (0, 1, 'C5'), (1, 1, 'C5'), (1.88, .12, 'C5', 'grace'), (2, 1, 'B4'), (3, 1, 'B4')],
        [(0, 'D7'), (2, 'Em')], [(0, 2, 'D2'), (2, 2, 'E2')], 'piano',
        second=[(0, 1, 'A4'), (1, 1, 'A4'), (2, 1, 'G4'), (3, 1, 'G4')]),
    bar([(-.12, .12, 'B4', 'grace'), (0, 1, 'A4'), (1, 1, 'A4'), (2, .5, 'G4'), (2.5, .5, 'F#4'), (3, .5, 'E4'), (3.5, .5, 'F#4')],
        [(0, 'Am/C'), (2, 'D7')], [(0, 1, 'C2'), (1, 1, 'C2'), (2, 1, 'D2'), (3, 1, 'D2')], 'piano',
        second=[(0, 1, 'E4'), (1, 1, 'E4'), (2, 1, 'C4'), (3, 1, 'A3')]),
    bar([(0, .5, 'G4'), (1, .5, 'A4'), (2, .5, 'B4')], [(0, 'G/B'), (1, 'D'), (2, 'G')],
        [(0, .5, 'B1'), (1, .5, 'D2'), (2, 1, 'G2')], 'piano', fill=True,
        second=[(0, .5, 'D4'), (1, .5, 'F#4'), (2, .5, 'G4')]),
]

BREAK = [  # 28-29: the second theme, in D, ending on its dominant.
    bar([(0, 1.5, 'A5'), (1.5, 1 / 6, 'G5'), (1.5 + 1 / 6, 1 / 6, 'F#5'), (1.5 + 2 / 6, 1 / 6, 'E5'), (2, .5, 'D5'), (3, .5, 'B5')],
        [(0, 'D'), (3, 'B7')], [(3, .5, 'D#2')], 'break'),
    bar([(0, .5, 'G5'), (1, .5, 'E5'), (2, .5, 'A5')], [(0, 'Em'), (2, 'A7')],
        [(0, .5, 'E2'), (1, .5, 'D2'), (2, .5, 'C#2'), (3, .5, 'A1')], 'break'),
]

INTRO = {'chord': 'G', 'stab': ('G4', 'B4', 'D5', 'G5')}

# 73: the chromatic climb that leads back to the opening (an octave down), over a D pedal.
BUILD = {'chord': 'D5', 'bass': 'D2', 'line': [(0, 1, 'A#4'), (1, 1, 'B4'), (2, 1, 'C5'), (3, .5, 'C#5')]}

PICKUP = (3.5, .5, 'D5')  # the opening's own upbeat into the downbeat G

OUTRO = [
    # 132-133: the coda's arpeggios ...
    bar([(0, 1, 'G5'), (1.5, .5, 'D5'), (2, .5, 'B4'), (2.5, .5, 'G4'), (3, .5, 'B4'), (3.5, .5, 'D5')], [(0, 'G')], G_PEDAL,
        second=[(0, 1, 'B4'), (0, 1, 'D4')]),
    bar([(0, .5, 'G5'), (.5, .5, 'D5'), (1, .5, 'G5'), (1.5, .5, 'B5')], [(0, 'G')], G_PEDAL[:4], length=2),
]

# ... up to the top D on the final chord, then bar 137's G, G-G, G.
ENDING = {
    'at': 6,  # beats into the outro
    'chord': 'G', 'top': ('D6', 'B5', 'G5'), 'sparkle': ('G6', 'B6', 'D7', 'G7'),
    'button': [(1, .75), (1.75, .25), (2, None)],  # beats after 'at'; the last one rings out
    'unison': ('G5', 'G4', 'G3'), 'bass': 'G2',
}
