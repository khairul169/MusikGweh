import express from 'express';
import { MUSIC_DIR } from './consts';

const initExpress = () => {
  const app = express();
  const port = process.env.STATIC_PORT || 1215;

  app.listen(port, () => {
    console.log(`Static backend listening on http://localhost:${port}/`);
  });

  app.use(express.static(MUSIC_DIR));
};

export default initExpress;
