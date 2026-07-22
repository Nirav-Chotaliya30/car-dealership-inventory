from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dealership.db")

if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if SQLALCHEMY_DATABASE_URL.startswith("postgresql://") and "sslmode" not in SQLALCHEMY_DATABASE_URL:
    delimiter = "&" if "?" in SQLALCHEMY_DATABASE_URL else "?"
    SQLALCHEMY_DATABASE_URL += f"{delimiter}sslmode=require"

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

_tables_created = False

def ensure_tables_exist():
    global _tables_created
    if not _tables_created:
        try:
            Base.metadata.create_all(bind=engine)
            _tables_created = True
            db = SessionLocal()
            try:
                from app.models import Vehicle
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
            except Exception as se:
                print(f"Seeding note: {se}")
            finally:
                db.close()
        except Exception as e:
            print(f"Table creation note: {e}")

def get_db():
    ensure_tables_exist()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()