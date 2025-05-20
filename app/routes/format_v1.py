# app/routes/format_v1.py

from fastapi import APIRouter, Form, HTTPException, Depends
from fastapi.responses import FileResponse # Used to send a file as a response
from app.services.doc_formatter_v1 import apply_dummy_formatting # Our dummy formatting service
from pathlib import Path # For object-oriented path manipulation

# Create an APIRouter instance.
# This router will be included in main.py, and its routes will be prefixed.
router = APIRouter()

# Define base directories for consistent path management and some security.
# These assume your 'data' and 'app/templates' folders are at the project root,
# and the application is run from the project root.
BASE_UPLOAD_DIR = Path("data/uploads")
BASE_OUTPUT_DIR = Path("data/sample_outputs")
# BASE_TEMPLATE_DIR = Path("app/templates") # We'll use this when we add real templates

# Ensure these base directories exist when the module is loaded.
BASE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
BASE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
# BASE_TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)


# Define the POST endpoint for formatting a document.
# It expects 'filename' as form data.
@router.post("/document/", summary="Format an uploaded document and allow download")
async def format_and_download_document(
    filename: str = Form(...),
    # template_name: str = Form(...), # Commented out for now, will be added back for real templating
):
    """
    Takes the filename of a previously uploaded document, applies dummy formatting
    to create a DOCX file, and then returns this DOCX file for download.

    - **filename**: The name of the file that was previously uploaded via the
                    `/api/v1/upload/document/` endpoint. This file should exist
                    in the server's `data/uploads/` directory.
    """
    # Basic sanitization: get only the filename part.
    safe_filename = Path(filename).name
    if not safe_filename:
        raise HTTPException(status_code=400, detail="Invalid or empty filename provided.")

    # Construct the full path to the input file (previously uploaded).
    input_file_path = BASE_UPLOAD_DIR / safe_filename
    
    # Determine the output filename and path.
    # We'll take the stem (filename without extension) of the input and add "_formatted.docx".
    output_filename_stem = input_file_path.stem 
    output_file_path = BASE_OUTPUT_DIR / f"{output_filename_stem}_formatted.docx"

    # Check if the input file actually exists in the uploads directory.
    if not input_file_path.is_file():
        raise HTTPException(
            status_code=404, 
            detail=f"Input file '{safe_filename}' not found in uploads directory. Please upload it first."
        )

    try:
        # Call our dummy formatting service.
        # This service function will create the file at `output_file_path`.
        # We pass string paths as the service function expects them.
        # We don't need the return value here if we trust the output_file_path construction.
        await apply_dummy_formatting(str(input_file_path), str(output_file_path))

        # After the service runs, check if the output file was actually created.
        if not output_file_path.is_file():
            # This would indicate an issue within the apply_dummy_formatting service.
            print(f"Error: Formatted file {output_file_path} was not created by the service.")
            raise HTTPException(status_code=500, detail="Formatted file generation failed on the server.")

        # If the file was created successfully, return it as a FileResponse.
        # This tells FastAPI to stream the file back to the client.
        return FileResponse(
            path=str(output_file_path), # The path to the file on the server
            filename=output_file_path.name, # The name the client's browser will suggest for saving
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document' # The MIME type for .docx
        )
    except HTTPException as e:
        # Re-raise HTTPExceptions that might come from the service or path checks
        raise e
    except Exception as e:
        # Catch any other unexpected errors during the process.
        # Log the error `e` on the server for debugging.
        # print(f"Unexpected error during formatting/download: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")