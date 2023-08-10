from flask import Blueprint

# Import the required controllers
from controllers.order_controllers import take_order,all_orders, review_orders

# Create a Blueprint for the Zomato routes
order_router = Blueprint('order', __name__)


# Route: All Orders
# Method: GET
# Description: Get all orders
order_router.route('/', methods=['POST'])(all_orders)


# Route: Take Order
# Method: POST
# Description: Takes an order
order_router.route('/take-order', methods=['POST'])(take_order)


# Route: Review Orders
# Method: GET
# Description: Review all orders
order_router.route('/review-orders', methods=['GET'])(review_orders)