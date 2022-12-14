/* eslint-disable no-console */
import { useEffect, useMemo, useState } from 'react';
import {
  FaSearch,
  FaTimes,
  FaMusic,
  FaTrash,
  FaDownload,
} from 'react-icons/fa';
import { getFilename, mapTrackData, TrackData } from 'renderer/utils';
import MusicPlayer from 'renderer/components/MusicPlayer';
import { useMusicPlayer } from 'renderer/context/MusicPlayerContext';
import MenuButton from 'renderer/components/MenuButton';
import DeleteModal from './DeleteModal';
import DownloadModal from './DownloadModal';

type ModalDeleteTrackData = {
  isOpen: boolean;
  track?: TrackData;
};

const Home = () => {
  const { track, play } = useMusicPlayer();
  const [musicList, setMusicList] = useState<TrackData[]>([]);
  const [search, setSearch] = useState('');
  const [modalDownload, setModalDownload] = useState(false);
  const [modalDeleteTrack, setModalDeleteTrack] =
    useState<ModalDeleteTrackData>({
      isOpen: false,
    });

  const getMusicList = async () => {
    console.log('fetching music list...');

    try {
      const result = await window.app.music.getList();
      const items = await Promise.all(result.map(mapTrackData));
      setMusicList(items);
    } catch (err) {
      console.log('Failed fetching music list...', err);
    }
  };

  useEffect(() => {
    getMusicList();
    window.app.config.onAudioDirChange(getMusicList);
  }, []);

  const playList = useMemo(() => {
    return musicList.sort((a, b) => {
      return getFilename(a.title).localeCompare(getFilename(b.title));
    });
  }, [musicList]);

  const onTrackSelect = (idx: number) => {
    play(playList, idx);
  };

  const onDeleteTrack = async (trackData: TrackData) => {
    const success = await window.app.music.deleteMusic(trackData.path);
    if (success) {
      getMusicList();
    }
  };

  const musicFiltered = useMemo(() => {
    return playList
      .map((i, index) => ({ ...i, index }))
      .filter((i) => {
        const keyword = search.toLowerCase();
        const filename = i.filename.toLowerCase();
        const title = i.title.toLowerCase();
        return title.includes(keyword) || filename.includes(keyword);
      });
  }, [playList, search]);

  return (
    <div className="h-[100vh] flex flex-col overflow-hidden bg-slate-800 text-white">
      <div className="px-5 h-20 flex items-center">
        <h1 className="text-2xl font-medium text-blue-300 flex-1">MusikGweh</h1>

        <div className="relative">
          <FaSearch className="absolute left-3 top-[13px]" />
          <input
            type="text"
            className="border border-slate-500 bg-slate-800 rounded outline-none h-10 px-10 w-60 text-sm"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search.length > 0 ? (
            <button
              type="button"
              className="absolute right-1 top-1 p-2 hover:bg-slate-600 rounded"
              onClick={() => setSearch('')}
            >
              <FaTimes />
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="border border-slate-500 bg-slate-800 hover:bg-slate-700 transition-colors text-sm rounded outline-none h-10 px-3 ml-2 flex items-center"
          onClick={() => setModalDownload(true)}
        >
          <FaDownload className="mr-2" />
          Download
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-5">
        {musicFiltered.map((music) => (
          <button
            type="button"
            key={music.filename}
            className={[
              'text-left border-b border-slate-600 w-full hover:bg-slate-700 active:bg-slate-500 transition-colors flex items-center py-2 my-1 rounded',
              track === music.index ? 'bg-slate-600' : '',
            ].join(' ')}
            onClick={() => onTrackSelect(music.index)}
          >
            <div className="mx-2 h-10 w-10 rounded bg-slate-400 overflow-hidden flex items-center justify-center">
              {music.cover ? (
                <img
                  src={music.cover}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaMusic />
              )}
            </div>
            <p className="flex-1 truncate">{music.title}</p>
            <MenuButton
              className="mr-2"
              items={[
                {
                  icon: FaTrash,
                  title: 'Hapus',
                  onClick: () => {
                    setModalDeleteTrack((state) => ({
                      ...state,
                      isOpen: true,
                      track: music,
                    }));
                  },
                },
              ]}
            />
          </button>
        ))}
      </div>

      <MusicPlayer />

      <DownloadModal
        isOpen={modalDownload}
        onClose={() => setModalDownload(false)}
        onComplete={(result?: string) => {
          getMusicList();
          setSearch(typeof result === 'string' ? result : '');
        }}
      />

      <DeleteModal
        isOpen={modalDeleteTrack.isOpen}
        track={modalDeleteTrack.track}
        onClose={() => {
          setModalDeleteTrack((state) => ({ ...state, isOpen: false }));
        }}
        onConfirm={() => {
          if (modalDeleteTrack.track) {
            onDeleteTrack(modalDeleteTrack.track);
          }
        }}
      />
    </div>
  );
};

export default Home;
