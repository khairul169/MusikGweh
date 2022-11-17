import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
  config: {
    onAudioDirChange: (callback: VoidFunction) => {
      ipcRenderer.on('refresh-music', callback);
    },
  },
  music: {
    getList: () => ipcRenderer.invoke('music:getList'),
    deleteMusic: (uri: string) => ipcRenderer.invoke('music:deleteMusic', uri),
  },
});
