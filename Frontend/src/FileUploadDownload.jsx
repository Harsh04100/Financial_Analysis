import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  CircularProgress,
  Alert, 
  IconButton,
  Card, 
  CardHeader, 
  CardContent, 
  Avatar,
  LinearProgress, 
  Badge, 
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions, 
  TextField,
  Paper,
  Tooltip,
  Snackbar,
  styled
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Download as DownloadIcon, 
  Description as DescriptionIcon, 
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { saveAs } from 'file-saver';


const StyledUploadBox = styled('div')(({ theme }) => ({
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.action.hover,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transform: 'translateY(-2px)'
  },
}));

const FileUploadDownload = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'Q2_2023_AAPL_Analysis.xlsx', date: '2023-07-15', size: '2.4 MB', status: 'completed' },
    { id: 2, name: 'Competitor_Analysis_Q2.xlsx', date: '2023-07-10', size: '3.1 MB', status: 'completed' },
    { id: 3, name: 'Market_Trends_2023.pdf', date: '2023-06-28', size: '5.2 MB', status: 'completed' },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      uploadFiles(selectedFiles);
    }
  };
  
  const uploadFiles = (filesToUpload) => {
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadProgress(0);
    setError(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          
          // Add the uploaded files
          const newFiles = Array.from(filesToUpload).map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            date: new Date().toISOString().split('T')[0],
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: 'completed'
          }));
          
          setFiles(prev => [...newFiles, ...prev]);
          setSnackbarMessage(`${filesToUpload.length} file(s) uploaded successfully`);
          setSnackbarOpen(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const handleDownload = (file) => {
    // Create and download a sample file
    const content = `This is a sample file content for ${file.name}\n\n` +
                    `File name: ${file.name}\n` +
                    `Upload date: ${file.date}\n` +
                    `Size: ${file.size}`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, file.name);
    
    setSnackbarMessage(`Downloading ${file.name}`);
    setSnackbarOpen(true);
  };
  
  const confirmDelete = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    setFiles(prev => prev.filter(file => file.id !== fileToDelete.id));
    setDeleteDialogOpen(false);
    setSnackbarMessage(`${fileToDelete.name} was deleted`);
    setSnackbarOpen(true);
    setFileToDelete(null);
  };

  const handleShare = (file) => {
    if (navigator.share) {
      navigator.share({
        title: file.name,
        text: 'Check out this financial report',
        url: `https://example.com/files/${file.id}`,
      }).catch(err => {
        setSnackbarMessage('Error sharing: ' + err.message);
        setSnackbarOpen(true);
      });
    } else {
      navigator.clipboard.writeText(`https://example.com/files/${file.id}`);
      setSnackbarMessage('Link copied to clipboard');
      setSnackbarOpen(true);
    }
  };

  const handleRefresh = () => {
    // In a real app, this would refresh the file list from the server
    setSnackbarMessage('File list refreshed');
    setSnackbarOpen(true);
  };

  const handleExportAll = () => {
    // Create a ZIP file with all files (simulated)
    setSnackbarMessage('Preparing ZIP archive...');
    setSnackbarOpen(true);
    
    setTimeout(() => {
      const content = files.map(file => 
        `${file.name}\nUploaded: ${file.date}\nSize: ${file.size}\n\n`
      ).join('---\n');
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'all_reports_export.txt');
      
      setSnackbarMessage('ZIP file downloaded');
      setSnackbarOpen(true);
    }, 1500);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Card sx={{ boxShadow: 3, mb: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <FolderIcon />
            </Avatar>
          }
          title="Analyst Reports Manager"
          subheader="Upload, manage and download your financial analysis reports"
          action={
            <Tooltip title="Refresh file list">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }
        />
        <LinearProgress variant="determinate" value={0} />
      </Card>

      <Card elevation={3} sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CloudUploadIcon sx={{ mr: 1 }} /> Upload New Reports
        </Typography>
        
        <input
          accept=".xlsx,.xls,.csv,.pdf,.docx,.txt"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <label htmlFor="file-upload">
          <StyledUploadBox>
            <Badge
              badgeContent={<CheckCircleIcon color="success" fontSize="small" />}
              invisible={!uploadSuccess}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <UploadIcon fontSize="large" color="primary" sx={{ fontSize: 48 }} />
            </Badge>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              {isUploading ? 'Uploading...' : uploadSuccess ? 'Upload Complete!' : 'Drag & Drop Files Here'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supports Excel, PDF, Word and Text documents (Max 50MB each)
            </Typography>
            {isUploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" display="block" textAlign="center">
                  {uploadProgress}% Complete
                </Typography>
              </Box>
            )}
          </StyledUploadBox>
        </label>
        
        {uploadSuccess && (
          <Alert 
            severity="success" 
            sx={{ mb: 2 }} 
            onClose={() => setUploadSuccess(false)}
            icon={<CheckCircleIcon fontSize="inherit" />}
          >
            Files uploaded successfully! They are now available in your reports.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
      </Card>

      <Card elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            My Reports ({files.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={handleExportAll}
            disabled={files.length === 0}
          >
            Export All as ZIP
          </Button>
        </Box>
        
        {files.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            p: 4, 
            backgroundColor: 'action.hover',
            borderRadius: 1
          }}>
            <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              No reports available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your first report to get started
            </Typography>
          </Box>
        ) : (
          <List sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            {files.map((file, index) => (
              <React.Fragment key={file.id}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Share">
                        <IconButton 
                          edge="end" 
                          onClick={() => handleShare(file)}
                          sx={{ mr: 1 }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDownload(file)}
                          sx={{ mr: 1 }}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          edge="end" 
                          onClick={() => confirmDelete(file)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <DescriptionIcon color={file.status === 'completed' ? 'primary' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {file.name}
                      </Typography>
                    }
                    secondary={`Uploaded: ${file.date} | Size: ${file.size}`}
                  />
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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

export default FileUploadDownload;