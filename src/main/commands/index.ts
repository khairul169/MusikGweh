import { ipcMain } from 'electron';
import music from './music';

const initCommands = async () => {
  ipcMain.handle('music:getList', music.getList);
};

export default initCommands;
