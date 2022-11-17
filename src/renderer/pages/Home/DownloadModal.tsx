/* eslint-disable no-console */
import { VideoInfo } from 'main/types';
import React, { useEffect, useState } from 'react';
import Button from 'renderer/components/Button';
import Modal from 'renderer/components/Modal';
import Spinner from 'renderer/components/Spinner';
import { formatTimeLength } from 'renderer/utils';

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  onComplete(result?: string): void;
};

const DownloadModal = ({ isOpen, onClose, onComplete }: Props) => {
  const [videoUrl, setVideoUrl] = useState(
    // 'https://www.youtube.com/watch?v=KYcGwnh4Pas'
    ''
  );
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const onDownloadComplete = (result?: string | Error) => {
      setIsDownloading(false);
      setVideoInfo(null);
      onClose();
      onComplete(typeof result === 'string' ? result : undefined);

      if (result instanceof Error) {
        console.log('ERR!', result);
      } else {
        setVideoUrl('');
      }
    };

    window.app.ytdl.onMp3DownloadComplete(onDownloadComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVideoInfo = async () => {
    if (!videoUrl.length) {
      return;
    }

    try {
      setVideoInfo(null);
      const result = await window.app.ytdl.getVideoInfo(videoUrl);
      setVideoInfo(result);
    } catch (err) {
      console.log(err);
    }
  };

  const onDownload = (data: VideoInfo) => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    window.app.ytdl.videoToMp3(data.videoUrl);
  };

  return (
    <Modal title="Download Musik" isOpen={isOpen} onClose={onClose}>
      <input
        type="text"
        className="border border-slate-500 rounded outline-none h-10 px-3 w-full text-sm"
        placeholder="https://www.youtube.com/watch?v=xxx"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <Button
        className="mt-2 py-2 text-sm"
        onClick={fetchVideoInfo}
        disabled={isDownloading}
      >
        Submit
      </Button>

      {videoInfo ? (
        <div className="mt-5">
          <div className="flex items-start">
            <img
              src={videoInfo.thumb.url}
              alt="thumbnail"
              className="w-[120px] h-[120px] object-cover"
            />
            <div className="ml-3 flex-1">
              <p>{videoInfo.title}</p>
              <p className="font-bold">
                {formatTimeLength(parseInt(videoInfo.length, 10))}
              </p>

              <Button
                className="mt-2 py-2 px-3 text-sm flex"
                onClick={() => onDownload(videoInfo)}
              >
                {isDownloading ? <Spinner size={5} className="mr-2" /> : null}
                Download
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default React.memo(DownloadModal);
