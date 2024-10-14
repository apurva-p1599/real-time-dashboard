import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    NEWS_API_KEY = os.environ.get("NEWS_API_KEY")
