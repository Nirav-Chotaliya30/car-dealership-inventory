from fastapi import FastAPI
from app.database import Base, engine
from app.routers import auth, vehicles
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vehicles.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}