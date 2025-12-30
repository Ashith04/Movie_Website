import React, { useState, useEffect } from 'react';
import { searchMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/Home.css';

const Home = () => {
    const { language } = useGlobalContext();
    const [query, setQuery] = useState('Avatar'); // default search
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const debouncedQuery = useDebounce(query, 500);

    // this runs when query or language changes
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                // calling the api
                const data = await searchMovies(debouncedQuery, 1, language);
                if (data.Response === "True") {
                    setMovies(data.Search);
                    setHasMore(data.TotalResults > 10);
                    setPage(1);
                } else {
                    setMovies([]);
                    setError(data.Error);
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [debouncedQuery, language]);

    // checks to load more movies
    const loadMore = async () => {
        const nextPage = page + 1;
        setLoading(true);
        try {
            const data = await searchMovies(debouncedQuery, nextPage, language);
            if (data.Response === "True") {
                setMovies((prev) => [...prev, ...data.Search]);
                setPage(nextPage);
                // if less than 10 movies then stop loading
                if (data.Search.length < 10) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Discover Cinematic Masterpieces</h1>
                    <p className="hero-subtitle">Explore a vast library of movies, from timeless classics to modern blockbusters.</p>
                    <SearchBar value={query} onChange={setQuery} />
                </div>
            </div>

            <div className="container">
                {/* showing error if any */}
                {error && query && <div className="error-message">{error}</div>}

                {movies.length > 0 && (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>
                )}

                {loading && <div className="loading-spinner"></div>}

                {/* button for loading more movies */}
                {!loading && movies.length > 0 && hasMore && (
                    <div className="pagination-container">
                        <button onClick={loadMore} className="load-more-btn">
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
