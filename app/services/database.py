import os
from dotenv import load_dotenv
import psycopg2

load_dotenv() 


def get_database_connection():    
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    return conn, cur

def save_wiki_data(character_name, raw_text, source_url):
    conn, cur = get_database_connection()
    cur.execute(    
        "INSERT INTO wiki_data (character_name, raw_text, source_url) VALUES (%s, %s, %s)",
        (character_name, raw_text, source_url)
    )
    conn.commit()
    cur.close()
    conn.close()

def get_wiki_data(character_name):
    conn, cur = get_database_connection()
    cur.execute(
        "SELECT raw_text, source_url FROM wiki_data WHERE character_name = %s",
        (character_name,)
    )
    result = cur.fetchone()
    cur.close()
    conn.close()
    return result

def replace_character_rows(character_name, rows):
    conn, cur = get_database_connection()
    cur.execute("DELETE FROM rag_text WHERE character_name = %s", (character_name,))
    cur.executemany(
        "INSERT INTO rag_text (character_name, chunk_index, raw_text_chunk, embedding) VALUES (%s, %s, %s, %s)",
        rows
    )
    conn.commit()          # one commit — both statements land together
    cur.close()
    conn.close()
