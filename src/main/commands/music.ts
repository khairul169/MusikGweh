/* eslint-disable import/prefer-default-export */
import fs from 'fs/promises';
import path from 'path';
import { parseFile, IAudioMetadata } from 'music-metadata';
import { getStaticBaseUrl } from '../static-file';
import { appConfig, getFilename } from '../util';

export type MusicData = {
  filename: string;
  uri: string;
  metadata: IAudioMetadata;
};

const createMusicData = async (filename: string) => {
  const metadata = await parseFile(`${appConfig.audioDir}/${filename}`);
  const fileUri = Buffer.from(filename).toString('base64url');
  const uri = `${getStaticBaseUrl()}/${fileUri}`;
  return { filename, uri, metadata } as MusicData;
};

const getFiles = async (basePath: string, dir = '', files?: string[]) => {
  const tmpFiles = files || [];
  const dirFiles = await fs.readdir(basePath, { encoding: 'utf-8' });

  const maps = dirFiles.map(async (file) => {
    const subDir = path.join(basePath, '/', file);
    const stats = await fs.lstat(subDir);

    if (stats.isDirectory()) {
      await getFiles(subDir, `${dir}${file}/`, tmpFiles);
    } else {
      tmpFiles.push(dir + file);
    }
  });

  await Promise.all(maps);
  return tmpFiles;
};

const getList = async () => {
  if (!appConfig.audioDir) {
    return [];
  }

  const files = await getFiles(appConfig.audioDir);
  const items = files.filter((i) => i.endsWith('.mp3')).map(createMusicData);
  return Promise.all(items);
};

const music = { getList };

export default music;
