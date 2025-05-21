# app/services/doc_formatter_v1.py

from pathlib import Path  # For object-oriented path manipulation
from docx import Document # From the python-docx library to create .docx files
# Removed HTTPException as services shouldn't typically raise HTTP specific exceptions directly
# They should raise custom exceptions or standard Python exceptions that routes can handle.

async def apply_dummy_formatting(
    input_file_path_str: str, 
    output_file_path_str: str
    # template_path_str: str, # We'll add this back when we use real templates
) -> str:
    """
    Simulates formatting a document (reads from input, writes a dummy DOCX to output).
    For this dummy version, it assumes the input is a text file.

    Args:
        input_file_path_str (str): The absolute or relative path to the input file.
        output_file_path_str (str): The absolute or relative path where the output .docx should be saved.
        # template_path_str (str): Path to the .docx template file (will be used later).

    Returns:
        str: The path to the created output .docx file.

    Raises:
        FileNotFoundError: If the input file does not exist.
        IOError: If there's an issue reading the input or writing the output file.
        Exception: For other general errors during DOCX creation.
    """
    input_path = Path(input_file_path_str)
    output_path = Path(output_file_path_str)

    print(f"SERVICE: Attempting dummy formatting for input: '{input_path}'")
    print(f"SERVICE: Output will be saved to: '{output_path}'")
    # print(f"SERVICE: Template to be used (later): '{template_path_str}'")


    # Ensure the output directory exists before trying to save the file
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        # Step 1: Read content from the input file (assuming it's text for this dummy version)
        file_content = "Default placeholder content if input file is not read."
        if not input_path.is_file():
            # Instead of HTTPException, raise a standard Python error that the route can catch
            # Or, you could design the function to return None or an error status.
            # For now, we'll proceed but log a warning if it's part of the dummy logic.
            print(f"SERVICE WARNING: Input file '{input_path}' not found. Using placeholder content.")
            # If this were critical, you'd raise FileNotFoundError(f"Input file not found: {input_path}")
        else:
            try:
                with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read()
                print(f"SERVICE: Successfully read content from '{input_path}'.")
            except Exception as e_read:
                print(f"SERVICE ERROR: Could not read input file '{input_path}': {e_read}")
                # Depending on requirements, you might want to raise an error here.
                # For the dummy, we'll continue with the placeholder.
                # raise IOError(f"Could not read input file '{input_path}': {e_read}") from e_read


        # Step 2: Create a new DOCX document using python-docx
        doc = Document() # Creates a new blank document

        # Add some content to the DOCX
        doc.add_heading('Dummy Formatted Document', level=1)
        
        p1 = doc.add_paragraph()
        p1.add_run('This document was "formatted" by DocuMorph AI.').bold = True
        
        doc.add_paragraph(f'Original file processed: {input_path.name}')
        
        # Add a snippet of the original content
        doc.add_heading('Original Content Snippet:', level=2)
        snippet = file_content[:500] + ("..." if len(file_content) > 500 else "")
        doc.add_paragraph(snippet if snippet else "No content to display from original file.")
        
        # Step 3: Save the DOCX document
        doc.save(output_path)
        
        print(f"SERVICE: Dummy DOCX '{output_path.name}' created successfully at '{output_path}'.")
        return str(output_path) # Return the path to the created file

    except FileNotFoundError as e: # Catch specific errors if you raise them
        print(f"SERVICE ERROR: File operation failed: {e}")
        raise # Re-raise to be handled by the route
    except IOError as e: # For read/write issues
        print(f"SERVICE ERROR: IO operation failed: {e}")
        raise # Re-raise
    except Exception as e:
        # Catch any other exceptions during DOCX creation or file operations
        print(f"SERVICE ERROR: Unexpected error during dummy formatting for '{input_path}': {str(e)}")
        # It's often better to raise a custom application-specific exception here
        # or re-raise the original exception if the route handler is equipped to deal with it.
        raise Exception(f"Dummy formatting failed: {str(e)}") from e