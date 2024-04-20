import asyncio
import pinecone
import openai
import os


# major and desired_career are Strings, interests is list of Strings, include_grad is a boolean
async def create_pinecone_context(major, desired_industry, interests):
    # Create questions for each category
    major_question = f"I am a {major} major"
    desired_career_question = f"I want to be in the  {desired_industry} industry"
    interests_questions = []
    for interest in interests:
        interests_questions.append(f"I am interested in {interest}")

    # Get the embeddings each category
    major_embedding = openai.Embedding.create(input=major_question, engine='text-embedding-ada-002')['data'][0]['embedding']
    desired_career_embedding = openai.Embedding.create(input=desired_career_question, engine='text-embedding-ada-002')['data'][0]['embedding']
    interests_embeddings = []
    for interest_question in interests_questions:
        interests_embeddings.append(openai.Embedding.create(input=interest_question, engine='text-embedding-ada-002')['data'][0]['embedding'])

    return major_embedding, desired_career_embedding, interests_embeddings


async def query_pinecone(major, desired_industry, interests, include_grad):
    major_embedding, desired_career_embedding, interests_embeddings = create_pinecone_context(major, desired_industry, interests)

    # pinecone auth
    if include_grad:
        api_key = os.environ["PINE_CONE_API_KEY_ALL"]
        pinecone.init(api_key=api_key, environment="us-west4-gcp-free")
        index = pinecone.Index("umd-courses")
    else:
        api_key = os.environ["PINE_CONE_API_KEY_UNDERGRAD"]
        pinecone.init(api_key=api_key, environment="gcp-starter")
        index = pinecone.Index("dbkcourses-undergrad")

    # Find matches related to major embedding
    major_matches = index.query(
        vector=major_embedding,
        top_k=20,
        include_values=False,
        include_metadata=True
    )

    # Find matches related to career embedding
    career_matches = index.query(
        vector=desired_career_embedding,
        top_k=20,
        include_values=False,
        include_metadata=True
    )

    # Find matches related to each interest
    interests_matches = []
    for interest_embedding in interests_embeddings:
        interests_matches.append(
            index.query(
                vector=interest_embedding,
                top_k=int(20/len(interests_embeddings)),
                include_values=False,
                include_metadata=True
            )
        )

    # Add courses from major matches
    major_courses = {}
    for match in major_matches:
        course = {
            "id": match.get('id', ''),
            "score": match.get('score', ''),
            "combined": match.get('metadata', {}).get('combined', ''),
            "description": match.get('metadata', {}).get('description', ''),
            "title": match.get('metadata', {}).get('title', ''),
            "top_prof": match.get('metadata', {}).get('top_prof', ''),
            "top_rating": match.get('metadata', {}).get('top_rating', ''),
            "tokens": match.get('metadata', {}).get('tokens', ''),
            "average_gpa": match.get('metadata', {}).get('average_gpa', ''),
            "credits": match.get('metadata', {}).get('credits', ''),
            "professors": match.get('metadata', {}).get('professors', '')
        }

        major_courses[match.get("id")] = course

    # Add courses from major matches
    career_courses = {}
    for match in career_matches:
        course = {
            "id": match.get('id', ''),
            "score": match.get('score', ''),
            "combined": match.get('metadata', {}).get('combined', ''),
            "description": match.get('metadata', {}).get('description', ''),
            "title": match.get('metadata', {}).get('title', ''),
            "top_prof": match.get('metadata', {}).get('top_prof', ''),
            "top_rating": match.get('metadata', {}).get('top_rating', ''),
            "tokens": match.get('metadata', {}).get('tokens', ''),
            "average_gpa": match.get('metadata', {}).get('average_gpa', ''),
            "credits": match.get('metadata', {}).get('credits', ''),
            "professors": match.get('metadata', {}).get('professors', '')
        }

        career_courses[match.get("id")] = course

    interest_courses = {}
    for interest_match_set in interests_matches:
        for match in interest_match_set:
            course = {
                "id": match.get('id', ''),
                "score": match.get('score', ''),
                "combined": match.get('metadata', {}).get('combined', ''),
                "description": match.get('metadata', {}).get('description', ''),
                "title": match.get('metadata', {}).get('title', ''),
                "top_prof": match.get('metadata', {}).get('top_prof', ''),
                "top_rating": match.get('metadata', {}).get('top_rating', ''),
                "tokens": match.get('metadata', {}).get('tokens', ''),
                "average_gpa": match.get('metadata', {}).get('average_gpa', ''),
                "credits": match.get('metadata', {}).get('credits', ''),
                "professors": match.get('metadata', {}).get('professors', '')
            }

            if not interest_courses[match.get("id")]:
                interest_courses[match.get("id")] = course

    return major_courses, career_courses, interest_courses
