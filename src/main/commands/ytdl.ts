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

const videoToMp3 = async (event: Electron.IpcMainInvokeEvent, url: string) => {
  if (!appConfig.audioDir) {
    return;
  }

  const dl = YTDL(url, { quality: 'highestaudio', filter: (i) => i.hasAudio });

  const onComplete = (result?: string | Error) => {
    event.sender.send('yt2mp3-complete', result);
  };

  dl.on('info', async (info: YTDL.videoInfo, format: YTDL.videoFormat) => {
    const type = format.container;

    const tmpDir = path.join(__dirname, '../../../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

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
      const outDir = path.join(appConfig.audioDir || '', 'Downloads');
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      const { title } = info.videoDetails;
      const outFile = path.join(outDir, `${slugify(title, false)}.mp3`);

      const cmd = ffmpeg(tmpSrc)
        .output(outFile)
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
        .format('mp3')
        .on('end', () => {
          // console.log('Convert complete..', outFile);
          onClean();
          onComplete(title);
        });

      if (albumCover) {
        cmd.addInput(albumCover);
        cmd.addOutputOptions(['-map 0:0', '-map 1:0']);
      }

      cmd.on('error', (err, stdout, stderr) => {
        console.log(`Cannot process video: ${err.message}`);
        console.log(stdout, stderr);
        onClean();
        onComplete(err);
      });

      cmd.on('start', (cmdline) => {
        console.log('cmdline', cmdline);
      });

      cmd.run();
    });
  });

  // dl.on('progress', (_, progress: number, total: number) => {
  //   console.log('info', `${Math.round((progress / total) * 100)}%`);
  // });
};

const ytdl = { getVideoInfo, videoToMp3 };

export default ytdl;
