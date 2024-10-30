#!/usr/bin/env python
"""
Script to remove unwanted fields and add 'SlugSetName' if missing in a JSON file.
"""

import json
from pathlib import Path

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

def remove_unwanted_fields_and_add_slug(data):
    """Removes unwanted fields and adds 'SlugSetName' if it's missing."""
    for item in data:
        # Remove unwanted fields
        for field in ['S3ImageUrl', 'SourceURL', 'Source']:
            if field in item:
                del item[field]

        # Add 'SlugSetName' if it doesn't exist
        if 'SlugSetName' not in item and 'SetName' in item:
            item['SlugSetName'] = slugify(item['SetName'])
            
    return data

def main():
    # Load the original JSON data
    data = load_json_data(original_json_file_path)

    # Remove unwanted fields and add 'SlugSetName' where necessary
    updated_data = remove_unwanted_fields_and_add_slug(data)

    # Save the updated data to a new JSON file
    save_json_data(updated_data, new_json_file_path)

if __name__ == "__main__":
    main()
