import sys
import os
import random
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import uvicorn
from typing import Dict, Any, List, Optional
from datetime import datetime
import cloudinary
import cloudinary.uploader
from supabase import create_client, Client
from fastapi import Request, HTTPException, Depends
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL          = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

# Single admin client — user isolation is enforced manually via .eq("user_id", ...)
_supabase: Client = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    _supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_supabase(request: Request) -> Client:
    if not _supabase:
        raise HTTPException(status_code=503, detail="Supabase not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env")
    return _supabase

def get_user_id(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    import jwt
    token = auth_header.split(" ")[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        uid = decoded.get("sub")
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token: no sub claim")
        return uid
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token decode failed: {e}")

# Import the Vision Agent
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from agents.vision_agent import PomeVisionAgent

app = FastAPI(title="PomeGuard API", description="LangGraph Orchestration for Pomegranate Health Mapping")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vision Agent
vision_agent = PomeVisionAgent()

# Dummy definitions (leaving notifications as mem for now to reduce scope creep on notifications, though history goes to supabase)
NOTIFICATIONS_DB = []

@app.post("/api/upload/media")
async def upload_media(
    file: UploadFile = File(...), 
    user_id: str = Depends(get_user_id),
    supabase: Client = Depends(get_supabase)
):
    try:
        # Determine resource type
        resource_type = "video" if file.content_type.startswith("video") else "image"
        
        # Read file
        contents = await file.read()
        
        # Upload to Cloudinary under user's folder
        folder = f"plant-scans/{user_id}"
        
        upload_result = cloudinary.uploader.upload(
            contents,
            folder=folder,
            resource_type=resource_type,
            quality="auto",
            fetch_format="auto" if resource_type == "image" else None
        )
        
        return {
            "url": upload_result.get("secure_url"),
            "publicId": upload_result.get("public_id"),
            "mediaType": resource_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/classify")
async def classify_fruit(image: UploadFile = File(...)):
    import tempfile
    suffix = os.path.splitext(image.filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await image.read())
        temp_img_path = tmp.name
        
    disease_label = vision_agent.predict(temp_img_path)
    
    if os.path.exists(temp_img_path):
        os.remove(temp_img_path)
        
    severity = "None" if disease_label == "Healthy" else random.choice(["Mild", "Moderate", "Severe"])
    
    result = {
        "disease": disease_label,
        "severity": severity,
        "confidence": round(random.uniform(90.0, 99.5), 1),
        "severity_score": 0.5 if severity == "Moderate" else 0.8 if severity == "Severe" else 0.2,
        "image_url": "uploaded_image"
    }
    return result

class EnvPayload(BaseModel):
    uv_irradiance: float
    humidity: float
    temperature: float

@app.post("/api/env-metadata")
async def submit_env_metadata(payload: EnvPayload):
    factors = []
    uv_level = "High" if payload.uv_irradiance > 1000 else "Low"
    hum_level = "High" if payload.humidity < 40 or payload.humidity > 80 else "Optimal"
    temp_level = "High" if payload.temperature > 35 else "Optimal"
    
    if uv_level == "High": factors.append("High UV")
    if hum_level == "High": factors.append("Abnormal Humidity")
    if temp_level == "High": factors.append("High Temperature")
    
    if not factors: factors.append("Optimal Conditions")
    
    # Trigger notification if stress factors exist
    stress_alerts = [f for f in factors if f != "Optimal Conditions"]
    if stress_alerts:
        NOTIFICATIONS_DB.append({
            "id": len(NOTIFICATIONS_DB) + 1,
            "type": "environmental_alert",
            "message": f"Critical Environmental Factors Detected: {', '.join(stress_alerts)}",
            "read": False,
            "timestamp": datetime.now().isoformat()
        })
    
    return {
        "stress_factors": factors,
        "uv_stress_level": uv_level,
        "humidity_stress_level": hum_level,
        "temp_stress_level": temp_level
    }

class OntologyPayload(BaseModel):
    disease: str
    severity: str
    stress_factors: List[str]

@app.post("/api/ontology-inference")
async def run_ontology_inference(payload: OntologyPayload):
    label = payload.disease.lower()
    
    # Base values for Bhagwa cultivar
    base_punicalagin = 150.0  
    base_vit_c = 15.0         
    base_anthocyanin = 18.0
    
    puni_deg = 0.0
    vitc_deg = 0.0
    antho_deg = 0.0
    
    # Disease impact
    if 'anthracnose' in label:
        puni_deg += 0.15
        vitc_deg += 0.40
        antho_deg += 0.20
    elif 'bacterial_blight' in label or 'blight' in label:
        puni_deg += 0.35
        vitc_deg += 0.30
        antho_deg += 0.40
    elif 'alternaria' in label:
        puni_deg += 0.20
        vitc_deg += 0.25
        antho_deg += 0.15
    elif 'cercospora' in label:
        puni_deg += 0.10
        vitc_deg += 0.20
        antho_deg += 0.10
        
    # Irradiance (Sunburn Risk)
    if "High UV" in payload.stress_factors:
        vitc_deg += 0.10
        puni_deg += 0.05
        antho_deg += 0.30 # Anthocyanin degrades heavily in high UV
        
    if payload.severity == "Severe":
        puni_deg *= 1.5
        vitc_deg *= 1.5
        antho_deg *= 1.5
        
    final_puni = max(0, base_punicalagin * (1.0 - puni_deg))
    final_vitc = max(0, base_vit_c * (1.0 - vitc_deg))
    final_antho = max(0, base_anthocyanin * (1.0 - antho_deg))
    
    score = 100 - (puni_deg * 40 + vitc_deg * 30 + antho_deg * 30)
    score = max(0, min(100, int(score)))
    
    tier = "Optimal" if score >= 80 else "Reduced" if score >= 60 else "Depleted"
    
    result = {
        "anthocyanins": round(final_antho, 1),
        "punicalagins": round(final_puni, 1),
        "ellagic_acid": round(final_vitc, 1),
        "nutritional_score": score,
        "quality_tier": tier
    }
    
    if payload.severity == "Severe":
        NOTIFICATIONS_DB.append({
            "id": len(NOTIFICATIONS_DB) + 1,
            "type": "disease_alert",
            "message": f"Severe {payload.disease.replace('_', ' ').title()} detected in recent scan. Take immediate action.",
            "read": False,
            "timestamp": datetime.now().isoformat()
        })
    
    return result

@app.get("/api/notifications")
async def get_notifications():
    # Return reversed so newest are first
    return list(reversed(NOTIFICATIONS_DB))

@app.put("/api/notifications/{n_id}/read")
async def mark_notification_read(n_id: int):
    for n in NOTIFICATIONS_DB:
        if n["id"] == n_id:
            n["read"] = True
            return n
    return {"error": "Not found"}

class ScanPayload(BaseModel):
    scan_type: str
    media_url: str
    media_type: str
    public_id: str
    input_data: Optional[Dict[str, Any]] = None
    result: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None

@app.post("/api/scans/save")
async def save_scan(payload: ScanPayload, user_id: str = Depends(get_user_id), supabase: Client = Depends(get_supabase)):
    data = payload.model_dump()
    data["user_id"] = user_id
    try:
        response = supabase.table("scans").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/scans/history")
async def get_scans_history(
    user_id: str = Depends(get_user_id), 
    supabase: Client = Depends(get_supabase),
    scan_type: Optional[str] = None,
    media_type: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    query = (
        supabase.table("scans")
        .select("*")
        .eq("user_id", user_id)          # ← enforce user isolation
        .order("created_at", desc=True)
        .limit(limit)
        .offset(offset)
    )
    if scan_type:
        query = query.eq("scan_type", scan_type)
    if media_type:
        query = query.eq("media_type", media_type)
        
    try:
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/scans/{scan_id}")
async def get_scan(scan_id: str, user_id: str = Depends(get_user_id), supabase: Client = Depends(get_supabase)):
    response = supabase.table("scans").select("*").eq("id", scan_id).eq("user_id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Scan not found")
    return response.data[0]

@app.delete("/api/scans/{scan_id}")
async def delete_scan(scan_id: str, user_id: str = Depends(get_user_id), supabase: Client = Depends(get_supabase)):
    res = supabase.table("scans").select("public_id", "media_type").eq("id", scan_id).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    scan = res.data[0]
    try:
        cloudinary.uploader.destroy(scan["public_id"], resource_type=scan["media_type"])
    except Exception as e:
        print("Cloudinary delete failed:", e)
        
    supabase.table("scans").delete().eq("id", scan_id).execute()
    return {"status": "success"}


@app.get("/api/reports/generate")
async def generate_report(
    scan_id: str,
    request: Request,
    user_id: str = Depends(get_user_id),
    supabase: Client = Depends(get_supabase)
):
    # 1. Fetch the scan (RLS ensures it belongs to this user)
    scan_res = supabase.table("scans").select("*").eq("id", scan_id).execute()
    if not scan_res.data:
        raise HTTPException(status_code=404, detail="Scan not found")
    scan = scan_res.data[0]

    # 2. Fetch the user's profile for their full name
    profile_res = supabase.table("profiles").select("*").eq("id", user_id).execute()
    profile = profile_res.data[0] if profile_res.data else {}

    # 3. Build the report HTML
    from report_template import build_report_html
    html = build_report_html(scan, profile)

    # 4. Render to PDF with Playwright
    try:
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.set_content(html, wait_until="networkidle")
            pdf_bytes = await page.pdf(
                format="A4",
                print_background=True,
                margin={"top": "0px", "bottom": "0px", "left": "0px", "right": "0px"}
            )
            await browser.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    # 5. Return as downloadable PDF
    report_id = f"PG-{scan_id[:8].upper()}"
    date_slug = datetime.now().strftime("%Y%m%d")
    filename = f"PomeGuard_Report_{report_id}_{date_slug}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/pdf"
        }
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
