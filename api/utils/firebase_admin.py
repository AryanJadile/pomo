import firebase_admin
from firebase_admin import credentials, firestore
import os
import uuid
from datetime import datetime, timedelta

def get_firestore_client():
    if not firebase_admin._apps:
        try:
            private_key = os.getenv("FIREBASE_ADMIN_PRIVATE_KEY", "").replace("\\n", "\n")
            project_id = os.getenv("FIREBASE_ADMIN_PROJECT_ID")
            client_email = os.getenv("FIREBASE_ADMIN_CLIENT_EMAIL")
            
            if project_id and client_email and private_key:
                cred = credentials.Certificate({
                    "type": "service_account",
                    "project_id": project_id,
                    "private_key": private_key,
                    "client_email": client_email,
                    "token_uri": "https://oauth2.googleapis.com/token"
                })
                firebase_admin.initialize_app(cred)
            else:
                return None
        except Exception as e:
            print(f"Firebase Init Error (Keys missing?): {e}")
            return None
    
    try:
        return firestore.client()
    except ValueError:
        return None

def get_or_create_session(user_id: str, scan_id: str) -> dict:
    db = get_firestore_client()
    if not db:
        return {} # Fallback graceful failure if no firebase found
        
    doc_ref = db.collection("chatSessions").document(f"{user_id}_{scan_id}")
    doc = doc_ref.get()
    
    if doc.exists:
        return doc.to_dict()
    
    now_utc = datetime.utcnow()
    session_data = {
        "sessionId": str(uuid.uuid4()),
        "userId": user_id,
        "scanId": scan_id,
        "createdAt": now_utc,
        "expiresAt": now_utc + timedelta(hours=24)
    }
    
    try:
        doc_ref.set(session_data)
    except Exception as e:
        print(f"Firestore Session Creation Error: {e}")
        
    return session_data

def save_message(user_id: str, scan_id: str, role: str, content: str):
    db = get_firestore_client()
    if not db:
        return
        
    doc_ref = db.collection("chatSessions").document(f"{user_id}_{scan_id}").collection("messages").document()
    try:
        doc_ref.set({
            "role": role,
            "content": content,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
    except Exception as e:
        print(f"Firestore Save Message Error: {e}")

def get_session_messages(user_id: str, scan_id: str) -> list:
    db = get_firestore_client()
    if not db:
        return []
        
    try:
        messages_ref = db.collection("chatSessions").document(f"{user_id}_{scan_id}").collection("messages")
        docs = messages_ref.order_by("timestamp").stream()
        
        # We explicitly assemble a list mapping {"role": obj, "content": obj}
        return [{"role": doc.to_dict().get("role"), "content": doc.to_dict().get("content")} for doc in docs]
    except Exception as e:
        print(f"Firestore Get Messages Error: {e}")
        return []
