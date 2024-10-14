import requests
import os
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Create a Flask Blueprint
chatbot_bp = Blueprint('chatbot', __name__)
CORS(chatbot_bp, supports_credentials=True)

# MongoDB connection
client = MongoClient(os.environ.get("MONGO_STRING"))
db = client['resource_allocation']
collection = db['form_entries']


# Function to query the Gemini model for AI responses
def get_gemini_response(prompt):
    headers = {
        'Content-Type': 'application/json'
    }
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    params = {
        "key": os.environ.get("API_KEY")
    }
    try:
        response = requests.post(os.environ.get("GEMINI_API_URL"), headers=headers, json=data, params=params)
        response.raise_for_status()  # Raise an exception for non-200 status codes
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return "Error fetching response from Gemini."

def analyze_question(user_input):
    # Retrieve all entries from the database
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
            "allocated_to": entry.get("allocated_to", "N/A"),
            "purpose": entry.get("purpose", "N/A"),
            "priority_level": entry.get("priority_level", "N/A"),
        })

    formatted_results = "\n".join(
        [f"{result['ngo_name']} has {result['quantity']} {result['unit_of_measurement']} of {result['resource_type']} for {result['purpose']} at {result['location']} (allocated by {result['allocated_by']}, allocated to {result['allocated_to']}, priority level: {result['priority_level']}, allocation date: {result['allocation_date']})"
         for result in results]
    )

    prompt = (
        "You are a Disaster Resource Coordinator. Your primary role is to assist users by providing clear, concise, and relevant information regarding disaster-related resources and aid available from various NGOs. Politely decline any requests that do not pertain to disasters or resource allocation.\n\n"
        f"User Query: {user_input}\n\n"
        f"Available Resources:\n{formatted_results}\n\n"
        "Based on the information provided, deliver a concise response highlighting the available resources. Use common symbols like double quotes for emphasis on important points instead of markdown format like '**', no markdown strictly. Format your response with bullet points for multiple pieces of information. Always assume the user is asking about available resources in the database; if relevant data exists, present it directly without prefacing with phrases like 'While I don't have generic information, I found...' or similar statements."
    )
    
    return get_gemini_response(prompt)

# Flask route for chatbot interaction
@chatbot_bp.route('/', methods=['POST'])
def chatbot():
    user_input = request.json['question']
    answer = analyze_question(user_input)

    return jsonify({"answer": answer})
