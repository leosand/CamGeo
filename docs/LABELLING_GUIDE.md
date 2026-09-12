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
5. **Never guess sensitive sites precisely** (see [DATA_POLICY.md](DATA_POLICY.md) §4). If an image seems to show something sensitive, flag it in the notes instead of labelling details.

## 3. Class-by-class visual keys

### Class 1 — Dense humid forest
- Looks like: continuous dark-green carpet, rough uneven canopy texture with emergent trees, unbroken galleries along watercourses.
- Confused with: industrial plantations (class 5), dense secondary forest (class 2), and dense shaded agroforestry (class 3).
- Tip: natural forest has structural heterogeneity and varied canopy heights; plantations are strictly geometric (straight lines, same age).

### Class 2 — Degraded / secondary forest
- Looks like: forest with visible canopy openings (< 0.5 ha), logging tracks (thin red/laterite lines), patches of lighter regrowth, younger canopy.
- Confused with: dense forest (class 1) and smallholder mosaics (class 4).
- Tip: in the East and South, follow the tracks — narrow lines entering forest often indicate selective logging gaps that heal into secondary regrowth over 12–24 months.

### Class 3 — Shaded agroforestry (cocoa / coffee)
- Looks like: semi-closed canopy with an uneven, pebbled texture; scattered tall shade trees over a dense lower crop layer; occasional pod-breaking clearings or footpaths.
- Confused with: dense natural forest (class 1) and smallholder agriculture (class 4).
- Tip: landscape context is critical — shaded agroforestry is almost always situated within walking distance of villages or tertiary roads; unlike class 1, it lacks giant emergent trees and shows subtle seasonal management.

### Class 4 — Smallholder agriculture
- Looks like: a mosaic of small, irregular plots with different colours and states (growing crops, bare soil, fallow), often wrapping around villages; slash-and-burn creates patchy edges inside forest.
- Confused with: degraded forest (class 2) and savanna (class 7).
- Tip: look for the "quilt" pattern and proximity to houses or paths. In the Grand Ouest, fields climb steep slopes in dense terraced mosaics.

### Class 5 — Industrial plantation
- Looks like: very regular blocks (orthogonal grid or contour lines), uniform colour and height, visible access road networks; oil palm shows distinctive concentric fronds in high resolution.
- Confused with: dense forest (class 1) and shaded agroforestry (class 3).
- Tip: regularity is the key — nature does not plant in straight lines. Common in Littoral and Sud-Ouest (palm, rubber, banana), tea in the Nord-Ouest. Continuous blocks typically exceed 10 hectares.

### Class 6 — Mangrove (Littoral and Sud-Ouest only)
- Looks like: dense green forest growing in coastal tidal waters, estuaries, or mudflats, with winding saltwater channels inside.
- Confused with: lowland dense forest (class 1) and open water (class 8).
- Tip: geographic position decides — tidal coastal zone + dense vegetation = mangrove.

### Class 7 — Savanna / grassland
- Looks like: light green to yellowish open areas, smooth texture, scattered trees or shrubs; burns appear as dark scars seasonally.
- Confused with: bare soil (class 10) in the dry season, and montane grassland in the Grand Ouest (still class 7).
- Tip: grass turns brown seasonally but soil is rarely fully exposed; if texture suggests vegetation, prefer class 7 over 10.

### Class 8 — Water
- Looks like: dark, flat surfaces (rivers, lakes, reservoirs); turbid rivers can look light brown or tan.
- Confused with: cloud shadows and wet bare soil.
- Tip: compare two dates if available — water bodies keep their shape; cloud shadows move.

### Class 9 — Urban / built-up
- Looks like: dense clusters of roofs (corrugated iron, zinc, concrete), road grids, bare yards; small villages count too.
- Confused with: bare soil (class 10) and smallholder agriculture (class 4).
- Tip: roofs form sharp geometric patterns; check the road network — buildings line up along streets.

### Class 10 — Bare soil / mining
- Looks like: exposed earth (bright orange, yellow, or white), quarries, open-cast artisanal mining pits, eroded slopes, fresh construction clearings.
- Confused with: dry-season savanna (class 7) and urban areas (class 9).
- Tip: mining in the East often appears as bright bare patches along rivers; erosion scars in the Grand Ouest sit on steep valley flanks.

## 4. Regional pitfalls (Grand Ouest focus)

- **Montane forest vs montane grassland** (Ouest, Nord-Ouest): at altitude, forest sits in humid valleys while grassland covers plateaus — use terrain shape and slope as a clue.
- **Plantation vs agroforest vs forest** (Sud-Ouest): Mount Cameroon area has all three; check for block regularity, access roads, and canopy strata.
- **Haze and clouds**: in humid zones, if the image is hazy, lower your confidence rather than forcing a class.

## 5. Review process

1. You label → `review_status: pending`.
2. A second contributor re-checks → `reviewed` or sends it back with a comment.
3. Disagreements go to a third, experienced reviewer; the final call is written in the notes.
4. Every month, 10% of all labels are randomly re-checked (see [../samples/README.md](../samples/README.md)).

## 6. FAQ

- **\"The image is too cloudy to tell.\"** → confidence `low`, note \"hazy image\", move on.
- **\"The point falls exactly on a boundary.\"** → label the majority of the 1-hectare surroundings, note \"boundary\".
- **\"I know this place and it changed recently.\"** → label what the *imagery date* shows, and add your field knowledge in the notes — it is valuable for validation.
- **\"I made a mistake.\"** → tell the WG coordinator; labels are versioned and fixable. Mistakes are normal; silent errors are not.

---

*Version 0.2 — August 2026 (updated for 10-class legend including shaded agroforestry). Improvements welcome via pull request.*
