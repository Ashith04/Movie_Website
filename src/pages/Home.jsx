import React, { useState, useEffect } from 'react';
import { searchMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/Home.css';

const Home = () => {
    const { language } = useGlobalContext();
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState({
        trending: [],
        action: [],
        drama: [],
        comedy: [],
        thriller: [],
        kdrama: [],
        cdrama: [],
        bollywood: [],
        top10: [],
        watchLater: []
    });
    const [continueWatching, setContinueWatching] = useState([]);
    const [myList, setMyList] = useState([]);
    const [becauseYouWatched, setBecauseYouWatched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const debouncedQuery = useDebounce(query, 500);

    const categoryData = {
        trending: ['Avengers: Endgame', 'Spider-Man: No Way Home', 'The Batman', 'Black Panther', 'Top Gun: Maverick', 'Dune'],
        action: ['John Wick', 'Fast & Furious', 'Mission: Impossible', 'Mad Max: Fury Road', 'The Matrix', 'Terminator'],
        drama: ['The Shawshank Redemption', 'Forrest Gump', 'The Godfather', 'Good Will Hunting', 'A Beautiful Mind', 'The Pursuit of Happyness'],
        comedy: ['Superbad', 'Anchorman', 'Step Brothers', 'Pineapple Express', 'The Hangover', 'Deadpool'],
        thriller: ['Inception', 'The Dark Knight', 'Interstellar', 'Shutter Island', 'Gone Girl', 'Se7en'],
        kdrama: ['Parasite', 'Train to Busan', 'Oldboy', 'The Handmaiden', 'Burning', 'Decision to Leave'],
        cdrama: ['Hero', 'Crouching Tiger, Hidden Dragon', 'House of Flying Daggers', 'Ip Man', 'Kung Fu Hustle', 'Red Cliff'],
        bollywood: ['3 Idiots', 'Dangal', 'Baahubali', 'Zindagi Na Milegi Dobara', 'Queen', 'Andhadhun'],
        top10: ['Top Gun: Maverick', 'Avatar', 'Titanic', 'Star Wars', 'Jurassic Park', 'The Lion King'],
        watchLater: ['Dune', 'No Time to Die', 'The Matrix', 'Blade Runner', 'Tenet', 'Oppenheimer']
    };

    // Load categories on component mount
    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            try {
                // Load all categories
                for (const [category, movies] of Object.entries(categoryData)) {
                    const categoryMovies = [];
                    
                    for (const movie of movies) {
                        try {
                            const data = await searchMovies(movie, 1, language);
                            if (data.Response === "True" && data.Search && data.Search[0]) {
                                categoryMovies.push(data.Search[0]);
                            }
                            await new Promise(resolve => setTimeout(resolve, 100));
                        } catch (err) {
                            console.error(`Failed to load ${movie}:`, err);
                        }
                    }
                    
                    setCategories(prev => ({ ...prev, [category]: categoryMovies }));
                }
                
            } catch (err) {
                console.error('Failed to load categories:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, [language]);

    // this runs when query changes (only for search)
    useEffect(() => {
        if (!debouncedQuery) {
            setMovies([]);
            setError(null);
            return;
        }

        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
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
                {/* Language indicator */}
                {language !== 'en' && (
                    <div className="language-indicator">
                        <span>Showing results for: {{
                            'es': 'Español',
                            'fr': 'Français', 
                            'hi': 'हिन्दी',
                            'ja': '日本語'
                        }[language] || 'English'}</span>
                    </div>
                )}
                
                {/* Category Filter Buttons */}
                {!query && (
                    <div className="category-filters">
                        <button 
                            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'trending' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('trending')}
                        >
                            Trending
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'action' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('action')}
                        >
                            Action
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'drama' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('drama')}
                        >
                            Drama
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'comedy' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('comedy')}
                        >
                            Comedy
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'thriller' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('thriller')}
                        >
                            Thriller
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'kdrama' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('kdrama')}
                        >
                            K-Drama
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'cdrama' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('cdrama')}
                        >
                            C-Drama
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'bollywood' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('bollywood')}
                        >
                            Bollywood
                        </button>
                        <button 
                            className={`filter-btn ${selectedCategory === 'top10' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('top10')}
                        >
                            Top 10
                        </button>
                    </div>
                )}

                {/* Search Results */}
                {query && (
                    <>
                        {error && <div className="error-message">{error}</div>}
                        {movies.length > 0 && (
                            <>
                                <h2 className="section-title">Search Results</h2>
                                <div className="movie-grid">
                                    {movies.map((movie) => (
                                        <MovieCard key={movie.imdbID} movie={movie} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Category Movies */}
                {!query && (
                    <>
                        {/* Show loading message while categories are loading */}
                        {loading && categories.trending.length === 0 && (
                            <div className="category-section">
                                <h2 className="category-title">Loading Recommended Movies...</h2>
                                <div className="loading-spinner"></div>
                            </div>
                        )}
                        
                        {/* Show error if categories failed to load */}
                        {error && (
                            <div className="error-message">{error}</div>
                        )}
                        
                        {/* Continue Watching Section */}
                        {continueWatching.length > 0 && (
                            <div className="category-section">
                                <h2 className="category-title">Continue Watching</h2>
                                <div className="movie-row">
                                    {continueWatching.map((movie) => (
                                        <MovieCard key={movie.imdbID} movie={movie} showProgress={true} />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* My List Section */}
                        {myList.length > 0 && (
                            <div className="category-section">
                                <h2 className="category-title">My List</h2>
                                <div className="movie-row">
                                    {myList.map((movie) => (
                                        <MovieCard key={movie.imdbID} movie={movie} />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Because You Watched Section */}
                        {becauseYouWatched.length > 0 && myList.length > 0 && (
                            <div className="category-section">
                                <h2 className="category-title">Because You Watched {myList[0]?.Title}</h2>
                                <div className="movie-row">
                                    {becauseYouWatched.map((movie) => (
                                        <MovieCard key={movie.imdbID} movie={movie} />
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {selectedCategory === 'all' ? (
                            Object.entries(categories).map(([category, categoryMovies]) => (
                                categoryMovies.length > 0 && (
                                    <div key={category} className="category-section">
                                        <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                                        <div className="movie-row">
                                            {categoryMovies.map((movie) => (
                                                <MovieCard key={movie.imdbID} movie={movie} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            categories[selectedCategory] && categories[selectedCategory].length > 0 ? (
                                <div className="category-section">
                                    <h2 className="category-title">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
                                    <div className="movie-grid">
                                        {categories[selectedCategory].map((movie) => (
                                            <MovieCard key={movie.imdbID} movie={movie} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                !loading && (
                                    <div className="category-section">
                                        <h2 className="category-title">No movies found for {selectedCategory}</h2>
                                        <p>Please try selecting a different category or check back later.</p>
                                    </div>
                                )
                            )
                        )}
                    </>
                )}

                {loading && <div className="loading-spinner"></div>}

                {/* Load more button for search results */}
                {!loading && movies.length > 0 && hasMore && query && (
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
