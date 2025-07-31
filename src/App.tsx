import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box, Paper, Button, TextField, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, IconButton, Tabs, Tab, Card, CardContent } from '@mui/material';
import { Edit, Delete, Add, TrendingUp, TrendingDown, AccountBalanceWallet } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';

type TipoTransaccion = 'gasto' | 'ingreso';

type Transaccion = {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  tipo: TipoTransaccion;
  esFuturo: boolean;
  tarjeta?: string;
  categoria?: string;
  cuotas?: number;
  cuotaNro?: number;
};

const tarjetas = ['Visa', 'Mastercard', 'Amex'];
const categoriasBase = ['Comida', 'Servicios', 'Ocio', 'Transporte', 'Salud', 'Salario', 'Freelance', 'Otros'];

function AppContent() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState<TipoTransaccion>('gasto');
  const [esFuturo, setEsFuturo] = useState(false);
  const [tarjeta, setTarjeta] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tab, setTab] = useState(0);
  const [editandoId, setEditandoId] = useState<number|null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categorias, setCategorias] = useState<string[]>(categoriasBase);
  const [tarjetasPersonalizadas, setTarjetasPersonalizadas] = useState<string[]>(tarjetas);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('transacciones-gastos');
    if (datosGuardados) {
      try {
        const transaccionesCargadas = JSON.parse(datosGuardados);
        setTransacciones(transaccionesCargadas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando cambian las transacciones
  useEffect(() => {
    if (transacciones.length > 0) {
      localStorage.setItem('transacciones-gastos', JSON.stringify(transacciones));
    }
  }, [transacciones]);

  const handleAgregar = () => {
    if (!descripcion || !monto || !fecha) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    if (editandoId) {
      setTransacciones(transacciones.map(t => t.id === editandoId ? {
        ...t, descripcion, monto: parseFloat(monto), fecha, tipo, esFuturo,
        tarjeta: esFuturo && tarjeta ? tarjeta : undefined,
        categoria: categoria || undefined
      } : t));
      alert(`${tipo === 'gasto' ? 'Gasto' : 'Ingreso'} editado`);
    } else {
      setTransacciones([...transacciones, {
        id: Date.now(), descripcion, monto: parseFloat(monto), fecha, tipo, esFuturo,
        tarjeta: esFuturo && tarjeta ? tarjeta : undefined,
        categoria: categoria || undefined
      }]);
      alert(`${tipo === 'gasto' ? 'Gasto' : 'Ingreso'} agregado`);
    }
    limpiarFormulario();
    setDialogOpen(false);
  };

  const limpiarFormulario = () => {
    setDescripcion(''); 
    setMonto(''); 
    setFecha(''); 
    setTipo('gasto'); 
    setEsFuturo(false); 
    setTarjeta(''); 
    setCategoria(''); 
    setEditandoId(null);
  };

  const abrirDialogoNuevo = (tipoTransaccion: TipoTransaccion) => {
    limpiarFormulario();
    setTipo(tipoTransaccion);
    setDialogOpen(true);
  };

  const handleEliminar = (id:number) => {
    setTransacciones(transacciones.filter(t => t.id !== id));
    alert('Transacción eliminada');
  };

  const handleEditar = (t:Transaccion) => {
    setDescripcion(t.descripcion); 
    setMonto(t.monto.toString()); 
    setFecha(t.fecha);
    setTipo(t.tipo); 
    setEsFuturo(t.esFuturo); 
    setTarjeta(t.tarjeta || ''); 
    setCategoria(t.categoria || ''); 
    setEditandoId(t.id);
    setDialogOpen(true);
  };

  // Cálculos mejorados
  const gastosActuales = transacciones.filter(t => t.tipo === 'gasto' && !t.esFuturo).reduce((a, b) => a + b.monto, 0);
  const gastosFuturos = transacciones.filter(t => t.tipo === 'gasto' && t.esFuturo).reduce((a, b) => a + b.monto, 0);
  const ingresosActuales = transacciones.filter(t => t.tipo === 'ingreso' && !t.esFuturo).reduce((a, b) => a + b.monto, 0);
  const ingresosFuturos = transacciones.filter(t => t.tipo === 'ingreso' && t.esFuturo).reduce((a, b) => a + b.monto, 0);
  const balanceActual = ingresosActuales - gastosActuales;
  const balanceFuturo = ingresosFuturos - gastosFuturos;
  const balanceTotal = balanceActual + balanceFuturo;

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#222', fontWeight: 700 }}>
        💰 Gestión Financiera
      </Typography>
      
      <Box mb={2}>
        <Tabs value={tab} onChange={(_,v)=>setTab(v)} centered>
          <Tab label="📊 Dashboard" />
          <Tab label="💸 Gastos" />
          <Tab label="💰 Ingresos" />
          <Tab label="🔮 Futuros" />
          <Tab label="⚙️ Configuración" />
        </Tabs>
      </Box>

      {/* Dashboard Principal */}
      {tab === 0 && (
        <>
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#e8f5e8', color: '#2e7d32' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Ingresos</Typography>
                </Box>
                <Typography variant="h4">${ingresosActuales.toFixed(2)}</Typography>
                <Typography variant="caption">Actuales</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#ffebee', color: '#d32f2f' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingDown sx={{ mr: 1 }} />
                  <Typography variant="h6">Gastos</Typography>
                </Box>
                <Typography variant="h4">${gastosActuales.toFixed(2)}</Typography>
                <Typography variant="caption">Actuales</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 200, bgcolor: balanceActual >= 0 ? '#e3f2fd' : '#ffebee', color: balanceActual >= 0 ? '#1976d2' : '#d32f2f' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountBalanceWallet sx={{ mr: 1 }} />
                  <Typography variant="h6">Balance</Typography>
                </Box>
                <Typography variant="h4">${balanceActual.toFixed(2)}</Typography>
                <Typography variant="caption">Actual</Typography>
              </CardContent>
            </Card>
          </Box>

          <Paper sx={{p:3, mb:3, bgcolor: '#fff', color: '#222'}}>
            <Typography variant="h6" gutterBottom>📋 Resumen Detallado</Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Box flex={1} minWidth={200}>
                <Typography><strong>Ingresos actuales:</strong> ${ingresosActuales.toFixed(2)}</Typography>
                <Typography><strong>Gastos actuales:</strong> ${gastosActuales.toFixed(2)}</Typography>
                <Typography><strong>Balance actual:</strong> ${balanceActual.toFixed(2)}</Typography>
              </Box>
              <Box flex={1} minWidth={200}>
                <Typography><strong>Ingresos futuros:</strong> ${ingresosFuturos.toFixed(2)}</Typography>
                <Typography><strong>Gastos futuros:</strong> ${gastosFuturos.toFixed(2)}</Typography>
                <Typography><strong>Balance futuro:</strong> ${balanceFuturo.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Paper>

          <Box display="flex" gap={2}>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<Add />} 
              onClick={() => abrirDialogoNuevo('ingreso')}
            >
              Agregar Ingreso
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<Add />} 
              onClick={() => abrirDialogoNuevo('gasto')}
            >
              Agregar Gasto
            </Button>
          </Box>
        </>
      )}

      {/* Tab de Gastos */}
      {tab === 1 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6">💸 Gastos actuales</Typography>
          <List>
            {transacciones.filter(t => t.tipo === 'gasto' && !t.esFuturo).length === 0 && (
              <ListItem><ListItemText primary="No hay gastos actuales." /></ListItem>
            )}
            {transacciones.filter(t => t.tipo === 'gasto' && !t.esFuturo).map(t => (
              <ListItem key={t.id} divider>
                <ListItemText 
                  primary={`💸 ${t.descripcion}`} 
                  secondary={`$${t.monto.toFixed(2)} — ${t.fecha}${t.categoria ? ` — ${t.categoria}` : ''}`} 
                />
                <IconButton onClick={()=>handleEditar(t)}><Edit /></IconButton>
                <IconButton onClick={()=>handleEliminar(t.id)}><Delete /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Tab de Ingresos */}
      {tab === 2 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6">💰 Ingresos actuales</Typography>
          <List>
            {transacciones.filter(t => t.tipo === 'ingreso' && !t.esFuturo).length === 0 && (
              <ListItem><ListItemText primary="No hay ingresos actuales." /></ListItem>
            )}
            {transacciones.filter(t => t.tipo === 'ingreso' && !t.esFuturo).map(t => (
              <ListItem key={t.id} divider>
                <ListItemText 
                  primary={`💰 ${t.descripcion}`} 
                  secondary={`$${t.monto.toFixed(2)} — ${t.fecha}${t.categoria ? ` — ${t.categoria}` : ''}`} 
                />
                <IconButton onClick={()=>handleEditar(t)}><Edit /></IconButton>
                <IconButton onClick={()=>handleEliminar(t.id)}><Delete /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Tab de Futuros */}
      {tab === 3 && (
        <Paper sx={{ p: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6">🔮 Transacciones futuras</Typography>
          <List>
            {transacciones.filter(t => t.esFuturo).length === 0 && (
              <ListItem><ListItemText primary="No hay transacciones futuras." /></ListItem>
            )}
            {transacciones.filter(t => t.esFuturo).map(t => (
              <ListItem key={t.id} divider>
                <ListItemText 
                  primary={`${t.tipo === 'gasto' ? '💸' : '💰'} ${t.descripcion}`} 
                  secondary={`$${t.monto.toFixed(2)} — ${t.fecha}${t.tarjeta ? ` — ${t.tarjeta}` : ''}${t.categoria ? ` — ${t.categoria}` : ''}`} 
                />
                <IconButton onClick={()=>handleEditar(t)}><Edit /></IconButton>
                <IconButton onClick={()=>handleEliminar(t.id)}><Delete /></IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Tab de Configuración */}
      {tab === 4 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff', color: '#222' }}>
            <Typography variant="h6" gutterBottom>🏷️ Gestión de Categorías</Typography>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                label="Nueva categoría"
                placeholder="Ej: Educación, Entretenimiento..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const nuevaCategoria = input.value.trim();
                    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
                      setCategorias([...categorias, nuevaCategoria]);
                      input.value = '';
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  const nuevaCategoria = input?.value.trim();
                  if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
                    setCategorias([...categorias, nuevaCategoria]);
                    input.value = '';
                  }
                }}
              >
                Agregar
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {categorias.map((cat) => (
                <Box key={cat} display="flex" alignItems="center" sx={{ 
                  bgcolor: '#f0f0f0', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 1,
                  border: categoriasBase.includes(cat) ? '2px solid #1976d2' : '1px solid #ccc'
                }}>
                  <Typography variant="body2">{cat}</Typography>
                  {!categoriasBase.includes(cat) && (
                    <IconButton
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setCategorias(categorias.filter(c => c !== cat));
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              💡 Las categorías con borde azul son predeterminadas y no se pueden eliminar
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff', color: '#222' }}>
            <Typography variant="h6" gutterBottom>💳 Gestión de Tarjetas</Typography>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                label="Nueva tarjeta"
                placeholder="Ej: Naranja X, Banco Nación..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const nuevaTarjeta = input.value.trim();
                    if (nuevaTarjeta && !tarjetasPersonalizadas.includes(nuevaTarjeta)) {
                      setTarjetasPersonalizadas([...tarjetasPersonalizadas, nuevaTarjeta]);
                      input.value = '';
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  const nuevaTarjeta = input?.value.trim();
                  if (nuevaTarjeta && !tarjetasPersonalizadas.includes(nuevaTarjeta)) {
                    setTarjetasPersonalizadas([...tarjetasPersonalizadas, nuevaTarjeta]);
                    input.value = '';
                  }
                }}
              >
                Agregar
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tarjetasPersonalizadas.map((tarj) => (
                <Box key={tarj} display="flex" alignItems="center" sx={{ 
                  bgcolor: '#f0f0f0', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 1,
                  border: tarjetas.includes(tarj) ? '2px solid #1976d2' : '1px solid #ccc'
                }}>
                  <Typography variant="body2">{tarj}</Typography>
                  {!tarjetas.includes(tarj) && (
                    <IconButton
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        setTarjetasPersonalizadas(tarjetasPersonalizadas.filter(t => t !== tarj));
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              💡 Las tarjetas con borde azul son predeterminadas y no se pueden eliminar
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: '#fff', color: '#222' }}>
            <Typography variant="h6" gutterBottom>🗂️ Datos de la aplicación</Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  const confirmacion = confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.');
                  if (confirmacion) {
                    setTransacciones([]);
                    localStorage.removeItem('transacciones-gastos');
                    alert('Todos los datos han sido eliminados');
                  }
                }}
              >
                🗑️ Borrar todos los datos
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const data = {
                    transacciones,
                    categorias,
                    tarjetas: tarjetasPersonalizadas
                  };
                  const dataStr = JSON.stringify(data, null, 2);
                  const dataBlob = new Blob([dataStr], {type: 'application/json'});
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'gastos-backup.json';
                  link.click();
                }}
              >
                📥 Exportar datos
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Total de transacciones: {transacciones.length}<br/>
              Categorías personalizadas: {categorias.length - categoriasBase.length}<br/>
              Tarjetas personalizadas: {tarjetasPersonalizadas.length - tarjetas.length}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Modal personalizado en lugar de Dialog */}
      {dialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => {
            setDialogOpen(false);
            limpiarFormulario();
          }}
        >
          <Paper
            sx={{
              p: 3,
              maxWidth: 500,
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" gutterBottom>
              {editandoId ? '✏️ Editar transacción' : `➕ Nuevo ${tipo === 'gasto' ? 'gasto' : 'ingreso'}`}
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                value={tipo}
                label="Tipo"
                onChange={e => setTipo(e.target.value as TipoTransaccion)}
              >
                <MenuItem value="gasto">💸 Gasto</MenuItem>
                <MenuItem value="ingreso">💰 Ingreso</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              fullWidth 
              label="Descripción" 
              value={descripcion} 
              onChange={e => setDescripcion(e.target.value)} 
              sx={{ mb: 2 }} 
              autoFocus
            />
            
            <TextField 
              fullWidth 
              label="Monto" 
              type="number" 
              value={monto} 
              onChange={e => setMonto(e.target.value)} 
              sx={{ mb: 2 }} 
            />
            
            <TextField 
              fullWidth 
              label="Fecha" 
              type="date" 
              value={fecha} 
              onChange={e => setFecha(e.target.value)} 
              sx={{ mb: 2 }} 
              InputLabelProps={{ shrink: true }} 
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="futuro-label">¿Es futuro?</InputLabel>
              <Select
                labelId="futuro-label"
                value={esFuturo ? 'si' : 'no'}
                label="¿Es futuro?"
                onChange={e => setEsFuturo(e.target.value === 'si')}
              >
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="si">Sí</MenuItem>
              </Select>
            </FormControl>
            
            {esFuturo && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tarjeta-label">Tarjeta (opcional)</InputLabel>
                <Select
                  labelId="tarjeta-label"
                  value={tarjeta}
                  label="Tarjeta (opcional)"
                  onChange={e => setTarjeta(e.target.value)}
                >
                  <MenuItem value="">Sin tarjeta</MenuItem>
                  {tarjetasPersonalizadas.map(t => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
                </Select>
              </FormControl>
            )}
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                value={categoria}
                label="Categoría"
                onChange={e => setCategoria(e.target.value)}
              >
                <MenuItem value="">Sin categoría</MenuItem>
                {categorias.map(cat => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
              </Select>
            </FormControl>
            
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                onClick={() => {
                  setDialogOpen(false); 
                  limpiarFormulario();
                }}
              >
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleAgregar}>
                {editandoId ? 'Guardar' : 'Agregar'}
              </Button>
            </Box>
          </Paper>
        </Box>
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
