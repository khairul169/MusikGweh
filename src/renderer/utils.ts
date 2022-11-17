/* eslint-disable import/prefer-default-export */
import { MusicData } from 'main/commands/music';

export const arrayBufferBase64 = async (data?: Buffer, mimeType?: string) => {
  if (!data) {
    return undefined;
  }

  // Use a FileReader to generate a base64 data URI
  const base64url: string = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(new Blob([data]));
  });

  /*
    The result looks like 
    "data:application/octet-stream;base64,<your base64 data>", 
    so we split off the beginning:
    */
  return `data:${mimeType || ''};base64,${base64url.split(',', 2)[1]}`;
};

export type TrackData = {
  uri: string;
  path: string;
  filename: string;
  title: string;
  cover?: string;
};

export const getAudioName = (music: MusicData) => {
  return music.metadata?.common?.title || music.filename.replace('.mp3', '');
};

export const mapTrackData = async (music: MusicData) => {
  const cover = music.metadata.common.picture?.[0];
  const coverImg = await arrayBufferBase64(cover?.data, cover?.format);

  return {
    uri: music.uri,
    path: music.path,
    filename: music.filename,
    title: getAudioName(music),
    cover: coverImg,
  } as TrackData;
};

export const getFilename = (filepath: string) => {
  return filepath.split('/').pop() || '';
};

export const filterTrackList = (items: TrackData[], search: string) => {
  return items
    .map((i, index) => ({ ...i, index }))
    .filter((i) => {
      const keyword = search.toLowerCase();
      const filename = i.filename.toLowerCase();
      const title = i.title.toLowerCase();
      return title.includes(keyword) || filename.includes(keyword);
    })
    .sort((a, b) => {
      return getFilename(a.title).localeCompare(getFilename(b.title));
    });
};

export const formatTimeLength = (duration: number) => {
  // Hours, minutes and seconds
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = Math.floor(duration % 60);

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? '0' : ''}`;
  }

  ret += `${mins}:${secs < 10 ? '0' : ''}`;
  ret += `${secs}`;
  return ret;
};
