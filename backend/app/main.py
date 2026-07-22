import os
import sys

# Ensure backend root directory is in sys.path for serverless imports
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from app.routers import auth, vehicles
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.models import Vehicle

try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database initialization warning: {e}")

def seed_initial_data():
    db = SessionLocal()
    try:
        if db.query(Vehicle).count() == 0:
            sample_vehicles = [
                Vehicle(make="Toyota", model="Camry", category="Sedan", price=26000.0, quantity=5),
                Vehicle(make="Ford", model="Mustang", category="Sports", price=38000.0, quantity=3),
                Vehicle(make="Tesla", model="Model 3", category="Electric", price=42000.0, quantity=4),
                Vehicle(make="BMW", model="X5", category="SUV", price=65000.0, quantity=2),
                Vehicle(make="Honda", model="Civic", category="Sedan", price=24000.0, quantity=8),
            ]
            db.add_all(sample_vehicles)
            db.commit()
            print("Successfully seeded initial vehicle inventory!")
    except Exception as e:
        print(f"Seed note: {e}")
    finally:
        db.close()

seed_initial_data()

app = FastAPI(title="Car Dealership Inventory System")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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