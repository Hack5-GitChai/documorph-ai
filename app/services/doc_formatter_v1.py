# app/services/doc_formatter_v1.py

from pathlib import Path  # For object-oriented path manipulation
from docx import Document # The main class from python-docx to create/manipulate Word documents
from fastapi import HTTPException # To raise HTTP errors if something goes wrong

# This function will be called by our formatting route.
# It simulates taking an input file, applying some "formatting", and saving a new .docx file.
async def apply_dummy_formatting(input_file_path_str: str, output_file_path_str: str) -> str:
    """
    Creates a dummy DOCX document based on an input file.

    Args:
        input_file_path_str (str): The string path to the input file (e.g., an uploaded .txt file).
        output_file_path_str (str): The string path where the formatted .docx file should be saved.

    Returns:
        str: The string path to the created output .docx file.

    Raises:
        HTTPException: If there's an error during file operations or DOCX creation.
    """
    # Convert string paths to Path objects for easier and safer manipulation
    input_path = Path(input_file_path_str)
    output_path = Path(output_file_path_str)

    # Ensure the directory for the output file exists.
    # output_path.parent gets the directory part of the path.
    # mkdir(parents=True, exist_ok=True) creates the directory and any necessary parent
    # directories, and doesn't raise an error if it already exists.
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
    except OSError as e:
        # If directory creation fails (e.g., permission issues)
        print(f"Error creating output directory {output_path.parent}: {e}")
        raise HTTPException(status_code=500, detail=f"Could not create output directory: {str(e)}")

    file_content = "Default: No content read from input file or input file did not exist."
    original_filename = input_path.name # Get the name of the input file

    # Try to read content from the input file (assuming it's a text file for this dummy version)
    if input_path.exists() and input_path.is_file():
        try:
            # Open with utf-8 encoding. 'errors="ignore"' will skip characters that can't be decoded.
            # For production, you might want more robust encoding detection or error handling.
            with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
                file_content = f.read()
        except Exception as e:
            # If reading fails, use a default message and log the error.
            print(f"Warning: Could not read input file {input_path}: {str(e)}")
            file_content = f"Error: Could not read content from {original_filename}."
    else:
        print(f"Warning: Input file {input_path} not found for dummy formatting.")
        # Keep the default file_content message

    try:
        # Create a new Word document instance using python-docx
        doc = Document()

        # Add a title to the document
        doc.add_heading('Dummy Formatted Document', level=1)
        
        # Add some paragraphs with information and content
        doc.add_paragraph(f'This is a dummy formatted DOCX generated from the file: {original_filename}')
        doc.add_paragraph('A real implementation would apply specific templates and styles.')
        doc.add_paragraph('--- Original Content Snippet Below ---')
        
        # Add a snippet of the original content (e.g., first 500 characters)
        # This helps verify that the input file was somewhat processed.
        snippet = file_content[:500] + ("..." if len(file_content) > 500 else "")
        doc.add_paragraph(snippet)

        # Save the newly created DOCX document to the specified output path
        doc.save(output_path)
        
        print(f"Dummy DOCX '{output_path.name}' created successfully at '{output_path}'.")
        # Return the string representation of the output path
        return str(output_path)

    except Exception as e:
        # If any error occurs during DOCX creation or saving
        print(f"Error creating or saving dummy DOCX: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during DOCX generation: {str(e)}")