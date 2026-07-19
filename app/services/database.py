import os
from dotenv import load_dotenv
import psycopg2
from pgvector.psycopg2 import register_vector

load_dotenv() 


def get_database_connection():    
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    #register_vector lets psycopg2 adapt python lists to the vector type automatically
    register_vector(conn)
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

def get_all_character_names():
    conn, cur = get_database_connection()
    cur.execute("SELECT DISTINCT character_name FROM wiki_data")
    results = cur.fetchall()
    cur.close()
    conn.close()
    return [row[0] for row in results]

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


def search_similar_chunks(character_name, query_vector, k):
    conn, cur = get_database_connection()
    cur.execute(
        """SELECT raw_text_chunk
           FROM rag_text
           WHERE character_name = %s
           ORDER BY embedding <=> %s
           LIMIT %s""",         # no ::vector cast needed, register_vector handles the type
        (character_name, query_vector, k)
    )
    results = cur.fetchall()
    cur.close()
    conn.close()
    return results