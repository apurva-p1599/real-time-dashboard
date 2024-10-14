import requests
from datetime import datetime, timedelta
from config import Config


# Function to fetch general news
def fetch_general_news():
    url = "https://newsapi.org/v2/general-news"
    params = {
        "country": "us",
        "category": "general",
        "pageSize": 5,
        "apiKey": Config.NEWS_API_KEY,
    }
    response = requests.get(url, params=params)
    return (
        response.json()
        if response.status_code == 200
        else {"error": f"Failed to fetch news: {response.status_code}"}
    )


# Function to fetch real-time disaster-related news
def fetch_real_time_data():
    five_days_before = datetime.now() - timedelta(days=5)
    from_date = five_days_before.strftime("%Y-%m-%d")

    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "earthquake OR flood OR hurricane OR wildfire",
        "apiKey": Config.NEWS_API_KEY,
        "from": from_date,
        "language": "en",
    }
    response = requests.get(url, params=params)
    return response.json()


# Function to fetch top headlines
def fetch_top_headlines():
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "country": "us",
        "apiKey": Config.NEWS_API_KEY,
    }
    response = requests.get(url, params=params)
    return (
        response.json()
        if response.status_code == 200
        else {"error": f"Failed to fetch news: {response.status_code}"}
    )
