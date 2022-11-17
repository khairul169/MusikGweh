import { ipcMain } from 'electron';
import music from './music';

const initCommands = async () => {
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });

  ipcMain.handle('music:getList', music.getList);
};

export default initCommands;
