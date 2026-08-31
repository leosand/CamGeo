# CamGeo Labelling Guide

This guide teaches any contributor — no coding or GIS background needed — how to label training samples: looking at a satellite image point and deciding which land cover class it belongs to. Good labels are the heart of CamGeo: the classifier only learns what we teach it.

## 1. Setup (15 minutes)

1. Get a batch of points from the Validation & Local Knowledge WG (a CSV produced by `gee/sampling/generate_sample_points.js`).
2. Open the labelling tool (Collect Earth Online — free, browser-based; the WG coordinator gives you the project link).
3. For each point, the tool shows very high resolution imagery (e.g. Google basemap, NICFI Planet) and Sentinel-2 context. You answer one question: **what covers the ground at this point?**

## 2. Golden rules

1. **Label what you see, at the date of the imagery** — not what you remember or assume.
2. **Judge the point's surroundings**, about 1 hectare around it (100 m × 100 m): land cover is about the area, not the exact pixel.
3. **Set your confidence honestly**: `high` (sure), `medium` (probable), `low` (uncertain). Low is not a failure — it triggers expert review.
4. **When two classes mix**, pick the one covering the majority of the surroundings, and explain in the notes.
5. **Never guess sensitive sites precisely** (see ../docs/DATA_POLICY.md §4). If an image seems to show something sensitive, flag it in the notes instead of labelling details.

## 3. Class-by-class visual keys

### Class 1 — Dense humid forest
- Looks like: continuous dark-green carpet, rough texture, no visible clearings; along rivers it forms unbroken galleries.
- Confused with: industrial plantations (class 5) and dense secondary forest (class 2).
- Tip: natural forest has irregular texture and mixed tones; plantations are suspiciously regular (straight lines, same colour).

### Class 2 — Degraded / secondary forest
- Looks like: forest with visible gaps, logging tracks (thin lines), patches of lighter regrowth, younger even canopy.
- Confused with: dense forest (class 1) and forest-savanna mosaic (class 3).
- Tip: in the East and South, follow the tracks — straight thin lines entering forest often mean selective logging.

### Class 3 — Savanna / grassland
- Looks like: light green to yellowish open areas, smooth texture, scattered trees or shrubs; burns appear as dark scars seasonally.
- Confused with: bare soil (class 9) in the dry season, and montane grassland in the Grand Ouest (still class 3).
- Tip: grass turns brown seasonally but the soil is rarely fully exposed; if texture suggests vegetation, prefer class 3 over 9.

### Class 4 — Smallholder agriculture
- Looks like: a mosaic of small, irregular plots with different colours and states (growing, harvested, fallow), often around villages; slash-and-burn creates patchy edges inside forest.
- Confused with: degraded forest (class 2) and savanna (class 3).
- Tip: look for the "quilt" pattern and proximity to houses or paths. In the Grand Ouest, fields climb slopes in dense mosaics.

### Class 5 — Industrial plantation
- Looks like: very regular blocks (grid or contour lines), uniform colour and height, often with visible access roads and buildings; oil palm shows dotted rows in high resolution.
- Confused with: dense forest (class 1).
- Tip: regularity is the key — nature does not plant in straight lines. Common in Littoral and Sud-Ouest (palm, banana, rubber), tea in the Nord-Ouest.

### Class 6 — Mangrove (Littoral and Sud-Ouest only)
- Looks like: dense green forest growing in coastal water or mudflats, with winding water channels inside.
- Confused with: lowland dense forest (class 1) and water (class 7).
- Tip: location decides — tidal coastal zone + dense vegetation = mangrove. Open water without vegetation = class 7.

### Class 7 — Water
- Looks like: dark, flat surfaces (rivers, lakes, reservoirs); turbid rivers can look light brown.
- Confused with: cloud shadows and wet bare soil.
- Tip: compare two dates if available — water bodies keep their shape; shadows move.

### Class 8 — Urban / built-up
- Looks like: dense clusters of roofs (grey, red, white), road grids, bare yards; small villages count too.
- Confused with: bare soil (class 9) and smallholder agriculture (class 4).
- Tip: roofs form sharp geometric patterns; check the road network — buildings line up along roads.

### Class 9 — Bare soil / mining
- Looks like: exposed earth (bright orange/white), quarries, mine pits, eroded slopes, fresh construction sites.
- Confused with: dry-season savanna (class 3) and urban areas (class 8).
- Tip: mining in the East often appears as bright patches along rivers; erosion scars in the Grand Ouest sit on steep slopes.

## 4. Regional pitfalls (Grand Ouest focus)

- **Montane forest vs montane grassland** (Ouest, Nord-Ouest): at altitude, forest sits in valleys and on humid slopes while grassland covers plateaus — use terrain shape as a clue.
- **Plantation vs forest** (Sud-Ouest): Mount Cameroon area has both; check for block regularity and access roads.
- **Haze and clouds**: in humid zones, if the image is hazy, lower your confidence rather than forcing a class.

## 5. Review process

1. You label → `review_status: pending`.
2. A second contributor re-checks → `reviewed` or sends it back with a comment.
3. Disagreements go to a third, experienced reviewer; the final call is written in the notes.
4. Every month, 10% of all labels are randomly re-checked (see ../samples/README.md).

## 6. FAQ

- **"The image is too cloudy to tell."** → confidence `low`, note "hazy image", move on.
- **"The point falls exactly on a boundary."** → label the majority of the 1-hectare surroundings, note "boundary".
- **"I know this place and it changed recently."** → label what the *imagery date* shows, and add your field knowledge in the notes — it is valuable for validation.
- **"I made a mistake."** → tell the WG coordinator; labels are versioned and fixable. Mistakes are normal; silent errors are not.

---

*Version 0.1 — August 2026. Improvements welcome via pull request.*
