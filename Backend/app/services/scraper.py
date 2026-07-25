import requests
from bs4 import BeautifulSoup
from Backend.app.services.database import save_wiki_data

def naruto_scrape_character(character_name: str):
    format_character_name = character_name.replace(" ", "_")
    url = f"https://naruto.fandom.com/api.php?action=parse&page={format_character_name}&format=json"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        raw_text = data.get("parse", {}).get("text", {}).get("*", "")
        soup = BeautifulSoup(raw_text, 'html.parser')
        clean_text = soup.get_text(separator=' ', strip=True)
        save_wiki_data(character_name, clean_text, url)

#naruto_scrape_character("Minato Namikaze")


def dragonball_scrape_character(character_name: str):
    format_character_name = character_name.replace(" ", "_")
    url = f"https://dragonball.fandom.com/api.php?action=parse&page={format_character_name}&format=json"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        raw_text = data.get("parse", {}).get("text", {}).get("*", "")
        soup = BeautifulSoup(raw_text, 'html.parser')
        clean_text = soup.get_text(separator=' ', strip=True)
        save_wiki_data(character_name, clean_text, url)
        
        
#dragonball_scrape_character("Janemba")

def one_piece_scrape_character(character_name: str):
    format_character_name = character_name.replace(" ", "_")
    url = f"https://onepiece.fandom.com/api.php?action=parse&page={format_character_name}&format=json"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        raw_text = data.get("parse", {}).get("text", {}).get("*", "")
        soup = BeautifulSoup(raw_text, 'html.parser')
        clean_text = soup.get_text(separator=' ', strip=True)
        save_wiki_data(character_name, clean_text, url)

one_piece_scrape_character("Edward Newgate")