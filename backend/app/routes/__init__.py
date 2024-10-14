from flask import Blueprint

# Create a blueprint
news_bp = Blueprint("news_bp", __name__)

from .news_routes import *
