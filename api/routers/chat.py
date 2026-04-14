from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json

from utils.gemini import build_system_prompt, stream_chat_message
from utils.firebase_admin import get_or_create_session, save_message, get_session_messages

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatMessageRequest(BaseModel):
    scan_id: str
    user_message: str
    user_id: str

def get_auth_dep(request: Request):
    import main
    return main.get_user_id(request)

def get_db_dep(request: Request):
    import main
    return main.get_supabase(request)

@router.post("/message")
async def chat_message(
    body: ChatMessageRequest,
    current_uid: str = Depends(get_auth_dep),
    supabase = Depends(get_db_dep)
):
    # 1. Validate Ownership constraints
    if body.user_id != current_uid:
        raise HTTPException(status_code=403, detail="Forbidden")

    # 2. Fetch the scan metadata from Supabase 
    result = supabase.table("scans").select("*").eq("id", body.scan_id).eq("user_id", current_uid).execute()
    
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    scan = result.data[0]
    
    # 3. Build system prompt using contextual data
    system_prompt = build_system_prompt(scan)
    
    # 4. Initialize session in Firebase
    get_or_create_session(current_uid, body.scan_id)
    
    # 5. Save incoming message into Firebase
    save_message(current_uid, body.scan_id, "user", body.user_message)
    
    # 6. Extract rolling history, stripping out the msg we literally just dropped into the DB 
    # to avoid double feeding it to Gemini contexts
    raw_history = get_session_messages(current_uid, body.scan_id)
    history = raw_history[:-1] if len(raw_history) > 0 else []

    # 7. Coordinate SSE Streaming mechanics back to frontend payload
    async def event_stream():
        full_response = ""
        try:
            async for chunk in stream_chat_message(system_prompt, history, body.user_message):
                full_response += chunk
                yield f"data: {json.dumps({'text': chunk})}\n\n"
        except Exception as e:
            err_str = str(e)
            if "429" in err_str:
                yield f"data: {json.dumps({'text': 'I am a little busy right now. Please try again in a moment.'})}\n\n"
            else:
                yield f"data: {json.dumps({'error': err_str})}\n\n"
        finally:
            if full_response:
                save_message(current_uid, body.scan_id, "model", full_response)
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
