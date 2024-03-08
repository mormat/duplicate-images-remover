const { app, BrowserWindow, ipcMain, dialog } = require('electron/main');

const path   = require('path');
const routes = require('./back/routes');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../icons/512x512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  
  if (!process.env.ELECTRON_ENV) {
    win.setMenu(null);
  }
  
  win.loadFile(path.resolve(__dirname, '..', 'web', 'index.html'));
  
  return win;
}

app.whenReady().then(() => {
    
    ipcMain.handle('select-folder', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        
        return result.filePaths;
    })
    
    for (const k in routes) {
        ipcMain.handle('POST ' + k, (_, args) => routes[k](args));
    }
    
    const mainWindow = createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})