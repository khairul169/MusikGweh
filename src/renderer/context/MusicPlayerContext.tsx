import React, { useContext, useMemo, useState } from 'react';
import { TrackData } from 'renderer/utils';

type Props = {
  children: React.ReactNode;
};

type ContextValue = {
  playlist: TrackData[];
  track: number | null;
  current: TrackData | null;
  play(playlist: TrackData[], track: number): void;
  setTrack(track: number): void;
};

const initialValue: ContextValue = {
  playlist: [],
  track: null,
  current: null,
  play: () => null,
  setTrack: () => null,
};

const Context = React.createContext<ContextValue>(initialValue);

export const useMusicPlayer = () => useContext(Context);

const MusicPlayerProvider = ({ children }: Props) => {
  const [playlist, setPlaylist] = useState<TrackData[]>([]);
  const [track, setTrack] = useState<number | null>(null);

  const play = (playlistItems: TrackData[], trackIdx: number) => {
    setPlaylist(playlistItems);
    setTrack(trackIdx);
  };

  const currentTrack = useMemo(() => {
    return track != null ? playlist[track] : null;
  }, [playlist, track]);

  const value: ContextValue = {
    playlist,
    track,
    play,
    current: currentTrack,
    setTrack,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default MusicPlayerProvider;
