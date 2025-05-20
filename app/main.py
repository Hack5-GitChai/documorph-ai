from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import formatting

app = FastAPI(
    title="DocuMorph AI Backend",
    description="FastAPI backend for document formatting",
    version="1.0"
)

# CORS settings — allow frontend to talk to backend
origins = [
    "http://localhost:3000",  # Vite dev server
    "https://documorph-ai.vercel.app",  # Deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the document formatting route
app.include_router(formatting.router)
