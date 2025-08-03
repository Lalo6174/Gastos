import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box, Paper, Button, TextField, List, ListItem, ListItemText, IconButton, Card, CardContent, Chip, ListItemIcon, Dialog } from '@mui/material';
import { Edit, Delete, Add, TrendingUp, TrendingDown, AccountBalanceWallet, Search, Dashboard, BarChart, SearchOutlined, CalendarMonth, AutoGraph, Settings } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

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
  
  // Estados para nuevas funcionalidades
  const [busqueda, setBusqueda] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroTemporal, setFiltroTemporal] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('fecha-desc');
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date());
  const [vistaCalendario, setVistaCalendario] = useState<'mes' | 'semana'>('mes');

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('transacciones-gastos');
    const categoriasGuardadas = localStorage.getItem('categorias-gastos');
    const tarjetasGuardadas = localStorage.getItem('tarjetas-gastos');
    
    if (datosGuardados) {
      try {
        const transaccionesCargadas = JSON.parse(datosGuardados);
        setTransacciones(transaccionesCargadas);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    } else {
      // Datos de ejemplo para demostrar las funcionalidades
      const transaccionesEjemplo: Transaccion[] = [
        { id: 1, descripcion: 'Supermercado', monto: 75.50, fecha: '2025-07-20', tipo: 'gasto', esFuturo: false, categoria: 'Comida' },
        { id: 2, descripcion: 'Salario', monto: 3000, fecha: '2025-07-01', tipo: 'ingreso', esFuturo: false, categoria: 'Salario' },
        { id: 3, descripcion: 'Gasolina', monto: 45, fecha: '2025-07-22', tipo: 'gasto', esFuturo: false, categoria: 'Transporte' },
        { id: 4, descripcion: 'Cine', monto: 25, fecha: '2025-07-18', tipo: 'gasto', esFuturo: false, categoria: 'Ocio' },
        { id: 5, descripcion: 'Freelance', monto: 500, fecha: '2025-07-15', tipo: 'ingreso', esFuturo: false, categoria: 'Freelance' },
        { id: 6, descripcion: 'Farmacia', monto: 35, fecha: '2025-07-10', tipo: 'gasto', esFuturo: false, categoria: 'Salud' },
        { id: 7, descripcion: 'Compra online futura', monto: 120, fecha: '2025-08-01', tipo: 'gasto', esFuturo: true, categoria: 'Otros', tarjeta: 'Visa' },
        { id: 8, descripcion: 'Restaurant', monto: 60, fecha: '2025-06-25', tipo: 'gasto', esFuturo: false, categoria: 'Comida' },
        { id: 9, descripcion: 'Bono', monto: 800, fecha: '2025-06-30', tipo: 'ingreso', esFuturo: false, categoria: 'Salario' },
        { id: 10, descripcion: 'Luz', monto: 85, fecha: '2025-06-20', tipo: 'gasto', esFuturo: false, categoria: 'Servicios' },
      ];
      setTransacciones(transaccionesEjemplo);
    }

    if (categoriasGuardadas) {
      try {
        const categoriasArray = JSON.parse(categoriasGuardadas);
        setCategorias(categoriasArray);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    }

    if (tarjetasGuardadas) {
      try {
        const tarjetasArray = JSON.parse(tarjetasGuardadas);
        setTarjetasPersonalizadas(tarjetasArray);
      } catch (error) {
        console.error('Error al cargar tarjetas:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando cambian las transacciones
  useEffect(() => {
    if (transacciones.length > 0) {
      localStorage.setItem('transacciones-gastos', JSON.stringify(transacciones));
    }
  }, [transacciones]);

  // Guardar categorías en localStorage
  useEffect(() => {
    localStorage.setItem('categorias-gastos', JSON.stringify(categorias));
  }, [categorias]);

  // Guardar tarjetas en localStorage  
  useEffect(() => {
    localStorage.setItem('tarjetas-gastos', JSON.stringify(tarjetasPersonalizadas));
  }, [tarjetasPersonalizadas]);

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

  // Función para filtrar y ordenar transacciones
  const filtrarYOrdenarTransacciones = (transaccionesArray: Transaccion[]) => {
    let resultado = transaccionesArray.filter(t => {
      const coincideBusqueda = !busqueda || 
        t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.categoria && t.categoria.toLowerCase().includes(busqueda.toLowerCase())) ||
        (t.tarjeta && t.tarjeta.toLowerCase().includes(busqueda.toLowerCase()));
      
      // Filtro por rango de fechas
      const fechaTransaccion = new Date(t.fecha);
      const coincideFechaDesde = !fechaDesde || fechaTransaccion >= new Date(fechaDesde);
      const coincideFechaHasta = !fechaHasta || fechaTransaccion <= new Date(fechaHasta);
      
      const coincideCategoria = !categoriaFiltro || t.categoria === categoriaFiltro;
      const coincideTipo = !filtroTipo || t.tipo === filtroTipo;
      const coincideTemporal = !filtroTemporal || 
        (filtroTemporal === 'actual' && !t.esFuturo) ||
        (filtroTemporal === 'futuro' && t.esFuturo);
      
      return coincideBusqueda && coincideFechaDesde && coincideFechaHasta && coincideCategoria && coincideTipo && coincideTemporal;
    });

    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case 'fecha-desc':
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        case 'fecha-asc':
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        case 'monto-desc':
          return b.monto - a.monto;
        case 'monto-asc':
          return a.monto - b.monto;
        case 'descripcion':
          return a.descripcion.localeCompare(b.descripcion);
        default:
          return 0;
      }
    });

    return resultado;
  };

  // Datos para gráficos
  const obtenerDatosGraficos = () => {
    // Gráfico por categorías
    const gastosPorCategoria = categorias.map(cat => {
      const totalGastos = transacciones
        .filter(t => t.tipo === 'gasto' && t.categoria === cat && !t.esFuturo)
        .reduce((sum, t) => sum + t.monto, 0);
      return { categoria: cat, gastos: totalGastos };
    }).filter(item => item.gastos > 0);

    // Gráfico temporal (últimos 6 meses)
    const hoy = new Date();
    const ultimosSeisMeses = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const nombreMes = format(fecha, 'MMM yyyy', { locale: es });
      const gastosDelMes = transacciones
        .filter(t => {
          const fechaTransaccion = parseISO(t.fecha);
          return t.tipo === 'gasto' && 
                 fechaTransaccion.getFullYear() === fecha.getFullYear() &&
                 fechaTransaccion.getMonth() === fecha.getMonth() &&
                 !t.esFuturo;
        })
        .reduce((sum, t) => sum + t.monto, 0);
      
      const ingresosDelMes = transacciones
        .filter(t => {
          const fechaTransaccion = parseISO(t.fecha);
          return t.tipo === 'ingreso' && 
                 fechaTransaccion.getFullYear() === fecha.getFullYear() &&
                 fechaTransaccion.getMonth() === fecha.getMonth() &&
                 !t.esFuturo;
        })
        .reduce((sum, t) => sum + t.monto, 0);

      ultimosSeisMeses.push({
        mes: nombreMes,
        gastos: gastosDelMes,
        ingresos: ingresosDelMes,
        balance: ingresosDelMes - gastosDelMes
      });
    }

    return { gastosPorCategoria, ultimosSeisMeses };
  };

  const { gastosPorCategoria, ultimosSeisMeses } = obtenerDatosGraficos();

  // Generar calendario
  const generarCalendario = () => {
    const inicio = vistaCalendario === 'mes' 
      ? startOfMonth(mesSeleccionado)
      : startOfWeek(mesSeleccionado, { locale: es });
    
    const fin = vistaCalendario === 'mes'
      ? endOfMonth(mesSeleccionado)
      : endOfWeek(mesSeleccionado, { locale: es });

    const dias = eachDayOfInterval({ start: inicio, end: fin });
    
    return dias.map(dia => {
      const transaccionesDelDia = transacciones.filter(t => 
        isSameDay(parseISO(t.fecha), dia)
      );
      
      const gastosDia = transaccionesDelDia
        .filter(t => t.tipo === 'gasto')
        .reduce((sum, t) => sum + t.monto, 0);
      
      const ingresosDia = transaccionesDelDia
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

      return {
        fecha: dia,
        gastos: gastosDia,
        ingresos: ingresosDia,
        balance: ingresosDia - gastosDia,
        transacciones: transaccionesDelDia
      };
    });
  };

  const diasCalendario = generarCalendario();

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

  const menuItems = [
    { id: 0, label: 'Dashboard', icon: <Dashboard /> },
    { id: 1, label: 'Gráficos', icon: <BarChart /> },
    { id: 2, label: 'Movimientos', icon: <SearchOutlined /> },
    { id: 3, label: 'Calendario', icon: <CalendarMonth /> },
    { id: 4, label: 'Futuros', icon: <AutoGraph /> },
    { id: 5, label: 'Configuración', icon: <Settings /> },
  ];

  return (
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
        {/* Header del sidebar */}
        <Box sx={{ p: 3, borderBottom: '1px solid #333' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            Gestión Financiera
          </Typography>
        </Box>

        {/* Menú de navegación */}
        <Box sx={{ flex: 1, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: tab === item.id ? '#2196f3' : 'transparent',
                '&:hover': {
                  bgcolor: tab === item.id ? '#1976d2' : '#333',
                },
                transition: 'all 0.2s ease'
              }}
              onClick={() => setTab(item.id)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
              />
            </ListItem>
          ))}
        </Box>

        {/* Footer del sidebar */}
        <Box sx={{ p: 2, borderTop: '1px solid #333', fontSize: '0.875rem', color: '#888' }}>
          <Typography variant="caption">
            � Los datos se guardan automáticamente
          </Typography>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, ml: '280px' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>

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
            <Typography variant="h6" gutterBottom>Resumen Detallado</Typography>
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

      {/* Tab de Gráficos */}
      {tab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            Análisis Gráfico
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Gráfico de Gastos por Categoría */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="h6" gutterBottom>Gastos por Categoría</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gastosPorCategoria}
                      dataKey="gastos"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ categoria, gastos }) => `${categoria}: $${gastos.toFixed(0)}`}
                    >
                      {gastosPorCategoria.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Gastos']} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>

            {/* Gráfico Temporal */}
              <Paper sx={{ p: 3, flex: 1 }}>
                <Typography variant="h6" gutterBottom>Tendencia Temporal (6 meses)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ultimosSeisMeses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value}`, name === 'gastos' ? 'Gastos' : name === 'ingresos' ? 'Ingresos' : 'Balance']} />
                    <Legend />
                    <Line type="monotone" dataKey="gastos" stroke="#ff7c7c" name="Gastos" />
                    <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" name="Ingresos" />
                    <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* Gráfico de Barras Comparativo */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Comparativa Mensual</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={ultimosSeisMeses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`$${value}`, name === 'gastos' ? 'Gastos' : 'Ingresos']} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#82ca9d" name="Ingresos" />
                  <Bar dataKey="gastos" fill="#ff7c7c" name="Gastos" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Tab de Movimientos */}
      {tab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            Historial de Movimientos
          </Typography>
          
          {/* Panel de filtros */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Filtros de búsqueda
            </Typography>
            
            {/* Primera fila de filtros */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={3}>
              <TextField
                fullWidth
                label="Buscar movimientos"
                placeholder="Descripción, categoría o tarjeta..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                }}
                sx={{ flex: 2 }}
              />
              <TextField
                select
                label="Filtrar por categoría"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                sx={{ flex: 1, minWidth: { xs: '100%', md: '200px' } }}
                SelectProps={{
                  native: true,
                  sx: { 
                    paddingTop: '8px',
                    '& option': {
                      backgroundColor: 'white',
                      color: 'black'
                    }
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </TextField>
            </Box>

            {/* Segunda fila - Rango de fechas */}
            <Box mb={3}>
              <Typography variant="body2" sx={{ mb: 2, color: '#666', fontWeight: 600 }}>
                Rango de fechas
              </Typography>
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }}>
                <TextField
                  label="Fecha desde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1 }}
                />
                <Typography variant="body2" sx={{ color: '#666', px: 1, display: { xs: 'none', sm: 'block' } }}>
                  hasta
                </Typography>
                <TextField
                  label="Fecha hasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1 }}
                />
                {(fechaDesde || fechaHasta) && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setFechaDesde('');
                      setFechaHasta('');
                    }}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Limpiar fechas
                  </Button>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#888', mt: 1, display: 'block' }}>
                Deja vacío "desde" para buscar desde el inicio, o "hasta" para buscar hasta el final
              </Typography>
            </Box>

            {/* Tercera fila - Filtros adicionales */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={3}>
              <TextField
                select
                label="Tipo de movimiento"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                sx={{ flex: 1 }}
                SelectProps={{
                  native: true,
                  sx: { 
                    paddingTop: '8px',
                    '& option': {
                      backgroundColor: 'white',
                      color: 'black'
                    }
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              >
                <option value="">Todos los tipos</option>
                <option value="gasto">Solo gastos</option>
                <option value="ingreso">Solo ingresos</option>
              </TextField>
              <TextField
                select
                label="Estado temporal"
                value={filtroTemporal}
                onChange={(e) => setFiltroTemporal(e.target.value)}
                sx={{ flex: 1 }}
                SelectProps={{
                  native: true,
                  sx: { 
                    paddingTop: '8px',
                    '& option': {
                      backgroundColor: 'white',
                      color: 'black'
                    }
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              >
                <option value="">Todos</option>
                <option value="actual">Solo actuales</option>
                <option value="futuro">Solo futuros</option>
              </TextField>
              <TextField
                select
                label="Ordenar por"
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                sx={{ flex: 1 }}
                SelectProps={{
                  native: true,
                  sx: { 
                    paddingTop: '8px',
                    '& option': {
                      backgroundColor: 'white',
                      color: 'black'
                    }
                  }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              >
                <option value="fecha-desc">Fecha (más reciente)</option>
                <option value="fecha-asc">Fecha (más antigua)</option>
                <option value="monto-desc">Monto (mayor a menor)</option>
                <option value="monto-asc">Monto (menor a mayor)</option>
                <option value="descripcion">Descripción (A-Z)</option>
              </TextField>
            </Box>
            
            {/* Filtros activos y botón limpiar */}
            <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => {
                  setBusqueda('');
                  setFechaDesde('');
                  setFechaHasta('');
                  setCategoriaFiltro('');
                  setFiltroTipo('');
                  setFiltroTemporal('');
                  setOrdenamiento('fecha-desc');
                }}
              >
                Limpiar todos los filtros
              </Button>
              {busqueda && (
                <Chip 
                  label={`Búsqueda: "${busqueda}"`} 
                  onDelete={() => setBusqueda('')} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
              {(fechaDesde || fechaHasta) && (
                <Chip 
                  label={`Fechas: ${fechaDesde || '∞'} - ${fechaHasta || '∞'}`} 
                  onDelete={() => {
                    setFechaDesde('');
                    setFechaHasta('');
                  }} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
              {categoriaFiltro && (
                <Chip 
                  label={`Categoría: ${categoriaFiltro}`} 
                  onDelete={() => setCategoriaFiltro('')} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
              {filtroTipo && (
                <Chip 
                  label={`Tipo: ${filtroTipo === 'gasto' ? 'Gastos' : 'Ingresos'}`} 
                  onDelete={() => setFiltroTipo('')} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
              {filtroTemporal && (
                <Chip 
                  label={`Estado: ${filtroTemporal === 'actual' ? 'Actuales' : 'Futuros'}`} 
                  onDelete={() => setFiltroTemporal('')} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>

          {/* Lista de movimientos */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Resultados ({filtrarYOrdenarTransacciones(transacciones).length} movimientos)
              </Typography>
              <Box display="flex" gap={1}>
                <Button 
                  variant="contained" 
                  color="success" 
                  size="small"
                  startIcon={<Add />} 
                  onClick={() => abrirDialogoNuevo('ingreso')}
                >
                  Nuevo Ingreso
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small"
                  startIcon={<Add />} 
                  onClick={() => abrirDialogoNuevo('gasto')}
                >
                  Nuevo Gasto
                </Button>
              </Box>
            </Box>
            
            <List>
              {filtrarYOrdenarTransacciones(transacciones).length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No se encontraron movimientos con los filtros aplicados." 
                    secondary="Prueba ajustando los criterios de búsqueda."
                  />
                </ListItem>
              ) : (
                filtrarYOrdenarTransacciones(transacciones).map(t => (
                  <ListItem 
                    key={t.id} 
                    divider
                    sx={{
                      borderLeft: `4px solid ${t.tipo === 'gasto' ? '#f44336' : '#4caf50'}`,
                      '&:hover': {
                        bgcolor: '#f5f5f5'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={t.tipo === 'gasto' ? 'Gasto' : 'Ingreso'}
                            color={t.tipo === 'gasto' ? 'error' : 'success'}
                            size="small"
                          />
                          <Typography variant="subtitle1" component="span">
                            {t.descripcion}
                          </Typography>
                          {t.esFuturo && (
                            <Chip label="Futuro" variant="outlined" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary">
                            <strong>${t.monto.toFixed(2)}</strong> — {t.fecha}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.categoria && `${t.categoria}`}
                            {t.categoria && t.tarjeta && ' • '}
                            {t.tarjeta && `${t.tarjeta}`}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1}>
                      <IconButton onClick={() => handleEditar(t)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleEliminar(t.id)} size="small">
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Box>
      )}

      {/* Tab de Calendario */}
      {tab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            Vista de Calendario
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" gap={2} alignItems="center">
                <Button
                  variant={vistaCalendario === 'mes' ? 'contained' : 'outlined'}
                  onClick={() => setVistaCalendario('mes')}
                  size="small"
                >
                  Vista Mes
                </Button>
                <Button
                  variant={vistaCalendario === 'semana' ? 'contained' : 'outlined'}
                  onClick={() => setVistaCalendario('semana')}
                  size="small"
                >
                  Vista Semana
                </Button>
              </Box>
              
              <Box display="flex" gap={1} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => {
                    const nuevaFecha = new Date(mesSeleccionado);
                    if (vistaCalendario === 'mes') {
                      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
                    } else {
                      nuevaFecha.setDate(nuevaFecha.getDate() - 7);
                    }
                    setMesSeleccionado(nuevaFecha);
                  }}
                >
                  ◀
                </Button>
                <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                  {format(mesSeleccionado, vistaCalendario === 'mes' ? 'MMMM yyyy' : "'Semana del' dd 'de' MMMM", { locale: es })}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const nuevaFecha = new Date(mesSeleccionado);
                    if (vistaCalendario === 'mes') {
                      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
                    } else {
                      nuevaFecha.setDate(nuevaFecha.getDate() + 7);
                    }
                    setMesSeleccionado(nuevaFecha);
                  }}
                >
                  ▶
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setMesSeleccionado(new Date())}
                  sx={{ ml: 2 }}
                >
                  Hoy
                </Button>
              </Box>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
              {diasCalendario.map((dia, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 1, 
                    height: 120, 
                    overflow: 'auto',
                    bgcolor: isSameDay(dia.fecha, new Date()) ? '#e3f2fd' : '#fff',
                    border: dia.transacciones.length > 0 ? '2px solid #1976d2' : '1px solid #ddd',
                    cursor: dia.transacciones.length > 0 ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (dia.transacciones.length > 0) {
                      // Aquí podrías abrir un modal con las transacciones del día
                      alert(`Transacciones del ${format(dia.fecha, 'dd/MM/yyyy', { locale: es })}:\n${dia.transacciones.map(t => `• ${t.descripcion}: $${t.monto}`).join('\n')}`);
                    }
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    {format(dia.fecha, 'dd')}
                  </Typography>
                  {dia.transacciones.length > 0 && (
                    <Box>
                      <Typography variant="caption" color={dia.gastos > 0 ? 'error' : 'success'}>
                        {dia.gastos > 0 && `Gastos: $${dia.gastos.toFixed(0)}`}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="success">
                        {dia.ingresos > 0 && `Ingresos: $${dia.ingresos.toFixed(0)}`}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {dia.transacciones.length} transacción{dia.transacciones.length !== 1 ? 'es' : ''}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Tab de Futuros */}
      {tab === 4 && (
        <Paper sx={{ p: 2, bgcolor: '#fff', color: '#222' }}>
          <Typography variant="h6">Transacciones futuras</Typography>
          <List>
            {transacciones.filter(t => t.esFuturo).length === 0 && (
              <ListItem><ListItemText primary="No hay transacciones futuras." /></ListItem>
            )}
            {transacciones.filter(t => t.esFuturo).map(t => (
              <ListItem key={t.id} divider>
                <ListItemText 
                  primary={`${t.tipo === 'gasto' ? 'Gasto' : 'Ingreso'}: ${t.descripcion}`} 
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
      {tab === 5 && (
        <Box>
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff', color: '#222' }}>
            <Typography variant="h6" gutterBottom>Gestión de Categorías</Typography>
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
              Las categorías con borde azul son predeterminadas y no se pueden eliminar
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff', color: '#222' }}>
            <Typography variant="h6" gutterBottom>Gestión de Tarjetas</Typography>
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
              Las tarjetas con borde azul son predeterminadas y no se pueden eliminar
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: '#fff', color: '#222' }}>
            <Typography variant="h6" gutterBottom>Datos de la aplicación</Typography>
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
                Borrar todos los datos
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
                Exportar datos
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

      {/* Modal con Dialog de Material-UI */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          limpiarFormulario();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 3,
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          }
        }}
      >
        <Typography variant="h6" gutterBottom>
          {editandoId ? 'Editar transacción' : `Nuevo ${tipo === 'gasto' ? 'gasto' : 'ingreso'}`}
        </Typography>
        <TextField
          select
          fullWidth
          label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoTransaccion)}
          sx={{ mb: 2 }}
          SelectProps={{
            native: true,
            sx: { 
              paddingTop: '8px',
              '& option': {
                backgroundColor: 'white',
                color: 'black'
              }
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </TextField>
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
        <TextField
          select
          fullWidth
          label="¿Es futuro?"
          value={esFuturo ? 'si' : 'no'}
          onChange={(e) => setEsFuturo(e.target.value === 'si')}
          sx={{ mb: 2 }}
          SelectProps={{
            native: true,
            sx: { 
              paddingTop: '8px',
              '& option': {
                backgroundColor: 'white',
                color: 'black'
              }
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        >
          <option value="no">No</option>
          <option value="si">Sí</option>
        </TextField>
        {esFuturo && (
          <TextField
            select
            fullWidth
            label="Tarjeta (opcional)"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            sx={{ mb: 2 }}
            SelectProps={{
              native: true,
              sx: { 
                paddingTop: '8px',
                '& option': {
                  backgroundColor: 'white',
                  color: 'black'
                }
              }
            }}
            InputLabelProps={{
              shrink: true
            }}
          >
            <option value="">Sin tarjeta</option>
            {tarjetasPersonalizadas.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </TextField>
        )}
        <TextField
          select
          fullWidth
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          sx={{ mb: 3 }}
          SelectProps={{
            native: true,
            sx: { 
              paddingTop: '8px',
              '& option': {
                backgroundColor: 'white',
                color: 'black'
              }
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
        >
          <option value="">Sin categoría</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </TextField>
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
      </Dialog>
      </Container>
      </Box>
    </Box>
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
