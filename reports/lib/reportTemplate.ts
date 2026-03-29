/**
 * PomeGuard Professional Report Template
 * 
 * Generates high-fidelity HTML for printed agronomic diagnostic reports.
 * Designed to look like a document, not a web app.
 * Benchmark: AI Drishti Labs Professional Reports.
 */

export interface ScanData {
  id: string;
  scan_type: string;
  media_url: string;
  confidence_score?: number;
  created_at: string;
  public_id?: string;
  input_data: {
    uv_irradiance: number;
    humidity: number;
    temperature: number;
  };
  result: {
    disease: string;
    severity: string;
    nutrition?: {
      anthocyanins: number;
      punicalagins: number;
      ellagic_acid: number;
      nutritional_score: number;
      quality_tier: string;
    };
  };
}

export interface UserProfile {
  full_name: string;
  phone?: string;
}

const BRAND_RED = "#8B1A1A"; // Deep Pomegranate Red
const LIGHT_RED = "#F9E8E8"; // Very light wash for section headers

const DISEASE_CONTENT: Record<string, any> = {
  "healthy": {
    displayName: "Healthy — No Disease Detected",
    causes: ["No pathogenic cause detected. The fruit presents with no visible signs of fungal, bacterial, or physiological disease."],
    observations: ["Fruit shows no visible signs of disease or stress damage. Surface integrity is intact with no lesions, discolouration, or abnormal growths."],
    prevention: ["Continue current agronomic practices. No intervention required."],
    treatment: ["No treatment necessary at this time. Routine monitoring is advised."]
  },
  "anthracnose": {
    displayName: "Anthracnose",
    causes: [
      "Caused by the fungal pathogen Colletotrichum gloeosporioides.",
      "Infection is favoured by warm, humid conditions (>80% relative humidity and temperatures of 25–30°C).",
      "Spreads through rain splash, wind-borne conidia, and contact with infected plant debris.",
      "Entry occurs through wounds, natural openings (stomata, lenticels), or direct cuticle penetration.",
      "Latent infection established during fruit development is commonly activated post-harvest during storage."
    ],
    observations: [
      "Dark, sunken, circular to oval lesions on the fruit surface, initially water-soaked.",
      "Lesions expand and coalesce under sustained high humidity, turning brown to black.",
      "Pink to orange acervuli (spore masses) appear centrally on mature lesions under moist conditions.",
      "Progressive fruit rot leading to complete collapse in severe cases.",
      "Significant reduction in post-harvest shelf life, marketability, and phytochemical integrity."
    ],
    prevention: [
      "Apply copper-based fungicides (e.g., copper hydroxide 53.8% WDG at 1.5 kg/ha) preventively during flowering and early fruit development.",
      "Maintain adequate plant spacing and annual canopy pruning to improve airflow and reduce relative humidity within the canopy.",
      "Remove and destroy all infected fruits and plant debris immediately upon detection.",
      "Avoid overhead irrigation; switch to drip irrigation to reduce leaf and fruit surface wetness duration.",
      "Apply mulch around the tree base to prevent soil-splashed spore dispersal onto lower canopy surfaces."
    ],
    treatment: [
      "Apply Mancozeb (75% WP at 2.5 g/L) or Carbendazim (50% WP at 1 g/L) in fortnightly spray cycles.",
      "Remove and safely dispose of heavily infected fruit; bag remaining healthy fruits where feasible.",
      "Apply systemic fungicide Azoxystrobin (23% SC at 1 mL/L) at first symptom appearance for internal penetration.",
      "Repeat applications every 10–14 days, rotating between chemical classes to prevent resistance development."
    ]
  },
  "bacterial_blight": {
    displayName: "Bacterial Blight",
    causes: [
      "Caused primarily by Xanthomonas axonopodis pv. punicae (Xap), a gram-negative bacterium.",
      "Infection enters the host through stomatal openings and mechanical wounds during rain events.",
      "Spread occurs via contaminated irrigation water, infected pruning tools, and wind-driven rain.",
      "Warm, wet conditions (24–30°C with sustained leaf wetness) heavily favour bacterial multiplication.",
      "Infected nursery planting material acts as primary inoculum source for new orchard establishments."
    ],
    observations: [
      "Water-soaked, angular lesions on leaves, stems, and fruit rind, often delimited by leaf veins.",
      "Lesions turn dark brown to black with oily, translucent margins under wet weather conditions.",
      "Crack formation on fruit rind exposing inner tissues and facilitating secondary fungal infection.",
      "Bacterial exudate (gummosis) often visible as amber-coloured droplets on infected stems and fruit.",
      "Severe defoliation and premature fruit drop in advanced infection stages with significant yield loss."
    ],
    prevention: [
      "Use certified bacterial blight-free planting material obtained from reputable, screened nurseries.",
      "Apply copper oxychloride (50% WP at 3 g/L) as a preventive spray on a monthly calendar basis.",
      "Avoid wounding fruit rind during thinning, bagging, or harvesting operations to prevent entry points.",
      "Disinfect all pruning tools with 70% ethanol or 1% sodium hypochlorite solution between individual trees.",
      "Maintain proper orchard drainage to avoid waterlogging which promotes bacterial survival and spread."
    ],
    treatment: [
      "Apply copper hydroxide (77% WP at 3–4 g/L) at first symptom appearance and repeat after 10 days.",
      "Combine with Streptomycin sulphate (90% SP at 0.6 g/L) for synergistic bactericidal action.",
      "Prune and remove all infected shoots, stems, and fruit; treat cut surfaces with Bordeaux paste.",
      "Repeat spray applications every 10 days for a minimum of 3 consecutive cycles post-symptom onset."
    ]
  },
  "alternaria": {
    displayName: "Alternaria Fruit Rot",
    causes: [
      "Caused by the fungal pathogen Alternaria alternata and related Alternaria spp.",
      "Infection predominantly enters through the calyx end (crown region) of the developing fruit.",
      "High relative humidity and poor canopy aeration create optimal sporulation conditions.",
      "Spores are disseminated via wind and rain splash from infected crop debris.",
      "Physiological stress in host trees (drought, nutrient deficiency) significantly increases susceptibility."
    ],
    observations: [
      "Characteristic dark brown to black rot initiating from the calyx region and progressing inward.",
      "Internal rot is frequently not externally visible until advanced decay stages, creating marketing risk.",
      "Unpleasant fermented odour emanating from affected arils despite an apparently sound outer rind.",
      "Black spore masses (conidia) visible under the persistent sepals of the calyx crown.",
      "Severe internal quality degradation rendering fruit commercially unmarketable at harvest."
    ],
    prevention: [
      "Ensure adequate annual canopy pruning to reduce internal humidity and improve light penetration.",
      "Apply Mancozeb at petal fall (75% WP at 2.5 g/L) and repeat at 30-day intervals through fruit development.",
      "Seal calyx cups with petroleum jelly or approved horticultural wax after flowering to block fungal entry.",
      "Avoid excessive nitrogen fertilisation which promotes succulent, more susceptible tissue growth.",
      "Implement fruit bagging using specialised paper or mesh bags 30–45 days after fruit set."
    ],
    treatment: [
      "Apply Iprodione (50% WP at 2 g/L) or Tebuconazole (25.9% EC at 1 mL/L) at first symptom detection.",
      "Remove affected fruits from the tree immediately and bury or incinerate away from the orchard block.",
      "Follow up with broad-spectrum Chlorothalonil (75% WP at 2 g/L) as a secondary protective application.",
      "Improve root zone drainage to reduce water stress that compromises the tree's natural disease resistance."
    ]
  },
  "cercospora": {
    displayName: "Cercospora Leaf Spot",
    causes: [
      "Caused by Cercospora punicae, a foliar necrotrophic fungal pathogen.",
      "Disease development favoured by warm, humid conditions with free moisture on leaf surfaces.",
      "Spreads primarily via wind-dispersed conidia produced on sporulating lesions during wet periods.",
      "Secondary infections spread rapidly during monsoon season via rain splash from infected debris.",
      "Dense planting and restricted canopy airflow significantly amplify disease pressure in the orchard."
    ],
    observations: [
      "Small, circular to angular spots with pale grey-white centres and distinctive dark purple-brown margins.",
      "Spots coalesce under high disease pressure, causing extensive leaf area destruction.",
      "Premature defoliation leads to sunburn damage on exposed fruit and significantly reduces photosynthetic capacity.",
      "Weakened tree vigour reduces the accumulation of sugars, phenolics, and antioxidant compounds in developing fruit.",
      "Secondary fruit surface cracking and reduced phytochemical integrity due to prolonged physiological stress."
    ],
    prevention: [
      "Apply copper oxychloride (50% WP at 3 g/L) preventively at the commencement of the humid growing season.",
      "Maintain adequate plant spacing and conduct annual structural pruning for optimal canopy airflow.",
      "Avoid overhead irrigation systems that prolong leaf surface wetness duration in the canopy.",
      "Regularly clear fallen leaves from the orchard floor to reduce the primary spore inoculum load.",
      "Apply organic mulch around the tree base to suppress soil splash transmission of spores to lower canopy."
    ],
    treatment: [
      "Apply Carbendazim (50% WP at 1 g/L) or Hexaconazole (5% SC at 2 mL/L) in fortnightly spray cycles.",
      "Remove and destroy heavily infected leaves and branches at a site removed from the orchard block.",
      "Supplement with foliar potassium nitrate spray (1%) to improve leaf cell wall strength and disease resistance.",
      "Re-evaluate disease pressure after 2–3 spray cycles and rotate to an alternate chemical class to prevent resistance."
    ]
  }
};

const getDiseaseKey = (diseaseName: string|undefined): string => {
  const name = (diseaseName || "").toLowerCase();
  if (!name || name.includes("healthy")) return "healthy";
  if (name.includes("anthracnose")) return "anthracnose";
  if (name.includes("bacterial") || name.includes("blight")) return "bacterial_blight";
  if (name.includes("alternaria")) return "alternaria";
  if (name.includes("cercospora")) return "cercospora";
  return "healthy";
};

const getStressLevel = (param: string, value: number): string => {
  if (param === 'uv') return value < 400 ? 'Low' : value <= 800 ? 'Moderate' : 'High';
  if (param === 'hum') return value < 40 ? 'Low' : value <= 70 ? 'Optimal' : 'High';
  if (param === 'temp') return value < 15 ? 'Low' : value <= 35 ? 'Optimal' : 'High';
  return 'N/A';
};

const getPhytoStatus = (val: number, min: number, max: number) => {
  if (val < min) return 'Below Reference';
  if (val > max) return 'Above Reference';
  return 'Optimal';
};

export const buildReportHtml = (scan: ScanData, profile: UserProfile): string => {
  const diseaseKey = getDiseaseKey(scan.result.disease);
  const content = DISEASE_CONTENT[diseaseKey];
  const reportId = `PG-${scan.id.slice(0, 8).toUpperCase()}`;
  const dateStr = new Date(scan.created_at).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const uv = scan.input_data.uv_irradiance;
  const hum = scan.input_data.humidity;
  const temp = scan.input_data.temperature;

  const nutrition = scan.result.nutrition;
  const hasPhyto = scan.scan_type.includes('phytochemical');
  const hasDisease = scan.scan_type.includes('disease');

  let reportTitle = "COMPREHENSIVE FRUIT ANALYSIS REPORT";
  if (!hasPhyto) reportTitle = "FRUIT DISEASE ANALYSIS REPORT";
  if (!hasDisease) reportTitle = "PHYTOCHEMICAL ANALYSIS REPORT";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PomeGuard Report - ${reportId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Libre Baskerville', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 40px;
      width: 794px; /* A4 width @ 96dpi */
      margin: 0 auto;
    }

    .letterhead {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .brand {
      display: flex;
      flex-direction: column;
    }

    .brand-logo {
      font-family: 'Inter', sans-serif;
      font-size: 24pt;
      font-weight: 800;
      color: ${BRAND_RED};
      letter-spacing: -1px;
    }

    .company-info {
      text-align: right;
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      color: #444;
      line-height: 1.4;
    }

    hr.styled-hr {
      border: none;
      border-top: 1px solid #333;
      margin: 10px 0 20px 0;
    }

    .title-banner {
      background: ${BRAND_RED};
      color: white;
      text-transform: uppercase;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 14pt;
      text-align: center;
      padding: 12px;
      letter-spacing: 2px;
      margin-bottom: 25px;
    }

    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }

    .meta-table td {
      border: 1px solid #bbb;
      padding: 8px 12px;
      font-size: 10pt;
    }

    .meta-table td.label {
      font-weight: bold;
      font-family: 'Inter', sans-serif;
      width: 30%;
      background: #f9f9f9;
    }

    .section-header {
      background: ${LIGHT_RED};
      color: ${BRAND_RED};
      padding: 8px 15px;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 11pt;
      text-transform: uppercase;
      margin: 25px 0 15px 0;
      border-left: 5px solid ${BRAND_RED};
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .data-table th, .data-table td {
      border: 1px solid #bbb;
      padding: 8px 12px;
      text-align: left;
      font-size: 10pt;
    }

    .data-table th {
      background: #f0f0f0;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9pt;
    }

    h4 {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      margin: 15px 0 8px 0;
      text-decoration: underline;
    }

    ul, ol {
      margin-left: 25px;
      margin-bottom: 15px;
    }

    li {
      margin-bottom: 5px;
      font-size: 10.5pt;
    }

    .advisory-text {
      font-style: italic;
      color: #333;
      margin-top: 10px;
      padding-left: 10px;
      border-left: 2px solid #ccc;
    }

    .image-block {
      text-align: center;
      margin: 30px 0;
    }

    .image-block img {
      width: 200px;
      border: 1px solid #ccc;
    }

    .image-caption {
      font-size: 9pt;
      font-style: italic;
      color: #666;
      margin-top: 8px;
    }

    .footer {
      margin-top: 50px;
      border-top: 1px solid #ccc;
      padding-top: 15px;
      font-size: 8.5pt;
      color: #666;
      font-style: italic;
    }

    .avoid-break {
      page-break-inside: avoid;
    }
  </style>
</head>
<body>

  <div class="letterhead">
    <div class="brand">
      <div class="brand-logo">POMEGUARD</div>
      <div style="font-family: 'Inter', sans-serif; font-size: 9pt; font-weight: 700; color: #666;">ADVANCED FRUIT DIAGNOSTICS</div>
    </div>
    <div class="company-info">
      Advanced Fruit Diagnostics | Helpline: ${profile.phone || 'N/A'}<br>
      www.pomeguard.app | Email: support@pomeguard.app
    </div>
  </div>

  <hr class="styled-hr">

  <div class="title-banner">${reportTitle}</div>

  <table class="meta-table">
    <tr><td class="label">Report ID</td><td>#${reportId}</td></tr>
    <tr><td class="label">Date of Analysis</td><td>${dateStr}</td></tr>
    <tr><td class="label">Fruit Analysed</td><td>Pomegranate (Punica granatum)</td></tr>
    <tr><td class="label">Analysed By</td><td>${profile.full_name}</td></tr>
    <tr><td class="label">Sample Reference</td><td>${scan.public_id || 'SCAN_' + scan.id.slice(0, 4)}</td></tr>
    <tr><td class="label">Environmental Data</td><td>UV: ${uv} W/m² | Humidity: ${hum}% | Temp: ${temp}°C</td></tr>
  </table>

  ${hasDisease ? `
  <div class="avoid-break">
    <div class="section-header">Disease Detection Findings</div>
    <table class="data-table">
      <tr><th style="width: 40%">Detected Condition</th><td>${content.displayName}</td></tr>
      <tr><th>Confidence Score</th><td>${scan.confidence_score ? scan.confidence_score.toFixed(1) + '%' : 'N/A'}</td></tr>
      <tr><th>Severity Classification</th><td>${scan.result.severity}</td></tr>
      <tr><th>Affected Area Estimate</th><td>Minimal / Surface Only</td></tr>
    </table>

    <h4>Possible Causes</h4>
    <ul>${content.causes.map((c: string) => `<li>${c}</li>`).join('')}</ul>

    <h4>Clinical Observations</h4>
    <ul>${content.observations.map((c: string) => `<li>${c}</li>`).join('')}</ul>

    <h4>Prevention Measures</h4>
    <ul>${content.prevention.map((c: string) => `<li>${c}</li>`).join('')}</ul>

    <h4>Treatment Protocol</h4>
    <ul>${content.treatment.map((c: string) => `<li>${c}</li>`).join('')}</ul>
  </div>
  ` : ''}

  <div class="avoid-break">
    <div class="section-header">Environmental Stress Assessment</div>
    <table class="data-table" style="text-align: center;">
      <tr>
        <th style="text-align: center;">Parameter</th>
        <th style="text-align: center;">Recorded Value</th>
        <th style="text-align: center;">Stress Level</th>
      </tr>
      <tr>
        <td>UV Irradiance</td>
        <td>${uv} W/m²</td>
        <td>${getStressLevel('uv', uv)}</td>
      </tr>
      <tr>
        <td>Relative Humidity</td>
        <td>${hum}%</td>
        <td>${getStressLevel('hum', hum)}</td>
      </tr>
      <tr>
        <td>Ambient Temperature</td>
        <td>${temp}°C</td>
        <td>${getStressLevel('temp', temp)}</td>
      </tr>
    </table>
    <p class="advisory-text">
      <em>Agro-Environmental Advisory:</em> 
      The combined interaction of recorded environmental parameters indicates ${uv > 800 || temp > 35 ? 'elevated physiological stress' : 'a stable growth micro-environment'}. 
      ${uv > 800 ? 'High UV irradiance may trigger surface oxidative stress.' : ''}
      ${hum > 70 ? 'High humidity levels increase risk of pathogenic foliar onset.' : ''}
    </p>
  </div>

  ${hasPhyto && nutrition ? `
  <div class="avoid-break">
    <div class="section-header">Nutritional & Phytochemical Profile</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Compound</th>
          <th>Detected Value</th>
          <th>Reference Range</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Anthocyanins</td>
          <td>${nutrition.anthocyanins.toFixed(1)} mg/100g</td>
          <td>10–25 mg/100g</td>
          <td>${getPhytoStatus(nutrition.anthocyanins, 10, 25)}</td>
        </tr>
        <tr>
          <td>Punicalagins</td>
          <td>${nutrition.punicalagins.toFixed(1)} mg/100g</td>
          <td>100–200 mg/100g</td>
          <td>${getPhytoStatus(nutrition.punicalagins, 100, 200)}</td>
        </tr>
        <tr>
          <td>Ellagic Acid</td>
          <td>${nutrition.ellagic_acid.toFixed(1)} mg/100g</td>
          <td>8–20 mg/100g</td>
          <td>${getPhytoStatus(nutrition.ellagic_acid, 8, 20)}</td>
        </tr>
      </tbody>
    </table>
    <div style="font-family: 'Inter', sans-serif; font-size: 11pt; font-weight: 700;">
      Overall Nutritional Score: ${nutrition.nutritional_score} / 100 — ${nutrition.quality_tier} Tier<br>
      Quality Grade: Grade ${nutrition.nutritional_score >= 80 ? 'A (Premium)' : 'B (Standard)'}
    </div>
  </div>
  ` : ''}

  <div class="avoid-break">
    <div class="section-header">Agronomic Advisory</div>
    <ol>
      <li>Maintain strict adherence to the Treatment Protocol if any pathogenic symptoms were detected.</li>
      <li>Monitor localized micro-climatic shifts, especially UV irradiance during peak solar hours.</li>
      <li>Ensure balanced fertigation to support phytochemical biosynthesis pathways.</li>
      ${nutrition && nutrition.nutritional_score < 60 ? '<li>Consider supplementary foliar nutrition to boost antioxidant accumulation.</li>' : ''}
    </ol>
  </div>

  <div class="image-block avoid-break">
    <div class="section-header">Submitted Sample Image</div>
    <img src="${scan.media_url}" alt="Sample">
    <div class="image-caption">Figure 1: High-resolution image submitted for analysis — ${scan.public_id || 'PG_SAMPLE'}</div>
  </div>

  <div class="footer">
    <p>Disclaimer: This report is generated by PomeGuard AI. It is an assistive tool and not a substitute for professional agricultural or nutritional advice. Please consult a certified agronomist for final confirmation.</p>
    <p>Generated by PomeGuard | Report ID: #${reportId} | ${dateStr} | Analysed for ${profile.full_name}</p>
  </div>

</body>
</html>
  `;
};
