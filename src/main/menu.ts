import {
  Menu,
  BrowserWindow,
  // MenuItemConstructorOptions,
  dialog,
} from 'electron';
import { setAppConfig } from './util';

// interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
//   selector?: string;
//   submenu?: DarwinMenuItemConstructorOptions[] | Menu;
// }

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  onQuit: VoidFunction;

  constructor(mainWindow: BrowserWindow, onQuit: VoidFunction) {
    this.mainWindow = mainWindow;
    this.onQuit = onQuit;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    // const template =
    //   process.platform === 'darwin'
    //     ? this.buildDarwinTemplate()
    //     : this.buildDefaultTemplate();

    const template = this.buildDefaultTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  // buildDarwinTemplate(): MenuItemConstructorOptions[] {
  //   return [];
  // }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
            click: async () => {
              const { canceled, filePaths } = await dialog.showOpenDialog(
                this.mainWindow,
                {
                  properties: ['openDirectory'],
                }
              );
              if (canceled) {
                return;
              }
              const dir = filePaths[0];
              setAppConfig({ audioDir: dir });
              this.mainWindow.webContents.send('refresh-music');
            },
          },
          {
            label: '&Quit',
            accelerator: 'Ctrl+Q',
            click: () => {
              // this.mainWindow.close();
              if (this.onQuit) this.onQuit();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
    ];

    return templateDefault;
  }
}
