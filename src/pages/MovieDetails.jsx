import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Heart, Award, Plus } from 'lucide-react';
import { getMovieDetails } from '../api/movieApi';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/MovieDetails.css';
import '../styles/trailer.css';

const MovieDetails = () => {
    // getting the movie id from the url
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInWatchLater, setIsInWatchLater] = useState(false);
    const { isFavorite, addToFavorites, removeFromFavorites } = useGlobalContext();

    // getting the details when id changes
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // fetching from api
                const data = await getMovieDetails(id);
                if (data.Response === "True") {
                    setMovie(data);
                    // Check if movie is in Watch Later
                    const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
                    setIsInWatchLater(watchLater.some(m => m.imdbID === data.imdbID));
                } else {
                    setError(data.Error);
                }
            } catch (err) {
                // oops something broke
                setError("Failed to load details.");
            } finally {
                // stop loading now
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // shows loading or error if needed
    if (loading) return <div className="details-loading"><div className="loading-spinner"></div></div>;
    if (error) return <div className="details-error">Error: {error}</div>;
    if (!movie) return null;

    // checks if it is favorite
    const favorite = isFavorite(movie.imdbID);

    // clicking the heart button
    const handleFavoriteClick = () => {
        if (favorite) {
            removeFromFavorites(movie.imdbID);
        } else {
            addToFavorites(movie);
        }
    };

    // Watch Later functionality
    const handleWatchLaterClick = () => {
        const watchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
        
        if (isInWatchLater) {
            // Remove from Watch Later
            const updatedList = watchLater.filter(m => m.imdbID !== movie.imdbID);
            localStorage.setItem('watchLater', JSON.stringify(updatedList));
            setIsInWatchLater(false);
        } else {
            // Add to Watch Later
            watchLater.push(movie);
            localStorage.setItem('watchLater', JSON.stringify(watchLater));
            setIsInWatchLater(true);
        }
    };

    // setting up the big background image
    const backdrop = movie.Poster !== 'N/A' ? movie.Poster : '';

    return (
        <div className="movie-details-page">
            {/* making a blurry background cus it looks cool */}
            <div
                className="details-backdrop"
                style={{ backgroundImage: `url(${backdrop})` }}
            ></div>

            <div className="container details-container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} /> Back to Search
                </Link>

                <div className="details-content">
                    <div className="poster-wrapper">
                        {/* the movie poster image */}
                        <img
                            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'}
                            alt={movie.Title}
                            className="details-poster"
                        />
                    </div>

                    <div className="info-wrapper">
                        <h1 className="details-title">{movie.Title}</h1>

                        {/* showing year, time and rating */}
                        <div className="details-meta">
                            <span className="meta-item"><Calendar size={16} /> {movie.Year}</span>
                            <span className="meta-item"><Clock size={16} /> {movie.Runtime}</span>
                            <span className="meta-badge">{movie.Rated}</span>
                            <span className="meta-item"><Star size={16} fill="#E2B616" color="#E2B616" /> {movie.imdbRating}/10</span>
                        </div>

                        {/* genres like Action, Comedy etc */}
                        <div className="genre-tags">
                            {movie.Genre.split(', ').map(genre => (
                                <span key={genre} className="genre-tag">{genre}</span>
                            ))}
                        </div>

                        {/* button to add or remove favorite */}
                        <div className="action-buttons">
                            <button
                                className={`fav-action-btn ${favorite ? 'active' : ''}`}
                                onClick={handleFavoriteClick}
                            >
                                <Heart fill={favorite ? "currentColor" : "none"} size={20} />
                                {favorite ? "In Favorites" : "Add to Favorites"}
                            </button>
                            
                            <button
                                className={`fav-action-btn watch-later-action-btn ${isInWatchLater ? 'active' : ''}`}
                                onClick={handleWatchLaterClick}
                            >
                                <Plus size={20} />
                                {isInWatchLater ? "In Watch Later" : "Add to Watch Later"}
                            </button>
                        </div>

                        {/* story of the movie */}
                        <div className="plot-section">
                            <h3>Synopsis</h3>
                            <p>{movie.Plot}</p>
                        </div>

                        {/* who made it and who is in it */}
                        <div className="credits-section">
                            <div className="credit-item">
                                <span className="label">Director</span>
                                <span className="value">{movie.Director}</span>
                            </div>
                            <div className="credit-item">
                                <span className="label">Awards</span>
                                <span className="value"><Award size={16} className="award-icon" /> {movie.Awards}</span>
                            </div>
                        </div>

                        {/* Cast section with images */}
                        <div className="cast-section">
                            <h3>Cast</h3>
                            <div className="cast-grid">
                                {movie.Actors && movie.Actors.split(', ').slice(0, 6).map((actor, index) => (
                                    <div key={index} className="cast-member">
                                        <img 
                                            src={`https://i.pravatar.cc/150?u=${actor.replace(/\s+/g, '')}`}
                                            alt={actor}
                                            className="cast-image"
                                        />
                                        <span className="cast-name">{actor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trailer section */}
                        <div className="trailer-section">
                            <h3>Trailer</h3>
                            <div className="trailer-container">
                                <div className="trailer-placeholder">
                                    <div className="play-button">
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </div>
                                    <div className="trailer-overlay">
                                        <h4>Watch Trailer</h4>
                                        <p>Click to search for {movie.Title} trailer on YouTube</p>
                                    </div>
                                </div>
                                <a 
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' ' + movie.Year + ' trailer')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="trailer-link"
                                >
                                    Watch Trailer on YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
