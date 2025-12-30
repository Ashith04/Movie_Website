const API_KEY = process.env.REACT_APP_OMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://www.omdbapi.com/';

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

  // setting up the url
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;

  try {
    // trying to fetch data
    const data = await handleResponse(await fetch(url));
    return data;
  } catch (error) {
    // showing error if something goes wrong
    console.error("API Search Error:", error);
    return { Response: "False", Error: error.message };
  }
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
