import os
from flask import Flask
from flask_cors import CORS
from routes.zomato_routes import zomato_router
from dotenv import dotenv_values

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
app.register_blueprint(zomato_router, url_prefix='/zomato')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", port_no))
    app.run(host='0.0.0.0' , port=port)
