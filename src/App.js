import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import WatchLater from './pages/WatchLater';
import './index.css';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Notification />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watch-later" element={<WatchLater />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
