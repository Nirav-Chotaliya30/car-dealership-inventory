from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

def setup_function():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def test_login_with_correct_credentials_returns_token():
    client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })

    response = client.post("/api/auth/login", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_with_wrong_password_returns_401():
    client.post("/api/auth/register", json={
        "email": "jane@example.com",
        "password": "SecurePass123"
    })

    response = client.post("/api/auth/login", json={
        "email": "jane@example.com",
        "password": "WrongPassword"
    })

    assert response.status_code == 401