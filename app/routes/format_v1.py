# app/routes/format_v1.py

from fastapi import APIRouter, Form, HTTPException # Depends not used here
from fastapi.responses import FileResponse
from pathlib import Path

from app.services.doc_formatter_v1 import apply_dummy_formatting 

router = APIRouter(
    prefix="/format" # Full path will be /api/v1/format
)

BASE_UPLOAD_DIR = Path("data/uploads")
BASE_OUTPUT_DIR = Path("data/sample_outputs")

BASE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
BASE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/document/", summary="Format an uploaded document (dummy) and provide it for download")
async def format_and_download_document_route( # Renamed function for clarity vs service
    filename: str = Form(..., description="The name of the previously uploaded file (e.g., 'my_document.txt'). Must exist in data/uploads/.")
    # template_name: str = Form(None, description="Future: Name of the template to apply."),
):
    """
    (Old Flow - Dummy Formatting)
    Takes a `filename` (assumed to be in `data/uploads/`),
    applies dummy formatting using `python-docx` via a service,
    and returns the formatted .docx file for download.
    """
    print(f"ROUTE (format_v1): Received request to format filename: '{filename}'")

    # Basic input validation for filename parameter itself
    if not filename or ".." in filename or "/" in filename or "\\" in filename: # More robust sanitization
        raise HTTPException(status_code=400, detail="Invalid filename provided. Contains disallowed characters or path elements.")
    
    safe_filename = Path(filename).name # Ensures we only use the basename

    input_file_path = BASE_UPLOAD_DIR / safe_filename
    output_filename_stem = input_file_path.stem 
    output_file_path = BASE_OUTPUT_DIR / f"{output_filename_stem}_formatted_dummy.docx" # Made output name more specific

    if not input_file_path.is_file():
        print(f"ROUTE ERROR (format_v1): Input file '{input_file_path}' not found for formatting.")
        raise HTTPException(
            status_code=404, 
            detail=f"Input file '{safe_filename}' not found. Please ensure it was uploaded correctly."
        )

    try:
        # Call the service
        await apply_dummy_formatting(
            input_file_path_str=str(input_file_path), 
            output_file_path_str=str(output_file_path)
        )

        if not output_file_path.is_file():
            print(f"ROUTE ERROR (format_v1): Service did not create output file at '{output_file_path}'.")
            raise HTTPException(status_code=500, detail="Internal error: Formatted file was not generated.")

        print(f"ROUTE (format_v1): Sending formatted file '{output_file_path.name}' for download.")
        return FileResponse(
            path=output_file_path, 
            filename=output_file_path.name, 
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except FileNotFoundError as e_fnf: # Catching specific errors from the service
        print(f"ROUTE ERROR (format_v1): FileNotFoundError from service: {e_fnf}")
        raise HTTPException(status_code=404, detail=str(e_fnf)) # Make sure detail is user-friendly
    except IOError as e_io:
        print(f"ROUTE ERROR (format_v1): IOError from service: {e_io}")
        raise HTTPException(status_code=500, detail=f"File processing error: {str(e_io)}")
    except Exception as e_service: # Catch more general exceptions from the service
        # This will catch the "Dummy formatting failed: All strings must be XML compatible..."
        print(f"ROUTE ERROR (format_v1): Exception from formatting service: {e_service}")
        # Extract the original specific error message if it's a chained exception
        original_error_msg = str(e_service.args[0]) if e_service.args else str(e_service)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during processing: {original_error_msg}")