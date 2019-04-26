import { app, BrowserWindow } from 'electron';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = process.env.ELECTRON_WEBPACK_APP_ELECTRON_ENABLE_SECURITY_WARNINGS;

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow: Electron.BrowserWindow | null;

function createMainWindow() {
  // Construct new BrowserWindow
  const window = new BrowserWindow({
    width: 1110,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const urlPath = path.resolve(__dirname, '../renderer', 'index.html');

  // Set url for `win`
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const url = isDevelopment
      ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
      : `file://${urlPath}`;

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  window.loadURL(url);

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null) mainWindow = createMainWindow();
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
