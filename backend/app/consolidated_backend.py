import os
from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from pymongo import MongoClient
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Initialize the Flask app and enable CORS with credentials
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# MongoDB connection
mongo_uri = os.getenv("MONGO_STRING", "mongodb://localhost:27017/")
client = MongoClient(mongo_uri)
db = client['resource_allocation']
collection = db['form_entries']

# Check MongoDB connection at startup
try:
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:", e)

# Health Check Route
@app.route('/health', methods=['GET'])
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({"status": "MongoDB is connected!"}), 200
    except Exception as e:
        return jsonify({"status": "MongoDB connection failed!", "error": str(e)}), 500

# Allocate Resource Endpoint
@app.route('/allocate-resource', methods=['POST', 'OPTIONS'])
def submit_form():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.json
    required_fields = [
        "ngo_name", "resource_type", "quantity", "unit_of_measurement",
        "location", "allocation_date", "allocated_by", "age_group", "purpose", "priority_level"
    ]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Please fill in all fields."}), 400

    form_entry = {
        "ngo_name": data['ngo_name'],
        "resource_type": data['resource_type'],
        "quantity": data['quantity'],
        "unit_of_measurement": data['unit_of_measurement'],
        "location": data['location'],
        "allocation_date": data['allocation_date'],
        "allocated_by": data['allocated_by'],
        "age_group": data['age_group'],
        "purpose": data['purpose'],
        "priority_level": data['priority_level']
    }

    try:
        collection.insert_one(form_entry)
        print('Data inserted successfully')
        return jsonify({"message": "Resource allocated successfully!"}), 201
    except Exception as e:
        print("Error inserting into database:", e)
        return jsonify({"message": "Error allocating resource"}), 500

# Chatbot Blueprint
chatbot_bp = Blueprint('chatbot', __name__)
CORS(chatbot_bp, origins=["http://localhost:3000"], supports_credentials=True)

def get_gemini_response(prompt):
    headers = {'Content-Type': 'application/json'}
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    params = {"key": os.getenv("API_KEY")}
    try:
        response = requests.post(os.getenv("GEMINI_API_URL"), headers=headers, json=data, params=params)
        response.raise_for_status()
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return "Error fetching response from Gemini."

def analyze_question(user_input):
    all_entries = collection.find({})
    results = []
    for entry in all_entries:
        results.append({
            "ngo_name": entry.get("ngo_name", "Unknown NGO"),
            "resource_type": entry.get("resource_type", "Unknown Resource"),
            "quantity": entry.get("quantity", "N/A"),
            "unit_of_measurement": entry.get("unit_of_measurement", "N/A"),
            "location": entry.get("location", "Unknown Location"),
            "allocation_date": entry.get("allocation_date", "N/A"),
            "allocated_by": entry.get("allocated_by", "N/A"),
            "age_group": entry.get("age_group", "N/A"),
            "purpose": entry.get("purpose", "N/A"),
            "priority_level": entry.get("priority_level", "N/A"),
        })

    formatted_results = "\n".join(
        [f"{result['ngo_name']} has {result['quantity']} {result['unit_of_measurement']} of {result['resource_type']} for {result['purpose']} at {result['location']} "
         f"(allocated by {result['allocated_by']}, age group: {result['age_group']}, priority level: {result['priority_level']}, allocation date: {result['allocation_date']})"
         for result in results]
    )

    prompt = (
        "You are a Disaster Resource Coordinator. Your primary role is to assist users by providing clear, concise, and relevant information regarding disaster-related resources and aid available from various NGOs.\n\n"
        f"User Query: {user_input}\n\n"
        f"Available Resources:\n{formatted_results}\n\n"
        "Based on the information provided, deliver a concise response highlighting the available resources."
    )
    
    return get_gemini_response(prompt)

@chatbot_bp.route('/', methods=['POST', 'OPTIONS'])
def chatbot():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    user_input = request.json['question']
    answer = analyze_question(user_input)
    return jsonify({"answer": answer})

app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

# News Service Functions
def fetch_general_news():
    url = "https://newsapi.org/v2/general-news"
    params = {
        "country": "us",
        "category": "general",
        "pageSize": 5,
        "apiKey": os.getenv("NEWS_API_KEY"),
    }
    response = requests.get(url, params=params)
    return response.json() if response.status_code == 200 else {"error": f"Failed to fetch news: {response.status_code}"}

def fetch_real_time_data():
    five_days_before = datetime.now() - timedelta(days=5)
    from_date = five_days_before.strftime("%Y-%m-%d")
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "earthquake OR flood OR hurricane OR wildfire",
        "apiKey": os.getenv("NEWS_API_KEY"),
        "from": from_date,
        "language": "en",
    }
    response = requests.get(url, params=params)
    return response.json()

def fetch_top_headlines():
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "country": "us",
        "apiKey": os.getenv("NEWS_API_KEY"),
    }
    response = requests.get(url, params=params)
    return response.json() if response.status_code == 200 else {"error": f"Failed to fetch news: {response.status_code}"}

# News Blueprint
news_bp = Blueprint("news_bp", __name__)
CORS(news_bp, origins=["http://localhost:3000"], supports_credentials=True)

@news_bp.route("/general-news", methods=["GET"])
def get_general_news():
    data = fetch_general_news()
    return jsonify(data)

@news_bp.route("/api/real-time-data", methods=["GET"])
def get_real_time_data():
    data = fetch_real_time_data()
    return jsonify(data)

@news_bp.route("/api/top-headlines", methods=["GET"])
def get_top_headlines():
    data = fetch_top_headlines()
    return jsonify(data)

# Register the news blueprint
app.register_blueprint(news_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
