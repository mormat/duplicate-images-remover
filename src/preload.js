const {  contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('requests', {
    'post':    (path, args) => ipcRenderer.invoke('POST ' + path, args),
    'trigger': (path, args) => ipcRenderer.invoke(path, args),
});
