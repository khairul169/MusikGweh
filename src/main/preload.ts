import { contextBridge, ipcRenderer } from 'electron';

export type DownloadCompleteCallback = (result?: string | Error) => void;

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
  ytdl: {
    getVideoInfo: (url: string) => ipcRenderer.invoke('ytdl:getVideoInfo', url),
    videoToMp3: (url: string) => ipcRenderer.send('ytdl:videoToMp3', url),
    onMp3DownloadComplete: (callback: DownloadCompleteCallback) => {
      ipcRenderer.on('yt2mp3-complete', (_, result?: string | Error) => {
        callback(result);
      });
    },
  },
});
