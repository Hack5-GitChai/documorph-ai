// frontend/src/api/index.js

// Get the base URL for the API from the environment variable set by Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error("CRITICAL FRONTEND ERROR: VITE_API_BASE_URL is not defined. API calls will fail. Please check your .env file or Vercel environment variables.");
    // Consider throwing an error or providing a more visible warning to the user/developer
}

/**
 * Reusable fetch wrapper to handle common logic like JSON parsing and error handling.
 * @param {string} endpoint - The API endpoint path (e.g., '/upload/document/').
 * @param {object} options - The options for the fetch call (method, body, headers, etc.).
 * @param {boolean} expectBlob - True if the expected response is a Blob (like a file).
 * @returns {Promise<object|Blob>} The JSON response or Blob.
 * @throws {Error} If the request fails.
 */
async function fetchApi(endpoint, options = {}, expectBlob = false) {
    if (!API_BASE_URL) {
        throw new Error("API Base URL is not configured. Cannot make API calls.");
    }

    const url = `${API_BASE_URL}${endpoint}`; // Construct the full URL
    console.log(`API Call: ${options.method || 'GET'} to ${url}`);

    try {
        const response = await fetch(url, options);

        // For non-ok responses, try to parse error JSON, then text, then use statusText.
        if (!response.ok) {
            let errorDetail = `Request failed with status: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || JSON.stringify(errorData);
            } catch (e) {
                try {
                    const textError = await response.text();
                    if (textError) errorDetail += `. Response: ${textError}`;
                } catch (e2) { /* Ignore if text() also fails */ }
            }
            console.error(`API Error for ${url}: ${errorDetail}`);
            throw new Error(errorDetail);
        }

        // Handle expected Blob response (e.g., for file downloads)
        if (expectBlob) {
            console.log(`API Success (Blob) for ${url}`);
            return response.blob();
        }

        // Handle expected JSON response
        // Check if content-type is application/json, otherwise might be empty or different
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const jsonData = await response.json();
            console.log(`API Success (JSON) for ${url}:`, jsonData);
            return jsonData;
        } else {
            // If not JSON but response is ok (e.g. 204 No Content or other text type)
            const textData = await response.text();
            console.log(`API Success (Non-JSON) for ${url}. Status: ${response.status}. Response Text:`, textData);
            // If textData is empty for a 200/204, return a simple success object or handle as needed
            return textData ? { success: true, message: textData } : { success: true, status: response.status };
        }

    } catch (error) {
        console.error(`Network or other error during API call to ${url}:`, error);
        // Re-throw to be caught by the calling component, ensuring it's an Error object
        throw error instanceof Error ? error : new Error(String(error));
    }
}


/**
 * Uploads a document to the backend (e.g., for direct storage or old flows).
 * @param {File} file - The file to upload.
 * @returns {Promise<object>} The JSON response from the server.
 */
export async function uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match the key expected by FastAPI backend

    // Using the new fetchApi wrapper
    return fetchApi('/api/v1/upload/document/', { // Assuming this is your direct upload endpoint
        method: 'POST',
        body: formData,
    });
}

/**
 * Sends a request to format an already uploaded document (old flow).
 * @param {string} filename - The name of the file previously uploaded.
 * @returns {Promise<Blob>} The formatted document as a Blob.
 */
export async function formatDocumentAndGetBlob(filename) {
    const formData = new FormData();
    formData.append('filename', filename);

    // Using the new fetchApi wrapper and expecting a Blob
    return fetchApi('/api/v1/format/document/', { // Assuming this is your dummy formatting endpoint
        method: 'POST',
        body: formData,
    }, true); // true indicates we expect a Blob
}


// --- NEW FUNCTION FOR N8N ORCHESTRATED PROCESSING ---
/**
 * Sends a document to the backend endpoint that triggers the n8n orchestration workflow.
 * @param {File} file - The document file to process (e.g., an image for OCR).
 * @returns {Promise<object>} The JSON response from the server (which originated from n8n).
 * @throws {Error} If the request fails or the server returns an error.
 */
export async function processDocumentViaN8n(file) {
    const formData = new FormData();
    // 'File' here must match the parameter name in your FastAPI endpoint:
    // @router.post("/process-document" ... file: UploadFile = File(...)) in orchestrate_v1.py
    formData.append('file', file); 

    // Call the new endpoint that triggers n8n
    // Assuming your orchestrate_v1.router is mounted under /api/v1/orchestrate
    // and the specific route in orchestrate_v1.py is "/process-document"
    const N8N_ENDPOINT_PATH = '/api/v1/orchestrate/process-document';

    // Using the new fetchApi wrapper
    return fetchApi(N8N_ENDPOINT_PATH, {
        method: 'POST',
        body: formData,
    });
}
// --- END OF NEW FUNCTION ---


// Add other API functions here as you build them (e.g., for specific summarization calls if not part of main n8n flow)