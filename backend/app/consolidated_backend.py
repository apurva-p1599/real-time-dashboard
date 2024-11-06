import os
from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from pymongo import MongoClient
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
from math import radians, sin, cos, sqrt, atan2

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
disaster_collection = db['disasters']

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
        "ngo_name", "resource_type", "quantity", "resource_details",
        "location", "allocation_date", "allocated_by", "age_group", "purpose", "priority_level"
    ]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Please fill in all fields."}), 400

    form_entry = {
        "ngo_name": data['ngo_name'],
        "resource_type": data['resource_type'],
        "quantity": data['quantity'],
        "resource_details": data['resource_details'],
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

# Haversine formula to calculate distance between two GPS coordinates
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance

# Endpoint to check if NGO is within range of a disaster location
@app.route('/check-arrival', methods=['POST'])
def check_arrival():
    data = request.json
    ngo_lat = data.get("latitude")
    ngo_lon = data.get("longitude")
    disaster_id = data.get("disaster_id")

    if not ngo_lat or not ngo_lon:
        return jsonify({"error": "Latitude and longitude are required for the NGO location."}), 400

    try:
        ngo_lat, ngo_lon = float(ngo_lat), float(ngo_lon)
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude format."}), 400

    disaster = disaster_collection.find_one({"disaster_id": disaster_id})
    if not disaster:
        return jsonify({"error": "Disaster location not found"}), 404

    disaster_lat = disaster.get("latitude")
    disaster_lon = disaster.get("longitude")
    arrival_radius_km = disaster.get("arrival_radius_km", 0.5)

    if disaster_lat is None or disaster_lon is None:
        return jsonify({"error": "Disaster coordinates are incomplete."}), 500

    distance = calculate_distance(ngo_lat, ngo_lon, disaster_lat, disaster_lon)

    if distance <= arrival_radius_km:
        message = f"{data.get('ngo_name', 'NGO')} has arrived at the Disaster Location."
        return jsonify({"arrivalConfirmed": True, "distance_km": distance, "message": message})
    else:
        message = f"{data.get('ngo_name', 'NGO')} has not yet arrived at the disaster location."
        return jsonify({"arrivalConfirmed": False, "distance_km": distance, "message": message})

# Chatbot functionality
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
            "resource_details": entry.get("resource_details", "N/A"),
            "location": entry.get("location", "Unknown Location"),
            "allocation_date": entry.get("allocation_date", "N/A"),
            "allocated_by": entry.get("allocated_by", "N/A"),
            "age_group": entry.get("age_group", "N/A"),
            "purpose": entry.get("purpose", "N/A"),
            "priority_level": entry.get("priority_level", "N/A"),
        })

    formatted_results = "\n".join(
        [f"{result['ngo_name']} has {result['quantity']} {result['resource_details']} of {result['resource_type']} for {result['purpose']} at {result['location']} "
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

app.register_blueprint(news_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
