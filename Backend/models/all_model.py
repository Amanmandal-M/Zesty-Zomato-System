from configs.db import dbConnection

# Get the collections
userCollection = dbConnection["user"]
menuCollection = dbConnection["menu"]
orderCollection = dbConnection["order"]

# Define the user schema
user_schema = {
    "name": str,
    "email": str,
    "password": str
}

# Define the menu schema
menu_schema = {
    "imageUrl": str,
    "dish_id": str,
    "name": str,
    "price": float,
    "available": str,
    "quantity": int
}

# Define the order schema
order_schema = {
    "customer_name": str,
    "imageUrl": str,
    "user_id": str,
    "menu_id": str,  # Changed menu_id to an array of strings
    "quantity": int,
    "status": str
}

# Function to validate the data against the schema
def validate_data(data, schema):
    for key, value_type in schema.items():
        if key not in data or not isinstance(data[key], value_type):
            return False
    return True

# Export the collections and schemas
__all__ = ["userCollection", "menuCollection", "orderCollection",
           "user_schema", "menu_schema", "order_schema", "validate_data"]
