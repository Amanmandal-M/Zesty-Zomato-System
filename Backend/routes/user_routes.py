from flask import Blueprint

# Import the required controllers
from controllers.user_controllers import user_registration , user_login

# Create a Blueprint for the Zomato routes
user_router = Blueprint('user', __name__)

# Routes with comments

# Route: Display Menu
# Method: GET
# Description: Displays the menu
user_router.route('/register', methods=['POST'])(user_registration)

# Route: Display Menu
# Method: GET
# Description: Displays the menu
user_router.route('/login', methods=['POST'])(user_login)