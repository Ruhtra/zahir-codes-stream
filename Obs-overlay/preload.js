const { contextBridge, ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  logger: () => ipcRenderer.invoke('logger'),
  getConfig: () => ipcRenderer.invoke('getConfig'),
  changeConfig: (data) => ipcRenderer.invoke('changeConfig', data),
  restart: () => ipcRenderer.invoke('restart'),
  createCollection: () => ipcRenderer.invoke('createCollection')
})
