import { MusicData } from 'main/commands/music';

declare global {
  interface Window {
    // electron: {
    //   ipcRenderer: {
    //     sendMessage(channel: Channels, args: unknown[]): void;
    //     on(
    //       channel: Channels,
    //       func: (...args: unknown[]) => void
    //     ): (() => void) | undefined;
    //     once(channel: Channels, func: (...args: unknown[]) => void): void;
    //   };
    // };
    app: {
      music: {
        getList(): Promise<MusicData[]>;
      };
    };
  }
}

export {};
