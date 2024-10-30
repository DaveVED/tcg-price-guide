#!/usr/bin/env python
"""
S3 Image Uploader Script

This script reads card data from a JSON file, downloads images from TcgImageUrl,
uploads them to an S3 bucket, adds new fields for S3ImageUrl and S3Key, and
writes the updated data to a new JSON file without modifying the original file.
"""

import sys
from pathlib import Path
import os
import json
import requests
from tqdm import tqdm
import uuid
from decimal import Decimal
import re  # Added for slugification

# Determine the project root directory (parent of 'scripts')
project_root = Path(__file__).resolve().parent.parent

# Add the project root to sys.path
sys.path.insert(0, str(project_root))

import boto3
from botocore.exceptions import ClientError
from bot.logger import setup_logger

# Configuration
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'bonk')
ORIGINAL_JSON_FILE_PATH = project_root / 'data' / 'tcgplayer_nosql_data.json'
UPDATED_JSON_FILE_PATH = project_root / 'data' / 'tcgplayer_nosql_data_updated.json'
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

logger = setup_logger('s3_uploader', project_root / 'logs' / 's3_upload.log')

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
            data = json.load(f, parse_float=Decimal)
        logger.info(f"Loaded {len(data)} records from {file_path}")
        return data
    except Exception as e:
        logger.error(f"Failed to load JSON data from {file_path}: {e}")
        raise

def save_json_data(data, file_path):
    """
    Saves JSON data to the specified file.

    Parameters:
        data (list): List of card data dictionaries.
        file_path (Path): Path to the JSON file.
    """
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4, default=str)
        logger.info(f"Saved updated data to {file_path}")
    except Exception as e:
        logger.error(f"Failed to save JSON data to {file_path}: {e}")
        raise

def download_image(image_url):
    """
    Downloads an image from the specified URL.

    Parameters:
        image_url (str): The URL of the image to download.

    Returns:
        bytes: The content of the image.
    """
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        return response.content
    except Exception as e:
        logger.error(f"Failed to download image from {image_url}: {e}")
        return None

def upload_image_to_s3(s3_client, image_content, bucket_name, object_key):
    """
    Uploads image content to an S3 bucket.

    Parameters:
        s3_client (boto3.client): The S3 client.
        image_content (bytes): The content of the image.
        bucket_name (str): The name of the S3 bucket.
        object_key (str): The object key (path) in the S3 bucket.

    Returns:
        str: The S3 URL of the uploaded image.
    """
    try:
        s3_client.put_object(Bucket=bucket_name, Key=object_key, Body=image_content, ContentType='image/jpeg')
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{object_key}"
        return s3_url
    except Exception as e:
        logger.error(f"Failed to upload image to S3 at {object_key}: {e}")
        return None

def slugify(value):
    """
    Converts a string to a slug by replacing spaces with hyphens and converting to lowercase.

    Parameters:
        value (str): The string to slugify.

    Returns:
        str: The slugified string.
    """
    value = str(value)
    value = value.strip().lower()
    value = re.sub(r'[\s]+', '-', value)  # Replace spaces with hyphens
    value = re.sub(r'[^\w\-]', '', value)  # Remove non-word characters except hyphens
    return value

def process_images_and_update_data(data):
    """
    Processes images for each item in the data and updates the S3ImageUrl and S3Key fields.

    Parameters:
        data (list): List of card data dictionaries.

    Returns:
        list: Updated list of card data dictionaries.
    """
    s3_client = boto3.client('s3', region_name=AWS_REGION)

    for item in tqdm(data, desc="Processing images", unit="item"):
        if item.get('SK') == 'SET':
            continue

        set_name = item.get('SetName', 'unknown-set')
        slug_set_name = slugify(set_name)
        item['SlugSetName'] = slug_set_name 

        image_url = item.get('TcgImageUrl')
        if image_url:
            image_content = download_image(image_url)
            if image_content:
                new_uuid = str(uuid.uuid4())[:8]
                # Construct the new object key/path
                object_key = f"{slug_set_name}/{new_uuid}_200x200.jpg"
                s3_url = upload_image_to_s3(s3_client, image_content, S3_BUCKET_NAME, object_key)
                if s3_url:
                    item['S3ImageUrl'] = s3_url
                    item['S3Key'] = object_key
                else:
                    logger.error(f"Failed to upload image for item {item.get('SK', 'UNKNOWN')}")
            else:
                logger.error(f"Failed to download image for item {item.get('SK', 'UNKNOWN')}")
        else:
            logger.warning(f"No TcgImageUrl found for item {item.get('SK', 'UNKNOWN')}")
    return data

def main():
    """
    Main function to process images and update the JSON data.
    """
    # Load the original JSON data
    data = load_json_data(ORIGINAL_JSON_FILE_PATH)

    # Process images and update the data
    updated_data = process_images_and_update_data(data)

    # Save the updated data to a new JSON file
    save_json_data(updated_data, UPDATED_JSON_FILE_PATH)

if __name__ == "__main__":
    main()
