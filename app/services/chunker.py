import re

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
    
    

print(clean_raw_text())