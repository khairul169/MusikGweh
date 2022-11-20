import AudioPlayer from 'react-h5-audio-player';
import { FaMusic } from 'react-icons/fa';
import { useMusicPlayer } from 'renderer/context/MusicPlayerContext';

const MusicPlayer = () => {
  const { current, playlist, track, setTrack } = useMusicPlayer();

  const onTrackPrev = () => {
    if (track != null && track > 0) setTrack(track - 1);
  };

  const onTrackNext = () => {
    if (track != null && track < playlist.length - 1) setTrack(track + 1);
  };

  return (
    <div className="bg-slate-700 flex items-center shadow-xl">
      <div className="w-[128px] h-[114px] ml-3 bg-slate-400 rounded-sm overflow-hidden flex items-center justify-center">
        {current?.cover ? (
          <img
            src={current?.cover}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaMusic className="text-[40px] mb-1 mr-1" />
        )}
      </div>

      <AudioPlayer
        autoPlay
        src={current?.uri}
        header={
          <div className="text-white">
            <p className="mb-2 mt-3">{current?.title || '-'}</p>
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
  );
};

export default MusicPlayer;
