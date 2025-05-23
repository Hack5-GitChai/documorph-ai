# File: app/main.py
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os # Make sure os is imported if you use os.getenv for CORS origins

from .routes import orchestrate_v1  
from .routes import upload_v1     
from .routes import format_v1     

app = FastAPI(
    title="DocuMorph AI API",
    description="API for document formatting, summarization, and intelligence, orchestrated via n8n.",
    version="0.2.1", # Bump version again
)

# --- CORS Configuration ---
# Get frontend URLs from environment variables
FRONTEND_DEV_URL_VITE = os.getenv("FRONTEND_DEV_URL_VITE", "http://localhost:5173") 
FRONTEND_DEV_URL_CRA = os.getenv("FRONTEND_DEV_URL_CRA", "http://localhost:3000")
VERCEL_DEPLOYMENT_URL = os.getenv("VERCEL_DEPLOYMENT_URL", "https://documorph-jclb75szd-jagadeeshs-projects-8f0326c8.vercel.app") # Provide a sensible default or ensure it's set

origins = [
    FRONTEND_DEV_URL_VITE,
    FRONTEND_DEV_URL_CRA,
]
if VERCEL_DEPLOYMENT_URL:
    origins.append(VERCEL_DEPLOYMENT_URL)
origins = [origin for origin in origins if origin] # Filter out None/empty
if not origins: origins = ["*"] # Fallback
print(f"CORS: Allowing origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],    
)

api_v1_router = APIRouter(prefix="/api/v1")

# Include the router for n8n-orchestrated document processing
api_v1_router.include_router(
    orchestrate_v1.router, 
    prefix="/orchestrate",  # <<<<<<< THIS IS THE CRITICAL FIX/ADDITION
    tags=["Orchestrated Document Processing"]
)
print("Included orchestrate_v1 router at /api/v1/orchestrate")

# Assuming upload_v1.py and format_v1.py have their router prefixes defined within those files
# e.g., router = APIRouter(prefix="/upload") in upload_v1.py
# If not, you'd add prefixes here too.
# Based on your format_v1.py, its prefix="/format" is defined in that file, so no prefix needed here.
# Assuming upload_v1.py also defines its own prefix="/upload".
if 'upload_v1' in globals() and hasattr(upload_v1, 'router'):
    api_v1_router.include_router(upload_v1.router, tags=["File Upload Utilities"])
    print("Included upload_v1 router (expecting prefix within its file)")
else:
    print("Warning: upload_v1 router not found or not configured as expected.")


if 'format_v1' in globals() and hasattr(format_v1, 'router'):
    api_v1_router.include_router(format_v1.router, tags=["Direct Document Formatting"])
    print("Included format_v1 router (expecting prefix within its file)")
else:
    print("Warning: format_v1 router not found or not configured as expected.")


app.include_router(api_v1_router)
print(f"Mounted api_v1_router at prefix /api/v1")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to DocuMorph AI! API is live. Visit /docs for interactive API documentation."}

print("FastAPI application configured and ready.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)