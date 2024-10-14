from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Initialize app and load environment variables
app = Flask(__name__)
CORS(app)
load_dotenv()

# Import and register routes
from routes.news_routes import news_bp

# Register the blueprint
app.register_blueprint(news_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
