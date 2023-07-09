from flask import request, jsonify
from models.all_model import menuCollection , orderCollection
from bson import ObjectId, json_util
from dotenv import dotenv_values
env_vars = dotenv_values('.env')


# Controller: Display Items
# Method: GET
# Description: Display items to the menu
def display_menu():
    try:
        data = list(menuCollection.find())
        serialized_data = json_util.dumps(data)  # Convert MongoDB documents to JSON
        return json_util(serialized_data), 200
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

    try:
        menuCollection.update_one({"_id": ObjectId(dish_id)}, {"$set": data})
        return jsonify({"message": "Dish updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Controller: Delete Items
# Method: DELETE
# Description: Deletes a dish from the menu
def delete_items(dish_id):
    try:
        menuCollection.delete_one({"_id": ObjectId(dish_id)})
        return jsonify({"message": "Dish deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
