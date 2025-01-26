from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)  # This will allow all origins by default. You can configure it more specifically if needed.

# Initialize Appwrite client
client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1')
client.set_project('project_id')
client.set_key('appwrite_api')
storage = Storage(client)
database = Databases(client)

# Function to push data to Appwrite collection
def push_data_to_appwrite(title, desc, name, contact, email, location, required_amt):
    try:
        response = database.create_document(
            database_id='database_id',
            collection_id='collection_id',
            document_id='unique()',  # Use 'unique()' to generate a unique document ID
            data={
                'title': title,
                'desc': desc,
                'name': name,
                'contact': contact,
                'email': email,
                'location': location,
                'required_amt': required_amt
            }
        )
        return jsonify({"message": "Data pushed successfully!", "response": response}), 200
    except Exception as e:
        return jsonify({"message": "Failed to push data", "error": str(e)}), 400


# Flask route to receive data via POST request
@app.route('/push_data', methods=['POST'])
def handle_push_data():
    # Extract data from the request
    data = request.get_json()
    
    title = data.get('title')
    desc = data.get('desc')
    name = data.get('name')
    contact = data.get('contact')
    email = data.get('email')
    location = data.get('location')
    required_amt = data.get('required_amt')
    
    if not all([title, desc, name, contact, email, location, required_amt]):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Push data to Appwrite
    return push_data_to_appwrite(title, desc, name, contact, email, location, required_amt)

@app.route('/get_bucket_list', methods=['GET'])
def get_bucket_list():
    try:
        # Fetch the files in the bucket
        files = storage.list_files(bucket_id="bucket_id")
        
        # Extract only the "$id" from each file in the list
        file_ids = [{"$id": file["$id"]} for file in files["files"]]

        return jsonify(file_ids), 200

    except Exception as e:
        print("An error occurred while listing files:", e)
        return jsonify({"message": "Failed to fetch files", "error": str(e)}), 400


@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        # Retrieve documents from the collection
        response = database.list_documents(
            database_id='database_id',
            collection_id='collection_id'
        )
        
        # Return the documents as JSON response
        return jsonify(response['documents']), 200

    except Exception as e:
        return jsonify({"message": "Failed to retrieve data", "error": str(e)}), 400


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)

