import os
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS
# from pyngrok import ngrok

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 
client = Groq(api_key='your_groq_api')

# Website structure and navigation mapping
WEBSITE_PROMPT = """
You are a navigation assistant for a website with these pages.  
- content: main landing page, default destination
- profile: takes you to user profile where the user can edit and view user details
- events: takes to page where all the events are listed and their url to join the meeting
- crowdfunding: Allows the user to pitch idea to get seed funding from investors 
- content: takes you to community section from where the local people can view videos and get upskilled 
- schemes: takes the user to scheme page where user can see all governement schemes provided to users
- panchayat: a virtual nline platform to dscuss meetings.

When given a user's voice transcription, Note i neeed one word response respond with ONLY the most relevant single-word page name from the above list. If unsure, default to 'home'.
Example output /home
"""

@app.route('/audio', methods=['POST'])
def process_transcription():
    data = request.json
    print(data)
    
    if not data or 'transcription' not in data:
        return jsonify({'error': 'No transcription provided'}), 400
    
    try:
        # Navigate using LLM
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": WEBSITE_PROMPT},
                {"role": "user", "content": data['transcription']}
            ],
            model="llama-3.1-8b-instant",
            max_tokens=10
        )
       
        
        # Extract single-word page
        destination = chat_completion.choices[0].message.content.strip().lower()
        print(destination)
        
        return jsonify({
            'transcription': data['transcription'],
            'destination': destination 
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # public_url = ngrok.connect(port=5000)
    # print(f"Public URL: {public_url}")
    app.run(host='0.0.0.0', port=5555, debug=True)