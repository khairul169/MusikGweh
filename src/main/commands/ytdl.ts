/* eslint-disable no-console */
import YTDL from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { appConfig, downloadFile, slugify } from '../util';
import { VideoInfo } from '../types';

const ffmpegPath = path.join(
  __dirname,
  '../../../node_modules/ffmpeg-static/ffmpeg.exe'
);
ffmpeg.setFfmpegPath(ffmpegPath);

const getBestThumbnail = (thumbnails: YTDL.thumbnail[]) => {
  let thumbnail = thumbnails[0] || null;

  thumbnails.forEach((thumb) => {
    if (!thumbnail) {
      thumbnail = thumb;
      return;
    }
    if (thumb.width > thumbnail.width || thumb.height > thumbnail.height) {
      thumbnail = thumb;
    }
  });

  return thumbnail;
};

const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  const info = await YTDL.getBasicInfo(url);
  const { videoDetails: details } = info;

  return {
    videoUrl: details.video_url,
    title: details.title,
    length: details.lengthSeconds,
    thumb: getBestThumbnail(details.thumbnails),
  };
};

type YTDownloadFnResult = {
  info: YTDL.videoInfo;
  path: string;
  clean: () => void;
  album: string | null;
};

const ytDownload = (
  url: string,
  tmpDir: string
): Promise<YTDownloadFnResult> => {
  return new Promise((resolve, reject) => {
    const dl = YTDL(url, {
      quality: 'highestaudio',
      filter: (i) => i.hasAudio,
    });

    dl.on('info', async (info: YTDL.videoInfo, format: YTDL.videoFormat) => {
      const type = format.container;

      // Download thumbnail
      const thumbnail = getBestThumbnail(info.videoDetails.thumbnails);
      const thumbDest = `${tmpDir}/${Date.now()}.jpeg`;
      const albumCover = await downloadFile(thumbnail.url, thumbDest);

      const filename = `${Date.now()}.${type}`;
      const tmpSrc = `${tmpDir}/${filename}`;

      const onClean = () => {
        fs.unlinkSync(tmpSrc);
        if (albumCover) fs.unlinkSync(albumCover);
      };

      dl.pipe(fs.createWriteStream(tmpSrc));
      dl.on('end', () => {
        resolve({ info, path: tmpSrc, clean: onClean, album: albumCover });
      });
    });

    // dl.on('progress', (_, progress: number, total: number) => {
    //   console.log('info', `${Math.round((progress / total) * 100)}%`);
    // });

    dl.on('error', reject);
  });
};

const convertToAudio = (
  src: string,
  output: string,
  format = 'mp3'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cmd = ffmpeg(src)
      .output(output)
      .format(format)
      .on('end', () => {
        resolve(output);
      });

    cmd.on('error', (err, stdout, stderr) => {
      console.log(`Cannot process video: ${err.message}`);
      console.log(stdout, stderr);
      reject(err);
    });

    cmd.on('start', (cmdline) => {
      console.log('cmdline', cmdline);
    });

    cmd.run();
  });
};

const embedMetadata = (
  src: string,
  output: string,
  title: string,
  album: string | null
) => {
  return new Promise((resolve, reject) => {
    const cmd = ffmpeg(src)
      .output(output)
      .outputOptions(
        // '-c:a libmp3lame',
        '-id3v2_version',
        '3',
        '-write_id3v1',
        '1',
        '-metadata',
        `title=${title}`
        // '-metadata',
        // 'comment="Cover (front)"'
      )
      .on('end', () => {
        resolve(output);
      });

    if (album) {
      cmd.addInput(album);
      cmd.addOutputOptions(['-map 0:0', '-map 1:0']);
    }

    cmd.on('error', (err, stdout, stderr) => {
      console.log(`Cannot process video: ${err.message}`);
      console.log(stdout, stderr);
      reject(err);
    });

    cmd.on('start', (cmdline) => {
      console.log('cmdline', cmdline);
    });

    cmd.run();
  });
};

const videoToMp3 = async (event: Electron.IpcMainInvokeEvent, url: string) => {
  const onComplete = (result?: string | Error) => {
    event.sender.send('yt2mp3-complete', result);
  };

  let srcFile: YTDownloadFnResult | null = null;
  let tmpAudio: string | undefined;

  try {
    if (!appConfig.audioDir) {
      throw new Error('Please specify audio dir!');
    }

    const tmpDir = path.join(__dirname, '../../../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    srcFile = await ytDownload(url, tmpDir);
    const { info } = srcFile;

    const outDir = path.join(appConfig.audioDir || '', 'Downloads');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const { title } = info.videoDetails;
    const format = 'mp3';
    const tmpAudioPath = path.join(tmpDir, `${Date.now()}.${format}`);
    tmpAudio = await convertToAudio(srcFile.path, tmpAudioPath, format);

    const audioPath = path.join(outDir, `${slugify(title, false)}.${format}`);
    await embedMetadata(tmpAudio, audioPath, title, srcFile.album);

    onComplete(title);
  } catch (err) {
    onComplete(err instanceof Error ? err : new Error('Unknown error!'));
  } finally {
    // clean tmp files
    if (srcFile) {
      srcFile.clean();
    }
    if (tmpAudio) {
      fs.unlinkSync(tmpAudio);
    }
  }
};

const ytdl = { getVideoInfo, videoToMp3 };

export default ytdl;
