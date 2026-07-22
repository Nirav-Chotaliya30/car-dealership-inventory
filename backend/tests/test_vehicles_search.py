from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def _auth_headers():
    client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })
    response = client.post("/api/auth/login", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def _seed_vehicles(headers):
    vehicles = [
        {"make": "Toyota", "model": "Corolla", "category": "Sedan", "price": 22000.00, "quantity": 5},
        {"make": "Toyota", "model": "RAV4", "category": "SUV", "price": 28000.00, "quantity": 2},
        {"make": "Honda", "model": "Civic", "category": "Sedan", "price": 24000.00, "quantity": 3},
    ]
    for v in vehicles:
        client.post("/api/vehicles", headers=headers, json=v)

def test_search_by_make_returns_matching_vehicles():
    headers = _auth_headers()
    _seed_vehicles(headers)

    response = client.get("/api/vehicles/search?make=Toyota", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(v["make"] == "Toyota" for v in data)

def test_search_by_category_returns_matching_vehicles():
    headers = _auth_headers()
    _seed_vehicles(headers)

    response = client.get("/api/vehicles/search?category=Sedan", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(v["category"] == "Sedan" for v in data)

def test_search_by_price_range_returns_matching_vehicles():
    headers = _auth_headers()
    _seed_vehicles(headers)

    response = client.get("/api/vehicles/search?min_price=23000&max_price=29000", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    prices = {v["price"] for v in data}
    assert prices == {24000.00, 28000.00}

def test_search_with_no_filters_returns_all_vehicles():
    headers = _auth_headers()
    _seed_vehicles(headers)

    response = client.get("/api/vehicles/search", headers=headers)

    assert response.status_code == 200
    assert len(response.json()) == 3