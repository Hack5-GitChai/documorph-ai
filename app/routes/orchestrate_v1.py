# File: app/routes/orchestrate_v1.py
from fastapi import APIRouter, File, UploadFile, HTTPException
import httpx
import os

router = APIRouter() # No prefix here, it will be handled in main.py

N8N_PROCESS_DOCUMENT_WEBHOOK_URL = os.getenv("N8N_PROCESS_DOCUMENT_WEBHOOK_URL_ENV")

if not N8N_PROCESS_DOCUMENT_WEBHOOK_URL:
    print("ORCHESTRATE_V1 (Module Load): CRITICAL ERROR - N8N_PROCESS_DOCUMENT_WEBHOOK_URL_ENV is NOT SET.")
else:
    print(f"ORCHESTRATE_V1 (Module Load): n8n Webhook URL configured as: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")

@router.post("/process-document", summary="Process document via n8n orchestration")
async def process_document_via_orchestrator(
    file: UploadFile = File(..., description="The document file to process (e.g., an image for OCR).")
):
    print(f"ORCHESTRATE_V1: Endpoint /process-document CALLED. Filename: {file.filename}")
    if not N8N_PROCESS_DOCUMENT_WEBHOOK_URL:
        print("ORCHESTRATE_V1: CRITICAL - N8N_PROCESS_DOCUMENT_WEBHOOK_URL is effectively None or empty.")
        raise HTTPException(
            status_code=503, 
            detail="Orchestration service is currently unavailable or not configured."
        )
    if not file.content_type or not file.content_type.startswith("image/"):
        print(f"ORCHESTRATE_V1: Invalid file type received: {file.content_type}")
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file.content_type}. Only image files are currently accepted."
        )
    try:
        file_content = await file.read()
        files_to_send_to_n8n = {'document_file': (file.filename, file_content, file.content_type)}
        print(f"ORCHESTRATE_V1: Forwarding '{file.filename}' to n8n at: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")
        async with httpx.AsyncClient(timeout=90.0) as client:
            response_from_n8n = await client.post(N8N_PROCESS_DOCUMENT_WEBHOOK_URL, files=files_to_send_to_n8n)
        response_from_n8n.raise_for_status() 
        processed_result = response_from_n8n.json()
        print(f"ORCHESTRATE_V1: Success response from n8n: {processed_result}")
        return processed_result
    except httpx.TimeoutException:
        print(f"ORCHESTRATE_V1: Timeout calling n8n: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")
        raise HTTPException(status_code=504, detail="Request to orchestration service timed out.")
    except httpx.RequestError as exc:
        print(f"ORCHESTRATE_V1: HTTP request error calling n8n: {exc}")
        raise HTTPException(status_code=503, detail=f"Error communicating with orchestration service: {str(exc)}")
    except httpx.HTTPStatusError as exc:
        print(f"ORCHESTRATE_V1: n8n returned error {exc.response.status_code}: {exc.response.text}")
        raise HTTPException(status_code=exc.response.status_code, detail=f"Orchestration service error: {exc.response.text}")
    except Exception as e:
        print(f"ORCHESTRATE_V1: Unexpected error in /process-document: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")