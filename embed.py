import openai
import csv
import tiktoken
from dotenv import load_dotenv
import os
import pandas as pd

# set up from environment
load_dotenv()
tokenizer = tiktoken.get_encoding("cl100k_base")

# Access the API key environment variable
api_key = os.environ["OPENAI_API_KEY"]
openai.api_key = api_key

# Define the batch size
BATCH_SIZE = 1000

# Set the original filename
filename = "data/courses-4 (combined w id, level, gpa).csv"

# tokens used
tot_tokens = 0

# Load the CSV file
with open(filename, "r", newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    # Create a list to hold the embeddings
    responses = []
    tokens = []

    # Iterate over the rows in the CSV, batching them as we go
    batch = []
    for row in reader:

        n_tokens = len(tokenizer.encode(row['combined']))
        tot_tokens += n_tokens
        print(f"{row['id']}, {n_tokens} Tokens Used")

        tokens.append(n_tokens)

        # Add the description to the current batch
        batch.append(row["combined"])

        # If the batch is full, generate embeddings for it and add them to the list
        if len(batch) == BATCH_SIZE:
            response = openai.Embedding.create(
                input=batch, engine='text-embedding-ada-002'
            )

            # Add the embeddings to the list
            responses.extend(response["data"])

            # Clear the batch
            batch = []

    # If there are any remaining rows in the CSV, generate embeddings for them and add them to the list
    if len(batch) > 0:
        response = openai.Embedding.create(
            input=batch, engine='text-embedding-ada-002'
        )

        # Add the embeddings to the list
        responses.extend(response["data"])

    final_embed = []
    for i, response in enumerate(responses):
        temp = response['embedding']
        final_embed.append(temp)

    df = pd.read_csv(filename)
    df['embedding'] = final_embed

    df['tokens'] = ''
    df['tokens'] = tokens

    df.to_csv(filename, index=False)
    df.to_parquet('data/courses_embed (combined w id, level, gpa).parquet')

    cost = tot_tokens / 1000 * 0.0004
    print("=" * 80)
    print(f"${cost} for {tot_tokens} tokens")
    print("=" * 80)

