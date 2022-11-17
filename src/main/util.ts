/* eslint-disable no-console */
/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { readFileSync, writeFile } from 'fs';

type AppConfig = {
  audioDir?: string;
};

const appConfigPath = path.join(__dirname, '/../../config.json');

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
    appConfig = JSON.parse(readFileSync(appConfigPath, { encoding: 'utf-8' }));
  } catch (err) {
    console.log('Failed loading app config!', err);
  }
};

export const setAppConfig = (config: Partial<AppConfig>) => {
  appConfig = { ...appConfig, ...config };
  writeFile(appConfigPath, JSON.stringify(appConfig), () =>
    console.log('App config updated.')
  );
};

export const getFilename = (filepath: string) => {
  return filepath.split('/').pop() || '';
};
