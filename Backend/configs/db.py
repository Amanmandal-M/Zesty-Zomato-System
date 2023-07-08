import os
from pymongo import MongoClient
from dotenv import dotenv_values

env_vars = dotenv_values('.env')

Mongo_link = os.getenv('MONGO_URL')

# Establish connection to MongoDB
client = MongoClient(Mongo_link)

# Export the database connection
dbConnection = db