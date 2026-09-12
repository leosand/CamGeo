# CamGeo Glossary

Every acronym and technical term used in CamGeo documents, defined in simple language. If a term is missing, open an issue or add it via a pull request.

## A

- **Agroforestry (shaded tree crops)** — farming systems where crops like cocoa or coffee are grown under a canopy of natural or planted shade trees.
- **AI (Artificial Intelligence)** — computer systems that learn patterns from data instead of following fixed rules.
- **AOI (Area Of Interest)** — the geographic zone a study or process covers.
- **Aspect (terrain)** — the direction a slope faces (north, south...), computed from a DEM.
- **ATBD (Algorithm Theoretical Basis Document)** — the formal document that explains exactly how a map product was computed. MapBiomas publishes one per collection; CamGeo publishes a shorter "method note" per release.

## B

- **Backscatter (radar/SAR)** — the portion of a radar signal reflected back to the satellite antenna, sensitive to physical structure and moisture.
- **Baseline** — a simple reference model or result that more complex approaches must beat to be worth adopting.
- **Biome** — a large natural region with its own climate and vegetation (e.g. dense humid forest, savanna).

## C

- **CC-BY-4.0** — a Creative Commons licence: anyone may reuse the work, even commercially, if they credit the source.
- **COG (Cloud-Optimized GeoTIFF)** — a satellite image file format that can be read directly over the internet, piece by piece, without downloading the whole file.
- **Collection** — MapBiomas/CamGeo term for a numbered release of maps (Collection 0.1, 0.2...).
- **Confusion matrix** — a table that compares map predictions against known truth, showing which classes get confused with which.
- **Contributing / Contributor** — see [../CONTRIBUTING.md](../CONTRIBUTING.md) and [../GOVERNANCE.md](../GOVERNANCE.md).
- **Copernicus** — the European Union's Earth observation programme (operates the Sentinel satellites).
- **Cross-ratio (radar)** — the ratio or difference between cross-polarized and co-polarized backscatter (VH/VV), highly sensitive to canopy volume scattering in forests and agroforests.

## D

- **DEM (Digital Elevation Model)** — a raster map where each pixel stores terrain height. Used to compute slope and aspect.
- **DOI (Digital Object Identifier)** — a permanent, citable identifier for a dataset (provided free by Zenodo).
- **Dual-polarization (SAR)** — transmitting and receiving radar waves in two orthogonal modes (e.g. VV and VH).

## E

- **EECU (Earth Engine Compute Unit)** — the unit in which Google Earth Engine measures computing work. The free non-commercial tier includes a monthly quota of EECU-hours.
- **ESA (European Space Agency)** — the European space agency; source of Sentinel data.

## F

- **F1 score** — a quality metric between 0 and 1 that balances precision (how often a predicted class is right) and recall (how many real cases were found). Higher is better.
- **Feature** — an input variable given to a machine learning model (e.g. a spectral band, an index, a slope value).
- **FLAIR-HUB** — a large-scale multimodal land cover dataset and benchmark created by the French IGN, distributed on Hugging Face.

## G

- **GEE (Google Earth Engine)** — Google's free (for non-commercial use) cloud platform that stores petabytes of satellite imagery and runs analysis on it.
- **GeoParquet** — a compact file format for geospatial vector data (points, polygons), designed for fast analytics.
- **GeoTIFF** — the standard file format for geospatial raster data (images with coordinates).
- **GIS (Geographic Information System)** — software and methods to store, analyse and display geographic data.
- **Grand Ouest** — the block of western Cameroonian regions: West (Ouest), Northwest (Nord-Ouest) and Southwest (Sud-Ouest). Highlands, dense farming, plantations.
- **Grassfields** — the high plateaus of western Cameroon, mostly grassland and farms today, with remnant montane forests.

## H

- **Hugging Face** — a platform for sharing datasets and machine learning models; CamGeo publishes datasets there (like FLAIR-HUB does).

## I

- **IGN (Institut national de l'information géographique et forestière)** — France's national mapping and forest information agency; producer of FLAIR-HUB.

## L

- **Landsat** — the long-running US satellite series (USGS/NASA), free imagery since 1972, 30 m resolution.
- **Lazy consensus** — a decision rule: a proposal passes if nobody objects within an agreed time. Silence = agreement.
- **LULC (Land Use and Land Cover)** — what covers the ground (forest, water...) and how humans use it (farming, city...).

## M

- **MapBiomas** — multi-institutional collaborative network producing annual land cover and land use maps using automated classification.
- **MINFOF** — Cameroon's Ministry of Forestry and Wildlife; co-producer of the Forest Atlas of Cameroon.
- **ML (Machine Learning)** — the part of AI where models learn from examples (our training samples).
- **MNDWI / NDWI** — Normalized Difference Water Indices, capturing open moisture and surface water bodies.
- **Montane forest** — forest growing on mountains (e.g. Mount Cameroon, the Bamenda highlands); looks different from lowland forest in satellite images.
- **MVP (Minimum Viable Product)** — the smallest version of a product that is useful and testable.
- **Mosaic / composite** — a single image built by combining many satellite scenes, choosing the best (cloud-free) pixel for each location.

## N

- **NDBI (Normalized Difference Built-up Index)** — a spectral index that highlights built-up (urban) areas.
- **NDVI (Normalized Difference Vegetation Index)** — a spectral index that measures vegetation greenness and health.
- **NDWI (Normalized Difference Water Index)** — a spectral index that highlights water surfaces.
- **NICFI (Norway's International Climate and Forest Initiative)** — funder of high-resolution Planet satellite imagery access for tropical countries; its licence restricts redistribution.

## O

- **OA (Overall Accuracy)** — the share of validation samples the map got right. One number, easy to read, but always read it together with per-class F1 scores.
- **ODbL (Open Database Licence)** — the OpenStreetMap licence; derived databases may need to be shared under the same licence.
- **Olofsson protocol** — established statistical best practice for area-adjusted accuracy assessment and unbiased map extent estimation with confidence intervals.
- **OSM (OpenStreetMap)** — the free, community-built world map.

## P

- **PR (Pull Request)** — a proposal to change the repository, reviewed before merging.
- **Provenance** — the documented origin of data: sources, dates, processing steps. Central to CamGeo.

## R

- **RF (Random Forest)** — a robust machine learning algorithm made of many decision trees voting together; the CamGeo baseline classifier.
- **RFC (Request For Comments)** — a formal proposal discussed before a significant decision (see [../GOVERNANCE.md](../GOVERNANCE.md)).
- **Raster** — data as a grid of pixels (satellite images, elevation maps).

## S

- **SAR (Synthetic Aperture Radar)** — satellite radar (e.g. Sentinel-1) that sees through clouds, day and night.
- **SC (Steering Committee)** — the small group that handles cross-cutting and contested decisions (see [../GOVERNANCE.md](../GOVERNANCE.md)).
- **SCL (Scene Classification Layer)** — pixel-quality classification mask provided with Sentinel-2 L2A data.
- **Sentinel-1 / Sentinel-2** — ESA's radar (S1) and optical (S2) satellite pairs; free data.
- **SLA (Service Level Agreement)** — a commitment about response or delivery time (e.g. reviews within ~7 days).
- **STAC (SpatioTemporal Asset Catalog)** — a standard way to describe and index geospatial data so machines can find and use it.

## U

- **USGS (United States Geological Survey)** — the US science agency that distributes Landsat data.

## V

- **Vector** — geographic data as points, lines and polygons (roads, region boundaries) rather than pixels.

## W

- **WG (Working Group)** — a small team that owns a domain of the project (see [../GOVERNANCE.md](../GOVERNANCE.md)).
- **WRI (World Resources Institute)** — the environmental research organisation behind Global Forest Watch and the Forest Atlases.

## Z

- **Zenodo** — a free repository (run by CERN) that gives datasets a permanent DOI for citation.

---

*Missing a term? Add it — this file belongs to everyone.*
