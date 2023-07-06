from flask import request, jsonify

# Menu dictionary containing dish information
menu = {
    "1": {"name": "Dhosa", "price": 8.99, "available": True, "quantity": 10},
    "2": {"name": "Maggie", "price": 12.99, "available": True, "quantity": 8},
    "3": {"name": "Pizza", "price": 6.99, "available": False, "quantity": 0},
    "4": {"name": "Noodles", "price": 5.99, "available": True, "quantity": 15}
}

# Menu dictionary containing dish information
orders = []

def display_menu():
    return jsonify(menu)
    
def take_order():
    print("take_order")

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

def update_items(dish_id):
    data = request.get_json()
    
    if dish_id in menu:
        
        quantity = data.get('quantity')
        menu[dish_id]["quantity"] = quantity
        
        available = data.get('available')
        if available==True:
            menu[dish_id]["available"]=available
        else:
            menu[dish_id]["quantity"] = 0
            return 'Dish availability Failed!'
        
        return 'Dish availability and quantity updated successfully!'
    else:
        return 'Dish not found in the menu.'


def delete_items(dish_id):
    if dish_id in menu:
        dish_name = menu[dish_id]["name"]
        del menu[dish_id]
        return (f"{dish_name} removed from the menu!")
    else:
        return("Dish not found in the menu.")
    


