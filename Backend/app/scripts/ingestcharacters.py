
from app.services.database import get_all_character_names
from app.services.embeddings import ingest_character


def main():
    characters = ["Marshall D. Teach", "Minato Namikaze", "Monkey D. Luffy", "Naruto Uzumaki"]
    for name in characters:
        print(f"Ingesting {name}...")

        try:
            ingest_character(name)
            print(f"✓ Successfully ingested {name}")
        except Exception as e:
            print(f"✗ Failed on {name}: {e}")


if __name__ == "__main__":
    main()