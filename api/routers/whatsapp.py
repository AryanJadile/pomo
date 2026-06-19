from fastapi import APIRouter, Request, Response
import os
from dotenv import load_dotenv
from utils.whatsapp import send_whatsapp_message
import asyncio

load_dotenv()

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "my_super_secret_verify_token_123")

@router.get("/webhook")
async def verify_webhook(request: Request):
    """
    Endpoint for Meta to verify the webhook.
    """
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode and token:
        if mode == "subscribe" and token == WHATSAPP_VERIFY_TOKEN:
            print("WEBHOOK_VERIFIED")
            return Response(content=challenge, media_type="text/plain")
        else:
            return Response(status_code=403)
    return Response(status_code=400)

@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    Endpoint to receive incoming WhatsApp messages.
    """
    body = await request.json()
    
    if body.get("object") == "whatsapp_business_account":
        for entry in body.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                
                if "messages" in value:
                    for message in value["messages"]:
                        sender_phone = message.get("from")
                        message_type = message.get("type")
                        
                        if message_type == "text":
                            message_text = message.get("text", {}).get("body", "")
                            print(f"Received message from {sender_phone}: {message_text}")
                            
                            reply = (
                                "Welcome to PomeGuard WhatsApp Bot! 🌿\n\n"
                                f"You said: '{message_text}'\n\n"
                                "I am currently in setup mode. Soon you will be able to send photos of your pomegranate plants for instant diagnosis!"
                            )
                            # Run async without blocking the response to Meta
                            asyncio.create_task(send_whatsapp_message(sender_phone, reply))
                            
        return Response(content="EVENT_RECEIVED", status_code=200)
    else:
        return Response(status_code=404)
