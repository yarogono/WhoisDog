import boto3
from settings import AWS_ID, AWS_SECRET

# 소스코드 작성자 => 임전혁

# AWS S3 기본 세팅
def s3_connection(self):
    s3 = boto3.client('s3',
                      aws_access_key_id=AWS_ID,
                      aws_secret_access_key=AWS_SECRET)
    return s3