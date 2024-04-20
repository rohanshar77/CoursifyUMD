import json
import numpy as np
import pinecone
import requests
from dotenv import load_dotenv
import os
import pandas as pd
import math
import ast

load_dotenv()
api_key = os.environ["PINE_CONE_API_KEY_UNDERGRAD"]

pinecone.init(api_key=api_key, environment="gcp-starter")
index = pinecone.Index("dbkcourses-undergrad")

df = pd.read_parquet('data/courses_embed (combined w id, level, gpa).parquet')


def transform_row(row):
    id = row['id']
    vector = row['embedding']

    professor_list = row["professors"].replace("[", "").replace("]", "").replace("\'", "").replace("\"", "").split(", ")
    top_professor = None
    top_rating = 0

    for professor in professor_list:
        splitted = professor.split(": ")
        if splitted[1] != "No ratings" and float(splitted[1]) > top_rating:
            top_rating = float(splitted[1])
            top_professor = splitted[0]


    print(top_professor)
    if top_rating == 0:
        top_rating = "No ratings"

    if top_professor is None:
        top_professor = professor_list[0].split(": ")[0]

    if not row["credits"]:
        print("not creds")
        return None

    # If the average GPA doesn't have decimals, then there probably aren't enough reviews
    if math.isnan(row["average_gpa"]):
        print("not avg_gpa")
        return None

    metadata = {
        "title": row["course_title"],
        "description": row["description"].replace('<b>', '').replace('</b>', '').replace('<i>', '').replace('</i>', ''),
        "combined": row["combined"],
        "tokens": row["tokens"],
        "top_prof": top_professor,
        "top_rating": top_rating,
        "average_gpa": round(row["average_gpa"], 2),
        "credits": row["credits"],
        "professors": professor_list
    }

    return id, vector, metadata


data_to_insert = df.apply(transform_row, axis=1).tolist()

for item in data_to_insert:
    # Skip items that are missing data
    if item is None:
        print("SKIPPING")
        continue

    try:
        index.upsert([item])
        print(f"Upserted {item[0]} successfully")
    except Exception as e:
        print(f"Error upserting {item[0]}: {e}")