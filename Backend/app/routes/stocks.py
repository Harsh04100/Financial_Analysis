from fastapi import APIRouter, HTTPException
from app.models import StockRatios, StockSearchQuery, ScreenerFilters
from ..services import stock_service

router = APIRouter()

@router.get("/{symbol}", response_model=StockRatios)
async def get_stock_ratios(symbol: str):
    """Fetch ratios for a single stock"""
    try:
        return await stock_service.get_stock_data(symbol)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/search")
async def search_stocks(query: StockSearchQuery):
    """Search for stocks by symbol"""
    return await stock_service.search_stocks(query.symbol, query.include_ratios)

@router.post("/screener")
async def stock_screener(filters: ScreenerFilters):
    """Filter stocks based on criteria"""
    return await stock_service.screen_stocks(filters)