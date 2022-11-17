import { MusicData } from 'main/commands/music';

declare global {
  interface Window {
    app: {
      config: {
        onAudioDirChange(callback: VoidFunction): void;
      };
      music: {
        getList(): Promise<MusicData[]>;
      };
    };
  }
}

export {};
