import bcrypt
import jwt
from flask import request, jsonify
from models.all_model import userCollection
from bson import ObjectId, json_util
from dotenv import dotenv_values

env_vars = dotenv_values('.env')
Normal_Key = env_vars.get('NORMAL_KEY')


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
            normal_token = jwt.encode({"masai": "masai"}, Normal_Key, algorithm="HS256")

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
