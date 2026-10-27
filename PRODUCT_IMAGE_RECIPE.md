# Product image recipes
<!-- recipe-version: 9 -->

This is the editable master shot list. Sitex PIM reads each `shot-json` block directly. Recipes are captured when a run starts. Generation code lives in `sitex-pim`; this repository contains source photographs, accepted photographs and recipes. The existing `video/` project is outside this workflow.

## Workflow

Upload one full view and one closeup in the product's PIM Media page. Enter the photographed cloth's horizontal and vertical physical dimensions in centimetres, as displayed, and select the horizontal or vertical fabric-width direction. The full view must include the entire cloth and all edges.

Choose Generate all, an image category or individual shots. PIM opens one ordinary Chat conversation per shot in the Eshop project, with Work off, the latest available model and High reasoning. Upload both originals at the start of each shot's conversation. Include the full product facts, photographed dimensions, source-image roles and that shot's recipe in every request. Treat the original photographs as the source of truth for the product; do not use earlier generated images as product references. Request one finished image at a time and wait for its original download before starting the next shot. Review the selected batch when it finishes. Retries, resume and regeneration continue in that shot's own conversation with the user's feedback. Each image links to its own chat; the batch link opens the latest chat. An older run's pending request keeps its saved conversation to prevent duplicate submissions; other shots without a dedicated chat start fresh with both originals. If ChatGPT explicitly reports that earlier originals are unavailable and requests them again, PIM reattaches the saved full view and closeup to the recovery request in that same conversation. One automatic source refresh is allowed per image retry budget; a repeated missing-source error pauses for review.

All shots, including closeups, complete information cards and compliance images with English label text, are generated through ChatGPT. Card wording, typography and layout can vary creatively while retaining the information and visual purpose specified here. Product claims must agree with the supplied PIM facts. For care cards without label instructions, present conservative material-specific advice as general guidance rather than manufacturer-confirmed instructions. Compliance labels contain only supplied product facts; do not invent care symbols, manufacturer addresses, certifications or barcodes, or copy another pattern's label data.

The originals establish the actual product: preserve its print, colour relationships, motif proportions, textile character and edge construction. Source dimensions establish pattern scale. Use natural regular dining tables and believable drape. Do not specify a numeric drop or prescribe table dimensions. Do not turn printed patchwork into sewn panels.

Generate each output as one opaque square image, at the highest available quality and at least 1024 pixels per side. The main image includes a small, legible "Ships from EU" sticker when supported by the supplied shipping information, with no other text. Natural-setting, above-view, shapes and closeups contain no text. All information cards contain legible English information. Generate only the product's active PIM shapes and compliance variant keys. Four active shapes give 18 standard files, plus two shared compliance files and one package file per distinct compliance key. For ROSA's four rectangle/oval sizes, round and square, this gives 26 files in total. Collection size guides are separate.

Composition reference paths below are examples for human comparison; they do not establish this product's fabric or facts and are not uploaded automatically.

## Files

Accepted images use `<collection>/<product>/<CODE>__<slot>.png`. Compliance uses `__compliance__packaging.png`, `__compliance__label.png` and `__compliance__<key>.png`. Rectangle and oval share their dimension key, such as `140180`; round uses `round` and square uses `square`, matching PIM's Temu compliance resolver. Reuse the existing product folder; create a folder only when needed. New originals are preserved unchanged under the product's `sources/<run-id>/` directory. PIM excludes source originals from final-media matching.

Keep all drafts, downloads, attempt history, measurements and run metadata outside this repository, in PIM's ignored local workflow storage. Accept saves the chosen attempt. Existing images require an explicit overwrite confirmation. Generation never stages, commits, pushes or publishes files. Originals already registered for existing products remain unchanged.

## Master shots

### 01 · Hero — `__main.png`

```shot-json
{
  "slot": "main",
  "title": "Hero",
  "method": "photo",
  "references": [
    "rosa/country-check/ROS-CC__main.png"
  ],
  "composition": "Natural daylight dining room, elevated three-quarter camera, tabletop plus natural front/side drape, restrained props. Add a small, tasteful sticker graphic in the upper-right corner with the exact, legible wording 'Ships from EU', provided the supplied shipping information confirms dispatch from an EU country. Keep the sticker inset from the image edges and clear of the product's pattern and perimeter. No other text. Use a regular dining table and preserve the original pattern scale.",
  "requiredContent": [
    "Exact motif order and source field proportions at a believable pattern scale",
    "Believable fabric, scalloped cut edge and gravity",
    "Small, legible 'Ships from EU' corner sticker for products confirmed to ship from the EU"
  ],
  "reject": [
    "Enlarged or stretched pattern fields",
    "Changed weave, colors, edge or false quilting seams",
    "Props hide the product",
    "Missing, unreadable, oversized or cropped shipping sticker when EU dispatch is confirmed",
    "Sticker obscures the product or claims EU dispatch unsupported by supplied shipping information"
  ]
}
```

### 02 · Rectangle shape — `__shape__rectangle.png`

```shot-json
{
  "slot": "shape__rectangle",
  "title": "Rectangle shape",
  "method": "photo",
  "references": [
    "rosa/country-check/ROS-CC__shape__rectangle.png"
  ],
  "composition": "Pure white studio background. Entire rectangle cloth on concealed support of the same shape. Elevated three-quarter camera. Match light, framing and scale across series. No legs, furniture, props or text.",
  "requiredContent": [
    "Recognizable silhouette and full perimeter",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Soft shadow and plausible drape"
  ],
  "reject": [
    "Visible legs/support or room background",
    "Ambiguous silhouette or cropped perimeter",
    "Changed print geometry"
  ]
}
```

### 03 · Oval shape — `__shape__oval.png`

```shot-json
{
  "slot": "shape__oval",
  "title": "Oval shape",
  "method": "photo",
  "references": [
    "rosa/country-check/ROS-CC__shape__oval.png"
  ],
  "composition": "Pure white studio background. Entire oval cloth on concealed support of the same shape. Elevated three-quarter camera. Match light, framing and scale across series. No legs, furniture, props or text.",
  "requiredContent": [
    "Recognizable silhouette and full perimeter",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Soft shadow and plausible drape"
  ],
  "reject": [
    "Visible legs/support or room background",
    "Ambiguous silhouette or cropped perimeter",
    "Changed print geometry"
  ]
}
```

### 04 · Round shape — `__shape__round.png`

```shot-json
{
  "slot": "shape__round",
  "title": "Round shape",
  "method": "photo",
  "references": [
    "rosa/country-check/ROS-CC__shape__round.png"
  ],
  "composition": "Pure white studio background. Entire round cloth on concealed support of the same shape. Elevated three-quarter camera. Match light, framing and scale across series. No legs, furniture, props or text.",
  "requiredContent": [
    "Recognizable silhouette and full perimeter",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Soft shadow and plausible drape"
  ],
  "reject": [
    "Visible legs/support or room background",
    "Ambiguous silhouette or cropped perimeter",
    "Changed print geometry"
  ]
}
```

### 05 · Square shape — `__shape__square.png`

```shot-json
{
  "slot": "shape__square",
  "title": "Square shape",
  "method": "photo",
  "references": [
    "rosa/country-check/ROS-CC__shape__square.png"
  ],
  "composition": "Pure white studio background. Entire square cloth on concealed support of the same shape. Elevated three-quarter camera. Match light, framing and scale across series. No legs, furniture, props or text.",
  "requiredContent": [
    "Recognizable silhouette and full perimeter",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Soft shadow and plausible drape"
  ],
  "reject": [
    "Visible legs/support or room background",
    "Ambiguous silhouette or cropped perimeter",
    "Changed print geometry"
  ]
}
```

### 06 · Everyday setting — `__natural-setting.png`

```shot-json
{
  "slot": "natural-setting",
  "title": "Everyday setting",
  "method": "photo",
  "references": [
    "rosa/terracotta-garden/ROS-TG__natural-setting.png"
  ],
  "composition": "Distinct natural dining scene with warm daylight and sparse tableware; keep most pattern unobstructed. No text.",
  "requiredContent": [
    "Tabletop and hanging fabric visible",
    "Scene differs from hero"
  ],
  "reject": [
    "Wrong scale or color",
    "Synthetic folds and scallops"
  ]
}
```

### 07 · Straight above — `__above-view.png`

```shot-json
{
  "slot": "above-view",
  "title": "Straight above",
  "method": "photo",
  "references": [
    "rosa/autumn-patchwork/ROS-AP__above-view.png"
  ],
  "composition": "Exactly vertical camera above a regular dining table in a natural setting. Show only physically visible fabric: hanging cloth below the tabletop plane must not appear flattened onto the tabletop. No text.",
  "requiredContent": [
    "Source pattern scale and proportions",
    "Cloth is central subject"
  ],
  "reject": [
    "Flat scalloped perimeter around tabletop",
    "Hanging hem visible despite vertical camera",
    "Enlarged motifs"
  ]
}
```

### 08 · Actual edge and fabric — `__closeup-1.png`

```shot-json
{
  "slot": "closeup-1",
  "title": "Actual edge and fabric",
  "method": "photo",
  "references": [
    "rosa/terracotta-garden/ROS-TG__closeup-1.png",
    "rosa/terracotta-garden/ROS-TG__closeup-2.png"
  ],
  "composition": "Professional closeup of the actual product showing its perimeter, textile texture and adjoining motif, faithfully following the supplied closeup original. No text.",
  "requiredContent": [
    "Faithful original fabric, print and edge construction",
    "Enough context to identify the product"
  ],
  "reject": [
    "Invented trim, seams or texture",
    "Different fabric or pattern",
    "Unclear or blurred detail"
  ]
}
```

### 09 · Actual pattern structure — `__closeup-2.png`

```shot-json
{
  "slot": "closeup-2",
  "title": "Actual pattern structure",
  "method": "photo",
  "references": [
    "rosa/terracotta-garden/ROS-TG__closeup-1.png"
  ],
  "composition": "Professional detail photograph showing the product's observed motif arrangement and adjoining printed fields. Follow the real full view and closeup. For a grid print show a divider or field transition. No text.",
  "requiredContent": [
    "Exact observed print geometry and motif order",
    "Real fine textile detail"
  ],
  "reject": [
    "Changed geometry or motif order",
    "Invented trim or false seams",
    "Unclear or blurred detail"
  ]
}
```

### 10 · Care infographic — `__easy-care.png`

```shot-json
{
  "slot": "easy-care",
  "title": "Care infographic",
  "method": "infographic",
  "references": [
    "pastel/01-coffee-lecce/PAS-CL__easy-care.png"
  ],
  "composition": "Large product photograph, fabric-detail inset and substantial care icon rail. Create legible English care guidance with a clear visual hierarchy. Keep depicted actions consistent with the wording.",
  "requiredContent": [
    "Useful care information consistent with supplied material facts",
    "Distinguish general material guidance from verified manufacturer instructions"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 11 · Origin infographic — `__made-in-bulgaria.png`

```shot-json
{
  "slot": "made-in-bulgaria",
  "title": "Origin infographic",
  "method": "infographic",
  "references": [
    "pastel/01-coffee-lecce/PAS-CL__made-in-bulgaria.png"
  ],
  "composition": "Product photograph and faithful fabric inset beside an English origin headline and positive fact groups. Show a Bulgarian flag and Bulgarian origin claim only when the supplied PIM origin is Bulgaria.",
  "requiredContent": [
    "Origin, manufacturer, material and finish",
    "No unsupported comparisons with imports"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 12 · Material and finish — `__others_01.png`

```shot-json
{
  "slot": "others_01",
  "title": "Material and finish",
  "method": "infographic",
  "references": [
    "rosa/mocha-mosaic/ROS-MM__others_01.png"
  ],
  "composition": "Editorial hero photograph, informative fact rail and three real detail panels.",
  "requiredContent": [
    "Useful verified material and finish facts with explanations",
    "Original texture, full pattern and edge inserts"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 13 · Four occasions — `__others_02.png`

```shot-json
{
  "slot": "others_02",
  "title": "Four occasions",
  "method": "infographic",
  "references": [
    "rosa/terracotta-garden/ROS-TG__others_02.png"
  ],
  "composition": "Four distinct scenes in a 2 × 2 grid: breakfast, family meal, sheltered terrace lunch and evening dinner.",
  "requiredContent": [
    "Four photos with headings and useful captions",
    "Same print, colours and source pattern scale in every setting"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 14 · Care routine — `__others_03.png`

```shot-json
{
  "slot": "others_03",
  "title": "Care routine",
  "method": "infographic",
  "references": [
    "rosa/terracotta-garden/ROS-TG__others_03.png"
  ],
  "composition": "Four numbered photographic care steps with legible English explanations. Use supplied label instructions where available; otherwise present conservative material-specific advice as general guidance.",
  "requiredContent": [
    "Four informative sequential steps",
    "Care guidance and matching actions consistent with supplied material facts"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 15 · Home styling — `__others_04.png`

```shot-json
{
  "slot": "others_04",
  "title": "Home styling",
  "method": "infographic",
  "references": [
    "rosa/terracotta-garden/ROS-TG__others_04.png"
  ],
  "composition": "Hero and actual detail beside three styling vignettes with named material/color swatches.",
  "requiredContent": [
    "Useful styling explanations",
    "Product color stays constant; props not included"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 16 · How to measure — `__others_05.png`

```shot-json
{
  "slot": "others_05",
  "title": "How to measure",
  "method": "infographic",
  "references": [
    "rosa/terracotta-garden/ROS-TG__others_05.png"
  ],
  "composition": "Three instructions, active-shape measurement diagrams and prominent dimension formula with real fabric detail.",
  "requiredContent": [
    "Measure tabletop including extensions in use",
    "Cloth dimension = table dimension + 2 × desired drop",
    "Length/width or diameter arrows; no invented recommended drop"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 17 · What you get — `__others_06.png`

```shot-json
{
  "slot": "others_06",
  "title": "What you get",
  "method": "infographic",
  "references": [
    "rosa/mocha-mosaic/ROS-MM__others_06.png"
  ],
  "composition": "Open product, folded cloth and original detail above an informative factual checklist.",
  "requiredContent": [
    "Verified contents, composition and finish",
    "No invented package, label, barcode or EAN"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

### 18 · Pattern and edge details — `__others_07.png`

```shot-json
{
  "slot": "others_07",
  "title": "Pattern and edge details",
  "method": "infographic",
  "references": [
    "rosa/mocha-mosaic/ROS-MM__others_01.png"
  ],
  "composition": "Faithful full-pattern view with two substantial fabric and edge detail panels and explanatory English labels. Use the same visual family as the material card.",
  "requiredContent": [
    "Explain full arrangement, decorative dividers and edge construction",
    "All panels faithfully match the original product photographs"
  ],
  "reject": [
    "Sparse information, weak hierarchy or misalignment",
    "Unreadable or clipped text",
    "Unsupported claims or altered fabric detail"
  ]
}
```

## Compliance images

Follow the established Country Check, Mocha Mosaic, Terracotta Garden and Coffee Lecce compositions below while preserving this product's actual fabric and verified facts. Keep label design consistent across the shared package and variant packages. Text belongs on the photographed label, with no floating captions or infographic layout. Shared images omit variant-specific sizes, SKUs and EANs. A dimension image shared by rectangle and oval omits shape-specific text and any barcode that differs between those SKUs. Never reuse the reference images' barcode or address.

PIM expands the `compliance__variant` template into one shot for each distinct active key; the template itself is never saved as a file. Exact size and shape information is supplied with each expanded shot. Multiple active round or square sizes share their established key, so show all applicable sizes without selecting an arbitrary SKU. Existing runs can add missing recipe images in PIM while keeping their originals, saved conversations and previous attempts. Newly added shots each start their own conversation with both originals.

### 19 · Complete packaged product — `__compliance__packaging.png`

```shot-json
{
  "slot": "compliance__packaging",
  "title": "Complete packaged product",
  "method": "compliance",
  "references": [
    "rosa/country-check/ROS-CC__compliance__packaging.png",
    "rosa/mocha-mosaic/ROS-MM__compliance__packaging.png"
  ],
  "composition": "Front-facing studio product photograph of one neatly folded tablecloth in a clear retail bag, complete package within the frame, neutral background and soft shadow. Show the actual print through the bag. A centered white paper label carries the product name and code, a small faithful in-use product photograph, verified composition, manufacturer and origin in legible English. Keep the label design consistent with the variant package images.",
  "requiredContent": [
    "Entire clear package and actual fabric visible",
    "Product name, product code and supplied composition, manufacturer and origin",
    "Shared product label without a variant-specific size, SKU or EAN"
  ],
  "reject": [
    "Wrong pattern, colors or edge",
    "Cropped bag, unreadable label or floating infographic text",
    "Invented address, care instructions, certification, barcode or EAN",
    "Copied reference-product identity or label data"
  ]
}
```

### 20 · Product label close-up — `__compliance__label.png`

```shot-json
{
  "slot": "compliance__label",
  "title": "Product label close-up",
  "method": "compliance",
  "references": [
    "rosa/country-check/ROS-CC__compliance__label.png",
    "pastel/01-coffee-lecce/PAS-CL__compliance__label.png"
  ],
  "composition": "Tight sharply focused product photograph of a white textile label resting against the actual cloth near its finished edge. Keep enough surrounding print and texture to identify the product. The label clearly shows the exact product code, supplied country of origin, manufacturer and composition in legible English, with clean black typography and realistic textile detail.",
  "requiredContent": [
    "Exact product code and supplied origin, manufacturer and composition",
    "Actual fabric, motif and edge visible around the label",
    "All label text sharply readable"
  ],
  "reject": [
    "Wrong fabric or invented edge construction",
    "Invented address, care symbols, certification, barcode or EAN",
    "Reference-product text, spelling errors or unreadable lettering"
  ]
}
```

### 21 · Variant packaged product — `__compliance__<key>.png`

```shot-json
{
  "slot": "compliance__variant",
  "title": "Packaged product",
  "method": "compliance",
  "expand": "active-compliance-keys",
  "references": [
    "rosa/country-check/ROS-CC__compliance__140180.png",
    "rosa/mocha-mosaic/ROS-MM__compliance__round.png",
    "rosa/terracotta-garden/ROS-TG__compliance__square.png"
  ],
  "composition": "Match the shared complete-package photograph: one neatly folded tablecloth in a clear retail bag, neutral studio background, complete bag visible, faithful print and a consistent centered white paper label with a small in-use product photograph. Add a prominent exact size line for the supplied target variants. Use the supplied round or square shape where applicable; rectangle and oval dimension keys share a shape-neutral label. Retain verified composition, manufacturer, origin and product identity. Omit a SKU or EAN when the image covers multiple variants.",
  "requiredContent": [
    "Exact target size in centimetres; round sizes use diameter notation",
    "Correct product name and code, actual print and consistent package-label design",
    "Only supplied product facts and target variants"
  ],
  "reject": [
    "Wrong or inactive size or shape",
    "Arbitrary SKU or barcode on an image shared by different variants",
    "Invented address, care symbols, certification, barcode or EAN",
    "Different print, unreadable label or cropped package"
  ]
}
```
