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

