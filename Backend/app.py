import os
from flask import Flask
from flask_cors import CORS
from dotenv import dotenv_values

# All routes imported 
from routes.menu_routes import menu_router
from routes.user_routes import user_router
from routes.order_routes import order_router

env_vars = dotenv_values('.env')

port_no = env_vars.get('PORT')

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Default routes
@app.route('/')
def default_routes():
    return '<h1 style="color:blue;text-align:center">Welcome in Zomato Backend!</h1>'
    

# Register the routes blueprint
app.register_blueprint(user_router, url_prefix='/user')
app.register_blueprint(menu_router, url_prefix='/menu-list')
app.register_blueprint(order_router, url_prefix='/order')



if __name__ == '__main__':
    app.run()
