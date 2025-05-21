// frontend/src/api/index.js

// Get the base URL for the API from the environment variable set by Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("Error: VITE_API_BASE_URL is not defined. Please check your .env file or Vercel environment variables.");
    // You might want to throw an error here or have a default fallback for extreme cases,
    // but usually, it's better to ensure it's always set.
}

/**
 * Uploads a document to the backend.
 * @param {File} file - The file to upload.
 * @returns {Promise<object>} The JSON response from the server.
 * @throws {Error} If the upload fails or the server returns an error.
 */
export async function uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match the key expected by FastAPI backend

    try {
        const response = await fetch(`${API_BASE_URL}/upload/document/`, {
            method: 'POST',
            body: formData,
            // Headers are not typically needed for FormData by fetch,
            // as the browser sets the 'Content-Type' to 'multipart/form-data' automatically.
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Upload failed with status: " + response.status }));
            throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error in uploadDocument API call:", error);
        throw error; // Re-throw to be caught by the calling component
    }
}

/**
 * Sends a request to format an already uploaded document.
 * @param {string} filename - The name of the file previously uploaded.
 * @returns {Promise<Blob>} The formatted document as a Blob.
 * @throws {Error} If the formatting request fails.
 */
export async function formatDocumentAndGetBlob(filename) {
    const formData = new FormData();
    formData.append('filename', filename);

    try {
        const response = await fetch(`${API_BASE_URL}/format/document/`, {
            method: 'POST',
            body: formData, 
            // For FastAPI Form(...) parameters, Content-Type is typically application/x-www-form-urlencoded
            // or multipart/form-data. FormData defaults to multipart. If issues, explicitly set:
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // if using URLSearchParams
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "Formatting request failed with status: " + response.status }));
            throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
        }
        // Since the backend returns a FileResponse, we expect a blob
        return response.blob(); 
    } catch (error) {
        console.error("Error in formatDocument API call:", error);
        throw error; // Re-throw
    }
}

// Add other API functions here as you build them (e.g., for summarization, OCR, etc.)