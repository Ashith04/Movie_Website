import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    // for saving favorites in local storage
    const [favorites, setFavorites] = useState(() => {
        // getting data from local storage
        const localData = localStorage.getItem('movieAppFavorites');
        return localData ? JSON.parse(localData) : [];
    });

    // for saving watch later in local storage
    const [watchLater, setWatchLater] = useState(() => {
        const localData = localStorage.getItem('movieAppWatchLater');
        return localData ? JSON.parse(localData) : [];
    });

    // for notifications
    const [notification, setNotification] = useState(null);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('movieAppTheme') || 'dark';
    });

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('movieAppTheme', theme);
    }, [theme]);

    // language settings
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('movieAppLanguage') || 'en';
    });

    // saving favorites whenever it changes
    useEffect(() => {
        localStorage.setItem('movieAppFavorites', JSON.stringify(favorites));
    }, [favorites]);

    // saving watch later whenever it changes
    useEffect(() => {
        localStorage.setItem('movieAppWatchLater', JSON.stringify(watchLater));
    }, [watchLater]);

    // saving language preference
    useEffect(() => {
        localStorage.setItem('movieAppLanguage', language);
    }, [language]);

    // Auto-hide notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // function to show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    // function to add movie to favorites
    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            // checking if movie is already there
            if (prev.some((fav) => fav.imdbID === movie.imdbID)) {
                showNotification('Movie is already in favorites!', 'info');
                return prev;
            }
            showNotification('Added to favorites!', 'success');
            return [...prev, movie];
        });
    };

    // removing movie from favorites
    const removeFromFavorites = (id) => {
        setFavorites((prev) => {
            const filtered = prev.filter((movie) => movie.imdbID !== id);
            showNotification('Removed from favorites!', 'success');
            return filtered;
        });
    };

    // checks if a movie is favorite
    const isFavorite = (id) => {
        return favorites.some((movie) => movie.imdbID === id);
    };

    // function to add movie to watch later
    const addToWatchLater = (movie) => {
        setWatchLater((prev) => {
            // checking if movie is already there
            if (prev.some((item) => item.imdbID === movie.imdbID)) {
                showNotification('Movie is already in watch later!', 'info');
                return prev;
            }
            showNotification('Added to watch later!', 'success');
            return [...prev, movie];
        });
    };

    // removing movie from watch later
    const removeFromWatchLater = (id) => {
        setWatchLater((prev) => {
            const filtered = prev.filter((movie) => movie.imdbID !== id);
            showNotification('Removed from watch later!', 'success');
            return filtered;
        });
    };

    // clear all watch later
    const clearWatchLater = () => {
        setWatchLater([]);
        showNotification('Watch later list cleared!', 'success');
    };

    // checks if a movie is in watch later
    const isInWatchLater = (id) => {
        return watchLater.some((movie) => movie.imdbID === id);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        watchLater,
        addToWatchLater,
        removeFromWatchLater,
        clearWatchLater,
        isInWatchLater,
        theme,
        setTheme,
        language,
        setLanguage,
        notification,
        showNotification
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
