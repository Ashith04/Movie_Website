import { useState, useEffect } from 'react';

// this hook waits before confirming value change
// good for search bars so it doesn't search on every letter
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // setting a timer
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // cleanup if value changes fast
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
