from fastapi import APIRouter, Form
from app.services.doc_formatter import apply_formatting
from pathlib import Path

router = APIRouter()

@router.post("/format")
def format_doc(filename: str = Form(...), template_name: str = Form(...)):
    input_path = f"data/uploads/{filename}"
    template_path = f"app/templates/{template_name}.docx"
    output_path = f"data/sample_outputs/formatted_{filename}"

    formatted_path = apply_formatting(input_path, template_path, output_path)

    return {"status": "formatted", "output_file": formatted_path}
# This route handles the document formatting request.