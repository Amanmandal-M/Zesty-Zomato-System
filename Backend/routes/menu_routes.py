from flask import Blueprint

# Import the required controllers
from controllers.menu_controllers import display_menu, add_items, update_items, delete_items

# Create a Blueprint for the Zomato routes
menu_router = Blueprint('menu-list', __name__)

# Routes with comments

# Route: Display Menu
# Method: GET
# Description: Displays the menu
menu_router.route('/', methods=['GET'])(display_menu)


# Route: Add Items
# Method: POST
# Description: Add items to the menu
menu_router.route('/add-items', methods=['POST'])(add_items)

# Route: Update Items
# Method: PATCH
# Description: Update the availability and quantity of a dish
menu_router.route('/update-items/<dish_id>', methods=['PATCH'])(update_items)

# Route: Delete Items
# Method: DELETE
# Description: Delete a dish from the menu
menu_router.route('/delete-items/<dish_id>', methods=['DELETE'])(delete_items)

