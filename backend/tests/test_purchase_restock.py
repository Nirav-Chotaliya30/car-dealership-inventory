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

def _create_vehicle(headers, quantity=5):
    response = client.post("/api/vehicles", headers=headers, json={
        "make": "Toyota", "model": "Corolla", "category": "Sedan",
        "price": 22000.00, "quantity": quantity,
    })
    return response.json()["id"]

def test_purchase_decreases_quantity_by_one():
    headers = _headers("user@example.com", "Pass123")
    vehicle_id = _create_vehicle(headers, quantity=5)

    response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=headers)

    assert response.status_code == 200
    assert response.json()["quantity"] == 4

def test_purchase_when_out_of_stock_returns_409():
    headers = _headers("user@example.com", "Pass123")
    vehicle_id = _create_vehicle(headers, quantity=0)

    response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=headers)

    assert response.status_code == 409

def test_purchase_nonexistent_vehicle_returns_404():
    headers = _headers("user@example.com", "Pass123")

    response = client.post("/api/vehicles/9999/purchase", headers=headers)

    assert response.status_code == 404

def test_restock_as_admin_increases_quantity():
    admin_headers = _headers("admin@example.com", "AdminPass123", is_admin=True)
    vehicle_id = _create_vehicle(admin_headers, quantity=2)

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=admin_headers,
        json={"amount": 10},
    )

    assert response.status_code == 200
    assert response.json()["quantity"] == 12

def test_restock_as_regular_user_returns_403():
    user_headers = _headers("user@example.com", "Pass123")
    vehicle_id = _create_vehicle(user_headers, quantity=2)

    response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=user_headers,
        json={"amount": 10},
    )

    assert response.status_code == 403