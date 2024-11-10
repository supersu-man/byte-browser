import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { lstatSync, readdirSync, statSync } from 'original-fs';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow;
const assetsPath = process.argv.includes('--dev') ? '../src/assets' : 'browser/assets'

function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, assetsPath + '/icon.png')
  });
  mainWindow.removeMenu()

  if(process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:4200')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'browser/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow.destroy()
  });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Listen for events with ipcMain.handle

ipcMain.handle('selectFolder', (event) => {
  const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
  if(result) return result[0]
  else return ''
})

ipcMain.handle('isDirectory', (event, path) => {
  return lstatSync(path).isDirectory()
})

ipcMain.handle('readDir', (event, path) => {
  return readdirSync(path)
})

ipcMain.handle('fileSize', (event, path) => {
  return statSync(path).size
})