from app.services.database import get_character

c = get_character(1)
print(c)
print(get_character(999))  