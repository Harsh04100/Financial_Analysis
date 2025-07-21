import React, { useState, useEffect } from 'react';
import { 
  Tabs, Tab, Box, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Card, CardHeader, Avatar, LinearProgress, Divider,
  Button, IconButton, Tooltip, Snackbar, Alert,
  CircularProgress
} from '@mui/material';
import { 
  AccountBalance as BalanceIcon, 
  TrendingUp as IncomeIcon, 
  MonetizationOn as CashFlowIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';

const StockRatiosDashboard = ({ stockCode = 'AAPL' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  // Mock data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
          balanceSheet: [
            { metric: 'Current Ratio', value: '2.5', industryAvg: '1.8', trend: 'up' },
            { metric: 'Debt-to-Equity', value: '0.45', industryAvg: '0.60', trend: 'down' },
            { metric: 'Quick Ratio', value: '1.8', industryAvg: '1.2', trend: 'up' },
          ],
          incomeStatement: [
            { metric: 'Gross Margin', value: '42%', industryAvg: '38%', trend: 'up' },
            { metric: 'Operating Margin', value: '28%', industryAvg: '22%', trend: 'up' },
            { metric: 'Net Profit Margin', value: '18%', industryAvg: '15%', trend: 'up' },
          ],
          cashFlow: [
            { metric: 'Operating Cash Flow', value: '1.2B', industryAvg: '900M', trend: 'up' },
            { metric: 'Free Cash Flow', value: '850M', industryAvg: '600M', trend: 'up' },
            { metric: 'Cash Conversion Cycle', value: '45 days', industryAvg: '60 days', trend: 'down' },
          ],
          companyInfo: {
            name: `${stockCode} Company`,
            sector: 'Technology',
            lastUpdated: new Date().toISOString()
          }
        };
        
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Check if stock is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(bookmarks.includes(stockCode));
  }, [stockCode]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // In a real app, this would re-fetch data
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Data refreshed successfully');
      setSnackbarOpen(true);
    }, 800);
  };

  const handleDownload = () => {
    // Simulate download
    setSnackbarMessage('Download started for ' + stockCode);
    setSnackbarOpen(true);
    // In a real app, this would trigger a file download
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${stockCode} Financial Ratios`,
        text: `Check out the financial ratios for ${stockCode}`,
        url: window.location.href,
      }).catch(err => {
        setSnackbarMessage('Error sharing: ' + err.message);
        setSnackbarOpen(true);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('Link copied to clipboard');
      setSnackbarOpen(true);
    }
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const newBookmarked = !bookmarked;
    
    if (newBookmarked) {
      if (!bookmarks.includes(stockCode)) {
        bookmarks.push(stockCode);
      }
    } else {
      const index = bookmarks.indexOf(stockCode);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    setBookmarked(newBookmarked);
    setSnackbarMessage(newBookmarked ? 'Added to bookmarks' : 'Removed from bookmarks');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Error loading data</Typography>
        <Typography>{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {stockCode.charAt(0)}
            </Avatar>
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ mr: 2 }}>{stockCode}</Typography>
              <Tooltip title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                <IconButton onClick={toggleBookmark}>
                  {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          }
          subheader={`${data.companyInfo.name} • ${data.companyInfo.sector}`}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Refresh data">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download report">
                <IconButton onClick={handleDownload}>
                  <DownloadIcon />
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

      <Paper elevation={2} sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              backgroundColor: 'primary.main',
            }
          }}
        >
          <Tab icon={<BalanceIcon />} label="Balance Sheet" />
          <Tab icon={<IncomeIcon />} label="Income Statement" />
          <Tab icon={<CashFlowIcon />} label="Cash Flow" />
        </Tabs>
        
        <Divider sx={{ my: 1 }} />
        
        <TabPanel value={activeTab} index={0}>
          <RatioTable data={data.balanceSheet} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <RatioTable data={data.incomeStatement} />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <RatioTable data={data.cashFlow} />
        </TabPanel>
      </Paper>

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

const TrendIcon = ({ trend }) => {
  const color = trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'warning.main';
  const icon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  
  return (
    <Box sx={{ 
      color,
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
  );
};

const MetricCard = ({ title, value, trend, color }) => (
  <Card sx={{ flex: 1, boxShadow: 2 }}>
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="h5" sx={{ color, mr: 1 }}>{value}</Typography>
        <TrendIcon trend={trend} />
      </Box>
    </Box>
  </Card>
);

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const RatioTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
       <TableHead>
          <TableRow sx={{ 
            backgroundColor: 'primary.light',
            '& th': { 
              color: 'common.white', 
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }
          }}>
            <TableCell>Financial Metric</TableCell>
            <TableCell align="right">Company Value</TableCell>
            <TableCell align="right">Industry Average</TableCell>
            <TableCell align="right">Trend</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontWeight: 'medium' }}>{row.metric}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row.value}</TableCell>
              <TableCell align="right">{row.industryAvg}</TableCell>
              <TableCell align="right">
                <TrendIcon trend={row.trend} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


export default StockRatiosDashboard;