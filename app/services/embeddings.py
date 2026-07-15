import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from Backend.app.services.database import get_wiki_data, replace_character_rows, search_similar_chunks
from Backend.app.services.chunker import chunk_text


load_dotenv()

google_api_key = os.getenv("GOOGLE_API_KEY")

#text embedding function for turning text into vector embeddings for retrieval 

def embed_text(text, tt):
    '''tt is the task type for the embedding, can be one of:
    RETRIEVAL_DOCUMENT or RETRIEVAL_QUERY'''
    client = genai.Client(api_key=google_api_key)
    result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=text,
    config=types.EmbedContentConfig(task_type=tt)
        )
    return result.embeddings[0].values

def ingest_character(character_name):
    data = get_wiki_data(character_name)
    if data is None:
        print(f"No data found for character: {character_name}")
        return
    
    rawtext = data[0]
    chunks = chunk_text(rawtext, character_name)
    rows = []
    for chunk in chunks:
        vector = embed_text(chunk["raw_text_chunk"], "RETRIEVAL_DOCUMENT")
        rows.append((chunk["character_name"], chunk["chunk_index"], chunk["raw_text_chunk"], vector))
    replace_character_rows(character_name, rows)
        
def retrieve_character_chunks(character_name, query, k):
    query_vector = embed_text(query, "RETRIEVAL_QUERY")
    results = search_similar_chunks(character_name, query_vector, k)
    return results

    


if __name__ == "__main__":
    print(retrieve_character_chunks("Edward Newgate", "earthquake tremor powers", 3)) 