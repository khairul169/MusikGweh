import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import AudioPlayer from 'react-h5-audio-player';
import { MusicData } from 'main/commands/music';
import { arrayBufferBase64 } from 'renderer/utils';

type TrackData = {
  uri: string;
  title: string;
  cover?: string;
};

const getAudioName = (music: MusicData) => {
  return music.metadata?.common?.title || music.filename.replace('.mp3', '');
};

const Home = () => {
  const [musicList, setMusicList] = useState<MusicData[]>([]);
  const [track, setTrack] = useState<TrackData>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const getMusicList = async () => {
      try {
        const result = await window.app.music.getList();
        setMusicList(result);
      } catch (err) {
        console.log('Failed fetching music list...', err);
      }
    };

    getMusicList();
  }, []);

  const onTrackSelect = async (music: MusicData) => {
    const port = 1215;
    const uri = `http://localhost:${port}/${music.filename}`;
    const cover = music.metadata.common.picture?.[0];
    const coverImg = await arrayBufferBase64(cover?.data, cover?.format);
    setTrack({ uri, title: getAudioName(music), cover: coverImg });
  };

  const musicFiltered = useMemo(() => {
    return musicList.filter((i) => {
      const keyword = search.toLowerCase();
      const filename = i.filename.toLowerCase();
      const title = getAudioName(i);
      return title.includes(keyword) || filename.includes(keyword);
    });
  }, [musicList, search]);

  return (
    <div className="h-[100vh] flex flex-col overflow-hidden bg-slate-800 text-white">
      <div className="px-5 h-20 flex items-center">
        <h1 className="text-2xl font-medium text-blue-300 flex-1">MusikGweh</h1>

        <div className="relative">
          <FaSearch className="absolute left-3 top-[13px]" />
          <input
            type="text"
            className="border border-slate-500 bg-slate-800 rounded outline-none py-2 px-10 w-60"
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
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {musicFiltered.map((music) => (
          <button
            type="button"
            key={music.filename}
            className="text-left border-b border-slate-600 py-3 w-full hover:bg-slate-700 active:bg-slate-500 transition-colors"
            onClick={() => onTrackSelect(music)}
          >
            {getAudioName(music)}
          </button>
        ))}
      </div>

      <div className="bg-slate-700 flex items-center shadow-xl">
        {track?.cover ? (
          <img src={track?.cover} alt="cover" className="w-[114px] ml-3" />
        ) : null}
        <AudioPlayer
          autoPlay
          src={track?.uri}
          header={
            <div className="text-white">
              <p className="mb-2 mt-3">{track?.title || '-'}</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Home;
