from flask import Flask, request, jsonify
from queries import query_pinecone

app = Flask(__name__)


@app.route('/search', methods=['POST'])
def receive_data():
    # Check if the request contains JSON data
    if request.is_json:
        # Parse the JSON data
        data = request.get_json()
        print("Received data:", data)

        major = data['major']
        industry = data['industry']
        interests = data['interests']
        include_grad = data['include_grad']

        major_courses, career_courses, interest_courses = query_pinecone(major, industry, interests, include_grad)

        # Return a response to the frontend
        return jsonify(major_courses, career_courses, interest_courses), 200
    else:
        return jsonify({"status": "error", "message": "Request was not JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
