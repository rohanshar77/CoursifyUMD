from flask import Flask, request, jsonify
from queries import query_pinecone, filter_freshman
<<<<<<< HEAD
from flask_cors import CORS, cross_origin
=======
>>>>>>> 44f5dc0241fb4225e282f2d4b7dd001ecebbdf04

app = Flask(__name__)
CORS(app)


@app.route('/search', methods=['POST'])
async def receive_data():
    # Check if the request contains JSON data
    if request.is_json:
        # Parse the JSON data
        data = request.get_json()
        print("Received data:", data)

        major = data['major']
        industry = data['industry']
        interests = data['interests']
        freshman = data['freshman']

        major_courses, career_courses, interest_courses = await query_pinecone(major, industry, interests)
        major_courses = list(major_courses.values())
        career_courses = list(career_courses.values())
        interest_courses = list(interest_courses.values())

        if freshman:
            major_courses, career_courses, interest_courses = await filter_freshman(major_courses, career_courses, interest_courses)

        return jsonify(major_courses, career_courses, interest_courses), 200
    else:
        return jsonify({"status": "error", "message": "Request was not JSON"}), 400


if __name__ == '__main__':
    app.run(debug=True)
