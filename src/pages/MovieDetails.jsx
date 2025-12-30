import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Heart, Award } from 'lucide-react';
import { getMovieDetails } from '../api/movieApi';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
    // getting the movie id from the url
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                                <span className="label">Cast</span>
                                <span className="value">{movie.Cast}</span>
                            </div>
                            <div className="credit-item">
                                <span className="label">Awards</span>
                                <span className="value"><Award size={16} className="award-icon" /> {movie.Awards}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
