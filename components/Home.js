// Home.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard'; // Use MovieCard component from the components folder

// Base URL for the API
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // <-- FILL WITH YOUR API KEY
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// ===================================
// Custom Hooks
// ===================================

/**
 * Custom hook to efficiently fetch data from the API.
 * Uses useCallback to prevent unnecessary re-renders.
 */
const useFetch = (url, initialPage = 1) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${url}&page=${page}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const json = await response.json();
      
      setData(prevData => {
        if (!prevData) {
          return json;
        }
        return {
          ...json,
          results: [...prevData.results, ...json.results],
        };
      });

      if (json.page >= json.total_pages) {
        setHasMore(false);
      }

    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [url, page]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return { data, loading, error, hasMore, loadMore };
};


// ===================================
// Home Component
// ===================================

export default function Home() {
  // Fetch Anime Movies (Genre ID 16 for Animation)
  const animeMovieId = 16;
  const { 
    data: animeMovieData, 
    loading: animeMovieLoading, 
    error: animeMovieError, 
    hasMore: hasMoreMovies, 
    loadMore: loadMoreMovies 
  } = useFetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${animeMovieId}`);
  
  // Fetch Anime Series (Genre ID 16 for Animation)
  const animeSeriesId = 16;
  const { 
    data: animeSeriesData, 
    loading: animeSeriesLoading, 
    error: animeSeriesError, 
    hasMore: hasMoreSeries, 
    loadMore: loadMoreSeries 
  } = useFetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${animeSeriesId}`);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Hero Section - Height Adjusted and Styled */}
      {/* Added rounded-xl and shadow-2xl for better styling */}
      <div className="relative w-full h-48 md:h-64 lg:h-96 overflow-hidden rounded-xl shadow-2xl" suppressHydrationWarning={true}>
          <img
              src="https://live.staticflickr.com/65535/54732469204_6663bf32b7_b.jpg"
              alt="Cine Visio Banner"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/1920x1080/0d1117/2d3138?text=Cine+Visio';
              }}
          />
      </div>
      
      {/* Main content container with padding */}
      <div className="px-4 md:px-8">
        {/* About Section */}
        <section className="bg-gray-800 rounded-2xl p-8 shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-3xl font-bold text-white mb-4">Cine Visio: Stream Free Movies & TV Shows HD</h1>
          <p className="text-gray-300 text-justify leading-relaxed">
            Cine Visio is your one-stop destination for high-quality, free streaming of movies and TV shows. Explore our collection of popular movies, trending films, and the most talked-about TV series. With an easy-to-use interface and smooth video player, we ensure a pleasant viewing experience. Start streaming today!
          </p>
        </section>

        {/* Anime Movies Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Anime Movies</h2>
          {animeMovieLoading && <p className="text-center text-gray-400">Loading anime movies...</p>}
          {animeMovieError && <p className="text-center text-red-400">Error: {animeMovieError}</p>}
          {animeMovieData && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {animeMovieData.results.filter(movie => movie.poster_path).map((movie) => (
                  <MovieCard key={movie.id} media={movie} mediaType="movie" />
                ))}
              </div>
              {hasMoreMovies && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreMovies}
                    className="bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-red-700 transition duration-300"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Anime Series Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Anime Series</h2>
          {animeSeriesLoading && <p className="text-center text-gray-400">Loading anime series...</p>}
          {animeSeriesError && <p className="text-center text-red-400">Error: {animeSeriesError}</p>}
          {animeSeriesData && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {animeSeriesData.results.filter(series => series.poster_path).map((series) => (
                  <MovieCard key={series.id} media={series} mediaType="tv" />
                ))}
              </div>
              {hasMoreSeries && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreSeries}
                    className="bg-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-red-700 transition duration-300"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </div>
    </div>
  );
}
