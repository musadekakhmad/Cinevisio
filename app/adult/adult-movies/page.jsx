// app/adult/erotic-movies/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { getMoviesByKeyword } from '../../../lib/api';
import MediaCard from '../../../components/MediaCard';

export default function EroticMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadMovies(1);
  }, []);

  const loadMovies = async (page) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newMovies = await getMoviesByKeyword(190370, page);
      
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        if (page === 1) {
          setMovies(newMovies);
        } else {
          setMovies(prevMovies => [...prevMovies, ...newMovies]);
        }
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    loadMovies(currentPage + 1);
  };

  // Debug: Log slug untuk setiap movie
  useEffect(() => {
    if (movies.length > 0) {
      console.log('🎬 Erotic Movies Slugs:');
      movies.forEach(movie => {
        const title = movie.title || 'Unknown';
        const year = movie.release_date?.substring(0, 4) || 'Unknown';
        console.log(`- "${title}" (${year})`);
      });
    }
  }, [movies]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Erotic Movies</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          <MediaCard 
            key={movie.id} 
            mediaItem={movie} 
            allMovies={movies} // ✅ PASS ALLMOVIES UNTUK DETEKSI DUPLIKAT
            showType={false} // Sembunyikan type karena semua movie
            showRating={true}
            size="medium"
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
      
      {!hasMore && movies.length > 0 && (
        <div className="text-center mt-8 text-gray-400">
          <p>No more movies to load</p>
        </div>
      )}

      {!hasMore && movies.length === 0 && !isLoading && (
        <div className="text-center mt-8 text-gray-400">
          <p>No erotic movies available at the moment</p>
        </div>
      )}
    </div>
  );
}