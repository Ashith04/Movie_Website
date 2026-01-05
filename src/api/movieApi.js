const API_KEY = process.env.REACT_APP_OMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://www.omdbapi.com/';

// Debug: Log API key status
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('⚠️ OMDB API key not configured! Please add your API key to .env file');
}

// this just checks if the response is ok or not
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  return response.json();
};

// function to search for movies
// it takes the query and page number
export const searchMovies = async (query, page = 1, language = 'en') => {
  // if no query then return empty
  if (!query) return { Search: [], TotalResults: 0, Response: "False" };

  // Check if API key is configured
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    return { Response: "False", Error: "API key not configured. Please add your OMDB API key to .env file." };
  }

  // Auto-correct and format query
  const formattedQuery = query.trim().toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Add language-specific search terms for better filtering
  const languageQueries = {
    'en': formattedQuery,
    'es': formattedQuery, // Spanish movies
    'fr': formattedQuery, // French movies  
    'hi': formattedQuery, // Hindi/Bollywood movies
    'ja': formattedQuery  // Japanese movies
  };

  const searchQuery = languageQueries[language] || formattedQuery;

  // setting up the url
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery)}&page=${page}&type=movie`;
  console.log('Fetching:', url.replace(API_KEY, '[API_KEY]')); // Log without exposing key

  try {
    // trying to fetch data
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter results by language preference if available
    if (data.Response === "True" && data.Search && language !== 'en') {
      // For non-English languages, try to filter or prioritize results
      const filteredResults = filterByLanguagePreference(data.Search, language);
      if (filteredResults.length > 0) {
        data.Search = filteredResults;
      }
    }
    
    // If no results found, try with original query
    if (data.Response === "False" && formattedQuery !== query) {
      const fallbackUrl = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
      const fallbackResponse = await fetch(fallbackUrl);
      
      if (!fallbackResponse.ok) {
        throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      console.log('API Response (fallback):', fallbackData);
      return fallbackData;
    }
    
    console.log('API Response:', data);
    return data;
  } catch (error) {
    // showing error if something goes wrong
    console.error("API Search Error:", error);
    
    // Return more specific error messages
    if (error.message.includes('Failed to fetch')) {
      return { Response: "False", Error: "Network error. Please check your internet connection." };
    }
    
    return { Response: "False", Error: error.message };
  }
};

// Helper function to filter results by language preference
const filterByLanguagePreference = (movies, language) => {
  const languageKeywords = {
    'es': ['spanish', 'españa', 'mexico', 'argentina'],
    'fr': ['french', 'france', 'français'],
    'hi': ['bollywood', 'hindi', 'india', 'indian'],
    'ja': ['japanese', 'japan', 'anime']
  };

  const keywords = languageKeywords[language] || [];
  
  if (keywords.length === 0) return movies;

  // First try to find movies that match language keywords
  const languageMatches = movies.filter(movie => {
    const title = movie.Title.toLowerCase();
    const plot = (movie.Plot || '').toLowerCase();
    return keywords.some(keyword => 
      title.includes(keyword) || plot.includes(keyword)
    );
  });

  // If we found language-specific matches, return them, otherwise return all
  return languageMatches.length > 0 ? languageMatches : movies;
};

// checks for movie details using id
export const getMovieDetails = async (id) => {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`;

  try {
    const data = await handleResponse(await fetch(url));
    return data;
  } catch (error) {
    console.error("API Details Error:", error);
    return { Response: "False", Error: error.message };
  }
};
