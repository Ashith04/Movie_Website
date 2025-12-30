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

    const [theme, setTheme] = useState('dark');

    // language settings
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('movieAppLanguage') || 'en';
    });

    // saving favorites whenever it changes
    useEffect(() => {
        localStorage.setItem('movieAppFavorites', JSON.stringify(favorites));
    }, [favorites]);

    // saving language preference
    useEffect(() => {
        localStorage.setItem('movieAppLanguage', language);
    }, [language]);

    // function to add movie to favorites
    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            // checking if movie is already there
            if (prev.some((fav) => fav.imdbID === movie.imdbID)) return prev;
            return [...prev, movie];
        });
    };

    // removing movie from favorites
    const removeFromFavorites = (id) => {
        setFavorites((prev) => prev.filter((movie) => movie.imdbID !== id));
    };

    // checks if a movie is favorite
    const isFavorite = (id) => {
        return favorites.some((movie) => movie.imdbID === id);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        theme,
        setTheme,
        language,
        setLanguage
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
