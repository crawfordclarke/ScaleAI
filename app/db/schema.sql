CREATE EXTENSION IF NOT EXISTS vector;



CREATE TABLE IF NOT EXISTS public.characters
(
    character_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    franchise TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    strength integer NOT NULL,
    speed integer NOT NULL,
    intelligence integer NOT NULL,
    durability integer NOT NULL,
    CONSTRAINT characters_pkey PRIMARY KEY (character_id),
    CONSTRAINT characters_name_unique UNIQUE (name)
);

-- Table: public.wiki_data

-- DROP TABLE IF EXISTS public.wiki_data;

CREATE TABLE IF NOT EXISTS public.wiki_data
(
    character_name text COLLATE pg_catalog."default" NOT NULL,
    raw_text text COLLATE pg_catalog."default" NOT NULL,
    source_url text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT wiki_data_pkey PRIMARY KEY (character_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.wiki_data
    OWNER to postgres;

-- Table: public.rag_text

-- DROP TABLE IF EXISTS public.rag_text;

CREATE TABLE IF NOT EXISTS public.rag_text
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    character_name text COLLATE pg_catalog."default" NOT NULL,
    chunk_index integer NOT NULL,
    raw_text_chunk text COLLATE pg_catalog."default" NOT NULL,
    embedding vector(3072),
    CONSTRAINT rag_text_pkey PRIMARY KEY (id),
    CONSTRAINT rag_text_character_name_fkey FOREIGN KEY (character_name)
        REFERENCES public.wiki_data (character_name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.rag_text
    OWNER to postgres;