from flask import Blueprint, render_template, request

# Controllers
from controllers.zomato_controllers import display_menu, take_order , add_items , update_items , delete_items

zomato_router = Blueprint('user_routes', __name__)

# All routes
zomato_router.route('/menu')(display_menu)
zomato_router.route('/order', methods=['POST'])(take_order)
zomato_router.route('/add_items', methods=['POST'])(add_items)
zomato_router.route('/update/<dish_id>', methods=['PATCH'])(update_items)
zomato_router.route('/delete/<dish_id>', methods=['DELETE'])(delete_items)