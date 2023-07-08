from pymongo import MongoClient
from dotenv import dotenv_values

env_vars = dotenv_values('.env')

Mongo_link = env_vars.get('MONGO_URI')

# Establish connection to MongoDB
client = MongoClient(Mongo_link)
db = client['ZomatoDB']

# Export the database connection
dbConnection = db

