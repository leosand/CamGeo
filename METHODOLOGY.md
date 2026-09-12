# CamGeo Scientific & Technical Methodology

This document details the algorithms, feature engineering strategies, and validation protocols underpinning the CamGeo open platform.

## 1. Scientific Objectives

The primary objective is generating reliable, version-controlled reference datasets capable of training and benchmarking machine learning algorithms across equatorial and tropical transition biomes in Cameroon.

## 2. Advanced Classification Legend (Version 0.2)

The classification legend separates vegetation structures characterized by overlapping spectral responses:

| Code | Class Name | Technical Definition | Key Sensor Signature |
|---|---|---|---|
| 1 | Dense Humid Forest | Closed-canopy primary or mature secondary forest (canopy cover > 70%) | High NIR, low SWIR temporal variance, continuous high radar backscatter |
| 2 | Degraded / Selective Disturbance | Forest canopy interrupted by gaps (< 0.5 ha), haul roads, or recent disturbance | Localized drop in radar VV/VH, localized bare-soil spectral mix |
| 3 | Shaded Agroforestry (Tree Crops) | Cocoa or coffee grown beneath natural or planted shade-tree canopies | Semi-regular structural pattern, distinct seasonal phenological variations |
| 4 | Open Agricultural Mosaics | Heterogeneous smallholder annual crops, shifting fallow, and food crops | High high-frequency temporal NDVI variance, visible parcel patchwork |
| 5 | Industrial Monocultures | Large-scale, uniform plantation grids (oil palm, rubber, banana) | High spatial auto-correlation, geometric layout, uniform canopy height |
| 6 | Savanna & Shrublands | Open woody vegetation, tall-grass savanna, and montane grasslands | Strong dry-season senescent signal (low dry-season NDVI) |
| 7 | Mangrove Ecosystems | Coastal tidal marine forests | Constant tidal water interface, high moisture indices |
| 8 | Aquatic Surfaces | Perennial rivers, reservoir storage, and coastal waters | Permanent negative MNDWI / NDWI signatures |
| 9 | Impervious / Urban Fabric | Built environments, paved surfaces, concentrated settlements | High NDBI, sustained high radar backscatter |
| 10 | Bare Soil & Mineral Surfaces | Unvegetated rock, extractive mining sites, exposed soil | High visible reflectance, flat spectral profile |

## 3. Data Integration & Sensor Fusion

To overcome the persistent equatorial cloud belt (often exceeding 80% mean annual cloud cover in the coastal and forest regions):
- **Optical Multi-Temporal Compositing**: Sentinel-2 L2A bottom-of-atmosphere imagery filtered through scene classification layers (SCL), combined across adaptive quarterly medians.
- **Radar Backscatter Fusion**: Sentinel-1 Dual-Polarization (VV, VH) temporal metrics and cross-ratio indices (VH/VV), enabling continuous structural monitoring independent of illumination and atmospheric interference.
- **Topographic & Hydrographic Conditioning**: High-resolution elevation, slope, and aspect derivations from the Copernicus Global DEM (30 m).

## 4. Sampling Protocol & Verification Standards

1. **Stratification Design**: Stratified random distribution across eco-regional zones, ensuring statistical representation of minority classes (agroforestry, mining clearings).
2. **Blind Dual-Interpretation**: Every benchmark sample undergoes blind dual-interpretation by independent analysts using very high-resolution reference basemaps.
3. **Disagreement Adjudication**: Samples showing discordant class attributions trigger senior review or field reconciliation before inclusion in training releases.
4. **Partition Integrity**: Strict spatial isolation between training, evaluation, and test partitions at the tile level to prevent spatial auto-correlation inflation.

## 5. Quantitative Validation

Accuracy reporting adheres to the best practices formulated by Olofsson et al.:
- Generation of population-error matrices.
- Computation of sample-based class producer and user accuracies.
- Area-adjusted unbiased map-category extent estimations accompanied by 95% confidence intervals.
