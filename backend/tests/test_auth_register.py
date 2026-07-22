from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

def setup_function():
    # fresh tables before each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def test_register_new_user_returns_201():
    response = client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "jane@example.com"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data

def test_register_duplicate_email_returns_409():
    client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })
    response = client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "AnotherPass456"
    })
    assert response.status_code == 409
    assert "already registered" in response.json()["detail"].lower()

def test_register_with_is_admin_true_creates_admin_user():
    response = client.post("/api/auth/register", json={
        "email": "admin@example.com",
        "password": "AdminPass123",
        "is_admin": True
    })
    assert response.status_code == 201
    assert response.json()["is_admin"] is True

def test_register_without_is_admin_defaults_to_false():
    response = client.post("/api/auth/register", json={
        "email": "regular@example.com",
        "password": "RegularPass123"
    })
    assert response.status_code == 201
    assert response.json()["is_admin"] is False