import { MemoryRouter as Router } from 'react-router-dom';
import AppRouter from './Router';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';

export default function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}
