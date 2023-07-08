import os
from pymongo import MongoClient
from dotenv import dotenv_values

Mongo_link = os.getenv("MONGO_URI")

# Establish connection to MongoDB
client = MongoClient(Mongo_link)
db = client['ZomatoDB']

# Export the database connection
dbConnection = db