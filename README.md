# Stock Analysis Dashboard

![Dashboard Preview]() 

A full-stack financial analysis platform with React.js frontend and FastAPI backend that displays key stock ratios, provides stock screening functionality, and manages analyst reports.

## Features

### Frontend
- **Stock Ratio Analysis**
  - Balance sheet metrics
  - Income statement ratios
  - Cash flow indicators
  - Trend visualization
  - Comparison with industry averages

- **Stock Screener**
  - Filter by market cap, P/E ratio, sector, etc.
  - Sortable results table
  - Export functionality

- **Report Management**
  - Upload financial reports (Excel, PDF)
  - Download/export documents
  - Share reports with team members

### Backend
- **FastAPI** RESTful endpoints
- **Pydantic** type validation
- **JWT Authentication**
- **Financial Data Processing**
- **Report Storage Management**

## Technologies Used

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- FileSaver.js
- Axios (API calls)
- Vite (build tool)

### Backend
- Python 3.9+
- FastAPI
- Pydantic (data validation)
- SQLAlchemy (ORM)
- PostgreSQL (database)
- JWT (authentication)
- Redis (caching)

## System Architecture

```mermaid
graph TD
    A[React Frontend] -->|HTTP Requests| B(FastAPI Backend)
    B --> C[(PostgreSQL)]
    B --> D[(Redis Cache)]
    B --> E[External Financial APIs]