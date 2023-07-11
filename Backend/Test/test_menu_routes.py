import json

def test_display_menu(client):
    response = client.get('/menu-list/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'menu' not in data

def test_add_items(client):
    data = {
        "imageUrl": "https://example.com/image.jpg",
        "dish_id": "64aceabcc34a68be6aa3546f",
        "name": "Dish Name",
        "price": 9.99,
        "available": "Yes",
        "quantity": 10
    }
    response = client.post('/menu-list/add-items', json=data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert 'message' in data

def test_update_items(client):
    dish_id = "64aceabcc34a68be6aa3546f"
    data = {
        "available": "No",
        "quantity": 0
    }
    response = client.patch(f'/menu-list/update-items/{dish_id}', json=data)
    assert response.status_code == 204

def test_delete_items(client):
    dish_id = "64aceabcc34a68be6aa3546f"
    response = client.delete(f'/menu-list/delete-items/{dish_id}')
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 202
    assert 'message' in data