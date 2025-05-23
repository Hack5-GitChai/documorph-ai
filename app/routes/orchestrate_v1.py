# File: app/routes/orchestrate_v1.py

from fastapi import APIRouter, File, UploadFile, HTTPException
import httpx  # For making asynchronous HTTP requests to n8n
import os     # For accessing environment variables

router = APIRouter()

# We will get this URL from n8n later and set it as an environment variable in Render
N8N_PROCESS_DOCUMENT_WEBHOOK_URL = os.getenv("N8N_PROCESS_DOCUMENT_WEBHOOK_URL_ENV")

@router.post("/process-document", summary="Process document via n8n orchestration")
async def process_document_via_orchestrator(
    file: UploadFile = File(..., description="The document file to process (e.g., an image for OCR).")
):
    """
    Receives a document, forwards it to the n8n orchestration workflow,
    and returns the result from n8n.
    """
    if not N8N_PROCESS_DOCUMENT_WEBHOOK_URL:
        print("CRITICAL ERROR: N8N_PROCESS_DOCUMENT_WEBHOOK_URL_ENV is not set in the backend environment.")
    else:
        print(f"DEBUG FastAPI: n8n Webhook URL configured as: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}") # ADD THIS LINE    
        
        raise HTTPException(
            status_code=500, 
            detail="Orchestration service endpoint is not configured on the server."
        )

    # Basic file type validation (you can expand this later)
    if not file.content_type or not file.content_type.startswith("image/"):
        # For now, assuming OCR will take images. Adjust if other types are expected first.
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file.content_type}. Only image files are currently accepted for this endpoint."
        )

    try:
        file_content = await file.read() # Read the file content into memory

        # Prepare the file for sending to n8n.
        # The key 'document_file' here MUST match the "Property Name" 
        # you will set in the n8n Webhook node's Binary Data section.
        files_to_send_to_n8n = {
            'document_file': (file.filename, file_content, file.content_type)
        }
        
        print(f"Forwarding file '{file.filename}' to n8n webhook at: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")

        # Make the HTTP POST request to the n8n webhook URL
        # Using a longer timeout because n8n might call an HF Space which can have a cold start.
        async with httpx.AsyncClient(timeout=90.0) as client:
            response_from_n8n = await client.post(
                N8N_PROCESS_DOCUMENT_WEBHOOK_URL,
                files=files_to_send_to_n8n # Sending as multipart/form-data
            )
        
        # Check if n8n responded with an error
        response_from_n8n.raise_for_status() 
        
        # n8n should return a JSON response.
        processed_result = response_from_n8n.json()
        print(f"Successfully received response from n8n: {processed_result}")
        
        return processed_result

    except httpx.TimeoutException:
        print(f"Timeout error when calling n8n webhook: {N8N_PROCESS_DOCUMENT_WEBHOOK_URL}")
        raise HTTPException(status_code=504, detail="Request to orchestration service timed out.")
    except httpx.RequestError as exc:
        print(f"HTTP request error when calling n8n: {exc}")
        raise HTTPException(status_code=503, detail=f"Error communicating with the orchestration service: {str(exc)}")
    except httpx.HTTPStatusError as exc: # Handles 4xx/5xx responses from n8n
        print(f"n8n service returned an error: {exc.response.status_code} - {exc.response.text}")
        raise HTTPException(
            status_code=exc.response.status_code, # Forward n8n's status code
            detail=f"Orchestration service error: {exc.response.text}"
        )
    except Exception as e:
        print(f"An unexpected error occurred in /process-document endpoint: {e}")
        import traceback
        traceback.print_exc() # Log the full stack trace for unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected server error occurred: {str(e)}")