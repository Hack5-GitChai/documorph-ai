# File: app/routes/orchestrate_v1.py

from fastapi import APIRouter, File, UploadFile, HTTPException
import httpx
import os

router = APIRouter()

N8N_PROCESS_DOCUMENT_WEBHOOK_URL = os.getenv("N8N_PROCESS_DOCUMENT_WEBHOOK_URL_ENV")

# You can add a print statement here at the module level to see if the env var is read on startup
if not N8N_PROCESS_DOCUMENT_WEBHOOK_URL:
    print("ORCHESTRATE_V1 (Module Load): CRITICAL ERROR - N8N_PROCESS_DOCUMENT_WEBHOOK_URL_ENV is NOT SET.")
else:
    print(f"ORCHESTRATE_V1 (Module Load): n8n Webhook URL configured as: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")


@router.post("/process-document", summary="Process document via n8n orchestration")
async def process_document_via_orchestrator(
    file: UploadFile = File(..., description="The document file to process (e.g., an image for OCR).")
):
    """
    Receives a document, forwards it to the n8n orchestration workflow,
    and returns the result from n8n.
    """
    print(f"ORCHESTRATE_V1: Endpoint /process-document called. Filename: {file.filename}") # Log endpoint entry

    # Check if the N8N URL was loaded correctly (it's checked at module load too, but good to have here)
    if not N8N_PROCESS_DOCUMENT_WEBHOOK_URL:
        # This internal print is for server logs
        print("ORCHESTRATE_V1: CRITICAL - N8N_PROCESS_DOCUMENT_WEBHOOK_URL is effectively None or empty WITHIN the request.")
        # This HTTPException is what the client (frontend) will see
        raise HTTPException(
            status_code=503, # Service Unavailable is more appropriate if config is missing
            detail="Orchestration service is currently unavailable or not configured."
        )

    # File type validation
    if not file.content_type or not file.content_type.startswith("image/"):
        print(f"ORCHESTRATE_V1: Invalid file type received: {file.content_type}")
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file.content_type}. Only image files are currently accepted."
        )

    try:
        file_content = await file.read()

        files_to_send_to_n8n = {
            'document_file': (file.filename, file_content, file.content_type)
        }
        
        # Log the actual URL being used in this request just before the call
        print(f"ORCHESTRATE_V1: Forwarding '{file.filename}' to n8n at: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")

        async with httpx.AsyncClient(timeout=90.0) as client:
            response_from_n8n = await client.post(
                N8N_PROCESS_DOCUMENT_WEBHOOK_URL,
                files=files_to_send_to_n8n
            )
        
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
        raise HTTPException(
            status_code=exc.response.status_code, 
            detail=f"Orchestration service error: {exc.response.text}"
        )
    except Exception as e:
        print(f"ORCHESTRATE_V1: Unexpected error in /process-document: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")