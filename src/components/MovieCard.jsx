import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import MovieRating from './MovieRating';
import '../styles/MovieCard.css';
import '../styles/MovieRating.css';

const MovieCard = ({ movie, showProgress = false }) => {
    // using the global helper to manage favorites and watch later
    const { 
        isFavorite, 
        addToFavorites, 
        removeFromFavorites,
        isInWatchLater,
        addToWatchLater,
        removeFromWatchLater
    } = useGlobalContext();
    const [isHovered, setIsHovered] = useState(false);
    const favorite = isFavorite(movie.imdbID);
    const inWatchLater = isInWatchLater(movie.imdbID);

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

    // when someone clicks the watch later button
    const handleWatchLaterClick = (e) => {
        e.preventDefault();
        if (inWatchLater) {
            removeFromWatchLater(movie.imdbID);
        } else {
            addToWatchLater(movie);
        }
    };

    // getting the image, if not there use a dummy one
    const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
        ? movie.Poster 
        : `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`;

    const handleImageError = (e) => {
        console.log('Image failed to load:', e.target.src);
        e.target.src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.Title)}`;
    };

    return (
        // clicking the card takes you to details page
        <Link 
            to={`/movie/${movie.imdbID}`} 
            className="movie-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="movie-poster-container">
                <img 
                    src={posterUrl} 
                    alt={movie.Title} 
                    className="movie-poster" 
                    loading="lazy" 
                    onError={handleImageError}
                />
                <div className="movie-overlay">
                    {/* the heart button on top */}
                    <button
                        className={`favorite-btn ${favorite ? 'active' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label={favorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        <Heart fill={favorite ? "currentColor" : "none"} size={20} />
                    </button>
                    {/* Watch Later button */}
                    <button
                        className={`watch-later-btn ${inWatchLater ? 'active' : ''}`}
                        onClick={handleWatchLaterClick}
                        aria-label={inWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
                    >
                        <Clock fill={inWatchLater ? "currentColor" : "none"} size={18} />
                    </button>
                </div>
                {/* Progress bar for Continue Watching */}
                {showProgress && (
                    <div className="progress-bar">
                        <div className="progress-fill" style={{width: '45%'}}></div>
                    </div>
                )}
            </div>
            <div className="movie-info">
                {/* movie name and year */}
                <h3 className="movie-title">{movie.Title}</h3>
                <div className="movie-meta">
                    <span className="movie-year">{movie.Year}</span>
                    <span className="movie-type">{movie.Type}</span>
                </div>
                {movie.imdbRating && (
                    <MovieRating rating={movie.imdbRating} size={14} />
                )}
            </div>
        </Link>
    );
};

export default MovieCard;
