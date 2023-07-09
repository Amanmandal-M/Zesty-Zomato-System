import os
import jwt
from flask import request, jsonify

Normal_Key = os.getenv('NORMAL_KEY')

# Custom middleware function
def check_token_middleware():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"message": "You are not authorized"}), 401

    try:
        decoded_token = jwt.decode(token, Normal_Key, algorithms=["HS256"])
        # You can perform additional checks or validations here
        # If token is valid, proceed to the next request handler
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
