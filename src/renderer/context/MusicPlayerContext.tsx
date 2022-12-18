import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TrackData } from 'renderer/utils';

type Props = {
  children: React.ReactNode;
};

type ContextValue = {
  playlist: TrackData[];
  track: number | null;
  current: TrackData | null;
  loop: LoopMode;
  play(playlist: TrackData[], track: number): void;
  setTrack(track: number): void;
  setLoop(mode: LoopMode): void;
  prev(): void;
  next(): void;
};

export enum LoopMode {
  LOOP_NONE = 0,
  LOOP_SINGLE,
  LOOP_ALL,
}

const initialValue: ContextValue = {
  playlist: [],
  track: null,
  current: null,
  loop: LoopMode.LOOP_NONE,
  play: () => null,
  setTrack: () => null,
  setLoop: () => null,
  prev: () => null,
  next: () => null,
};

const Context = React.createContext<ContextValue>(initialValue);

export const useMusicPlayer = () => useContext(Context);

const MusicPlayerProvider = ({ children }: Props) => {
  const [playlist, setPlaylist] = useState<TrackData[]>([]);
  const [track, setTrack] = useState<number | null>(null);
  const [loop, setLoop] = useState<LoopMode>(LoopMode.LOOP_ALL);

  const play = (playlistItems: TrackData[], trackIdx: number) => {
    setPlaylist(playlistItems);
    setTrack(trackIdx);
  };

  const onTrackPrev = useCallback(() => {
    if (track == null) {
      return;
    }
    let newTrack = track - 1;
    if (newTrack < 0) {
      newTrack = playlist.length - 1;
    }
    setTrack(newTrack);
  }, [track, playlist]);

  const onTrackNext = useCallback(() => {
    if (track == null) {
      return;
    }

    if (track < playlist.length - 1 || loop === LoopMode.LOOP_ALL) {
      let newTrack = track + 1;
      if (newTrack >= playlist.length) {
        newTrack = 0;
      }
      setTrack(newTrack);
    }
  }, [track, playlist, loop]);

  const currentTrack = useMemo(() => {
    return track != null ? playlist[track] : null;
  }, [playlist, track]);

  useEffect(() => {
    if (!currentTrack) {
      return;
    }

    // console.log(currentTrack);

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      // artist: 'Artist',
      // album: 'Album',
      artwork: currentTrack.cover
        ? [{ src: currentTrack.cover, sizes: '512x512', type: 'image/png' }]
        : [],
    });
  }, [currentTrack]);

  useEffect(() => {
    navigator.mediaSession.setActionHandler('previoustrack', onTrackPrev);
    navigator.mediaSession.setActionHandler('nexttrack', onTrackNext);
  }, [onTrackPrev, onTrackNext]);

  const value: ContextValue = {
    playlist,
    track,
    play,
    current: currentTrack,
    setTrack,
    loop,
    setLoop,
    prev: onTrackPrev,
    next: onTrackNext,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default MusicPlayerProvider;
