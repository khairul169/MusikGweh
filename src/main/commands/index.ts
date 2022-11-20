import { ipcMain } from 'electron';
import music from './music';
import ytdl from './ytdl';

const initCommands = async () => {
  ipcMain.handle('music:getList', music.getList);
  ipcMain.handle('music:deleteMusic', (_, path: string) => {
    return music.deleteMusic(path);
  });

  ipcMain.handle('ytdl:getVideoInfo', (_, url: string) => {
    return ytdl.getVideoInfo(url);
  });
  ipcMain.on('ytdl:videoToMp3', ytdl.videoToMp3);
};

export default initCommands;
