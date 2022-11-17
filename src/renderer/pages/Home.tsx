import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaTimes, FaMusic } from 'react-icons/fa';
import AudioPlayer from 'react-h5-audio-player';
import { getFilename, mapTrackData, TrackData } from 'renderer/utils';

const Home = () => {
  const [musicList, setMusicList] = useState<TrackData[]>([]);
  const [track, setTrack] = useState<number>();
  const [search, setSearch] = useState('');

  const getMusicList = async () => {
    try {
      const result = await window.app.music.getList();
      const items = await Promise.all(result.map(mapTrackData));
      setMusicList(items);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Failed fetching music list...', err);
    }
  };

  useEffect(() => {
    getMusicList();
    window.app.config.onAudioDirChange(getMusicList);
  }, []);

  const onTrackSelect = (idx: number) => {
    setTrack(idx);
  };

  const onTrackPrev = () => {
    if (track != null && track > 0) setTrack(track - 1);
  };

  const onTrackNext = () => {
    if (track != null && track < musicList.length - 1) setTrack(track + 1);
  };

  const musicFiltered = useMemo(() => {
    return musicList
      .map((i, index) => ({ ...i, index }))
      .filter((i) => {
        const keyword = search.toLowerCase();
        const filename = i.filename.toLowerCase();
        const title = i.title.toLowerCase();
        return title.includes(keyword) || filename.includes(keyword);
      })
      .sort((a, b) => {
        return getFilename(a.title).localeCompare(getFilename(b.title));
      });
  }, [musicList, search]);

  const currentTrack = useMemo(() => {
    return track != null ? musicList[track] : null;
  }, [musicList, track]);

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
          </button>
        ))}
      </div>

      <div className="bg-slate-700 flex items-center shadow-xl">
        {currentTrack?.cover ? (
          <img
            src={currentTrack?.cover}
            alt="cover"
            className="w-[114px] ml-3"
          />
        ) : null}

        <AudioPlayer
          autoPlay
          src={currentTrack?.uri}
          header={
            <div className="text-white">
              <p className="mb-2 mt-3">{currentTrack?.title || '-'}</p>
            </div>
          }
          showJumpControls={false}
          showSkipControls
          onClickPrevious={onTrackPrev}
          onClickNext={onTrackNext}
          onEnded={onTrackNext}
          hasDefaultKeyBindings={false}
        />
      </div>
    </div>
  );
};

export default Home;
