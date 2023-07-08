# Import the required controllers
from configs.db import dbConnection

# Get the collections
userCollection = dbConnection["user"]
menuCollection = dbConnection["menu"]
orderCollection = dbConnection["order"]

# Export the collections
__all__ = ["userCollection", "menuCollection" , "orderCollection"]
