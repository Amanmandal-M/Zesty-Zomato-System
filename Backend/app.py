import os
from flask import Flask , render_template
from flask_cors import CORS
from configs.db import dbConnection
from routes.zomato_routes import zomato_router


app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Default routes
@app.route('/')
def default_routes():
    return render_template('index.html')
    

# Register the routes blueprint
app.register_blueprint(zomato_router, url_prefix='/zomato')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
    dbConnection
