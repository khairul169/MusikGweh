import { ipcMain } from 'electron';
import music from './music';

const initCommands = async () => {
  ipcMain.handle('music:getList', music.getList);
  ipcMain.handle('music:deleteMusic', (_, path: string) => {
    return music.deleteMusic(path);
  });
};

export default initCommands;
