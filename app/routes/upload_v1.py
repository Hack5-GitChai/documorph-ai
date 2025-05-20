# app/routes/upload_v1.py

from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path # For object-oriented path manipulation
import shutil # For file operations like copy

# Create an APIRouter instance.
# All routes defined in this file will be automatically prefixed by what's
# set in main.py when this router is included (e.g., /api/v1/upload if prefix="/upload" there).
# For now, we'll let main.py handle the full prefixing.
router = APIRouter()

# Define the base directory for uploads.
# Path("data/uploads") assumes 'data' is in the project root,
# and the app is run from the project root.
UPLOAD_DIR = Path("data/uploads") 
# Create the directory if it doesn't exist.
# parents=True: Creates parent directories if they don't exist.
# exist_ok=True: Doesn't raise an error if the directory already exists.
UPLOAD_DIR.mkdir(parents=True, exist_ok=True) 

@router.post("/document/", summary="Upload a document for processing")
# `file: UploadFile = File(...)` tells FastAPI this endpoint expects a file upload.
# `UploadFile` is a special type that provides methods to handle the file.
async def upload_document_for_processing(file: UploadFile = File(...)):
    """
    Handles the upload of a single document file.
    The file is saved to a predefined directory on the server.

    - **file**: The document file to be uploaded.
    """
    # Check if a filename was provided with the upload
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided with the uploaded file.")

    # Basic sanitization: use Path().name to get just the filename part,
    # preventing directory traversal components like '../' in the user-provided filename.
    safe_filename = Path(file.filename).name
    if not safe_filename: # Handles cases where filename might be just ".." or empty after sanitization
        raise HTTPException(status_code=400, detail="Invalid or empty filename provided.")
    
    # Construct the full path where the file will be saved.
    file_path = UPLOAD_DIR / safe_filename

    try:
        # Open the destination file in write-binary ("wb") mode.
        # shutil.copyfileobj efficiently copies the contents of the uploaded file
        # (file.file, which is a SpooledTemporaryFile) to the destination file_object.
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # If successful, return a confirmation message.
        return {
            "message": "File uploaded successfully and saved.",
            "filename": safe_filename,
            "saved_to_server_path": str(file_path) # For debugging; you might not return this in production.
        }
    except Exception as e:
        # If any error occurs during file saving, raise an HTTPException.
        # It's good practice to log the actual error `e` on the server for debugging.
        # print(f"Error saving file: {e}") # Example logging
        raise HTTPException(status_code=500, detail=f"Could not save the uploaded file: {str(e)}")
    finally:
        # It's crucial to close the uploaded file to free up resources.
        # `UploadFile` is an async object, so use `await`.
        await file.close()