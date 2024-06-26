import asyncio
import pinecone
from pinecone import Pinecone
import openai
import os
from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client, Client

load_dotenv()
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])


# major and desired_career are Strings, interests is list of Strings, include_grad is a boolean
async def create_pinecone_context(major, desired_industry, interests):
    # Create questions for each category
    major_question = f"I am a {major} major"
    desired_career_question = f"I want to be in the  {desired_industry} industry"
    interests_questions = []
    for interest in interests:
        interests_questions.append(f"I am interested in {interest}")

    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    email: str = os.environ.get("SUPABASE_EMAIL")
    password: str = os.environ.get("SUPABASE_PASS")

    supabase: Client = create_client(url, key)

    data = supabase.auth.sign_in_with_password({"email": email, "password": password})

    input_data = {
        "major_question": major_question,
        "desired_career_question": desired_career_question,
        "interests_questions": interests_questions
    }

    data = supabase.table('user_searches').insert(input_data).execute()

    supabase.auth.sign_out()

    # Get the embeddings each category
    major_embedding = client.embeddings.create(input=major_question, model='text-embedding-ada-002').data[0].embedding
    desired_career_embedding = client.embeddings.create(input=desired_career_question, model='text-embedding-ada-002').data[0].embedding
    interests_embeddings = []
    for interest_question in interests_questions:
        interests_embeddings.append(client.embeddings.create(input=interest_question, model='text-embedding-ada-002').data[0].embedding)

    return major_embedding, desired_career_embedding, interests_embeddings


async def query_pinecone(major, desired_industry, interests):
    major_embedding, desired_career_embedding, interests_embeddings = await create_pinecone_context(major, desired_industry, interests)

    # pinecone auth
    api_key = os.environ["PINE_CONE_API_KEY_UNDERGRAD"]
    pc = Pinecone(api_key=api_key)
    index = pc.Index("dbkcourses-undergrad")

    # Find matches related to major embedding
    major_matches = index.query(
        vector=major_embedding,
        top_k=6,
        include_values=False,
        include_metadata=True
    )

    # Find matches related to career embedding
    career_matches = index.query(
        vector=desired_career_embedding,
        top_k=6,
        include_values=False,
        include_metadata=True
    )

    # Find matches related to each interest
    interests_matches = []
    for interest_embedding in interests_embeddings:
        interests_matches.append(
            index.query(
                vector=interest_embedding,
                top_k=int(6/len(interests_embeddings)),
                include_values=False,
                include_metadata=True
            )
        )

    # Add courses from major matches
    major_courses = {}
    for match in major_matches.matches:
        course = {
            "id": match.id,
            "score": match.score,
            "combined": match.metadata.get('combined', ''),
            "description": match.metadata.get('description', ''),
            "title": match.metadata.get('title', ''),
            "top_prof": match.metadata.get('top_prof', ''),
            "top_rating": match.metadata.get('top_rating', ''),
            "tokens": match.metadata.get('tokens', ''),
            "average_gpa": match.metadata.get('average_gpa', ''),
            "credits": match.metadata.get('credits', ''),
            "professors": match.metadata.get('professors', '')
        }

        major_courses[match.id] = course

    # Add courses from major matches
    career_courses = {}
    for match in career_matches.matches:
        course = {
            "id": match.id,
            "score": match.score,
            "combined": match.metadata.get('combined', ''),
            "description": match.metadata.get('description', ''),
            "title": match.metadata.get('title', ''),
            "top_prof": match.metadata.get('top_prof', ''),
            "top_rating": match.metadata.get('top_rating', ''),
            "tokens": match.metadata.get('tokens', ''),
            "average_gpa": match.metadata.get('average_gpa', ''),
            "credits": match.metadata.get('credits', ''),
            "professors": match.metadata.get('professors', '')
        }

        career_courses[match.id] = course

    interest_courses = {}
    for interest_match_set in interests_matches:
        for match in interest_match_set.matches:
            course = {
                "id": match.id,
                "score": match.score,
                "combined": match.metadata.get('combined', ''),
                "description": match.metadata.get('description', ''),
                "title": match.metadata.get('title', ''),
                "top_prof": match.metadata.get('top_prof', ''),
                "top_rating": match.metadata.get('top_rating', ''),
                "tokens": match.metadata.get('tokens', ''),
                "average_gpa": match.metadata.get('average_gpa', ''),
                "credits": match.metadata.get('credits', ''),
                "professors": match.metadata.get('professors', '')
            }

            # Make sure not to overwrite existing entries
            if match.id not in interest_courses:
                interest_courses[match.id] = course

    return major_courses, career_courses, interest_courses


async def filter_freshman(major_courses, career_courses, interest_courses):
    def is_freshman_course(course):
        # Extract the numeric part of the course ID
        numeric_part = ''.join(filter(str.isdigit, course['id']))
        # Check if the numeric part starts with '4'
        return not numeric_part.startswith('4')

    # Filter the courses in each list to exclude those that are 400-level
    filtered_major_courses = [course for course in major_courses if is_freshman_course(course)]
    filtered_career_courses = [course for course in career_courses if is_freshman_course(course)]
    filtered_interest_courses = [course for course in interest_courses if is_freshman_course(course)]

    return filtered_major_courses, filtered_career_courses, filtered_interest_courses


async def main():
    result = await query_pinecone("Computer Science", "Backend Engineer", ["Weightlifting", "Cars"])
    print(result)

# Run the main function in the asyncio event loop
if __name__ == "__main__":
    asyncio.run(main())