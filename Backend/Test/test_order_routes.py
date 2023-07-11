import json

def test_all_orders(client):
    response = client.get('/order/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'orders' not in data

def test_take_order(client):
    data = {
        "user_id": "64acf1fb68def252dc02ff9e",
        "order_items": ["64aceabcc34a68be6aa3546f", "64acead2c34a68be6aa35470", "64aceaecc34a68be6aa35472"]
    }
    response = client.post('/order/take-order', json=data)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
