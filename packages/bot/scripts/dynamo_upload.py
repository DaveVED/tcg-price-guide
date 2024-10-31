#!/usr/bin/env python
"""
DynamoDB Uploader Script

This script reads card data from a JSON file and uploads it to a specified DynamoDB table.
"""

import sys
from pathlib import Path
import os

# Determine the project root directory (parent of 'scripts')
project_root = Path(__file__).resolve().parent.parent

# Add the project root to sys.path
sys.path.insert(0, str(project_root))

import json
from decimal import Decimal

import boto3
from botocore.exceptions import ClientError
from tqdm import tqdm

from bot.logger import setup_logger

DYNAMODB_TABLE_NAME = os.getenv('DYNAMODB_TABLE_NAME', 'table-name')
JSON_FILE_PATH = project_root / 'data' / 'op_poki_nosql_data_new.json'

logger = setup_logger('dynamodb_uploader', project_root / 'logs' / 'dynamodb_upload.log')

def get_dynamodb_resource():
    """
    Initializes and returns a DynamoDB resource.
    """
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(DYNAMODB_TABLE_NAME)
        logger.info(f"Connected to DynamoDB table: {DYNAMODB_TABLE_NAME}")
        return table
    except ClientError as e:
        logger.error(f"Failed to connect to DynamoDB: {e}")
        raise

def load_json_data(file_path):
    """
    Loads JSON data from the specified file.

    Parameters:
        file_path (Path): Path to the JSON file.

    Returns:
        list: List of card data dictionaries.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f, parse_float=Decimal)  # Ensure decimals are handled correctly
        logger.info(f"Loaded {len(data)} records from {file_path}")
        return data
    except Exception as e:
        logger.error(f"Failed to load JSON data from {file_path}: {e}")
        raise

def upload_to_dynamodb(table, data):
    """
    Uploads a list of items to the DynamoDB table.

    Parameters:
        table (boto3.resources.factory.dynamodb.Table): The DynamoDB table resource.
        data (list): List of dictionaries representing card data.
    """
    success_count = 0
    failure_count = 0

    for item in tqdm(data, desc="Uploading to DynamoDB", unit="item"):
        try:
            table.put_item(Item=item)
            success_count += 1
        except ClientError as e:
            logger.error(f"Failed to upload item {item.get('SK', 'UNKNOWN')}: {e}")
            failure_count += 1

    logger.info(f"Upload complete: {success_count} succeeded, {failure_count} failed.")

def main():
    """
    Main function to orchestrate the DynamoDB upload process.
    """
    data = load_json_data(JSON_FILE_PATH)

    table = get_dynamodb_resource()

    upload_to_dynamodb(table, data)

if __name__ == "__main__":
    main()
