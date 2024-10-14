from flask import Blueprint, jsonify
from services.news_service import (
    fetch_general_news,
    fetch_real_time_data,
    fetch_top_headlines,
)

# Create a blueprint
news_bp = Blueprint("news_bp", __name__)


# Route to fetch general news
@news_bp.route("/general-news", methods=["GET"])
def get_general_news():
    data = fetch_general_news()
    return jsonify(data)


# Route to fetch real-time disaster-related news
@news_bp.route("/api/real-time-data", methods=["GET"])
def get_real_time_data():
    data = fetch_real_time_data()
    return jsonify(data)


# Route to fetch top headlines
@news_bp.route("/api/top-headlines", methods=["GET"])
def get_top_headlines():
    data = fetch_top_headlines()
    return jsonify(data)
