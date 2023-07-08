from pymongo import MongoClient
from dotenv import dotenv_values

env_vars = dotenv_values('.env')

MONGO_URL = env_vars.get('MONGO_URL')

# Establish connection to MongoDB
client = MongoClient(MONGO_URL)
db = client['zomatoDB']

# Export the database connection
dbConnection = db