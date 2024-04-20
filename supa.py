import os
from supabase import create_client, Client
import uuid

url: str = "https://shobrjphmlccnutokhhi.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNob2JyanBobWxjY251dG9raGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NzgxMjksImV4cCI6MjAyOTE1NDEyOX0.wjpVc8Yz2KZuX6YMRIp_c5nMj-ZjY16F_jgNvjGmWBU"
supabase: Client = create_client(url, key)


data = supabase.table('user_searches').insert({"user_name": "skura"}).execute()


def fetch_recent_queries(name):
    response = supabase.table('countries') \
        .select("*") \
        .eq('user_name', name) \ 
        .order('created_at', ascending=False) \
        .limit(1) \
        .execute()
    
    return response


print(data)