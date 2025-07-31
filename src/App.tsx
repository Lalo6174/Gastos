import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box, Paper, Button, TextField, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, IconButton, Tabs, Tab } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';


type Gasto = {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  esFuturo: boolean;
  tarjeta?: string;
  categoria?: string;
  cuotas?: number;
  cuotaNro?: number;
};

const tarjetas = ['Visa', 'Mastercard', 'Amex'];
const categoriasBase = ['Comida', 'Servicios', 'Ocio', 'Transporte', 'Salud', 'Otros'];

function AppContent() {
  console.log('AppContent montado');
  
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [esFuturo, setEsFuturo] = useState(false);
  const [tarjeta, setTarjeta] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<string[]>(categoriasBase);
  const [tab, setTab] = useState(0);
  const [editandoId, setEditandoId] = useState<number|null>(null);

  const handleAgregar = () => {
    if (!descripcion || !monto || !fecha) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    if (editandoId) {
      setGastos(gastos.map(g => g.id === editandoId ? {
        ...g, descripcion, monto: parseFloat(monto), fecha, esFuturo,
        tarjeta: esFuturo && tarjeta ? tarjeta : undefined,
        categoria: categoria || undefined
      } : g));
      alert('Gasto editado');
    } else {
      setGastos([...gastos, {
        id: Date.now(), descripcion, monto: parseFloat(monto), fecha, esFuturo,
        tarjeta: esFuturo && tarjeta ? tarjeta : undefined,
        categoria: categoria || undefined
      }]);
      alert('Gasto agregado');
    }
    setDescripcion(''); setMonto(''); setFecha(''); setEsFuturo(false); setTarjeta(''); setCategoria(''); setEditandoId(null);
  };

  const handleEliminar = (id:number) => {
    setGastos(gastos.filter(g => g.id !== id));
    alert('Gasto eliminado');
  };

  const handleEditar = (g:Gasto) => {
    setDescripcion(g.descripcion); setMonto(g.monto.toString()); setFecha(g.fecha);
    setEsFuturo(g.esFuturo); setTarjeta(g.tarjeta || ''); setCategoria(g.categoria || ''); setEditandoId(g.id);
  };

  const totalActual = gastos.filter(g => !g.esFuturo).reduce((a, b) => a + b.monto, 0);
  const totalFuturo = gastos.filter(g => g.esFuturo).reduce((a, b) => a + b.monto, 0);

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#222', fontWeight: 700 }}>
        Gestión de Gastos
      </Typography>
      
      <Box mb={2}>
        <Tabs value={tab} onChange={(_,v)=>setTab(v)} centered>
          <Tab label="Resumen" />
          <Tab label="Gastos actuales" />
          <Tab label="Gastos futuros" />
          <Tab label={editandoId ? 'Editar gasto' : 'Nuevo gasto'} />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Paper sx={{p:3, mb:3, bgcolor: '#fff', color: '#222'}}>
          <Typography variant="h6" gutterBottom>Resumen</Typography>
          <Typography>Total Actual: ${totalActual.toFixed(2)}</Typography>
          <Typography>Total Futuro: ${totalFuturo.toFixed(2)}</Typography>
          <Typography>Total General: ${(totalActual + totalFuturo).toFixed(2)}</Typography>
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6">Gastos actuales</Typography>
          <List>
            {gastos.filter(g => !g.esFuturo).length === 0 && (
              <ListItem><ListItemText primary="No hay gastos actuales." /></ListItem>
            )}
            {gastos.filter(g => !g.esFuturo).map(g => (
              <ListItem key={g.id} divider>
                <ListItemText primary={g.descripcion} secondary={`$${g.monto.toFixed(2)} — ${g.fecha}`} />
                <IconButton onClick={()=>{setTab(3); handleEditar(g);}}><Edit /></IconButton>
                <IconButton onClick={()=>handleEliminar(g.id)}><Delete /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6">Gastos futuros</Typography>
          <List>
            {gastos.filter(g => g.esFuturo).length === 0 && (
              <ListItem><ListItemText primary="No hay gastos futuros." /></ListItem>
            )}
            {gastos.filter(g => g.esFuturo).map(g => (
              <ListItem key={g.id} divider>
                <ListItemText primary={g.descripcion} secondary={`$${g.monto.toFixed(2)} — ${g.fecha}${g.tarjeta ? ` — ${g.tarjeta}` : ''}`} />
                <IconButton onClick={()=>{setTab(3); handleEditar(g);}}><Edit /></IconButton>
                <IconButton onClick={()=>handleEliminar(g.id)}><Delete /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {tab === 3 && (
        <Paper sx={{ p: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6" gutterBottom>
            {editandoId ? 'Editar gasto' : 'Nuevo Gasto'}
          </Typography>
          <TextField fullWidth label="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>¿Es futuro?</InputLabel>
            <Select value={esFuturo ? 'sí' : 'no'} label="¿Es futuro?" onChange={e => setEsFuturo(e.target.value === 'sí')}>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="sí">Sí</MenuItem>
            </Select>
          </FormControl>
          {esFuturo && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tarjeta (opcional)</InputLabel>
              <Select value={tarjeta} label="Tarjeta (opcional)" onChange={e => setTarjeta(e.target.value)}>
                <MenuItem value="">Sin tarjeta</MenuItem>
                {tarjetas.map(t => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
              </Select>
            </FormControl>
          )}
          <TextField fullWidth label="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" color="primary" fullWidth onClick={handleAgregar} sx={{mb:1}}>
            {editandoId ? 'Guardar cambios' : 'Agregar Gasto'}
          </Button>
          {editandoId && (
            <Button variant="outlined" color="secondary" fullWidth onClick={()=>{setEditandoId(null); setDescripcion(''); setMonto(''); setFecha(''); setEsFuturo(false); setTarjeta(''); setCategoria(''); setTab(0);}}>
              Cancelar edición
            </Button>
          )}
        </Paper>
      )}
    </Container>
  );
}


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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
