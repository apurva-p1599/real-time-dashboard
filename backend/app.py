import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS  # Import CORS
from modules.chatbot import chatbot_bp

app = Flask(__name__)

# Enable CORS for the frontend origin and allow credentials
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# MongoDB connection string
mongo_uri = os.environ.get("MONGO_STRING", "mongodb://localhost:27017/")  # Use default if MONGO_STRING is not set
client = MongoClient(mongo_uri)
db = client['resource_allocation']  # Replace with your database name
collection = db['form_entries']  # Replace with your collection name

# Check MongoDB connection at startup
try:
    client.admin.command('ping')  # Send a ping command to check connection
    print("MongoDB connection successful!")
except Exception as e:
    print("MongoDB connection failed:", e)

@app.route('/health', methods=['GET'])
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({"status": "MongoDB is connected!"}), 200
    except Exception as e:
        return jsonify({"status": "MongoDB connection failed!", "error": str(e)}), 500

@app.route('/allocate-resource', methods=['POST'])
def submit_form():
    data = request.json
    print("Received data:", data)  # Log incoming data

    # Check if all required fields are present
    if not all(field in data for field in ["ngo_name", "resource_type", "quantity", 
                                           "unit_of_measurement", "location", 
                                           "allocation_date", "allocated_by", 
                                           "age_group", "purpose", "priority_level"]):
        print("Missing fields")
        return jsonify({"message": "Missing fields"}), 400
    
    # Create form entry for MongoDB
    form_entry = {
        "ngo_name": data['ngo_name'],
        "resource_type": data['resource_type'],
        "quantity": data['quantity'],
        "unit_of_measurement": data['unit_of_measurement'],
        "location": data['location'],
        "allocation_date": data['allocation_date'],
        "allocated_by": data['allocated_by'],
        "age_group": data['age_group'],  # Updated to 'age_group'
        "purpose": data['purpose'],
        "priority_level": data['priority_level']
    }
    print("Form entry successful")
    
    # Insert form entry into MongoDB
    try:
        collection.insert_one(form_entry)
        print('Data inserted successfully')
        return jsonify({"message": "Form submitted successfully!"}), 201
    except Exception as e:
        print("Error inserting into database:", e)
        return jsonify({"message": "Error allocating resource"}), 500

# Register the chatbot blueprint
app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

# Run the Flask app on port 5000
if __name__ == "__main__":
    app.run(debug=True, port=5000)
