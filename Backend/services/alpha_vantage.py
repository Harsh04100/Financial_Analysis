import os
import requests
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"

async def get_alpha_vantage_data(symbol: str):
    """Fetch data from Alpha Vantage API"""
    params = {
        "function": "OVERVIEW",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    
    if "Error Message" in data:
        raise ValueError(data["Error Message"])
    
    return {
        "company_name": data.get("Name"),
        "current_ratio": float(data.get("CurrentRatio", 0)),
        "debt_to_equity": float(data.get("DebtToEquity", 0)),
        "pe_ratio": float(data.get("PERatio", 0)),
        "dividend_yield": float(data.get("DividendYield", 0))
    }