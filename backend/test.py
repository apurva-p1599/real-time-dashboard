import datetime
import os 
from flask import Flask, Response, request
from flask_mongoengine import MongoEngine

app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'host': 'cluster0.cbtq3.mongodb.net/resource_allocation?retryWrites=true&w=majority',
    'username': 'apatil62',
    'password': 'Aidtechinnovators',
    'db': 'resource_allocation'

}   

db = MongoEngine()
db.init_app(app)
@app.route('/health', methods=['GET'])
def health_check():
  return 'Hello Komal'

if __name__ == "__main__":
    app.run(debug=True, port=5000)