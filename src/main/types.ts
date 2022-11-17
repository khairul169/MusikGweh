import type { thumbnail } from 'ytdl-core';

export type VideoInfo = {
  videoUrl: string;
  title: string;
  length: string;
  thumb: thumbnail;
};
