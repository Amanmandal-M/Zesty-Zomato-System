import os
from flask import request, jsonify

secret_key = os.getenv('SECRET_KEY')

from flask import request, jsonify

def validate_secret_key():
    data = request.get_json()
    key = data.get('key')
    try:
        if key == secret_key:
            return jsonify({
                "success": True,
                "message": "Welcome Admin"
            }), 200
        return jsonify({"message": "Invalid key"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500

