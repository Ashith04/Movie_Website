import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import MovieCard from '../components/MovieCard';
import { Clock } from 'lucide-react';
import '../styles/Favorites.css';

const WatchLater = () => {
    const { watchLater, clearWatchLater } = useGlobalContext();

    if (watchLater.length === 0) {
        return (
            <div className="favorites-page">
                <div className="container">
                    <div className="empty-state">
                        <Clock size={64} className="empty-icon" />
                        <h2>No Movies in Watch Later</h2>
                        <p>Movies you add to watch later will appear here.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        <Clock className="page-icon" />
                        Watch Later ({watchLater.length})
                    </h1>
                    <button 
                        onClick={clearWatchLater}
                        className="clear-btn"
                    >
                        Clear All
                    </button>
                </div>
                <div className="movie-grid">
                    {watchLater.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WatchLater;