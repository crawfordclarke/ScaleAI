
from app.services.database import get_all_character_names
from app.services.embeddings import ingest_character, retrieve_character_chunks


def main():
    query = ["attributes and abilities", "Whitebeard powers fighting style personality signature moves", "Edward Newgate", "describe this character's abilities backstory and combat feats"]
    name = "Edward Newgate"
    k = 5
    for q in query:
        print(f"querying string {q}...")

        try:
            retrieve_character_chunks(name, q, k)
            print(f"✓ Successfully retrieved chunks for query: {q}")   
        except Exception as e:
            print(f"✗ Failed on {name}: {e}")


if __name__ == "__main__":
    main()