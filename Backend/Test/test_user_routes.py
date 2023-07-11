import json

def test_user_registration(client):
    data = {
        "name": "Aman Kumar",
        "email": "aman34787@example.com",
        "password": "zomato"
    }
    response = client.post('/user/register', json=data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'message' in data
    assert 'data' in data

def test_user_login(client):
    data = {
        "email": "aman34787@example.com",
        "password": "zomato"
    }
    response = client.post('/user/login', json=data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'message' in data
    assert 'Token' in data
    assert 'Data' in data
