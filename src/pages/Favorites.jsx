import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import MovieCard from '../components/MovieCard';
import { Film } from 'lucide-react';
import '../styles/Home.css';
import '../styles/Favorites.css';

const Favorites = () => {
    // getting favorites from our global box
    const { favorites } = useGlobalContext();

    return (
        <div className="favorites-page container">
            <h1 className="page-title">Your Collection</h1>

            {/* checking if we have any favorites */}
            {favorites.length === 0 ? (
                <div className="empty-state">
                    <Film size={64} className="empty-icon" />
                    <h2>Your Collection is Empty</h2>
                    <p>Start exploring and add movies to your favorites to see them here.</p>
                </div>
            ) : (
                // loop through favorites and show them in a grid
                <div className="movie-grid">
                    {favorites.map((movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
