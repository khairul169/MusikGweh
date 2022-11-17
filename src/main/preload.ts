import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
  music: {
    getList: () => ipcRenderer.invoke('music:getList'),
  },
});
