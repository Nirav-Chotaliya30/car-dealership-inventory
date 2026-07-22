from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def _get_token():
    client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })
    response = client.post("/api/auth/login", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })
    return response.json()["access_token"]

def _auth_headers():
    token = _get_token()
    return {"Authorization": f"Bearer {token}"}

def test_create_vehicle_returns_201():
    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(),
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "Sedan",
            "price": 22000.00,
            "quantity": 5,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Corolla"
    assert data["quantity"] == 5
    assert "id" in data

def test_create_vehicle_without_auth_returns_401():
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "Sedan",
            "price": 22000.00,
            "quantity": 5,
        },
    )
    assert response.status_code == 401

def test_list_vehicles_returns_created_vehicles():
    headers = _auth_headers()

    client.post("/api/vehicles", headers=headers, json={
        "make": "Toyota", "model": "Corolla", "category": "Sedan",
        "price": 22000.00, "quantity": 5,
    })
    client.post("/api/vehicles", headers=headers, json={
        "make": "Honda", "model": "Civic", "category": "Sedan",
        "price": 24000.00, "quantity": 3,
    })

    response = client.get("/api/vehicles", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    makes = {v["make"] for v in data}
    assert makes == {"Toyota", "Honda"}

def test_list_vehicles_returns_empty_list_when_none_exist():
    response = client.get("/api/vehicles", headers=_auth_headers())
    assert response.status_code == 200
    assert response.json() == []