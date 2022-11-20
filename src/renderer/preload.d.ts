import { MusicData } from 'main/commands/music';
import { VideoInfo } from 'main/types';
import type { DownloadCompleteCallback } from 'main/preload';

declare global {
  interface Window {
    app: {
      config: {
        onAudioDirChange(callback: VoidFunction): void;
      };
      music: {
        getList(): Promise<MusicData[]>;
        deleteMusic(uri: string): Promise<boolean>;
      };
      ytdl: {
        getVideoInfo(url: string): Promise<VideoInfo>;
        videoToMp3(url: string): void;
        onMp3DownloadComplete(callback: DownloadCompleteCallback): void;
      };
    };
  }
}

export {};
