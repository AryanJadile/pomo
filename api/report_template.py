"""
PomeGuard Report Template
Generates a professional, printable diagnostic report HTML string
from a scan record. Styled to match agronomic lab report conventions.
"""

from datetime import datetime, timezone

BRAND_RED = "#8B1A1A"
BRAND_RED_LIGHT = "#b22222"
SECTION_HEADER_BG = "#8B1A1A"
SECTION_HEADER_LIGHT = "#f9e8e8"

# ─────────────────────────────────────────────
# Disease-specific clinical content library
# ─────────────────────────────────────────────

DISEASE_CONTENT = {
    "healthy": {
        "display_name": "Healthy — No Disease Detected",
        "causes": ["No pathogenic cause detected. The fruit presents with no visible signs of fungal, bacterial, or physiological disease."],
        "observations": ["Fruit shows no visible signs of disease or stress damage. Surface integrity is intact with no lesions, discolouration, or abnormal growths."],
        "prevention": ["Continue current agronomic practices. No intervention required."],
        "treatment": ["No treatment necessary at this time. Routine monitoring is advised."]
    },
    "anthracnose": {
        "display_name": "Anthracnose",
        "causes": [
            "Caused by the fungal pathogen Colletotrichum gloeosporioides.",
            "Infection is favoured by warm, humid conditions (>80% relative humidity and temperatures of 25–30°C).",
            "Spreads through rain splash, wind-borne conidia, and contact with infected plant debris.",
            "Entry occurs through wounds, natural openings (stomata, lenticels), or direct cuticle penetration.",
            "Latent infection established during fruit development is commonly activated post-harvest during storage."
        ],
        "observations": [
            "Dark, sunken, circular to oval lesions on the fruit surface, initially water-soaked.",
            "Lesions expand and coalesce under sustained high humidity, turning brown to black.",
            "Pink to orange acervuli (spore masses) appear centrally on mature lesions under moist conditions.",
            "Progressive fruit rot leading to complete collapse in severe cases.",
            "Significant reduction in post-harvest shelf life, marketability, and phytochemical integrity."
        ],
        "prevention": [
            "Apply copper-based fungicides (e.g., copper hydroxide 53.8% WDG at 1.5 kg/ha) preventively during flowering and early fruit development.",
            "Maintain adequate plant spacing and annual canopy pruning to improve airflow and reduce relative humidity within the canopy.",
            "Remove and destroy all infected fruits and plant debris immediately upon detection.",
            "Avoid overhead irrigation; switch to drip irrigation to reduce leaf and fruit surface wetness duration.",
            "Apply mulch around the tree base to prevent soil-splashed spore dispersal onto lower canopy surfaces."
        ],
        "treatment": [
            "Apply Mancozeb (75% WP at 2.5 g/L) or Carbendazim (50% WP at 1 g/L) in fortnightly spray cycles.",
            "Remove and safely dispose of heavily infected fruit; bag remaining healthy fruits where feasible.",
            "Apply systemic fungicide Azoxystrobin (23% SC at 1 mL/L) at first symptom appearance for internal penetration.",
            "Repeat applications every 10–14 days, rotating between chemical classes to prevent resistance development."
        ]
    },
    "bacterial_blight": {
        "display_name": "Bacterial Blight",
        "causes": [
            "Caused primarily by Xanthomonas axonopodis pv. punicae (Xap), a gram-negative bacterium.",
            "Infection enters the host through stomatal openings and mechanical wounds during rain events.",
            "Spread occurs via contaminated irrigation water, infected pruning tools, and wind-driven rain.",
            "Warm, wet conditions (24–30°C with sustained leaf wetness) heavily favour bacterial multiplication.",
            "Infected nursery planting material acts as primary inoculum source for new orchard establishments."
        ],
        "observations": [
            "Water-soaked, angular lesions on leaves, stems, and fruit rind, often delimited by leaf veins.",
            "Lesions turn dark brown to black with oily, translucent margins under wet weather conditions.",
            "Crack formation on fruit rind exposing inner tissues and facilitating secondary fungal infection.",
            "Bacterial exudate (gummosis) often visible as amber-coloured droplets on infected stems and fruit.",
            "Severe defoliation and premature fruit drop in advanced infection stages with significant yield loss."
        ],
        "prevention": [
            "Use certified bacterial blight-free planting material obtained from reputable, screened nurseries.",
            "Apply copper oxychloride (50% WP at 3 g/L) as a preventive spray on a monthly calendar basis.",
            "Avoid wounding fruit rind during thinning, bagging, or harvesting operations to prevent entry points.",
            "Disinfect all pruning tools with 70% ethanol or 1% sodium hypochlorite solution between individual trees.",
            "Maintain proper orchard drainage to avoid waterlogging which promotes bacterial survival and spread."
        ],
        "treatment": [
            "Apply copper hydroxide (77% WP at 3–4 g/L) at first symptom appearance and repeat after 10 days.",
            "Combine with Streptomycin sulphate (90% SP at 0.6 g/L) for synergistic bactericidal action.",
            "Prune and remove all infected shoots, stems, and fruit; treat cut surfaces with Bordeaux paste.",
            "Repeat spray applications every 10 days for a minimum of 3 consecutive cycles post-symptom onset."
        ]
    },
    "alternaria": {
        "display_name": "Alternaria Fruit Rot",
        "causes": [
            "Caused by the fungal pathogen Alternaria alternata and related Alternaria spp.",
            "Infection predominantly enters through the calyx end (crown region) of the developing fruit.",
            "High relative humidity and poor canopy aeration create optimal sporulation conditions.",
            "Spores are disseminated via wind and rain splash from infected crop debris.",
            "Physiological stress in host trees (drought, nutrient deficiency) significantly increases susceptibility."
        ],
        "observations": [
            "Characteristic dark brown to black rot initiating from the calyx region and progressing inward.",
            "Internal rot is frequently not externally visible until advanced decay stages, creating marketing risk.",
            "Unpleasant fermented odour emanating from affected arils despite an apparently sound outer rind.",
            "Black spore masses (conidia) visible under the persistent sepals of the calyx crown.",
            "Severe internal quality degradation rendering fruit commercially unmarketable at harvest."
        ],
        "prevention": [
            "Ensure adequate annual canopy pruning to reduce internal humidity and improve light penetration.",
            "Apply Mancozeb at petal fall (75% WP at 2.5 g/L) and repeat at 30-day intervals through fruit development.",
            "Seal calyx cups with petroleum jelly or approved horticultural wax after flowering to block fungal entry.",
            "Avoid excessive nitrogen fertilisation which promotes succulent, more susceptible tissue growth.",
            "Implement fruit bagging using specialised paper or mesh bags 30–45 days after fruit set."
        ],
        "treatment": [
            "Apply Iprodione (50% WP at 2 g/L) or Tebuconazole (25.9% EC at 1 mL/L) at first symptom detection.",
            "Remove affected fruits from the tree immediately and bury or incinerate away from the orchard block.",
            "Follow up with broad-spectrum Chlorothalonil (75% WP at 2 g/L) as a secondary protective application.",
            "Improve root zone drainage to reduce water stress that compromises the tree's natural disease resistance."
        ]
    },
    "cercospora": {
        "display_name": "Cercospora Leaf Spot",
        "causes": [
            "Caused by Cercospora punicae, a foliar necrotrophic fungal pathogen.",
            "Disease development favoured by warm, humid conditions with free moisture on leaf surfaces.",
            "Spreads primarily via wind-dispersed conidia produced on sporulating lesions during wet periods.",
            "Secondary infections spread rapidly during monsoon season via rain splash from infected debris.",
            "Dense planting and restricted canopy airflow significantly amplify disease pressure in the orchard."
        ],
        "observations": [
            "Small, circular to angular spots with pale grey-white centres and distinctive dark purple-brown margins.",
            "Spots coalesce under high disease pressure, causing extensive leaf area destruction.",
            "Premature defoliation leads to sunburn damage on exposed fruit and significantly reduces photosynthetic capacity.",
            "Weakened tree vigour reduces the accumulation of sugars, phenolics, and antioxidant compounds in developing fruit.",
            "Secondary fruit surface cracking and reduced phytochemical integrity due to prolonged physiological stress."
        ],
        "prevention": [
            "Apply copper oxychloride (50% WP at 3 g/L) preventively at the commencement of the humid growing season.",
            "Maintain adequate plant spacing and conduct annual structural pruning for optimal canopy airflow.",
            "Avoid overhead irrigation systems that prolong leaf surface wetness duration in the canopy.",
            "Regularly clear fallen leaves from the orchard floor to reduce the primary spore inoculum load.",
            "Apply organic mulch around the tree base to suppress soil splash transmission of spores to lower canopy."
        ],
        "treatment": [
            "Apply Carbendazim (50% WP at 1 g/L) or Hexaconazole (5% SC at 2 mL/L) in fortnightly spray cycles.",
            "Remove and destroy heavily infected leaves and branches at a site removed from the orchard block.",
            "Supplement with foliar potassium nitrate spray (1%) to improve leaf cell wall strength and disease resistance.",
            "Re-evaluate disease pressure after 2–3 spray cycles and rotate to an alternate chemical class to prevent resistance."
        ]
    }
}


# ─────────────────────────────────────────────
# Helper functions
# ─────────────────────────────────────────────

def get_disease_key(disease_name: str) -> str:
    name = (disease_name or "").lower()
    if not name or "healthy" in name:
        return "healthy"
    if "anthracnose" in name:
        return "anthracnose"
    if "bacterial" in name or "blight" in name:
        return "bacterial_blight"
    if "alternaria" in name:
        return "alternaria"
    if "cercospora" in name:
        return "cercospora"
    return "healthy"

def generate_report_id(scan_id: str) -> str:
    return f"PG-{(scan_id or 'UNKNOWN')[:8].upper()}"

def format_date(iso_date: str) -> str:
    try:
        iso = iso_date.replace('Z', '+00:00') if iso_date else ""
        dt = datetime.fromisoformat(iso)
        return dt.strftime('%d %b %Y, %I:%M %p IST')
    except Exception:
        return iso_date or "N/A"

def get_uv_stress(uv: float) -> str:
    if uv < 400:  return "Low"
    if uv <= 800: return "Moderate"
    return "High"

def get_humidity_stress(h: float) -> str:
    if h < 40:  return "Low"
    if h <= 70: return "Optimal"
    return "High"

def get_temp_stress(t: float) -> str:
    if t < 15:  return "Low"
    if t <= 35: return "Optimal"
    return "High"

def get_nutrition_status(value: float, low: float, high: float) -> str:
    if value < low:  return "Below Reference"
    if value > high: return "Above Reference"
    return "Optimal"

def get_confidence_label(confidence) -> str:
    try:
        c = float(confidence)
    except (TypeError, ValueError):
        return "N/A"
    if c >= 90: return f"High Confidence ({c:.1f}%)"
    if c >= 75: return f"Moderate Confidence ({c:.1f}%)"
    return f"Low Confidence ({c:.1f}%)"

def get_quality_grade(score: int) -> str:
    if score >= 80: return "Grade A (Premium)"
    if score >= 60: return "Grade B (Standard)"
    return "Grade C (Below Standard)"

def get_advisories(disease_key, severity, uv_stress, humidity_stress, temp_stress, nutrition) -> list:
    advisories = []
    score = (nutrition or {}).get("nutritional_score", 100)
    tier  = (nutrition or {}).get("quality_tier", "Optimal")

    content = DISEASE_CONTENT.get(disease_key, DISEASE_CONTENT["healthy"])
    dn = content["display_name"]

    if disease_key != "healthy":
        advisories.append(
            f"Initiate targeted chemical management for {dn} immediately as per the Treatment Protocol "
            f"detailed in Section 4 of this report. Delay in treatment risks exponential disease spread."
        )

    if severity == "Severe":
        advisories.append(
            "Escalated response required: conduct an emergency block inspection within 48 hours. "
            "Remove and safely dispose (incinerate or deep-bury) all heavily infected plant material to eliminate the primary inoculum source."
        )
    elif severity == "Moderate":
        advisories.append(
            "Schedule a follow-up diagnostic scan in 10–14 days post-treatment initiation to monitor disease "
            "progression and confirm treatment efficacy before declaring the intervention successful."
        )

    if uv_stress == "High":
        advisories.append(
            "Deploy shade netting (30–40% shading factor) or apply a kaolin clay spray (5% concentration) "
            "to the fruit canopy. High UV irradiance (>800 W/m²) is accelerating Anthocyanin photodegradation, "
            "directly reducing the fruit's antioxidant and commercial quality profile."
        )

    if humidity_stress == "High":
        advisories.append(
            "Revise irrigation scheduling to reduce canopy relative humidity into the 40–70% optimal range. "
            "Excess ambient humidity (>70%) is directly accelerating fungal and bacterial spore germination "
            "rates in the orchard microclimate, compounding disease risk."
        )
    elif humidity_stress == "Low":
        advisories.append(
            "Increase soil moisture delivery via sub-surface drip irrigation. Low relative humidity (<40%) "
            "is inducing drought stress, causing premature fruit senescence and phytochemical concentration loss."
        )

    if temp_stress == "High":
        advisories.append(
            "Apply evaporative cooling via overhead micro-sprinklers during peak afternoon hours (12:00–16:00). "
            "Sustained temperatures above 35°C are inducing heat stress, degrading antioxidant enzyme activity "
            "and accelerating post-harvest quality deterioration."
        )

    if score < 60:
        advisories.append(
            f"Phytochemical profile is critically below threshold (Score: {score}/100 — {tier} Tier). "
            "Prioritise disease control and environmental condition stabilisation as first-order interventions "
            "to restore normal phytochemical biosynthesis pathways before the next harvest cycle."
        )
    elif score < 80:
        advisories.append(
            f"Nutritional analysis indicates a reduced phytochemical profile (Score: {score}/100 — {tier} Tier). "
            "Supplement with foliar potassium nitrate (1%) and calcium chloride (0.5%) micronutrient sprays "
            "during the next active growth flush to support phytochemical recovery."
        )

    if not advisories:
        advisories.append(
            "No immediate agronomic intervention is required. The crop presents with favourable disease status, "
            "phytochemical integrity, and environmental conditions. Maintain current cultivation, irrigation, "
            "and monitoring practices. Schedule next diagnostic assessment in 30 days."
        )

    return advisories

def get_env_advisory(uv_stress, humidity_stress, temp_stress, disease_key) -> str:
    parts = []
    if uv_stress == "High":
        parts.append("high UV irradiance is accelerating surface phytochemical degradation, particularly Anthocyanins")
    if humidity_stress == "High":
        parts.append("elevated ambient humidity is creating conditions conducive to fungal and bacterial pathogen proliferation")
    elif humidity_stress == "Low":
        parts.append("below-optimal humidity is inducing physiological drought stress, impairing nutrient uptake and fruit development")
    if temp_stress == "High":
        parts.append("above-threshold temperature is suppressing antioxidant enzyme activity and accelerating fruit senescence")

    if not parts:
        return ("The recorded environmental parameters are within optimal agronomic ranges. "
                "Current conditions support stable phytochemical biosynthesis and reduced disease pressure.")

    combined = "; ".join(p.capitalize() for p in parts)
    return (f"Environmental Advisory: {combined}. "
            "Combined stress interactions may compound the overall impact on fruit quality and phytochemical stability beyond individual factor assessments. "
            "Corrective interventions are recommended as a priority.")


# ─────────────────────────────────────────────
# Main HTML builder
# ─────────────────────────────────────────────

def build_report_html(scan: dict, profile: dict) -> str:
    result     = scan.get("result") or {}
    input_data = scan.get("input_data") or {}

    disease_name = result.get("disease", "Unknown")
    disease_key  = get_disease_key(disease_name)
    content      = DISEASE_CONTENT.get(disease_key, DISEASE_CONTENT["healthy"])
    severity     = result.get("severity", "None")
    nutrition    = result.get("nutrition") or {}
    env          = result.get("environment") or {}

    uv          = float(input_data.get("uv_irradiance", 0))
    humidity    = float(input_data.get("humidity", 0))
    temperature = float(input_data.get("temperature", 0))
    uv_stress   = get_uv_stress(uv)
    hum_stress  = get_humidity_stress(humidity)
    temp_stress = get_temp_stress(temperature)

    report_id   = generate_report_id(scan.get("id", "UNKNOWN"))
    date_str    = format_date(scan.get("created_at", ""))
    full_name   = (profile or {}).get("full_name") or "N/A"
    confidence  = scan.get("confidence_score") or 0
    media_url   = scan.get("media_url", "")
    public_id   = scan.get("public_id", "")
    filename    = public_id.split("/")[-1] if "/" in public_id else (public_id or "N/A")
    scan_type   = scan.get("scan_type", "disease_detection")

    if scan_type == "phytochemical_detection":
        report_title = "PHYTOCHEMICAL ANALYSIS REPORT"
    else:
        report_title = "FRUIT DISEASE ANALYSIS REPORT"

    disease_display = content["display_name"]
    advisories = get_advisories(disease_key, severity, uv_stress, hum_stress, temp_stress, nutrition)
    env_advisory = get_env_advisory(uv_stress, hum_stress, temp_stress, disease_key)

    antho  = float(nutrition.get("anthocyanins", 0))
    puni   = float(nutrition.get("punicalagins", 0))
    ellag  = float(nutrition.get("ellagic_acid", 0))
    score  = int(nutrition.get("nutritional_score", 0))
    tier   = nutrition.get("quality_tier", "N/A")
    grade  = get_quality_grade(score)

    antho_status = get_nutrition_status(antho, 10, 25)
    puni_status  = get_nutrition_status(puni, 100, 200)
    ellag_status = get_nutrition_status(ellag, 8, 20)

    def section_header(title: str) -> str:
        return f"""
        <div class="section-header">{title}</div>"""

    def bullet_list(items: list) -> str:
        lis = "".join(f"<li>{item}</li>" for item in items)
        return f"<ul>{lis}</ul>"

    def numbered_list(items: list) -> str:
        lis = "".join(f"<li>{item}</li>" for item in items)
        return f"<ol>{lis}</ol>"

    advisories_html = numbered_list(advisories)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PomeGuard Diagnostic Report — {report_id}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      font-family: 'Libre Baskerville', Georgia, 'Times New Roman', serif;
      font-size: 11.5px;
      line-height: 1.65;
      color: #1a1a1a;
      background: #ffffff;
      width: 794px;
      margin: 0 auto;
      padding: 36px 42px 44px 42px;
    }}

    /* ── Letterhead ── */
    .letterhead {{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 10px;
    }}
    .letterhead-left {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .logo-circle {{
      width: 42px;
      height: 42px;
      background: {BRAND_RED};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }}
    .logo-circle svg {{
      width: 24px;
      height: 24px;
      stroke: #ffffff;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }}
    .brand-name {{
      font-family: 'Inter', Arial, sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: {BRAND_RED};
      letter-spacing: 0.5px;
      line-height: 1.1;
    }}
    .brand-tagline {{
      font-family: 'Inter', Arial, sans-serif;
      font-size: 9px;
      color: #666;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }}
    .letterhead-right {{
      text-align: right;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 9.5px;
      color: #444;
      line-height: 1.7;
    }}
    .letterhead-right strong {{
      color: #1a1a1a;
    }}

    .divider {{
      border: none;
      border-top: 1.5px solid #2c2c2c;
      margin: 10px 0;
    }}
    .divider-light {{
      border: none;
      border-top: 0.75px solid #cccccc;
      margin: 10px 0;
    }}

    /* ── Title Banner ── */
    .title-banner {{
      background-color: {BRAND_RED};
      color: #ffffff;
      text-align: center;
      padding: 11px 16px;
      font-family: 'Inter', Arial, sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin: 14px 0;
    }}

    /* ── Metadata table ── */
    .meta-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10.5px;
    }}
    .meta-table td {{
      border: 0.75px solid #aaaaaa;
      padding: 5px 10px;
      vertical-align: top;
    }}
    .meta-table td:first-child {{
      font-weight: 700;
      font-family: 'Inter', Arial, sans-serif;
      width: 30%;
      background: #f7f7f7;
      color: #111;
    }}

    /* ── Section Header Bar ── */
    .section-header {{
      background-color: {BRAND_RED};
      color: #ffffff;
      font-family: 'Inter', Arial, sans-serif;
      font-weight: 700;
      font-size: 10.5px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 6px 12px;
      margin: 20px 0 10px 0;
    }}

    /* Sub-section header (light red bar) */
    .sub-section-header {{
      background-color: {SECTION_HEADER_LIGHT};
      color: {BRAND_RED};
      font-family: 'Inter', Arial, sans-serif;
      font-weight: 700;
      font-size: 9.5px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      padding: 4px 10px;
      margin: 12px 0 6px 0;
      border-left: 3px solid {BRAND_RED};
    }}

    /* ── Content tables (findings, nutrition, env) ── */
    .data-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin-bottom: 12px;
    }}
    .data-table th {{
      border: 0.75px solid #999999;
      padding: 5px 10px;
      background: #eeeeee;
      font-family: 'Inter', Arial, sans-serif;
      font-weight: 700;
      font-size: 9.5px;
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}
    .data-table td {{
      border: 0.75px solid #cccccc;
      padding: 5px 10px;
      vertical-align: top;
    }}
    .data-table tr:nth-child(even) td {{
      background: #fafafa;
    }}

    /* ── Lists ── */
    ul, ol {{
      margin: 4px 0 8px 22px;
      padding: 0;
    }}
    li {{
      margin-bottom: 4px;
      font-size: 10.5px;
      line-height: 1.6;
    }}

    /* ── Env advisory ── */
    .env-advisory {{
      font-style: italic;
      color: #333;
      margin: 8px 0 4px 16px;
      font-size: 10px;
      line-height: 1.65;
    }}

    /* ── Score line ── */
    .score-line {{
      font-family: 'Inter', Arial, sans-serif;
      font-size: 11px;
      font-weight: 600;
      margin: 10px 0 4px 0;
      color: #1a1a1a;
    }}

    /* ── Image section ── */
    .image-container {{
      text-align: center;
      margin: 10px 0;
    }}
    .image-container img {{
      width: 200px;
      height: auto;
      border: 1px solid #999999;
      display: inline-block;
    }}
    .image-caption {{
      font-style: italic;
      font-size: 9px;
      color: #555;
      margin-top: 6px;
    }}

    /* ── Footer ── */
    .footer {{
      margin-top: 24px;
    }}
    .footer-text {{
      font-style: italic;
      font-size: 9px;
      color: #666;
      line-height: 1.6;
      margin-top: 8px;
    }}

    /* ── Page break helpers ── */
    .page-break-before {{ page-break-before: always; }}
    .avoid-break {{ page-break-inside: avoid; }}
  </style>
</head>
<body>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 1 — LETTERHEAD                  -->
  <!-- ════════════════════════════════════════ -->
  <div class="letterhead">
    <div class="letterhead-left">
      <div class="logo-circle">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2v20"/>
          <path d="M12 12 4.5 7.5"/>
          <path d="M12 12l7.5-4.5"/>
        </svg>
      </div>
      <div>
        <div class="brand-name">POMEGUARD</div>
        <div class="brand-tagline">Precision Horticulture Intelligence</div>
      </div>
    </div>
    <div class="letterhead-right">
      <table style="border:none; font-size:9.5px; color:#444;">
        <tr>
          <td style="padding:1px 18px 1px 0; border:none;">Advanced Fruit Diagnostics</td>
          <td style="padding:1px 0; border:none;"><strong>Helpline:</strong> N/A</td>
        </tr>
        <tr>
          <td style="padding:1px 18px 1px 0; border:none;">www.pomeguard.app</td>
          <td style="padding:1px 0; border:none;"><strong>Email:</strong> support@pomeguard.app</td>
        </tr>
      </table>
    </div>
  </div>

  <hr class="divider"/>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 2 — REPORT TITLE BANNER         -->
  <!-- ════════════════════════════════════════ -->
  <div class="title-banner">{report_title}</div>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 3 — REPORT METADATA             -->
  <!-- ════════════════════════════════════════ -->
  <table class="meta-table">
    <tr><td>Report ID</td><td>#{report_id}</td></tr>
    <tr><td>Date of Analysis</td><td>{date_str}</td></tr>
    <tr><td>Fruit Analysed</td><td>Pomegranate (Punica granatum — Bhagwa Cultivar)</td></tr>
    <tr><td>Analysed By</td><td>{full_name}</td></tr>
    <tr><td>Sample Reference</td><td>{filename}</td></tr>
    <tr><td>Environmental Data</td><td>UV: {uv:.0f} W/m² &nbsp;|&nbsp; Humidity: {humidity:.0f}% &nbsp;|&nbsp; Temperature: {temperature:.1f}°C</td></tr>
  </table>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 4 — DISEASE DETECTION FINDINGS  -->
  <!-- ════════════════════════════════════════ -->
  {section_header("4. Disease Detection Findings")}

  <div class="avoid-break">
    <table class="data-table">
      <tr><th>Parameter</th><th>Finding</th></tr>
      <tr><td>Detected Condition</td><td>{disease_display}</td></tr>
      <tr><td>Confidence Score</td><td>{get_confidence_label(confidence)}</td></tr>
      <tr><td>Severity Classification</td><td>{severity}</td></tr>
      <tr><td>Affected Area Estimate</td><td>N/A</td></tr>
    </table>
  </div>

  <div class="sub-section-header">Possible Causes</div>
  {bullet_list(content["causes"])}

  <div class="sub-section-header">Clinical Observations</div>
  {bullet_list(content["observations"])}

  <div class="sub-section-header">Prevention Measures</div>
  {bullet_list(content["prevention"])}

  <div class="sub-section-header">Treatment Protocol</div>
  {bullet_list(content["treatment"])}

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 5 — ENVIRONMENTAL STRESS        -->
  <!-- ════════════════════════════════════════ -->
  {section_header("5. Environmental Stress Assessment")}

  <div class="avoid-break">
    <table class="data-table">
      <tr>
        <th>Parameter</th>
        <th>Recorded Value</th>
        <th>Optimal Range</th>
        <th>Stress Level</th>
      </tr>
      <tr>
        <td>UV Irradiance</td>
        <td>{uv:.0f} W/m²</td>
        <td>0–400 W/m² (Low/Optimal)</td>
        <td>{uv_stress}</td>
      </tr>
      <tr>
        <td>Relative Humidity</td>
        <td>{humidity:.0f}%</td>
        <td>40–70%</td>
        <td>{hum_stress}</td>
      </tr>
      <tr>
        <td>Ambient Temperature</td>
        <td>{temperature:.1f}°C</td>
        <td>15–35°C</td>
        <td>{temp_stress}</td>
      </tr>
    </table>
  </div>

  <p class="env-advisory">{env_advisory}</p>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 6 — NUTRITIONAL PROFILE         -->
  <!-- ════════════════════════════════════════ -->
  {section_header("6. Nutritional &amp; Phytochemical Profile")}

  <div class="avoid-break">
    <table class="data-table">
      <tr>
        <th>Compound</th>
        <th>Detected Value</th>
        <th>Reference Range (Bhagwa)</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Anthocyanins</td>
        <td>{antho:.1f} mg/100g</td>
        <td>10–25 mg/100g</td>
        <td>{antho_status}</td>
      </tr>
      <tr>
        <td>Punicalagins</td>
        <td>{puni:.1f} mg/100g</td>
        <td>100–200 mg/100g</td>
        <td>{puni_status}</td>
      </tr>
      <tr>
        <td>Ellagic Acid</td>
        <td>{ellag:.1f} mg/100g</td>
        <td>8–20 mg/100g</td>
        <td>{ellag_status}</td>
      </tr>
    </table>
  </div>

  <p class="score-line">Overall Nutritional Score: {score} / 100 — {tier} Tier</p>
  <p class="score-line">Quality Grade: {grade}</p>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 7 — AGRONOMIC ADVISORY          -->
  <!-- ════════════════════════════════════════ -->
  {section_header("7. Agronomic Advisory")}
  {advisories_html}

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 8 — SUBMITTED IMAGE             -->
  <!-- ════════════════════════════════════════ -->
  {section_header("8. Submitted Sample Image")}

  <div class="image-container avoid-break">
    <img src="{media_url}" alt="Submitted fruit sample" />
    <div class="image-caption">Figure 1: Image submitted for analysis — {filename}</div>
  </div>

  <!-- ════════════════════════════════════════ -->
  <!-- SECTION 9 — FOOTER                       -->
  <!-- ════════════════════════════════════════ -->
  <div class="footer">
    <hr class="divider"/>
    <p class="footer-text">
      <strong>Disclaimer:</strong> This report is generated by PomeGuard AI. It is an assistive tool and not a substitute for
      professional agricultural or nutritional advice. Please consult a certified agronomist or nutritionist for final confirmation
      of any diagnosis or treatment recommendation contained herein.
    </p>
    <p class="footer-text">
      Generated by PomeGuard &nbsp;|&nbsp; Report ID: #{report_id} &nbsp;|&nbsp; {date_str} &nbsp;|&nbsp; {full_name}
    </p>
  </div>

</body>
</html>"""

    return html
