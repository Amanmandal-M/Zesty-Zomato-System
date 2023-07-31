from flask import Blueprint

# Import the required controllers
from controllers.admin_controllers import validate_secret_key

# Create a Blueprint for the Zomato routes
admin_router = Blueprint('admin', __name__)

admin_router.route('/secret-key', methods=['POST'])(validate_secret_key)