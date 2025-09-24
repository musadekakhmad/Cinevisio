// app/Home/page-client.jsx
"use client";

import { useState, useCallback } from 'react';
import { getTrendingMoviesDaily, getTrendingTvSeriesDaily } from '../../lib/api';
import MovieList from '../../components/MovieList';
import TvSeriesList from '../../components/TvSeriesList';

// Helper function untuk menghapus duplikat berdasarkan ID
const removeDuplicates = (array) => {
  const seen = new Set();
  return array.filter(item => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

export default function TrendingClient({ initialMovies, initialTvSeries }) {
  const [movies, setMovies] = useState(initialMovies);
  const [tvSeries, setTvSeries] = useState(initialTvSeries);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingTv, setLoadingTv] = useState(false);

  const loadMoreMovies = useCallback(async () => {
    setLoadingMovies(true);
    try {
      const nextPage = moviePage + 1;
      const newMovies = await getTrendingMoviesDaily(nextPage);
      
      // Gabungkan dan hapus duplikat
      const combinedMovies = [...movies, ...newMovies];
      const uniqueMovies = removeDuplicates(combinedMovies);
      
      setMovies(uniqueMovies);
      setMoviePage(nextPage);
    } catch (error) {
      console.error('Error loading more movies:', error);
    }
    setLoadingMovies(false);
  }, [moviePage, movies]);

  const loadMoreTvSeries = useCallback(async () => {
    setLoadingTv(true);
    try {
      const nextPage = tvPage + 1;
      const newTvSeries = await getTrendingTvSeriesDaily(nextPage);
      
      // Gabungkan dan hapus duplikat
      const combinedTvSeries = [...tvSeries, ...newTvSeries];
      const uniqueTvSeries = removeDuplicates(combinedTvSeries);
      
      setTvSeries(uniqueTvSeries);
      setTvPage(nextPage);
    } catch (error) {
      console.error('Error loading more TV series:', error);
    }
    setLoadingTv(false);
  }, [tvPage, tvSeries]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">Daily Trending</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">Trending Movies</h2>
        {movies.length > 0 ? (
          <>
            <MovieList movies={movies} />
            <div className="flex justify-center mt-6">
              <button 
                onClick={loadMoreMovies}
                disabled={loadingMovies}
                className="bg-blue-700 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200 disabled:opacity-50"
              >
                {loadingMovies ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-white">No trending movies currently available.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Trending TV Series</h2>
        {tvSeries.length > 0 ? (
          <>
            <TvSeriesList series={tvSeries} />
            <div className="flex justify-center mt-6">
              <button 
                onClick={loadMoreTvSeries}
                disabled={loadingTv}
                className="bg-blue-700 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200 disabled:opacity-50"
              >
                {loadingTv ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-white">No trending TV series currently available.</p>
        )}
      </div>
    </div>
  );
}