# Product image recipes
<!-- recipe-version: 15 -->

This is the editable master shot list. Sitex PIM reads each `shot-json` block directly. Recipes are captured when a run starts. Generation code lives in `sitex-pim`; this repository contains source photographs, accepted photographs and recipes. The existing `video/` project is outside this workflow.

## Workflow

Upload one full view and one closeup in the product's PIM Media page. Enter the photographed cloth's horizontal and vertical physical dimensions in centimetres, as displayed, and select the horizontal or vertical fabric-width direction. The full view must include the entire cloth and all edges.

Choose Generate all, an image category or individual shots. PIM opens one ordinary Chat conversation per shot in the Eshop project, with Work off, the latest available model and High reasoning. Upload both originals at the start of each shot's conversation. Include the full product facts, photographed dimensions, source-image roles and that shot's recipe in every request. Treat the original photographs as the source of truth for the product; do not use earlier generated images as product references. Request one finished image at a time and wait for its original download before starting the next shot. Review the selected batch when it finishes. Retries, resume and regeneration continue in that shot's own conversation with the user's feedback. Each image links to its own chat; the batch link opens the latest chat. An older run's pending request keeps its saved conversation to prevent duplicate submissions; other shots without a dedicated chat start fresh with both originals. If ChatGPT explicitly reports that earlier originals are unavailable and requests them again, PIM reattaches the saved full view and closeup to the recovery request in that same conversation. One automatic source refresh is allowed per image retry budget; a repeated missing-source error pauses for review.

All shots, including closeups, complete information cards and compliance images with English label text, are generated through ChatGPT. Card wording, typography and layout can vary creatively while retaining the information and visual purpose specified here. Product claims must agree with the supplied PIM facts. For care cards without label instructions, present conservative material-specific advice as general guidance rather than manufacturer-confirmed instructions. Compliance labels contain only supplied product facts; do not invent care symbols, manufacturer addresses, certifications or barcodes, or copy another pattern's label data.

The originals establish the actual product: preserve its print, colour relationships, motif proportions, textile character and edge construction. Source dimensions establish pattern scale. Use natural regular dining tables and believable drape. Do not specify a numeric drop or prescribe table dimensions. Do not turn printed patchwork into sewn panels.

In every in-use dining scene, the cloth must cover the entire tabletop and extend past every tabletop edge, with the excess fabric hanging down naturally on all sides. Choose a table that fits beneath the cloth at its supplied physical size; never stretch the cloth or enlarge the print to obtain coverage. The originals establish the product's design and finished edge, not a laid-flat arrangement to reproduce on the table. Apply the shot's camera-specific visibility rules: show hanging fabric in oblique views; in the straight-above view, keep the finished hem below the tabletop and out of sight.

Generate each output as one opaque square image, at the highest available quality and at least 1024 pixels per side. The main image includes a small, legible "Ships from EU" sticker when supported by the supplied shipping information, with no other text. Shape images include exactly two supplied stickers: MADE IN EU at the top left and MULTIPLE SIZES & SHAPES at the bottom right, as specified below. No other text or badges. Natural-setting, above-view and closeups contain no text. All information cards contain legible English information. Generate only the product's active PIM shapes and compliance variant keys. Four active shapes give 18 standard files, plus two shared compliance files and one package file per distinct compliance key. For ROSA's four rectangle/oval sizes, round and square, this gives 26 files in total. Collection size guides are separate.

Composition `references` below are examples for human comparison; they do not establish this product's fabric or facts and are not uploaded automatically. Required artwork is listed separately in `graphicReferences`. PIM snapshots these files for selected shots when a run starts and automatically uploads them after the two originals in each shot's conversation, including source recovery. Shots queued later snapshot their required artwork before their first request. Saved artwork is reused for retries and regeneration. Existing runs retain their captured recipes; start a new run to use an updated recipe.

### Two stickers for shape images

Use the two user-approved PNGs, saved unchanged, for `shape__rectangle`, `shape__oval`, `shape__round` and `shape__square` in every collection:

1. [`shared/made-in-eu-ribbon-sticker.png`](shared/made-in-eu-ribbon-sticker.png) — wide blue embroidered ribbon MADE IN EU badge, with curled ribbon ends, a circle of yellow stars, yellow divider and stitching, white lettering, a silver needle and looping yellow thread, and soft shadow. This is the current origin artwork.
2. [`shared/multiple-sizes-shapes-sticker.png`](shared/multiple-sizes-shapes-sticker.png) — white oval MULTIPLE SIZES & SHAPES badge, with blue lettering and three tablecloth diagrams, yellow border and blue offset edge.

Each shape recipe lists these files in `graphicReferences` in that order. PIM automatically supplies the authentic full view as image 1, the closeup as image 2, MADE IN EU as image 3 and MULTIPLE SIZES & SHAPES as image 4. Images 1 and 2 alone establish the textile. Images 3 and 4 supply graphic artwork only; their embroidery, sewing illustrations, colours and diagrams must never alter the photographed product. PIM preserves both graphics with the run and reattaches both during source recovery. Flag unavailable artwork for review rather than inventing a replacement.

Use [`shared/references/shape-two-stickers-example.png`](shared/references/shape-two-stickers-example.png) as the human composition example: one large, isolated tablecloth in an elevated three-quarter view on a clean white background, realistic drape and soft ground shadow, with the origin badge in the upper-left space and the oval range badge in the lower-right space. The example establishes layout only; use the current ribbon-shaped origin artwork instead of its older round badge. Never copy its floral print, colours, fabric or edge onto another product. It is a human-only `references` example, not an automatically uploaded product or graphic reference; each shot's composition below restates the layout.

- Apply exactly one instance of each supplied sticker as a flat graphic overlay. Preserve the original artwork, wording, colours, texture, outlines, diagrams and aspect ratios. Use the correct artwork spelling MULTIPLE SIZES & SHAPES. No EASY CARE sticker, previous brushstroke, round or scalloped square origin stickers, size labels or extra badges.
- The new MADE IN EU PNG has an opaque warm-white exterior background. For placement, isolate only that exterior background and outer margins; preserve the wide blue ribbon, curled ends, yellow stitching and stars, white lettering, silver needle, looping yellow thread and soft shadow. The MULTIPLE SIZES & SHAPES PNG has transparency: preserve its alpha and white oval face. Size and anchor the visible artwork rather than the full input canvas. Do not paste rectangular backdrops or remove white details within either badge. Never redraw the stickers or sew them onto the actual tablecloth.
- MADE IN EU: top-left; visible artwork width 24% of the square canvas, left inset 6%, top inset 2.5%. At 2000 × 2000 px this is 480 px wide at X = 120 px, Y = 50 px. Preserve its wide ribbon outline, curled ends and original aspect ratio; do not compress it into a square or circle.
- MULTIPLE SIZES & SHAPES: bottom-right; visible artwork width 36% of the canvas, right inset 3%, bottom inset 4%. At 2000 × 2000 px this is 720 px wide, ending at X = 1940 px and Y = 1920 px. Derive height from the original artwork's aspect ratio; do not stretch it to match the example.
- Use the same proportional sticker sizes and corner anchors for every shape. Keep the product large and dominant, its full perimeter visible, and both badges clear of its motifs and drape. Arrange the product within the central diagonal space; adjust framing before reducing product prominence. Keep both badges fully inside the canvas. Review at 400, 200 and 120 px square.
- Manufacturing origin and available sizes/shapes must agree with supplied PIM facts. Shipping origin alone does not establish manufacturing origin. The range badge describes available variants; depict one tablecloth of the requested shape, not a bundle or several products.

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
    "rosa/country-check/ROS-CC__shape__rectangle.png",
    "shared/references/shape-two-stickers-example.png"
  ],
  "graphicReferences": [
    "shared/made-in-eu-ribbon-sticker.png",
    "shared/multiple-sizes-shapes-sticker.png"
  ],
  "composition": "Pure white studio background. One entire rectangle tablecloth on concealed support of the same shape, photographed from an elevated three-quarter angle. Follow the two-sticker example layout: a large central product with a broad visible tabletop, natural hanging fabric and finished edges, soft realistic ground shadow and open white corner space. Match light, framing and product scale across the series. Preserve this product's authentic print, physical motif scale, texture, edge and shape; never copy the example's floral pattern. No visible legs, furniture or props. Add exactly two supplied graphic overlays. Image 3, shared/made-in-eu-ribbon-sticker.png, is the wide blue embroidered ribbon MADE IN EU badge with curled ends, a circle of yellow stars, yellow divider and stitching, white lettering, a silver needle, looping yellow thread and soft shadow: place its visible artwork at the top left, 24% of canvas width, inset 6% from the left and 2.5% from the top. Image 4, shared/multiple-sizes-shapes-sticker.png, is the white oval MULTIPLE SIZES & SHAPES badge with blue lettering and table diagrams, yellow border and blue offset edge: place its visible artwork at the bottom right, 36% of canvas width, inset 3% from the right and 4% from the bottom. Preserve both supplied artworks, their lettering, colours, texture, outlines and aspect ratios. Isolate only the opaque warm-white exterior background and outer margins of the MADE IN EU input, retaining the ribbon outline, curled ends, lettering, needle, yellow thread and soft shadow. Preserve the range badge's transparency and white oval face. Size and anchor the visible artwork; no black or rectangular backgrounds. Keep the whole cloth large, recognizable and fully inside the frame; reserve clear corner space so neither badge covers the product, motifs, drape or perimeter. Images 1 and 2 are the authentic product references; images 3 and 4 supply only sticker artwork. Do not apply the badge embroidery or diagram styling to the textile. Show one tablecloth of the requested shape; the range badge describes available variants, not included extras. Use supplied PIM facts for manufacturing origin and variant availability. No EASY CARE sticker, previous brushstroke badge, additional text or other badges. Flag missing artwork or unsupported claims for review instead of inventing replacements.",
  "requiredContent": [
    "Recognizable requested shape and full visible perimeter of one tablecloth",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Authentic fabric and edge, soft ground shadow and plausible drape",
    "Exactly two supplied stickers: wide embroidered ribbon MADE IN EU at the top left and oval MULTIPLE SIZES & SHAPES at the bottom right",
    "Consistent proportional sticker sizes and corner anchors, original aspect ratios, cleanly isolated origin artwork and preserved range-badge transparency",
    "Images 3 and 4 supplied as graphic inputs; images 1 and 2 remain the product source of truth",
    "PIM-supported manufacturing origin and variant availability; both badges clear of the entire product"
  ],
  "reject": [
    "Visible legs/support, room background, props or multiple actual tablecloths",
    "Ambiguous silhouette, cropped perimeter or altered print geometry",
    "Missing, duplicated, swapped, redrawn, distorted, cropped or unreadable stickers",
    "Previous round, scalloped square or brushstroke origin badge, EASY CARE sticker, additional labels or badges",
    "Changed sticker lettering, colours, texture, outlines or table diagrams",
    "Unremoved exterior origin-image backdrop, black/rectangular sticker backgrounds, removed white origin details, lost range-badge transparency or removed white oval face",
    "Stickers cover the cloth, motifs, drape or finished edge, or make the product secondary",
    "Example floral fabric, badge embroidery or illustrated diagrams copied onto the actual textile",
    "Unsupported origin or size/shape availability claims, or either required graphic unavailable"
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
    "rosa/country-check/ROS-CC__shape__oval.png",
    "shared/references/shape-two-stickers-example.png"
  ],
  "graphicReferences": [
    "shared/made-in-eu-ribbon-sticker.png",
    "shared/multiple-sizes-shapes-sticker.png"
  ],
  "composition": "Pure white studio background. One entire oval tablecloth on concealed support of the same shape, photographed from an elevated three-quarter angle. Follow the two-sticker example layout: a large central product with a broad visible tabletop, natural hanging fabric and finished edges, soft realistic ground shadow and open white corner space. Match light, framing and product scale across the series. Preserve this product's authentic print, physical motif scale, texture, edge and shape; never copy the example's floral pattern. No visible legs, furniture or props. Add exactly two supplied graphic overlays. Image 3, shared/made-in-eu-ribbon-sticker.png, is the wide blue embroidered ribbon MADE IN EU badge with curled ends, a circle of yellow stars, yellow divider and stitching, white lettering, a silver needle, looping yellow thread and soft shadow: place its visible artwork at the top left, 24% of canvas width, inset 6% from the left and 2.5% from the top. Image 4, shared/multiple-sizes-shapes-sticker.png, is the white oval MULTIPLE SIZES & SHAPES badge with blue lettering and table diagrams, yellow border and blue offset edge: place its visible artwork at the bottom right, 36% of canvas width, inset 3% from the right and 4% from the bottom. Preserve both supplied artworks, their lettering, colours, texture, outlines and aspect ratios. Isolate only the opaque warm-white exterior background and outer margins of the MADE IN EU input, retaining the ribbon outline, curled ends, lettering, needle, yellow thread and soft shadow. Preserve the range badge's transparency and white oval face. Size and anchor the visible artwork; no black or rectangular backgrounds. Keep the whole cloth large, recognizable and fully inside the frame; reserve clear corner space so neither badge covers the product, motifs, drape or perimeter. Images 1 and 2 are the authentic product references; images 3 and 4 supply only sticker artwork. Do not apply the badge embroidery or diagram styling to the textile. Show one tablecloth of the requested shape; the range badge describes available variants, not included extras. Use supplied PIM facts for manufacturing origin and variant availability. No EASY CARE sticker, previous brushstroke badge, additional text or other badges. Flag missing artwork or unsupported claims for review instead of inventing replacements.",
  "requiredContent": [
    "Recognizable requested shape and full visible perimeter of one tablecloth",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Authentic fabric and edge, soft ground shadow and plausible drape",
    "Exactly two supplied stickers: wide embroidered ribbon MADE IN EU at the top left and oval MULTIPLE SIZES & SHAPES at the bottom right",
    "Consistent proportional sticker sizes and corner anchors, original aspect ratios, cleanly isolated origin artwork and preserved range-badge transparency",
    "Images 3 and 4 supplied as graphic inputs; images 1 and 2 remain the product source of truth",
    "PIM-supported manufacturing origin and variant availability; both badges clear of the entire product"
  ],
  "reject": [
    "Visible legs/support, room background, props or multiple actual tablecloths",
    "Ambiguous silhouette, cropped perimeter or altered print geometry",
    "Missing, duplicated, swapped, redrawn, distorted, cropped or unreadable stickers",
    "Previous round, scalloped square or brushstroke origin badge, EASY CARE sticker, additional labels or badges",
    "Changed sticker lettering, colours, texture, outlines or table diagrams",
    "Unremoved exterior origin-image backdrop, black/rectangular sticker backgrounds, removed white origin details, lost range-badge transparency or removed white oval face",
    "Stickers cover the cloth, motifs, drape or finished edge, or make the product secondary",
    "Example floral fabric, badge embroidery or illustrated diagrams copied onto the actual textile",
    "Unsupported origin or size/shape availability claims, or either required graphic unavailable"
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
    "rosa/country-check/ROS-CC__shape__round.png",
    "shared/references/shape-two-stickers-example.png"
  ],
  "graphicReferences": [
    "shared/made-in-eu-ribbon-sticker.png",
    "shared/multiple-sizes-shapes-sticker.png"
  ],
  "composition": "Pure white studio background. One entire round tablecloth on concealed support of the same shape, photographed from an elevated three-quarter angle. Follow the two-sticker example layout: a large central product with a broad visible tabletop, natural hanging fabric and finished edges, soft realistic ground shadow and open white corner space. Match light, framing and product scale across the series. Preserve this product's authentic print, physical motif scale, texture, edge and shape; never copy the example's floral pattern. No visible legs, furniture or props. Add exactly two supplied graphic overlays. Image 3, shared/made-in-eu-ribbon-sticker.png, is the wide blue embroidered ribbon MADE IN EU badge with curled ends, a circle of yellow stars, yellow divider and stitching, white lettering, a silver needle, looping yellow thread and soft shadow: place its visible artwork at the top left, 24% of canvas width, inset 6% from the left and 2.5% from the top. Image 4, shared/multiple-sizes-shapes-sticker.png, is the white oval MULTIPLE SIZES & SHAPES badge with blue lettering and table diagrams, yellow border and blue offset edge: place its visible artwork at the bottom right, 36% of canvas width, inset 3% from the right and 4% from the bottom. Preserve both supplied artworks, their lettering, colours, texture, outlines and aspect ratios. Isolate only the opaque warm-white exterior background and outer margins of the MADE IN EU input, retaining the ribbon outline, curled ends, lettering, needle, yellow thread and soft shadow. Preserve the range badge's transparency and white oval face. Size and anchor the visible artwork; no black or rectangular backgrounds. Keep the whole cloth large, recognizable and fully inside the frame; reserve clear corner space so neither badge covers the product, motifs, drape or perimeter. Images 1 and 2 are the authentic product references; images 3 and 4 supply only sticker artwork. Do not apply the badge embroidery or diagram styling to the textile. Show one tablecloth of the requested shape; the range badge describes available variants, not included extras. Use supplied PIM facts for manufacturing origin and variant availability. No EASY CARE sticker, previous brushstroke badge, additional text or other badges. Flag missing artwork or unsupported claims for review instead of inventing replacements.",
  "requiredContent": [
    "Recognizable requested shape and full visible perimeter of one tablecloth",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Authentic fabric and edge, soft ground shadow and plausible drape",
    "Exactly two supplied stickers: wide embroidered ribbon MADE IN EU at the top left and oval MULTIPLE SIZES & SHAPES at the bottom right",
    "Consistent proportional sticker sizes and corner anchors, original aspect ratios, cleanly isolated origin artwork and preserved range-badge transparency",
    "Images 3 and 4 supplied as graphic inputs; images 1 and 2 remain the product source of truth",
    "PIM-supported manufacturing origin and variant availability; both badges clear of the entire product"
  ],
  "reject": [
    "Visible legs/support, room background, props or multiple actual tablecloths",
    "Ambiguous silhouette, cropped perimeter or altered print geometry",
    "Missing, duplicated, swapped, redrawn, distorted, cropped or unreadable stickers",
    "Previous round, scalloped square or brushstroke origin badge, EASY CARE sticker, additional labels or badges",
    "Changed sticker lettering, colours, texture, outlines or table diagrams",
    "Unremoved exterior origin-image backdrop, black/rectangular sticker backgrounds, removed white origin details, lost range-badge transparency or removed white oval face",
    "Stickers cover the cloth, motifs, drape or finished edge, or make the product secondary",
    "Example floral fabric, badge embroidery or illustrated diagrams copied onto the actual textile",
    "Unsupported origin or size/shape availability claims, or either required graphic unavailable"
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
    "rosa/country-check/ROS-CC__shape__square.png",
    "shared/references/shape-two-stickers-example.png"
  ],
  "graphicReferences": [
    "shared/made-in-eu-ribbon-sticker.png",
    "shared/multiple-sizes-shapes-sticker.png"
  ],
  "composition": "Pure white studio background. One entire square tablecloth on concealed support of the same shape, photographed from an elevated three-quarter angle. Follow the two-sticker example layout: a large central product with a broad visible tabletop, natural hanging fabric and finished edges, soft realistic ground shadow and open white corner space. Match light, framing and product scale across the series. Preserve this product's authentic print, physical motif scale, texture, edge and shape; never copy the example's floral pattern. No visible legs, furniture or props. Add exactly two supplied graphic overlays. Image 3, shared/made-in-eu-ribbon-sticker.png, is the wide blue embroidered ribbon MADE IN EU badge with curled ends, a circle of yellow stars, yellow divider and stitching, white lettering, a silver needle, looping yellow thread and soft shadow: place its visible artwork at the top left, 24% of canvas width, inset 6% from the left and 2.5% from the top. Image 4, shared/multiple-sizes-shapes-sticker.png, is the white oval MULTIPLE SIZES & SHAPES badge with blue lettering and table diagrams, yellow border and blue offset edge: place its visible artwork at the bottom right, 36% of canvas width, inset 3% from the right and 4% from the bottom. Preserve both supplied artworks, their lettering, colours, texture, outlines and aspect ratios. Isolate only the opaque warm-white exterior background and outer margins of the MADE IN EU input, retaining the ribbon outline, curled ends, lettering, needle, yellow thread and soft shadow. Preserve the range badge's transparency and white oval face. Size and anchor the visible artwork; no black or rectangular backgrounds. Keep the whole cloth large, recognizable and fully inside the frame; reserve clear corner space so neither badge covers the product, motifs, drape or perimeter. Images 1 and 2 are the authentic product references; images 3 and 4 supply only sticker artwork. Do not apply the badge embroidery or diagram styling to the textile. Show one tablecloth of the requested shape; the range badge describes available variants, not included extras. Use supplied PIM facts for manufacturing origin and variant availability. No EASY CARE sticker, previous brushstroke badge, additional text or other badges. Flag missing artwork or unsupported claims for review instead of inventing replacements.",
  "requiredContent": [
    "Recognizable requested shape and full visible perimeter of one tablecloth",
    "Source-scale repeat; cuts alter counts, never stretch motifs",
    "Authentic fabric and edge, soft ground shadow and plausible drape",
    "Exactly two supplied stickers: wide embroidered ribbon MADE IN EU at the top left and oval MULTIPLE SIZES & SHAPES at the bottom right",
    "Consistent proportional sticker sizes and corner anchors, original aspect ratios, cleanly isolated origin artwork and preserved range-badge transparency",
    "Images 3 and 4 supplied as graphic inputs; images 1 and 2 remain the product source of truth",
    "PIM-supported manufacturing origin and variant availability; both badges clear of the entire product"
  ],
  "reject": [
    "Visible legs/support, room background, props or multiple actual tablecloths",
    "Ambiguous silhouette, cropped perimeter or altered print geometry",
    "Missing, duplicated, swapped, redrawn, distorted, cropped or unreadable stickers",
    "Previous round, scalloped square or brushstroke origin badge, EASY CARE sticker, additional labels or badges",
    "Changed sticker lettering, colours, texture, outlines or table diagrams",
    "Unremoved exterior origin-image backdrop, black/rectangular sticker backgrounds, removed white origin details, lost range-badge transparency or removed white oval face",
    "Stickers cover the cloth, motifs, drape or finished edge, or make the product secondary",
    "Example floral fabric, badge embroidery or illustrated diagrams copied onto the actual textile",
    "Unsupported origin or size/shape availability claims, or either required graphic unavailable"
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
  "composition": "Exactly vertical camera, looking straight down at a regular dining table in a natural setting. Use a tabletop smaller than the cloth in both directions so the cloth fully covers it and extends beyond every edge. The excess fabric turns downward over all sides under gravity; the finished hem, including any scalloped cut edge, hangs below the tabletop and is not visible from above. The visible fabric boundary follows the smooth bend over the tabletop edge, not the cloth's decorative perimeter. Preserve the source pattern scale and the supplied physical cloth dimensions when choosing a suitable table. Do not copy the original full-view photograph's laid-flat silhouette into this scene. Keep the table within the frame so correct coverage is not achieved merely by cropping. No text.",
  "requiredContent": [
    "Source pattern scale and proportions",
    "Cloth is central subject",
    "Entire tabletop covered, with fabric turning down over every tabletop edge",
    "Finished hem below the tabletop and out of sight from the vertical camera"
  ],
  "reject": [
    "Visible finished hem or scalloped cut edge in the straight-above view",
    "Cloth laid flat like a placemat, runner or topper, with its finished perimeter resting on the tabletop",
    "Exposed tabletop border, corners or strips outside the cloth",
    "Hanging fabric flattened or spread outward into the tabletop plane",
    "Missing overhang on any side or cropping used to hide incorrect coverage",
    "Enlarged or stretched motifs, or changed cloth dimensions, used to obtain coverage"
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
