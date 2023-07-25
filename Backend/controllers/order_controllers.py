from flask import request, jsonify
from models.all_model import menuCollection, orderCollection, menu_schema, order_schema, validate_data
from bson import ObjectId, json_util



# Controller: Take Order
# Method: POST
# Description: Takes an order from the customer
def take_order():
    data = request.get_json()
    user_id = data.get('user_id')
    order_items = data.get('order_items')
    order_status = "received"

    try:
        for dish_id in order_items:
            dish_info = menuCollection.find_one({"_id": ObjectId(dish_id)})
            if dish_info:
                if not dish_info["available"]:
                    return jsonify({"message": f"{dish_info['name']} is not available. Order cannot be processed.","error":"Not available"})

                if dish_info["quantity"] <= 0:
                    return jsonify({"message": f"{dish_info['name']} is out of stock. Order cannot be processed.","error":"Out of Stock"}),404

                order = {
                    "customer_name": dish_info['name'],
                    "imageUrl": dish_info['imageUrl'],
                    "user_id": user_id,
                    "menu_id": dish_id,  # Changed menu_id to an array of strings
                    "quantity": dish_info["quantity"],
                    "status": order_status
                }

                # Validate order data against order schema
                if not validate_data(order, order_schema):
                    return jsonify({"message": "Invalid order data."}), 400

                orderCollection.insert_one(order)

                menuCollection.update_one({"_id": ObjectId(dish_id)}, {"$inc": {"quantity": -1}})

        return jsonify({"message": "Order processed successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Controller: All Orders
# Method: GET
# Description: Returns all orders
def all_orders():
    try:
        orders = list(orderCollection.find())
        serialized_orders = json_util.dumps(orders)
        return jsonify(serialized_orders), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Controller: Review Orders
# Method: GET
# Description: Reviews all orders
def review_orders():
    try:
        orders = list(orderCollection.find())
        orders_list = []

        for order in orders:
            order_id = order['_id']
            customer = order['customer_name']
            menu_id = order['menu_id']
            dish_info = menuCollection.find_one({"_id": ObjectId(menu_id)})
            dish = dish_info.get('name') if dish_info else 'Unknown'
            status = order['status']
            remaining_quantity = dish_info.get('quantity') if dish_info else 0

            order_info = {
                'order_id': str(order_id),
                'customer': customer,
                'dish': dish,
                'status': status,
                'remaining_quantity': remaining_quantity
            }

            orders_list.append(order_info)

        return jsonify({'orders': orders_list}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
