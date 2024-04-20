import os
from supabase import create_client, Client
import uuid

# url: str = os.environ.get("SUPABASE_URL")
# key: str = os.environ.get("SUPABASE_KEY")

url: str = "https://shobrjphmlccnutokhhi.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNob2JyanBobWxjY251dG9raGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NzgxMjksImV4cCI6MjAyOTE1NDEyOX0.wjpVc8Yz2KZuX6YMRIp_c5nMj-ZjY16F_jgNvjGmWBU"
supabase: Client = create_client(url, key)



data = supabase.auth.sign_in_with_password({"email": "saketh.kura@gmail.com", "password": "Db@_KHL+3-mS@sx"})

input_data = {
    "major": "computer science",
    "interests": ["machine learning", "data science"],
    "industry": "tech",
    "user_query": "list out all the courses in computer science",
    "year": "freshman"
}

data = supabase.table('user_searches').insert(input_data).execute()


def fetch_all_recent_queries():
    response = supabase.table('user_searches').select("*").limit(10).execute()
    
    return response


print(data)
print("Fetching all recent queries")
print(fetch_all_recent_queries())

res = supabase.auth.sign_out()


