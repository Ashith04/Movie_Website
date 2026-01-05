import React from 'react';
import { Star } from 'lucide-react';

const MovieRating = ({ rating, size = 16 }) => {
    const numRating = parseFloat(rating) || 0;
    const stars = Math.round(numRating / 2); // Convert 10-point to 5-star
    
    return (
        <div className="movie-rating">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={size} 
                    fill={i < stars ? '#FFD700' : 'none'} 
                    color={i < stars ? '#FFD700' : '#666'}
                />
            ))}
            <span className="rating-text">{rating}</span>
        </div>
    );
};

export default MovieRating;