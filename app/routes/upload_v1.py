# app/routes/upload_v1.py

from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path # For object-oriented path manipulation
import shutil # For file operations like copy

# Create an APIRouter instance. All routes defined in this file
# will be included in the main app with the prefix defined in main.py (e.g., /api/v1/upload)
router = APIRouter(
    prefix="/upload" # This prefix will be added to all routes in this router
                     # So, /document/ becomes /api/v1/upload/document/
)

# Define the base directory for uploads.
# This path is relative to the root of your project (where you run uvicorn).
# Make sure the 'data' directory exists in your project root.
UPLOAD_DIR = Path("data/uploads") 

# Ensure the UPLOAD_DIR exists when the application starts.
# parents=True: creates parent directories if they don't exist.
# exist_ok=True: doesn't raise an error if the directory already exists.
UPLOAD_DIR.mkdir(parents=True, exist_ok=True) 

@router.post("/document/", summary="Upload a document for processing")
async def upload_document_for_processing(file: UploadFile = File(...)):
    """
    Endpoint to upload a single document file.
    The file will be saved to the server in the `data/uploads/` directory.

    - **file**: The document file to upload (multipart/form-data).
    """
    # Check if a filename was provided with the upload
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided with the file.")

    # Basic filename sanitization to prevent directory traversal issues.
    # Path(file.filename).name extracts only the actual filename part.
    # e.g., if file.filename is "../../../etc/passwd", .name will be "passwd"
    safe_filename = Path(file.filename).name 
    if not safe_filename: # Handle edge cases like filename being just ".."
        raise HTTPException(status_code=400, detail="Invalid filename provided.")

    # Construct the full path where the file will be saved.
    file_path = UPLOAD_DIR / safe_filename

    try:
        # Open the destination file in write-binary ("wb") mode.
        # shutil.copyfileobj copies the contents from the uploaded file stream
        # to the destination file stream efficiently.
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # If successful, return a confirmation message.
        return {
            "message": "File uploaded successfully and saved.",
            "filename": safe_filename,
            "saved_path_on_server": str(file_path) # For debugging, you might remove this in production
        }
    except Exception as e:
        # If any error occurs during file saving, raise an HTTP 500 error.
        # It's good practice to log the actual error `e` on the server for debugging.
        # print(f"Error saving file: {e}") # Example logging
        raise HTTPException(status_code=500, detail=f"Could not save uploaded file: {str(e)}")
    finally:
        # Crucial: Always close the uploaded file stream to free up resources.
        await file.close()