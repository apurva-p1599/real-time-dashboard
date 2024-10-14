import requests
import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS  # Import CORS
from  dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow credentials


GEMINI_API_URL = os.environ.get("GEMINI_API_URL")
API_KEY = os.environ.get("API_KEY")
MONGO_STRING= os.environ.get("MONGO_STRING")

# MongoDB connection
client = MongoClient(MONGO_STRING)
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
        "key": API_KEY
    }
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=data, params=params)
        response.raise_for_status()  # Raise an exception for non-200 status codes
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except requests.exceptions.RequestException as e:
        print(f"Error calling Gemini API: {e}")
        return "Error fetching response from Gemini."

def analyze_question(user_input):
    # Querying MongoDB for aid-related information
    if "aid" in user_input.lower():
        available_aid = collection.find({})
        aid_suggestions = []
        for aid in available_aid:
            # Using .get() to avoid KeyError if the field is missing
            ngo_name = aid.get('ngo_name', 'Unknown NGO')
            resource_type = aid.get('resource_type', 'Unknown Resource')
            location = aid.get('location', 'Unknown Location')
            
            aid_suggestions.append(f"{ngo_name} has {resource_type} available at {location}.")
        
        # Building a detailed prompt for Gemini
        prompt = f"The following NGOs have aid available: {', '.join(aid_suggestions)}. Based on the user's question: '{user_input}', generate a helpful suggestion and include straight suggestion or information no other additional fillers. kindly ignore those aid which has no location specified. "
        return get_gemini_response(prompt)
    
    return "Sorry, I cannot answer that question right now."

# Flask route for chatbot interaction
@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json['question']
    # Process the question and get an AI response
    answer = analyze_question(user_input)
    return jsonify({"answer": answer})

if __name__ == "_main__":
    app.run(debug=True)