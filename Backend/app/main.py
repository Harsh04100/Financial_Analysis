from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routes import stocks, reports

app = FastAPI(title="Stock Analysis API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stocks.router, prefix="/api/stocks")
app.include_router(reports.router, prefix="/api/reports")

@app.get("/")
def health_check():
    return {"status": "healthy"}