import boto3
import json
import os
import re
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class PatternNotFoundException(Exception):
    pass


class ObjectWrapper:
    """Encapsulates S3 object actions. Code from
    https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_CopyObject_section.html"""

    def __init__(self, s3_object):
        """
        :param s3_object: A Boto3 Object resource. This is a high-level resource in Boto3
                          that wraps object actions in a class-like structure.
        """
        self.object = s3_object
        self.key = self.object.key

    def copy(self, dest_object):
        """
        Copies the object to another bucket.

        :param dest_object: The destination object initialized with a bucket and key.
                            This is a Boto3 Object resource.
        """
        try:
            dest_object.copy_from(
                CopySource={"Bucket": self.object.bucket_name, "Key": self.object.key}
            )
            dest_object.wait_until_exists()
            logger.info(
                "Copied object from %s:%s to %s:%s.",
                self.object.bucket_name,
                self.object.key,
                dest_object.bucket_name,
                dest_object.key,
            )
        except Exception as e:
            logger.exception(
                "Couldn't copy object from %s/%s to %s/%s.",
                self.object.bucket_name,
                self.object.key,
                dest_object.bucket_name,
                dest_object.key,
            )
            raise


def lambda_handler(event, context):
    try:
        # Create a Boto3 S3 resource
        s3_resource = boto3.resource('s3')

        # Get source bucket and key from event, destination bucket from env variables
        source_bucket = event['Records'][0]['s3']['bucket']['name']
        key = event['Records'][0]['s3']['object']['key']
        destination_bucket = os.environ['destination_bucket']

        # Instantiate the ObjectWrapper class with the S3 object
        s3_object = s3_resource.Object(source_bucket, key)
        object_wrapper = ObjectWrapper(s3_object)

        logger.info(f"Source Bucket: {source_bucket}, Key: {key}, Destination Bucket: {destination_bucket}")

        # Define a regular expression pattern to capture the substring starting with the last underscore (this will
        # contain .mp4 or .mov as well). We need to do this because the user's filename may contain underscores
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

        dest_s3_object = s3_resource.Object(destination_bucket, key)

        # Copy the S3 object to another bucket
        object_wrapper.copy(dest_s3_object)
        logger.info("File copied to the destination bucket successfully!")

        # Create json from video name, deposit json once video has been successfully uploaded
        metadata_file = {'videoId': extracted_string, 'srcVideo': key}
        logger.info(metadata_file)
        upload_byte_stream = bytes(json.dumps(metadata_file), 'utf-8')
        s3_resource.meta.client.put_object(Bucket=destination_bucket, Key=extracted_string + '.json',
                                           Body=upload_byte_stream)
        logger.info("Metadata added to destination bucket successfully!")
    except Exception as e:
        # Handle exceptions or errors
        logger.error(f"Error: {e}")
        raise
