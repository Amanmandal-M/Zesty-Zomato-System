import bcrypt
import jwt
from flask import request, jsonify
from models.all_model import userCollection, menuCollection
from bson import ObjectId, json_util
from dotenv import dotenv_values


env_vars = dotenv_values('.env')
NORMAL_KEY = env_vars['NORMAL_KEY']


# List to store orders
orders = []


# Controller: User Registration
# Method: POST
# Description: Registers a new user
def user_registration():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if email == "" or password == "":
        return jsonify({"message": "Enter all fields"}), 501

    try:
        isPresent = userCollection.find_one({"email": email})
        if isPresent:
            return jsonify({"message": "User already exists"}), 401

        hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        data = {
            "name": name,
            "email": email,
            "password": hash
        }
        result = userCollection.insert_one(data)
        inserted_id = str(result.inserted_id)  # Convert ObjectId to string

        return jsonify({
            "message": "User Registered Successfully",
            "data": {
                "_id": inserted_id,
                "name": name,
                "email": email
            }
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Controller: User Login
# Method: POST
# Description: Performs user login
def user_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email == "" or password == "":
        return jsonify({"message": "Enter all fields"}), 501

    try:
        is_present = userCollection.find_one({"email": email})
        if not is_present:
            return jsonify({"message": "User not found"}), 401
        
        hashed_password = is_present.get('password')

        if bcrypt.checkpw(password.encode(), hashed_password):
            normal_token = jwt.encode({"masai": "masai"}, NORMAL_KEY, algorithm="HS256")

            # Convert is_present to JSON serializable format
            is_present_serializable = json_util.dumps(is_present)

            response = jsonify({
                           "message": "Login successful",
                           "Token": normal_token,
                           "Data": json_util.dumps(is_present)
                       })
            return response, 201
        else:
            return jsonify({"message": "Login failed"}), 404

    except Exception as e:
        return jsonify({"message": str(e)}), 500



# Controller: Display Menu
# Method: GET
# Description: Returns the menu
def display_menu():
    try:
        data = list(menuCollection.find())
        serialized_data = json_util.dumps(data)
        return serialized_data, 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


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

    item = {
        "dish_id": dish_id,
        "name": name,
        "price": price,
        "available": available,
        "quantity": quantity
    }

    try:
        menuCollection.insert_one(item)
        return jsonify({"message": "Dish added successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500



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
