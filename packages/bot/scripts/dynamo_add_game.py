#!/usr/bin/env python
"""
DynamoDB Update Script

This script reads card data from a JSON file, adds a new Game attribute,
and updates existing records in a specified DynamoDB table.
"""

import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from pathlib import Path
from tqdm import tqdm

# Configuration
TABLE_NAME = 'development-TCGPriceGuide-ReferenceData'
JSON_FILE_PATH = Path('data/tcgplayer_nosql_data_updated.json')  # Adjust as needed

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def load_json_data(file_path):
    """
    Loads JSON data from the specified file.

    Parameters:
        file_path (Path): Path to the JSON file.

    Returns:
        list: List of card data dictionaries.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f, parse_float=Decimal)  # Ensure decimals are handled correctly
    return data

def add_game_attribute(item):
    """
    Adds the Game attribute to an item based on the SetID.

    Parameters:
        item (dict): Dictionary representing a card.

    Returns:
        dict: Updated item with the Game attribute.
    """
    set_id = item.get('SetID', '')
    if set_id.startswith("OnePiece#"):
        item['Game'] = "OnePiece"
    elif set_id.startswith("Pokemon#"):
        item['Game'] = "Pokemon"
    else:
        item['Game'] = "Unknown"
    return item

def update_item_in_dynamodb(item):
    """
    Updates an existing item in DynamoDB with the new Game attribute.

    Parameters:
        item (dict): Dictionary representing the card data.
    """
    key = {
        'SetID': item['SetID'],
        'SK': item['SK']
    }
    update_expression = "SET Game = :game"
    expression_attribute_values = {
        ":game": item['Game']
    }

    try:
        table.update_item(
            Key=key,
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values
        )
    except ClientError as e:
        print(f"Failed to update item {item.get('SK', 'UNKNOWN')}: {e}")

def main():
    """
    Main function to orchestrate the DynamoDB update process.
    """
    # Load data from JSON file
    data = load_json_data(JSON_FILE_PATH)

    # Update each item in DynamoDB
    for item in tqdm(data, desc="Updating DynamoDB records", unit="item"):
        # Add the Game attribute to each item
        updated_item = add_game_attribute(item)
        # Update the item in DynamoDB
        update_item_in_dynamodb(updated_item)

if __name__ == "__main__":
    main()
