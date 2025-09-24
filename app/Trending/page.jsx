// app/trending/page.jsx
import { getTrendingMoviesDaily, getTrendingTvSeriesDaily } from '../../lib/api';
import TrendingClient from './page-client';

// ✅ Konfigurasi caching yang tepat
export const revalidate = 3600; // 1 jam

export default async function TrendingPage() {
  try {
    // ✅ Gunakan Promise.allSettled untuk error handling
    const [moviesResult, tvSeriesResult] = await Promise.allSettled([
      getTrendingMoviesDaily(1),
      getTrendingTvSeriesDaily(1)
    ]);

    // Extract data dengan error handling
    const trendingMovies = moviesResult.status === 'fulfilled' ? moviesResult.value : [];
    const trendingTvSeries = tvSeriesResult.status === 'fulfilled' ? tvSeriesResult.value : [];

    return (
      <TrendingClient 
        initialMovies={trendingMovies} 
        initialTvSeries={trendingTvSeries} 
      />
    );
  } catch (error) {
    console.error('Error in TrendingPage:', error);
    
    // Return empty data jika error
    return (
      <TrendingClient 
        initialMovies={[]} 
        initialTvSeries={[]} 
      />
    );
  }
}

// ✅ Tambahkan metadata untuk SEO
export const metadata = {
  title: 'Daily Trending - Vegamovies',
  description: 'Discover daily trending movies and TV series on Vegamovies',
};