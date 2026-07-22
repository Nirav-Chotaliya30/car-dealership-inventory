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