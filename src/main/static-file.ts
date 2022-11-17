/* eslint-disable no-console */
import express from 'express';
import { AddressInfo } from 'net';
import path from 'path';
import { appConfig } from './util';

let address: AddressInfo | null = null;

export const getStaticBaseUrl = () => {
  return `http://localhost:${address?.port || 80}`;
};

const initStaticFiles = () => {
  const app = express();
  const port = 0; // process.env.STATIC_PORT || 1215;

  const listener = app.listen(port, () => {
    address = listener.address() as AddressInfo;
    console.log(`Static files started on ${getStaticBaseUrl()}`);
  });

  app.get('/*', (req, res) => {
    if (!appConfig.audioDir) {
      throw new Error('Please configure audioDir!');
    }

    const params = req.params as (number | string)[];
    const fileUri = Buffer.from(params[0] as string, 'base64url').toString(
      'utf-8'
    );
    const uri = path.join(appConfig.audioDir, fileUri);
    res.sendFile(uri);
  });
};

export default initStaticFiles;
