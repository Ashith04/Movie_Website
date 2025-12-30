import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/MovieCard.css';

const MovieCard = ({ movie }) => {
    // using the global helper to manage favorites
    const { isFavorite, addToFavorites, removeFromFavorites } = useGlobalContext();
    const favorite = isFavorite(movie.imdbID);

    // when someone clicks the heart icon
    const handleFavoriteClick = (e) => {
        // stop it from opening the movie page
        e.preventDefault();
        if (favorite) {
            removeFromFavorites(movie.imdbID);
        } else {
            addToFavorites(movie);
        }
    };

    // getting the image, if not there use a dummy one
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

    return (
        // clicking the card takes you to details page
        <Link to={`/movie/${movie.imdbID}`} className="movie-card">
            <div className="movie-poster-container">
                <img src={posterUrl} alt={movie.Title} className="movie-poster" loading="lazy" />
                <div className="movie-overlay">
                    {/* the heart button on top */}
                    <button
                        className={`favorite-btn ${favorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label={favorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        <Heart fill={favorite ? "currentColor" : "none"} size={20} />
                    </button>
                </div>
            </div>
            <div className="movie-info">
                {/* movie name and year */}
                <h3 className="movie-title">{movie.Title}</h3>
                <div className="movie-meta">
                    <span className="movie-year">{movie.Year}</span>
                    <span className="movie-type">{movie.Type}</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
