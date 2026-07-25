import os
from dotenv import load_dotenv
from google import genai
from google.genai import types, errors
from pgvector import Vector
from Backend.app.services.database import get_wiki_data, replace_character_rows, search_similar_chunks
from Backend.app.services.chunker import chunk_text
from pgvector import Vector
import time 


load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")

#text embedding function for turning text into vector embeddings for retrieval 

def embed_text(text, tt):
    '''tt is the task type for the embedding, can be one of:
    RETRIEVAL_DOCUMENT or RETRIEVAL_QUERY'''
    client = genai.Client(api_key=google_api_key)
    for attempt in range(3):
        try:
            result = client.models.embed_content(
                model="gemini-embedding-001",
                contents=text,
                config=types.EmbedContentConfig(task_type=tt)
            )
            return result.embeddings[0].values
        except errors.ClientError as e:
            raise  # 429 quota etc. — fail fast, retrying won't help
        except Exception as e:
            if attempt == 2:
                raise  # exhausted retries on a connection drop
            time.sleep(2 ** attempt)  # 1s, 2s, 4s




def ingest_character(character_name):
    data = get_wiki_data(character_name)
    if data is None:
        print(f"No data found for character: {character_name}")
        return
    
    rawtext = data[0]
    chunks = chunk_text(rawtext, character_name)
    rows = []
    for chunk in chunks:
        vector = Vector(embed_text(chunk["raw_text_chunk"], "RETRIEVAL_DOCUMENT"))
        rows.append((chunk["character_name"], chunk["chunk_index"], chunk["raw_text_chunk"], vector))
        time.sleep(0.5)
    replace_character_rows(character_name, rows)
        
def retrieve_character_chunks(character_name, query, k):
    #wrap in Vector so psycopg2 sends it as an actual vector param, not a plain list
    query_vector = Vector(embed_text(query, "RETRIEVAL_QUERY"))
    results = search_similar_chunks(character_name, query_vector, k)
    return results

    


if __name__ == "__main__":
    print(retrieve_character_chunks("Edward Newgate", "earthquake tremor powers", 3)) 