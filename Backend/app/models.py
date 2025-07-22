from datetime import datetime
from pydantic import BaseModel

class StockBase(BaseModel):
    symbol: str
    name: str

class StockRatios(StockBase):
    current_ratio: float | None
    debt_to_equity: float | None
    pe_ratio: float | None
    dividend_yield: float | None
    last_updated: datetime

class StockSearchQuery(BaseModel):
    symbol: str
    include_ratios: bool = True

class ScreenerFilters(BaseModel):
    min_pe: float | None = None
    max_pe: float | None = None
    sector: str | None = None
    min_dividend: float | None = None