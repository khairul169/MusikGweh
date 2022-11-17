/* eslint-disable import/prefer-default-export */
import fs from 'fs/promises';
import { parseFile, IAudioMetadata } from 'music-metadata';
import { MUSIC_DIR } from '../consts';

export type MusicData = {
  filename: string;
  metadata: IAudioMetadata;
};

const getList = async () => {
  const files = await fs.readdir(MUSIC_DIR);
  const filesMap = files
    .filter((i) => i.endsWith('.mp3'))
    .map(async (i) => {
      const metadata = await parseFile(`${MUSIC_DIR}/${i}`);
      return { filename: i, metadata } as MusicData;
    });
  const musicList = await Promise.all(filesMap);
  return musicList;
};

const music = { getList };

export default music;
