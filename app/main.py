# File: app/main.py
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

# --- Import Your Routers ---
# Ensure these .py files exist in your app/routes/ directory
# and each contains an APIRouter instance named 'router'.

# 1. Import the NEW orchestrate_v1 router
from .routes import orchestrate_v1  

# 2. Import your existing routers that you want to keep
from .routes import upload_v1     
from .routes import format_v1     

# 3. If you had a router for a previous, direct OCR attempt (e.g., ocr_v1),
#    ensure it's NOT imported here if it's being replaced by the n8n flow.
#    Example: # from .routes import ocr_v1 # This would be commented out or removed


# --- Initialize FastAPI App ---
app = FastAPI(
    title="DocuMorph AI API",
    description="API for document formatting, summarization, and intelligence, orchestrated via n8n.",
    version="0.2.0", # Bump version
    # Optional: Customize Swagger UI/OpenAPI docs paths
    # docs_url="/docs",  # If not using /api/v1 prefix for docs
    # redoc_url="/redoc",
    # openapi_url="/openapi.json"
)

# --- CORS (Cross-Origin Resource Sharing) settings ---
# This allows your frontend (on a different URL) to make requests to this backend.
origins = [
    "http://localhost:5173",  # Default Vite dev server port for frontend
    "http://localhost:3000",  # Common alternative React dev server port
    "https://documorph-jclb75szd-jagadeeshs-projects-8f0326c8.vercel.app", # Your Vercel deployment URL
    # You can also use os.getenv("VERCEL_FRONTEND_URL") and set it in Render for more flexibility
]
print(f"CORS: Allowing origins: {origins}") # For debugging in Render logs

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],    
)

# --- API Router for versioning (all routes under /api/v1) ---
api_v1_router = APIRouter(prefix="/api/v1")

# --- Include your feature-specific routers into the versioned API router ---

# 1. Include the router for n8n-orchestrated document processing
api_v1_router.include_router(
    orchestrate_v1.router, 
    tags=["Orchestrated Document Processing"] # More general tag
    # The routes within orchestrate_v1.router will be prefixed,
    # e.g., /api/v1/process-document (if 'process-document' is the path in orchestrate_v1.router)
    # We defined orchestrate_v1.router in app/routes/orchestrate_v1.py to have its own paths.
    # So, if orchestrate_v1.router defines a route @router.post("/process-document"),
    # the full path will be /api/v1/process-document
)
print("Included orchestrate_v1 router with prefix /api/v1")


# 2. Include your other existing routers
if 'upload_v1' in globals() and hasattr(upload_v1, 'router'): # Check if module and router exist
    api_v1_router.include_router(upload_v1.router, tags=["File Upload Utilities"]) # e.g., /api/v1/upload/...
    print("Included upload_v1 router with prefix /api/v1")

if 'format_v1' in globals() and hasattr(format_v1, 'router'): # Check if module and router exist
    api_v1_router.include_router(format_v1.router, tags=["Direct Document Formatting"]) # e.g., /api/v1/format/...
    print("Included format_v1 router with prefix /api/v1")

# 3. Ensure any router for OLD direct OCR is NOT included here.
#    For example, if you had `api_v1_router.include_router(ocr_v1.router, tags=["Old OCR"])`,
#    that line should be removed or commented out.
# print("Note: Any old direct OCR router (e.g., ocr_v1) is intentionally not included in api_v1_router.")


# Mount the versioned API router onto the main application
app.include_router(api_v1_router)
print(f"Mounted api_v1_router at prefix /api/v1")


# --- Root endpoint (outside /api/v1) ---
@app.get("/", tags=["Root"])
async def read_root():
    """
    Root GET endpoint.
    Confirms that the API is up and running.
    """
    return {"message": "Welcome to DocuMorph AI! API is live. Visit /docs for interactive API documentation."}

print("FastAPI application configured and ready.")

# The following is for running with `python app/main.py`
# Uvicorn command from root `documorph-ai` directory:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 
if __name__ == "__main__":
    import uvicorn
    # Note: Uvicorn recommends running it as a command line tool for production/dev
    # rather than programmatically like this for most cases.
    # However, this is fine for simple execution if preferred.
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) # Added reload=True for consistency