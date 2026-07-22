INSERT INTO characters (name, franchise, strength, speed, intelligence, durability)
VALUES
    ('Goku',           'Dragon Ball', 92, 94, 78, 88),
    ('Vegeta',         'Dragon Ball', 90, 91, 85, 86),
    ('Janemba',        'Dragon Ball', 95, 88, 70, 93),
    ('Piccolo',        'Dragon Ball', 82, 84, 93, 85),
    ('Edward Newgate', 'One Piece',   95, 72, 82, 94),
    ('Sasuke Uchiha',  'Naruto',      84, 90, 88, 80)
ON CONFLICT (name) DO NOTHING;