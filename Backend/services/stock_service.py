from app.models import StockRatios
from .alpha_vantage import get_alpha_vantage_data
from datetime import datetime

async def get_stock_data(symbol: str) -> StockRatios:
    """Get financial ratios from Alpha Vantage API"""
    data = await get_alpha_vantage_data(symbol)
    
    return StockRatios(
        symbol=symbol,
        name=data.get("company_name", ""),
        current_ratio=data.get("current_ratio"),
        debt_to_equity=data.get("debt_to_equity"),
        pe_ratio=data.get("pe_ratio"),
        dividend_yield=data.get("dividend_yield"),
        last_updated=datetime.now()
    )

async def search_stocks(symbol: str, include_ratios: bool):
    """Search stocks with optional ratio data"""
    if include_ratios:
        return await get_stock_data(symbol)
    return {"symbol": symbol, "message": "Search successful"}

async def screen_stocks(filters: dict):
    """Apply screening filters"""
    # Implementation would query database or external API
    return {"filters": filters, "results": []}