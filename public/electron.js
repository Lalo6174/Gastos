const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  // Crear la ventana del navegador
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false // Permitir cargar archivos locales
    },
    title: '💰 Gestión Financiera',
    show: false // No mostrar hasta que esté cargado
  });

  // Función para encontrar el index.html
  function findIndexHtml() {
    const possiblePaths = [
      path.join(__dirname, '../dist/index.html'),
      path.join(__dirname, '../../dist/index.html'),
      path.join(__dirname, 'dist/index.html'),
      path.join(process.resourcesPath, 'app/dist/index.html'),
      path.join(process.resourcesPath, 'dist/index.html')
    ];

    console.log('Buscando index.html...');
    console.log('__dirname:', __dirname);
    console.log('process.resourcesPath:', process.resourcesPath || 'undefined');

    for (const filePath of possiblePaths) {
      console.log('Verificando:', filePath);
      if (fs.existsSync(filePath)) {
        console.log('✅ Encontrado:', filePath);
        return filePath;
      }
    }

    console.log('❌ No se encontró index.html en ninguna ubicación');
    return null;
  }

  const indexPath = findIndexHtml();

  if (indexPath) {
    mainWindow.loadFile(indexPath);
  } else {
    // Crear una página de error informativa
    const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error - Gestión Financiera</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #f5f5f5;
            color: #333;
          }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .error { color: #d32f2f; font-size: 24px; margin-bottom: 20px; }
          .paths { text-align: left; background: #f8f8f8; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .paths li { margin: 5px 0; font-family: monospace; font-size: 12px; }
          .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">❌ Error al cargar la aplicación</h1>
          <p>No se pudo encontrar el archivo <code>index.html</code> de la aplicación.</p>
          
          <div class="info">
            <strong>💡 Solución:</strong><br>
            1. Asegúrate de que la aplicación esté compilada: <code>npm run build</code><br>
            2. Verifica que existe la carpeta <code>dist</code> con los archivos compilados
          </div>

          <details>
            <summary>🔍 Información técnica</summary>
            <div class="paths">
              <strong>Directorio actual:</strong> ${__dirname}<br>
              <strong>Ubicaciones buscadas:</strong>
              <ul>
                <li>${path.join(__dirname, '../dist/index.html')}</li>
                <li>${path.join(__dirname, '../../dist/index.html')}</li>
                <li>${path.join(__dirname, 'dist/index.html')}</li>
                <li>${path.join(process.resourcesPath || 'N/A', 'app/dist/index.html')}</li>
                <li>${path.join(process.resourcesPath || 'N/A', 'dist/index.html')}</li>
              </ul>
            </div>
          </details>
        </div>
      </body>
      </html>
    `;
    
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Error al cargar:', errorCode, errorDescription, validatedURL);
  });

  // Evento para manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Error al cargar la página:', errorCode, errorDescription, validatedURL);
  });

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
          label: 'DevTools',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
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
