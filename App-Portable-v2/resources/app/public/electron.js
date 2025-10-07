import { app, BrowserWindow, Menu } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  // Crear la ventana del navegador
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // Permitir cargar archivos locales
      allowRunningInsecureContent: true,
      experimentalFeatures: true
    },
    icon: join(__dirname, 'favicon.ico'), // Opcional: ícono de la app
    title: 'Gestión Financiera',
    show: false // No mostrar hasta que esté listo
  });

  // Verificar si estamos en desarrollo
  const envDev = process.env.ELECTRON_IS_DEV;
  const isDevEnv = envDev && envDev.trim() === 'true';
  
  // Cargar la app
  const startUrl = (isDev || isDevEnv)
    ? 'http://localhost:5173' 
    : `file://${join(__dirname, '../dist/index.html')}`;
  
  console.log('Cargando URL:', startUrl);
  console.log('isDev:', isDev);
  console.log('isDevEnv:', isDevEnv);
  console.log('__dirname:', __dirname);
  
  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Error al cargar URL:', err);
  });

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    console.log('Ventana lista para mostrar');
    mainWindow.show();
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error cargando la página:', errorCode, errorDescription);
  });

  // Agregar más eventos para debug
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Página cargada completamente');
  });

  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM listo');
  });

  // mainWindow.webContents.openDevTools(); // Desactivado para producción

  // Crear menú personalizado
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Cerrar',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        {
          label: 'Recargar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        {
          label: 'Pantalla Completa',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Este método será llamado cuando Electron haya terminado la inicialización
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
