from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def _headers(email, password, is_admin=False):
    client.post("/api/auth/register", json={
        "email": email, "password": password, "is_admin": is_admin
    })
    response = client.post("/api/auth/login", json={
        "email": email, "password": password
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def _create_vehicle(headers):
    response = client.post("/api/vehicles", headers=headers, json={
        "make": "Toyota", "model": "Corolla", "category": "Sedan",
        "price": 22000.00, "quantity": 5,
    })
    return response.json()["id"]

def test_update_vehicle_as_regular_user_succeeds():
    headers = _headers("user@example.com", "Pass123")
    vehicle_id = _create_vehicle(headers)

    response = client.put(f"/api/vehicles/{vehicle_id}", headers=headers, json={
        "make": "Toyota", "model": "Corolla", "category": "Sedan",
        "price": 21000.00, "quantity": 4,
    })

    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 21000.00
    assert data["quantity"] == 4

def test_update_nonexistent_vehicle_returns_404():
    headers = _headers("user@example.com", "Pass123")

    response = client.put("/api/vehicles/9999", headers=headers, json={
        "make": "Toyota", "model": "Corolla", "category": "Sedan",
        "price": 21000.00, "quantity": 4,
    })

    assert response.status_code == 404

def test_delete_vehicle_as_admin_succeeds():
    admin_headers = _headers("admin@example.com", "AdminPass123", is_admin=True)
    vehicle_id = _create_vehicle(admin_headers)

    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)

    assert response.status_code == 204

def test_delete_vehicle_as_regular_user_returns_403():
    user_headers = _headers("user@example.com", "Pass123")
    vehicle_id = _create_vehicle(user_headers)

    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=user_headers)

    assert response.status_code == 403