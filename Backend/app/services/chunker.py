import re
from app.services.database import get_wiki_data
from nltk.tokenize import sent_tokenize

# TODO: leading infobox noise in first ~3 chunks, revisit if retrieval surfaces junk 



def group_list(num_sentences):
    current_start = 0
    gpl = []
    if num_sentences < 3:
        return [(i,) for i in range(num_sentences)]
    while num_sentences - current_start >= 3:
        temp_list = [current_start, current_start + 1, current_start + 2]
        tupled_list = tuple(temp_list)
        gpl.append(tupled_list)
        current_start += 2
    remaining_sentences = num_sentences - current_start - 1    
    if remaining_sentences == 1 and len(gpl) > 0:
        last_group = gpl.pop()
        gpl.append((last_group[0],last_group[1],last_group[2], current_start + 1))
    if remaining_sentences == 2 and len(gpl) > 0:
        last_group = gpl.pop()
        gpl.append((last_group[0],last_group[1],current_start + 1, current_start + 2))
    return gpl


def clean_raw_text(raw_text):
    reference_index = raw_text.find("References [")
    if reference_index != -1:
        raw_text = raw_text[:reference_index]
    cleaned_with_space = re.sub(r"\[[\d\s.]*\]", "", raw_text)
    cleaned = re.sub(r"\s+", " ", cleaned_with_space)
    return cleaned
    
    
def chunk_text(raw_text, character_name):
    cleaned_text = clean_raw_text(raw_text)
    sentences = sent_tokenize(cleaned_text)
    num_sentences = len(sentences)
    grouped_indices = group_list(num_sentences)
    chunks = []
    for i,group in enumerate(grouped_indices):
        rag_dict = {}
        rag_dict["character_name"] = character_name
        chunk = " ".join([sentences[idx] for idx in group])
        rag_dict["raw_text_chunk"] = chunk
        rag_dict["chunk_index"] = i
        chunks.append(rag_dict)
        
    return chunks
    
    



if __name__ == "__main__":
    row = get_wiki_data("Edward Newgate")
    text = row[0]
    result = chunk_text(text, "Edward Newgate")
    for chunk in result[:3]:
        print(chunk["chunk_index"], "→", chunk["raw_text_chunk"][:150])
        print("---")
    print(f"total chunks: {len(result)}")
    row = get_wiki_data("Edward Newgate")
    text = row[0]
    print(text[:2000])