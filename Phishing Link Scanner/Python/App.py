from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
app = Flask(__name__)
CORS(app)

API_KEY = os.getenv('API_KEY') 
SAFE_BROWSING_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find'

@app.route("/", methods=['GET'])
def home():
    return "Flask server is running";

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    payload = {
        'client': {
            'clientId': 'yourcompanyname',
            'clientVersion': '1.5.2'
        },
        'threatInfo': {
            'threatTypes': ['MALWARE', 'SOCIAL_ENGINEERING'],
            'platformTypes': ['ANY_PLATFORM'],
            'threatEntryTypes': ['URL'],
            'threatEntries': [
                {'url': url}
            ]
        }
    }
    
    params = {'key': API_KEY}
    response = requests.post(SAFE_BROWSING_URL, params=params, json=payload)
    result = response.json()
    
    if 'matches' in result:
        return jsonify({'phishing': True, 'details': result}), 200
    else:
        return jsonify({'phishing': False, 'details': 'Continue with this url'}), 200

if __name__ == '__main__':
    app.run(debug=True)