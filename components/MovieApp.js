"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import MovieImage from './MovieImage'; // Path diperbaiki

// API Key is not needed here as we are using a proxy URL
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// ===================================
// Custom Hooks
// ===================================

/**
 * Custom hook to fetch data from an API efficiently.
 * Uses useCallback to prevent unnecessary re-renders.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  return { data, loading, error };
};

// ===================================
// MovieCard Component
// ===================================
const MovieCard = ({ media, mediaType }) => {
  // Function to create a slug from the title for SEO-friendly URLs
  const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <Link
      href={`/details/${mediaType}/${media.id}/${createSlug(media.title || media.name)}`}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 block"
    >
      <MovieImage
        src={media.poster_path ? `${IMAGE_BASE_URL}${media.poster_path}` : 'https://placehold.co/500x750?text=No+Image'}
        alt={`Poster for ${media.title || media.name}`}
        className="w-full h-auto object-cover"
      />
      <div className="p-4">
        <h3 className="text-sm font-bold truncate">{media.title || media.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{media.release_date || media.first_air_date}</p>
      </div>
    </Link>
  );
};

// ===================================
// Home Page Component
// ===================================
const HomePage = () => {
  const { data, loading, error } = useFetch(`${BASE_URL}/movie/popular`);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div id="hero-section" className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <figure>
              <img
                  src="https://live.staticflickr.com/65535/54732469204_6663bf32b7_b.jpg"
                  alt="Cine Visio Movie Streaming Banner"
                  srcSet="
                      https://live.staticflickr.com/65535/54732469204_6663bf32b7_b.jpg 1024w,
                      https://live.staticflickr.com/65535/54732469204_6663bf32b7_b.jpg 500w,
                      https://live.staticflickr.com/65535/54732469204_6663bf32b7_b.jpg 240w
                  "
                  sizes="(max-width: 600px) 100vw, 1024px"
                  loading="lazy"
                  className="w-full h-auto object-cover mx-auto block"
              />
          </figure>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Cine Visio: Free HD Movie & TV Show Streaming</h1>
        <p className="text-gray-300 text-justify">
          Cine Visio is your ultimate destination for high-quality, free movie and TV show streaming. Explore our extensive collection of popular movies, trending films, and the most talked-about TV series. With an easy-to-use interface and a seamless video player, we ensure an enjoyable viewing experience. Start streaming today!
        </p>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
          Popular Movies
      </h2>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>An error occurred while fetching data: {error}. Please ensure you have a valid API key and a stable internet connection.</p>
        </div>
      )}

      {!loading && !error && data && data.results && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.results.map(item => (
            <MovieCard key={item.id} media={item} mediaType={'movie'} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
