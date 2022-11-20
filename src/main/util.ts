/* eslint-disable no-console */
/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

type AppConfig = {
  audioDir?: string;
};

const appConfigPath = path.join(__dirname, '../../../config.json');

// eslint-disable-next-line import/no-mutable-exports
export let appConfig: AppConfig = {
  audioDir: undefined,
};

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const loadAppConfig = () => {
  try {
    appConfig = JSON.parse(
      fs.readFileSync(appConfigPath, { encoding: 'utf-8' })
    );
  } catch (err) {
    console.log('Failed loading app config!', err);
  }
};

export const setAppConfig = (config: Partial<AppConfig>) => {
  appConfig = { ...appConfig, ...config };
  fs.writeFile(appConfigPath, JSON.stringify(appConfig), () =>
    console.log('App config updated.')
  );
};

export const getFilename = (filepath: string) => {
  return filepath.split('/').pop() || '';
};

export const slugify = (text: string, lowerCase = true) => {
  let str = text.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  if (lowerCase) {
    str = str.toLowerCase();
  }

  // Remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
  for (let i = 0, l = from.length; i < l; i += 1) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str
    .replace(/[^A-Za-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return str;
};

export const downloadFile = async (url: string, out: string) => {
  try {
    const res = await fetch(url);
    res.body.pipe(fs.createWriteStream(out));
    return out;
  } catch (err) {
    console.log('err download file', err);
    return null;
  }
};
