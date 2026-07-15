
from Backend.app.services.database import get_all_character_names
from Backend.app.services.embeddings import ingest_character


def main():
    for name in get_all_character_names():
        print(f"Ingesting {name}...")

        try:
            ingest_character(name)
            print(f"✓ Successfully ingested {name}")
        except Exception as e:
            print(f"✗ Failed on {name}: {e}")


if __name__ == "__main__":
    main()