import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, 
  TableRow, TablePagination, FormControl, InputLabel, 
  Select, MenuItem, Chip, Card, CardHeader, 
  CardContent, Grid, Autocomplete, LinearProgress,
  IconButton, Tooltip, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { saveAs } from 'file-saver';

const sectors = [
  'Technology',
  'Healthcare',
  'Financial',
  'Consumer Goods',
  'Energy',
  'Utilities'
];

const StockScreener = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    marketCap: '',
    peRatio: '',
    sector: '',
    dividendYield: ''
  });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveFilterOpen, setSaveFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Mock data fetch
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStocks = [
          { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', marketCap: '2.5T', peRatio: '28.5', dividendYield: '0.6%', price: '175.20', change: '+2.3%' },
          { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', marketCap: '2.1T', peRatio: '32.1', dividendYield: '0.8%', price: '310.45', change: '+1.5%' },
          { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: '450B', peRatio: '16.8', dividendYield: '2.9%', price: '165.30', change: '-0.5%' },
          { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Goods', marketCap: '380B', peRatio: '25.3', dividendYield: '2.5%', price: '145.75', change: '+0.8%' },
          { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', marketCap: '420B', peRatio: '11.2', dividendYield: '2.8%', price: '155.90', change: '-1.2%' },
        ];
        
        setStocks(mockStocks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchStocks();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setLoading(true);
    // Simulate filtered data
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Filters applied successfully');
      setSnackbarOpen(true);
    }, 800);
  };

  const clearFilters = () => {
    setFilters({
      marketCap: '',
      peRatio: '',
      sector: '',
      dividendYield: ''
    });
    setSnackbarMessage('Filters cleared');
    setSnackbarOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Data refreshed');
      setSnackbarOpen(true);
    }, 800);
  };

  const handleExport = () => {
    // Simulate export
    const csvContent = stocks.map(stock => 
      `${stock.symbol},${stock.name},${stock.sector},${stock.price}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'stock_screener_results.csv');
    
    setSnackbarMessage('Export started');
    setSnackbarOpen(true);
  };

  const handleSaveFilter = () => {
    if (filterName.trim()) {
      const savedFilters = JSON.parse(localStorage.getItem('savedFilters') || []);
      savedFilters.push({
        name: filterName,
        filters: filters,
        date: new Date().toISOString()
      });
      localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
      
      setSnackbarMessage(`Filter "${filterName}" saved`);
      setSnackbarOpen(true);
      setSaveFilterOpen(false);
      setFilterName('');
    }
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (filters.marketCap) params.append('marketCap', filters.marketCap);
    if (filters.peRatio) params.append('peRatio', filters.peRatio);
    if (filters.sector) params.append('sector', filters.sector);
    if (filters.dividendYield) params.append('dividendYield', filters.dividendYield);
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Stock Screener',
        text: 'Check out this stock screener configuration',
        url: url,
      }).catch(err => {
        setSnackbarMessage('Error sharing: ' + err.message);
        setSnackbarOpen(true);
      });
    } else {
      navigator.clipboard.writeText(url);
      setSnackbarMessage('Link copied to clipboard');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title="Stock Screener"
          subheader="Filter and discover stocks based on your criteria"
          avatar={<TrendingIcon color="primary" fontSize="large" />}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <LinearProgress variant={loading ? 'indeterminate' : 'determinate'} value={0} />
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterIcon sx={{ mr: 1 }} /> Filters
            </Typography>
            
            <Autocomplete
              options={sectors}
              value={filters.sector}
              onChange={(event, newValue) => setFilters({...filters, sector: newValue})}
              renderInput={(params) => (
                <TextField {...params} label="Sector" variant="outlined" fullWidth sx={{ mb: 2 }} />
              )}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Market Cap</InputLabel>
              <Select
                name="marketCap"
                value={filters.marketCap}
                label="Market Cap"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="large">Large ($10B)</MenuItem>
                <MenuItem value="mid">Mid ($2B-$10B)</MenuItem>
                <MenuItem value="small">Small ($2B)</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              name="peRatio"
              label="Max P/E Ratio"
              type="number"
              value={filters.peRatio}
              onChange={handleFilterChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              name="dividendYield"
              label="Min Dividend Yield"
              type="number"
              value={filters.dividendYield}
              onChange={handleFilterChange}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <span>%</span>,
              }}
            />
            
            <Button 
              variant="contained" 
              onClick={applyFilters}
              fullWidth
              sx={{ mb: 1 }}
              startIcon={<SearchIcon />}
              disabled={loading}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              fullWidth
              sx={{ mb: 1 }}
            >
              Clear Filters
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setSaveFilterOpen(true)}
              fullWidth
              startIcon={<SaveIcon />}
            >
              Save Filter
            </Button>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Results: {stocks.length} stocks found
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  disabled={loading || stocks.length === 0}
                >
                  Export
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="error">{error}</Typography>
                  <Button onClick={() => window.location.reload()} sx={{ mt: 1 }}>
                    Retry
                  </Button>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.light', '& th': { color: 'common.white' } }}>
                          <TableCell>Symbol</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Sector</TableCell>
                          <TableCell align="right">Market Cap</TableCell>
                          <TableCell align="right">P/E Ratio</TableCell>
                          <TableCell align="right">Div. Yield</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Change</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Chip 
                                label={stock.symbol} 
                                color="primary" 
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={stock.sector} 
                                size="small"
                                sx={{ 
                                  backgroundColor: 'primary.light', 
                                  color: 'common.white' 
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">{stock.marketCap}</TableCell>
                            <TableCell align="right">{stock.peRatio}</TableCell>
                            <TableCell align="right">{stock.dividendYield}</TableCell>
                            <TableCell align="right">${stock.price}</TableCell>
                            <TableCell align="right" sx={{ 
                              color: stock.change.startsWith('+') ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {stock.change}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={stocks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={saveFilterOpen} onClose={() => setSaveFilterOpen(false)}>
        <DialogTitle>Save Current Filter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Filter Name"
            fullWidth
            variant="standard"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveFilterOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StockScreener;