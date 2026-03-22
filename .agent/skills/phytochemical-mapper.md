---
name: Phytochemical Mapper
description: Maps pomegranate disease states and irradiance data to degradation curves for Punicalagin and Vitamin C.
---

# Phytochemical Mapper Skill

This skill calculates the predicted degradation of key phytochemicals (Punicalagin, Vitamin C) based on visual disease markers and environmental data.

## Input Parameters
1. `disease_label` (string): The detected disease state. Valid options: `Blight`, `Anthracnose`, `Healthy`.
2. `base_punicalagin` (float): Baseline Punicalagin (mg/100g) for the Bhagwa cultivar.
3. `base_vitamin_c` (float): Baseline Vitamin C (mg/100g) for the Bhagwa cultivar.
4. `irradiance` (float): Current solar irradiance reading (W/m²) from Pune weather data.

## Logic Rules

### 1. Disease Impact
- **Healthy**: No degradation (0%).
- **Anthracnose**: Rapid reduction in Vitamin C (-40%), moderate reduction in Punicalagin (-15%).
- **Blight**: Severe reduction in both Punicalagin (-35%) and Vitamin C (-30%).

### 2. Irradiance (Sunburn Risk)
- If `irradiance` > 1000 W/m², apply an additional **Sunburn penalty**.
- The Sunburn penalty reduces total remaining Vitamin C by an extra 10% and Punicalagin by 5% due to photo-oxidation on the fruit surface.

## Output Format
Return a structured JSON mapping containing:
```json
{
  "disease_state": "<label>",
  "punicalagin_mg_100g": <calculated_value>,
  "vitamin_c_mg_100g": <calculated_value>,
  "sunburn_risk": <boolean>
}
```
