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

def test_protected_route_without_token_returns_401():
    response = client.get("/api/vehicles")
    assert response.status_code == 401

def test_protected_route_with_valid_token_returns_200():
    token = _get_token()
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

def test_protected_route_with_invalid_token_returns_401():
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": "Bearer garbage.invalid.token"}
    )
    assert response.status_code == 401