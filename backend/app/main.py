from fastapi import FastAPI
from app.database import Base, engine
from app.routers import auth, vehicles
from fastapi.middleware.cors import CORSMiddleware

import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory System")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}