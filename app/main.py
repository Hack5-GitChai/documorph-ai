# app/main.py
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

# Assuming your route files will be named upload_v1.py and format_v1.py
# If you named them differently (e.g., upload.py), adjust the import.
from .routes import upload_v1, format_v1 

app = FastAPI(
    title="DocuMorph AI API",
    description="API for document formatting, summarization, and intelligence.",
    version="0.1.0",
    # You can customize docs URLs if you move them under the /api/v1 prefix
    # docs_url="/api/v1/docs", 
    # redoc_url="/api/v1/redoc",
    # openapi_url="/api/v1/openapi.json" 
)

# CORS (Cross-Origin Resource Sharing) settings
# This allows your frontend (on a different URL) to make requests to this backend.
origins = [
    "http://localhost:5173",  # Default Vite dev server port for frontend
    "http://localhost:3000",  # Common alternative React dev server port
    "https://documorph-ai.vercel.app", # Vercel deployment URL (example)
    # IMPORTANT: Add your deployed Vercel frontend URL here LATER
    "https://documorph-jclb75szd-jagadeeshs-projects-8f0326c8.vercel.app",
    # e.g., "https://your-project-name.vercel.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],    
)

# API Router for versioning (good practice)
# All routes included in this router will be prefixed with /api/v1
api_v1_router = APIRouter(prefix="/api/v1")

# Include your feature-specific routers into the versioned API router
api_v1_router.include_router(upload_v1.router, tags=["File Upload"])
api_v1_router.include_router(format_v1.router, tags=["Document Formatting"])
# As you build more features (e.g., summarization), you'll import their routers
# and include them here.

# Mount the versioned API router onto the main application
app.include_router(api_v1_router)

# A simple root endpoint to check if the server is running
@app.get("/", tags=["Root"])
async def read_root():
    """
    Root GET endpoint.
    Confirms that the API is up and running.
    """
    return {"message": "Welcome to DocuMorph AI! API is live. Visit /docs for interactive API documentation."}

# The following is for running with `python app/main.py` (less common for dev with FastAPI)
# For development, it's generally better to use:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 
# (run this command from the root 'documorph-ai' directory)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)