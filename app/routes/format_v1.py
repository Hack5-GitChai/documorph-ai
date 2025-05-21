# app/routes/format_v1.py

from fastapi import APIRouter, Form, HTTPException, Depends
from fastapi.responses import FileResponse # Used to send a file back to the client
from pathlib import Path # For object-oriented path manipulation

# Import the service function that does the actual (dummy) formatting
from app.services.doc_formatter_v1 import apply_dummy_formatting 

router = APIRouter(
    prefix="/format" # This prefix will be added to all routes in this router
                     # So, /document/ becomes /api/v1/format/document/
)

# Define base directories for consistency and security.
# These paths are relative to the project root where uvicorn is run.
BASE_UPLOAD_DIR = Path("data/uploads")
BASE_OUTPUT_DIR = Path("data/sample_outputs")
# BASE_TEMPLATE_DIR = Path("app/templates") # We'll use this when real templates are implemented

# Ensure these directories exist (idempotent - won't error if they already exist)
BASE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
BASE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
# BASE_TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/document/", summary="Format an uploaded document and provide it for download")
async def format_and_download_document(
    filename: str = Form(...),
    # template_name: str = Form(...), # Parameter for template selection (to be added later)
):
    """
    Takes a `filename` (which is assumed to have been previously uploaded
    via the `/upload/document/` endpoint and resides in `data/uploads/`),
    applies dummy formatting to it (creating a .docx file),
    and returns the formatted .docx file for download.

    - **filename**: The name of the previously uploaded file (e.g., "my_document.txt").
    - **template_name**: (Future) The name of the template to apply (e.g., "academic_report").
    """
    # Basic sanitization for filename to prevent path traversal
    safe_filename = Path(filename).name
    if not safe_filename:
        raise HTTPException(status_code=400, detail="Invalid filename provided.")

    input_file_path = BASE_UPLOAD_DIR / safe_filename
    
    # Determine the output filename. We'll use the original filename's stem
    # and append "_formatted.docx".
    output_filename_stem = input_file_path.stem # Gets filename without extension
    output_file_path = BASE_OUTPUT_DIR / f"{output_filename_stem}_formatted.docx"

    # Check if the input file actually exists in the uploads directory
    if not input_file_path.is_file():
        raise HTTPException(
            status_code=404, 
            detail=f"Input file '{safe_filename}' not found. Please upload it first."
        )

    try:
        # Call the service function to perform the (dummy) formatting.
        # This function will create the file at output_file_path.
        # We pass paths as strings as defined in the service function.
        # The template_path_str is omitted for now.
        await apply_dummy_formatting(
            input_file_path_str=str(input_file_path), 
            output_file_path_str=str(output_file_path)
            # template_path_str=str(BASE_TEMPLATE_DIR / f"{Path(template_name).name}.docx") # For later
        )

        # After the service call, check if the output file was actually created.
        if not output_file_path.is_file():
            # This would indicate an issue within the apply_dummy_formatting service
            # if it didn't raise an error but also didn't create the file.
            raise HTTPException(status_code=500, detail="Formatted file was not created by the service.")

        # If the file was created, return it as a downloadable response.
        return FileResponse(
            path=output_file_path, # The path to the file on the server
            filename=output_file_path.name, # The name the client's browser will suggest for saving
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document' # MIME type for .docx
        )
    except FileNotFoundError as e: # Catching specific errors from the service
        raise HTTPException(status_code=404, detail=str(e))
    except IOError as e:
        raise HTTPException(status_code=500, detail=f"File operation error: {str(e)}")
    except HTTPException as e_http: # Re-raise HTTPExceptions if the service raised one (though ideally it shouldn't)
        raise e_http
    except Exception as e:
        # Catch any other unexpected errors from the service or this route.
        # Log the error `e` on the server for debugging.
        # print(f"Unexpected error in format_and_download_document: {e}") # Example logging
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during processing: {str(e)}")