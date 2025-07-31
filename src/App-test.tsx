import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 280,
            bgcolor: '#1a1a1a',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            height: '100vh',
            zIndex: 1000,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
              💰 Gestión Financiera
            </Typography>
          </Box>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ flex: 1, ml: '280px', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            ¡Hola! La aplicación está funcionando
          </Typography>
          <Typography variant="body1">
            Si ves este mensaje, el sidebar está trabajando correctamente.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
