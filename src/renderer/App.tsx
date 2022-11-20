import { MemoryRouter as Router } from 'react-router-dom';
import AppRouter from './Router';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import MusicPlayerProvider from './context/MusicPlayerContext';

export default function App() {
  return (
    <MusicPlayerProvider>
      <Router>
        <AppRouter />
      </Router>
    </MusicPlayerProvider>
  );
}
