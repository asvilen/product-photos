# Product image recipe and master shot list

This is the editable source of truth for producing product images from actual tablecloth photographs. Use one image agent per numbered output. The product photographs establish what the cloth looks like; the PIM establishes product facts, active shapes, sizes, and approved care information. Existing catalog images are composition references only.

**Set size:** 11 required product images and 7 numbered detail images for a product with four active shapes, or 18 generated product files in total. The collection size guide is a separate shared asset. Generate only the shape files for shapes active in the PIM.

## File naming and inputs

- Product output: `<collection-slug>/<product-slug>/<PRODUCT-CODE>__<slot>.png`. For the pilot, the folder is `rosa/autumn-patchwork/`, so `__above-view` becomes `rosa/autumn-patchwork/ROS-AP__above-view.png`.
- Numbered details use `__others_01` through `__others_07`. Keep each number tied to the purpose defined below when starting a new product. Existing products may use different numbers; do not rename or overwrite them without review.
- Preferred originals: `sources/<collection-slug>/<product-slug>/<PRODUCT-CODE>__source__full-pattern.jpg` and `...__closeup.jpg`. Preserve the originals unchanged. The PIM currently scans image files recursively and would report these `__source__` names as unknown slots, so its repository scan must exclude `sources/` before this folder convention is adopted.
- The coordinator supplies every agent with both original photos, current PIM facts, a product-specific visual description, **one** numbered assignment below, and its exact destination path.

## Shared quality rules

1. Make professional, photorealistic product photography with plausible perspective, gravity, fabric folds, shadows, and material texture. Square, opaque PNG output, at least 1024 × 1024 pixels. Keep the intended cloth or detail inside the frame.
2. Preserve the real print: repeat geometry, motif order, colors, scale, ornamental bands, and edge shape. Do not invent quilting seams or rearrange a pattern to fit the scene. The two originals outrank example images.
3. A camera directly above the table shows its top surface. A hanging edge is visible only when the camera angle makes that physically possible.
4. `__main`, `__natural-setting`, `__above-view`, all `__shape__*`, and both `__closeup-*` images have **no text**. `__easy-care` and `__made-in-bulgaria` may have short, verified text. The detail rows specify their own copy limits.
5. Generate the photograph first. When a row permits words, numbers, arrows, or icons, add and inspect them in a controlled finishing step. Never trust generated lettering, symbols, labels, or barcodes without verification.
6. Inspect each candidate beside both originals at full view and close view. Check print, color, edge, shape, drape, text, and filename. Retry a failed detail before saving. If the sources cannot support an accurate result, report the limitation instead of publishing a changed product.
7. Each agent saves only its assigned selected file and reports the path and checks. The coordinator verifies file format, dimensions, unique filename, PIM matching, and visual fidelity before publishing the set.

## Required product images

These are required by this recipe. The current PIM already recognizes ten of them. `__above-view` is new: add it as a required PRODUCT/CAROUSEL media-template slot in the PIM before importing its image. Until then, the PIM repository validator will call that suffix an unknown slot. The PIM's eMAG image export also has a fixed slot list; add this view there separately if it should appear in eMAG galleries.

### 01 · Hero — `__main.png`

- **Scene:** Inviting, naturally lit dining room. A rectangular tablecloth occupies most of the frame. Show the tabletop repeat and substantial front/side drape with few simple props. Three-quarter camera view, around seated eye level or slightly higher.
- **Text:** None.
- **Check:** At thumbnail size this reads as a tablecloth and as the exact product, with believable scale and scalloped edge.

### 02 · Rectangle shape — `__shape__rectangle.png`

- **Scene:** Bright neutral studio or minimal room. Show the entire rectangular cloth on a rectangular table, centered, with straight sides, four corners, and front/side drape. No props. Elevated three-quarter angle.
- **Text:** None; no size label.
- **Check:** Clearly rectangular outline, correct print scale, and plausible edge.

### 03 · Oval shape — `__shape__oval.png`

- **Scene:** Match the rectangle shape image's light, camera height, and background. Show a smooth oval cloth on an oval table, entire curved outline and natural drape visible. No props.
- **Text:** None; no size label.
- **Check:** Curve and scallop are continuous. The printed repeat is not bent or stretched into arcs.

### 04 · Round shape — `__shape__round.png`

- **Scene:** Same visual series on a round table. Show the circular tabletop and full cloth outline with even, gravity-led drape. No props.
- **Text:** None; no diameter label.
- **Check:** Both table and cloth read as round; the internal pattern retains its normal scale.

### 05 · Square shape — `__shape__square.png`

- **Scene:** Same visual series on a square table. Show the full square outline, four corners, and side drape. No props.
- **Text:** None; no size label.
- **Check:** The shape of the whole cloth is clear and distinct from any square fields within its print.

### 06 · Everyday setting — `__natural-setting.png`

- **Scene:** A second believable dining photograph, distinct from the hero: modest meal, warm natural light, some room context. Angled camera shows pattern on the table and a hanging edge. Keep props sparse.
- **Text:** None.
- **Check:** Lived-in setting, cloth still the main subject, substantial unobstructed print.

### 07 · Above view — `__above-view.png`

- **Scene:** Natural dining setting viewed from directly above or at a slight elevated angle. Center the tablecloth and make it the clear centerpiece of the square frame. A restrained arrangement of plates, food, or flowers may establish real use, while leaving large areas of the print visible. The camera angle is flexible; choose the angle that best shows this product and the table's shape.
- **Text:** None.
- **Check:** The image is distinct from the hero and everyday setting. The cloth dominates and its real pattern is readable. A directly overhead shot cannot show a hanging edge; an angled shot may show one if the perspective supports it.

### 08 · Edge and fabric — `__closeup-1.png`

- **Scene:** Tight natural close-up of the actual scalloped hem, textile texture, and adjacent motif. A refined edit of the real close-up photo is preferable if it is most faithful.
- **Text:** None.
- **Check:** Hem contour, texture, color, and print match the source.

### 09 · Pattern structure — `__closeup-2.png`

- **Scene:** Close view broad enough to show adjoining fields and their ornamental divider. Include contrasting light/warm and darker floral areas. A gentle fold may show fabric thickness.
- **Text:** None.
- **Check:** Divider is continuous; fields stay aligned; folds do not duplicate or scramble motifs.

### 10 · Easy care — `__easy-care.png`

- **Scene:** Professional fabric or table photograph with restrained space for care information.
- **Text:** Short verified copy only. The current PIM media instruction specifies machine washing at 30°C; confirm this instruction for each collection before using it. Do not add other care or performance claims without a verified source.
- **Check:** Every word, number, and symbol is legible and matches approved care data.

### 11 · Origin — `__made-in-bulgaria.png`

- **Scene:** Elegant product photograph emphasizing the actual cloth, with a small, clean space for origin information.
- **Text:** “Made in Bulgaria” when confirmed by PIM. Manufacturer and material facts may be added only when PIM confirms them.
- **Check:** Origin and any numbers or names are exact; the image remains a credible product photograph.

## Numbered detail images

These use the PIM's optional repeatable `others` slot. Slots `01`–`06` standardize themes visible in [Terracotta Garden](rosa/terracotta-garden/) and [Mocha Mosaic](rosa/mocha-mosaic/). `07` provides a direct pattern view like those used for other products. These are image-type references, not proof of Autumn Patchwork's care, packaging, or material properties.

### 12 · Material and finish — `__others_01.png`

- **Scene:** Airy editorial layout with a three-quarter dining photograph and a true-to-source macro inset of fabric and finished edge.
- **Text:** Optional exact PIM facts such as composition, fabric weight, and edge. No unsupported stain, drying, ironing, durability, or color-retention claim.
- **Check:** The macro shows this product's actual motif and edge; text matches PIM.

### 13 · Multiple occasions — `__others_02.png`

- **Scene:** Restrained 2 × 2 layout of four distinct professional photographs: everyday breakfast, family meal, sheltered terrace lunch, evening dinner. Use the same cloth in every panel.
- **Text:** Optional short scene labels only.
- **Check:** The settings change but the print, colors, and edge do not.

### 14 · Care in use — `__others_03.png`

- **Scene:** Small photographic sequence: cloth on table, neatly folded for laundering, and refreshed on table. Avoid a staged stain-removal claim.
- **Text:** Short heading and verified wash temperature only; no unverified bleaching, tumble-drying, ironing, or stain-resistance instructions.
- **Check:** Depicted actions and copy agree with approved care data.

### 15 · Home styling — `__others_04.png`

- **Scene:** Three or four coordinated room photographs showing the same cloth with furnishings selected for its colors. Styling and light may vary; product color must remain fixed.
- **Text:** Optional neutral styling labels such as “Natural wood” or “Cream ceramics”.
- **Check:** Enough tabletop remains visible in every panel to identify the product; no implication that props are included.

### 16 · How to measure — `__others_05.png`

- **Scene:** Clean instructional layout with real-looking table photography and precise measurement arrows for length, width or diameter, and desired drop. Cover active shapes without implying one pictured table is a particular SKU.
- **Text:** The geometry formula “tablecloth dimension = table dimension + 2 × desired drop” may be used. Any shown product sizes must come from current PIM data. Do not invent a recommended drop.
- **Check:** Arrows point to the correct dimensions; text is readable and sizes match PIM.

### 17 · Cloth overview — `__others_06.png`

- **Scene:** Studio photograph of a neatly folded cloth beside a partially opened section showing the real print and edge. Neutral backdrop, soft shadow.
- **Text:** Optional product name and verified material or origin facts.
- **Check:** No imagined retail bag, printed label, barcode, EAN, address, or bundle contents.

### 18 · Full-pattern flat lay — `__others_07.png`

- **Scene:** Entire rectangular cloth laid flat on a plain surface, evenly lit, all four edges within the square frame. No props or perspective trick. Use the original full-pattern photograph as the geometric master.
- **Text:** None.
- **Check:** Repeat count, motif order, field and divider positions, colors, and perimeter permit direct comparison to the original. If generation changes the design, use a faithful cleanup of the original photograph.

## Collection-shared image

`<collection-slug>/<collection-slug>__size-guide.jpg` is a separate collection task and is reused across products. It should explain how to measure the table and show current collection shapes and sizes. Review and revise it when PIM defaults change. The current [ROSA size guide](rosa/rosa__size-guide.jpg) omits active oval and square options and the 130 × 150 cm size; review it before using it for the pilot. Replacement of the existing file requires visual review.

Packaging and retail-label images are outside this two-photo recipe. Add such a slot only when an actual package photograph and approved label data are supplied.

## Pilot run card: ROSA Autumn Patchwork (`ROS-AP`)

- **Output folder:** `rosa/autumn-patchwork/`.
- **Inputs:** one actual full-pattern photograph and one actual close-up. Once committed under `sources/`, pass both exact paths to every agent. Do not substitute a generated image for an original.
- **PIM facts checked 2026-10-07:** ROSA; 100% polyester; 140 g/m²; scallop-cut edge; made in Bulgaria; manufacturer Sitex OOD. Active shapes: rectangle, oval, round, square. Rectangle and oval sizes: 100 × 150, 130 × 150, 140 × 180, 150 × 220 cm. Square: 150 × 150 cm. Round: Ø150 cm.
- **Visual lock:** One continuous tablecloth with repeated square fields separated by narrow dark-and-light ornamental bands. Warm ochre/orange, muted rose, taupe/gray, burgundy, and dark plum fields carry leaves and large flowers. Preserve their order, relative scale, texture, and the scalloped outer edge. The patchwork-like design is a print, not separately sewn squares.
- **First pilot outputs:** `ROS-AP__main.png`, `ROS-AP__above-view.png`, and `ROS-AP__closeup-1.png`. Review these for realism and print fidelity before generating the remaining set.

### Copyable one-agent assignment

```text
Product: {PIM product name, code, collection, active shapes/sizes, verified facts}
Original A: {exact full-pattern photo path}
Original B: {exact close-up photo path}
Visual lock: {product-specific pattern, motif, colors, texture, edge}
Assigned image: {one numbered heading above and its full destination path}
Task: Create one photorealistic candidate. Compare it with both originals at full
      view and close view. Revise any pattern, edge, shape, perspective, or text
      error. Save only the selected square PNG at the assigned path.
Report: saved path; format/dimensions; print/edge/shape/text checks; any limitation.
```
