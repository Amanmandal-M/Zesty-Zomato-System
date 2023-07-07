from flask import request, jsonify

# Menu dictionary containing dish information
menu = {
    "1": {"name": "Dhosa", "price": 8.99, "available": True, "quantity": 10},
    "2": {"name": "Maggie", "price": 12.99, "available": True, "quantity": 8},
    "3": {"name": "Pizza", "price": 6.99, "available": False, "quantity": 0},
    "4": {"name": "Noodles", "price": 5.99, "available": True, "quantity": 15}
}

# List to store orders
orders = []

# User dictionary containing user information
users = {}


# Controller: User Registration
# Method: POST
# Description: Registers a new user
def user_registration():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if email in users:
        return jsonify({"message": "Email already registered. Please login or use a different email."}), 400
    else:
        users[email] = {
            "name": name,
            "password": password
        }
        return jsonify({"message": "Registration successful. You can now log in with your credentials."}), 200
    
# Controller: User Login
# Method: POST
# Description: Performs user login
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email in users and users[email]["password"] == password:
        return jsonify({"message": f"Welcome, {users[email]['name']}!"}), 200
    else:
        return jsonify({"message": "Invalid credentials. Access denied."}), 401


# Controller: Display Menu
# Method: GET
# Description: Returns the menu
def display_menu():
    return jsonify(menu)


# Controller: Add Items
# Method: POST
# Description: Adds items to the menu
def add_items():
    data = request.get_json()
    dish_id = data.get('dish_id')
    name = data.get('name')
    price = data.get('price')
    available = data.get('available')
    quantity = data.get('quantity')

    menu[dish_id] = {
        "name": name,
        "price": price,
        "available": available,
        "quantity": quantity
    }

    return 'Dish added successfully'


# Controller: Update Items
# Method: PATCH
# Description: Updates the availability and quantity of a dish
def update_items(dish_id):
    data = request.get_json()

    if dish_id in menu:
        quantity = data.get('quantity')
        menu[dish_id]["quantity"] = quantity

        available = data.get('available')
        if available == True:
            menu[dish_id]["available"] = available
        else:
            menu[dish_id]["available"] = False
            menu[dish_id]["quantity"] = 0
            return 'Dish availability failed!'

        return 'Dish availability and quantity updated successfully!'
    else:
        return 'Dish not found in the menu.'


# Controller: Delete Items
# Method: DELETE
# Description: Deletes a dish from the menu
def delete_items(dish_id):
    if dish_id in menu:
        dish_name = menu[dish_id]["name"]
        del menu[dish_id]
        return f"{dish_name} removed from the menu!"
    else:
        return "Dish not found in the menu."


# Controller: Take Order
# Method: POST
# Description: Takes an order from the customer
def take_order():
    data = request.get_json()
    customer_name = data.get('customer_name')
    order_items = data.get('order_items')
    order_status = "received"
    order_id = len(orders) + 1

    for dish_id in order_items:
        if dish_id in menu:
            dish_info = menu[dish_id]
            if not dish_info["available"]:
                return jsonify({"message": f"{dish_info['name']} is not available. Order cannot be processed."})

            if dish_info["quantity"] <= 0:
                return jsonify({"message": f"{dish_info['name']} is out of stock. Order cannot be processed."})

            orders.append({
                "order_id": order_id,
                "customer_name": customer_name,
                "dish_id": dish_id,
                "status": order_status
            })

            dish_info["quantity"] -= 1
            return jsonify({"message": f"{dish_info['name']} added to the order! Order ID: {order_id}"})
        else:
            return jsonify({"message": f"Dish with ID {dish_id} not found in the menu."})

    return jsonify({"message": "Order processed successfully!"})


# Controller: All Orders
# Method: GET
# Description: Returns all orders
def all_orders():
    return jsonify(orders)


# Controller: Review Orders
# Method: GET
# Description: Reviews all orders
def review_orders():
    if not orders:
        return jsonify({'message': 'No orders available.'}), 200

    orders_list = []

    for order in orders:
        order_id = order['order_id']
        customer = order['customer_name']
        dish_id = order['dish_id']
        dish = menu.get(dish_id, {}).get('name', 'Unknown')
        status = order['status']
        remaining_quantity = menu.get(dish_id, {}).get('quantity', 0)

        order_info = {
            'order_id': order_id,
            'customer': customer,
            'dish': dish,
            'status': status,
            'remaining_quantity': remaining_quantity
        }

        orders_list.append(order_info)

    return jsonify({'orders': orders_list}), 200
