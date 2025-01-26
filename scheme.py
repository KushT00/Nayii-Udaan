from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

# Initialize Flask app
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}) 
# Initialize Groq client
client = Groq(
    api_key='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'
)

@app.route('/schemes', methods=['POST'])
# @cors() 
def get_schemes():
    try:
        # Get JSON payload from the POST request
        data = request.get_json()
        question = data.get("question")

        if not question:
            return jsonify({"error": "Question is required"}), 400

        # Create chat completion
        chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": """Provide EXACTLY this JSON format based on users question Do not include any markdown characters:
{
"schemes": [
    {
    
        "url": "https://pmayg.nic.in/",(logo)
        "scheme_name": "Pradhan Mantri Awas Yojana - Gramin",
        "description": "A scheme to provide affordable housing to rural poor",
        "eligibility": "Families with income less than 3 lakhs per annum",
        "benefits": "Subsidy of up to 1.2 lakhs for construction of house",
        "application_process": "Online application through PMAY-G website or offline through local authorities"
    },
    {
    
        "url": "https://pib.nic.in/",(logo)
        "scheme_name": "Deen Dayal Upadhyaya Antyodaya Yojana",
        "description": "A scheme to promote rural livelihoods and skill development",
        "eligibility": "Rural households below poverty line",
        "benefits": "Financial assistance for skill development and entrepreneurship",
        "application_process": "Online application through NRLM website or offline through local authorities"
    },
    {
    
        "url": "https://www.pib.nic.in/",(logo)
        "scheme_name": "National Rural Livelihood Mission",
        "description": "A scheme to promote rural livelihoods and poverty reduction",
        "eligibility": "Rural households below poverty line",
        "benefits": "Financial assistance for livelihood activities and skill development",
        "application_process": "Online application through NRLM website or offline through local authorities"
    }
],
"ngos": [
    {
        "url": "https://www.pib.nic.in/",(logo)
        "ngo_name": "Barefoot College",
        "description": "An NGO working on rural development and education",
        "focus_area": "Rural education and livelihoods",
        "location": "Tilonia, Rajasthan",
        "contact_information": {
            "phone": "01437-225607",
            "email": "info@barefootcollege.org"
        }
    },
    {
    
        "url": "https://www.pib.nic.in/",(logo)
        "ngo_name": "Self Employed Women's Association",
        "description": "An NGO working on women's empowerment and livelihoods",
        "focus_area": "Women's empowerment and rural livelihoods",
        "location": "Ahmedabad, Gujarat",
        "contact_information": {
            "phone": "079-25306156",
            "email": "sewa@sewa.org"
        }
    },
    {
        "url": "https://www.pib.nic.in/",(logo) 
        "ngo_name": "Pratham Education Foundation",
        "description": "An NGO working on education and rural development",
        "focus_area": "Rural education and livelihoods",
        "location": "Mumbai, Maharashtra",
        "contact_information": {
            "phone": "022-26210445",
            "email": "info@pratham.org"
        }
    }
]
}"""
        },
        {
            "role": "user",
            "content": question
        }
    ],
    model="llama-3.3-70b-versatile",
    response_format={"type": "json_object"},
    temperature=0.5,
    max_completion_tokens=2048,
    top_p=1,
)
       


        # Return the Groq response as JSON
        
        return chat_completion.choices[0].message.content

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=4444)
