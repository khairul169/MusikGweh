import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
  config: {
    onAudioDirChange: (callback: VoidFunction) => {
      ipcRenderer.on('audiodir-changed', callback);
    },
  },
  music: {
    getList: () => ipcRenderer.invoke('music:getList'),
  },
});
