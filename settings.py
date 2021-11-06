from os import getenv
from dotenv import load_dotenv

# 소스코드 작성자 => 임전혁

load_dotenv()

DB_URL = getenv("DB_URL")
FLASK_SECRET = getenv("FLASK_SECRET")
SECRET_KEY = getenv("SECRET_KEY")

AWS_ID = getenv("AWS_ID")
AWS_SECRET = getenv("AWS_SECRET")
BUCKET_NAME = getenv("BUCKET_NAME")