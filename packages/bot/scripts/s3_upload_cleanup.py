#!/usr/bin/env python
"""
Script to remove unwanted fields, add 'SlugSetName' if missing, and add 'Game' attribute in a JSON file.
"""

import json
from pathlib import Path
import re

# File paths
project_root = Path(__file__).resolve().parent.parent
original_json_file_path = project_root / 'data' / 'tcgplayer_nosql_data_updated.json'
new_json_file_path = project_root / 'data' / 'op_poki_nosql_data_new.json'

def load_json_data(file_path):
    """Loads JSON data from the specified file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json_data(data, file_path):
    """Saves JSON data to the specified file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def slugify(set_name):
    """Converts 'SetName' to a slug by replacing spaces with hyphens."""
    return set_name.lower().replace(' ', '-')

def determine_game(set_id):
    """Determines the game based on the 'SetID'."""
    if set_id.startswith("OnePiece#"):
        return "OnePiece"
    elif set_id.startswith("Pokemon#"):
        return "Pokemon"
    else:
        return "Unknown"

def normalize_card_name(card_name):
    """
    Normalizes the card name by removing punctuation and converting to lowercase.

    Parameters:
        card_name (str): The original card name.

    Returns:
        str: Normalized card name.
    """
    # Remove punctuation and convert to lowercase
    return re.sub(r'[\W_]+', ' ', card_name).strip().lower()


def remove_unwanted_fields_and_add_attributes(data):
    """Removes unwanted fields, adds 'SlugSetName' if missing, and adds 'Game' attribute."""
    for item in data:
        # Remove unwanted fields
        for field in ['S3ImageUrl', 'SourceURL', 'Source']:
            if field in item:
                del item[field]

        # Add 'SlugSetName' if it doesn't exist
        if 'SlugSetName' not in item and 'SetName' in item:
            item['SlugSetName'] = slugify(item['SetName'])

        # Add 'Game' attribute if missing
        if 'Game' not in item and 'SetID' in item:
            item['Game'] = determine_game(item['SetID'])

        if 'NormalizedCardName' not in item and 'CardName' in item:
            item["NormalizedCardName"] = normalize_card_name(item['CardName'])
            
    return data

def main():
    # Load the original JSON data
    data = load_json_data(original_json_file_path)

    # Remove unwanted fields, add 'SlugSetName' and 'Game' where necessary
    updated_data = remove_unwanted_fields_and_add_attributes(data)

    # Save the updated data to a new JSON file
    save_json_data(updated_data, new_json_file_path)

if __name__ == "__main__":
    main()
