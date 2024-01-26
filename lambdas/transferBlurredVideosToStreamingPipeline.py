import boto3
import botocore
import json
import os
import re
import logging

class PatternNotFoundException(Exception):
    pass

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.resource('s3')

def lambda_handler(event, context):
    logger.info("New files uploaded to the source bucket.")

    key = event['Records'][0]['s3']['object']['key']

    source_bucket = event['Records'][0]['s3']['bucket']['name']
    destination_bucket = os.environ['destination_bucket']

    source = {'Bucket': source_bucket, 'Key': key}

    print(f"Source Bucket: {source_bucket}, Key: {key}, Destination Bucket: {destination_bucket}")

    # Define a regular expression pattern to capture the substring starting with the last underscore (this will contain .mp4 or .mov as well)
    # We need to do this because the user's filename may contain underscores
    pattern = r'_([^_]+)$'

    # Use re.search to find the match in the filename
    match = re.search(pattern, key)

    # Check if a match is found, and extract the desired string
    if match:
        # Remove the file extension (.mp4 or .mov) if a match was found and treat that as the extracted_string
        extracted_string = match.group(1)[:-4]
        logger.info(extracted_string)
    else:
        raise PatternNotFoundException("Pattern not found in the filename.")

    try:
        response = s3.meta.client.copy(source, destination_bucket, key)
        logger.info("File copied to the destination bucket successfully!")

        # Create json from video name, deposit json once video has been successfully uploaded
        metadata_file = {'videoId': extracted_string, 'srcVideo': key}
        logger.info(metadata_file)
        upload_byte_stream = bytes(json.dumps(metadata_file), 'utf-8')
        s3.meta.client.put_object(Bucket=destination_bucket, Key=extracted_string + '.json', Body=upload_byte_stream)
        logger.info("Metadata added to destination bucket successfully!")
    except botocore.exceptions.ClientError as error:
        logger.error("There was an error copying the file to the destination bucket")
        print('Error Message: {}'.format(error))

    except botocore.exceptions.ParamValidationError as error:
        logger.error("Missing required parameters while calling the API.")
        print('Error Message: {}'.format(error))
