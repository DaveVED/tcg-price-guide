#!/usr/bin/env python
"""
DynamoDB NormalizedCardName Update Script

This script reads card data from a JSON file, adds a new NormalizedCardName attribute,
and updates existing records in a specified DynamoDB table.
"""

import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal
from pathlib import Path
from tqdm import tqdm
import re

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

def add_normalized_card_name_attribute(item):
    """
    Adds the NormalizedCardName attribute to an item based on the CardName.

    Parameters:
        item (dict): Dictionary representing a card.

    Returns:
        dict: Updated item with the NormalizedCardName attribute.
    """
    card_name = item.get('CardName', '')
    item['NormalizedCardName'] = normalize_card_name(card_name)
    return item

def update_item_in_dynamodb(item):
    """
    Updates an existing item in DynamoDB with the new NormalizedCardName attribute.

    Parameters:
        item (dict): Dictionary representing the card data.
    """
    key = {
        'SetID': item['SetID'],
        'SK': item['SK']
    }
    update_expression = "SET NormalizedCardName = :normalizedCardName"
    expression_attribute_values = {
        ":normalizedCardName": item['NormalizedCardName']
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
        # Add the NormalizedCardName attribute to each item
        updated_item = add_normalized_card_name_attribute(item)
        # Update the item in DynamoDB
        update_item_in_dynamodb(updated_item)

if __name__ == "__main__":
    main()