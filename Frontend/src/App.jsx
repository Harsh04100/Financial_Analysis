import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box, 
  Typography, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
  Stack,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  Assessment as AnalysisIcon,
  Search as ScreenerIcon,
  CloudUpload as ReportsIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import StockRatiosDashboard from './StockRatiosDashboard';
import StockScreener from './StockScreener';
import FileUploadDownload from './FileUploadDownload';
import { useMemo } from 'react';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#9c27b0',
          },
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
          h4: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppLayout() {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/ratios/AAPL', label: 'Stock Analysis', icon: <AnalysisIcon /> },
    { path: '/screener', label: 'Stock Screener', icon: <ScreenerIcon /> },
    { path: '/reports', label: 'Analyst Reports', icon: <ReportsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            <Box component="span" sx={{ color: 'primary.main' }}>Fin-Tastic</Box>
          </Typography>
          
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
                    backgroundColor: location.pathname === item.path ? 'primary.dark' : 'transparent',
                    '&:hover': {
                      backgroundColor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}
          
          <Button 
            color="inherit" 
            startIcon={<AccountIcon />}
            sx={{ ml: 'auto' }}
          >
            Account
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="xl" 
        component="main" 
        sx={{ 
          flex: 1, 
          py: 4,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            flex: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default'
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ratios/:stockCode" element={<StockRatiosDashboard />} />
            <Route path="/screener" element={<StockScreener />} />
            <Route path="/reports" element={<FileUploadDownload />} />
          </Routes>
        </Paper>
      </Container>
      
      {isMobile && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  minWidth: 'auto',
                  p: 2,
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  {item.icon}
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {item.label}
                  </Typography>
                </Stack>
              </Button>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

function HomePage() {
  return (
    <Box sx={{ 
      textAlign: 'center', 
      my: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 700,
          mb: 3,
          background: 'linear-gradient(45deg, #1976d2 30%, #2196F3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Welcome to Fin-Tastic
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mb: 4 }}>
        Your comprehensive financial analysis platform for stock research, screening, and reporting
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          component={Link} 
          to="/ratios/AAPL"
          startIcon={<AnalysisIcon />}
        >
          Analyze Stocks
        </Button>
        <Button 
          variant="outlined" 
          size="large" 
          component={Link} 
          to="/screener"
          startIcon={<ScreenerIcon />}
        >
          Explore Screener
        </Button>
      </Box>
    </Box>
  );
}

export default App;