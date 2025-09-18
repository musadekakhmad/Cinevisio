// app/sitemap.js
import {
  getMovieGenres,
  getMoviesByCategory,
  getTvSeriesByCategory,
  getTvSeriesGenres,
  getMoviesByGenre,
  getTvSeriesByGenre
} from '../lib/api';

const BASE_URL = 'https://cinevisio.netlify.app';

// Fungsi utilitas untuk membuat slug
const createSlug = (name, year) => {
  if (!name) return '';
  
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Validasi tahun lebih ketat
  if (!year || typeof year !== 'string' || year.length !== 4 || isNaN(year)) {
    return baseSlug;
  }
  
  return `${baseSlug}-${year}`;
};

export default async function sitemap() {
  const movieCategories = ['popular', 'now_playing', 'upcoming', 'top_rated'];
  const tvCategories = ['popular', 'airing_today', 'on_the_air', 'top_rated'];

  try {
    const [movieGenres, tvGenres] = await Promise.all([
      getMovieGenres(),
      getTvSeriesGenres()
    ]);

    console.log('Mengambil data untuk sitemap CineVisio...');

    // Ambil semua film dari semua kategori (halaman 1 saja)
    const movieCategoryPromises = movieCategories.map(async (category) => {
      const movies = await getMoviesByCategory(category, 1);
      return movies || [];
    });
    
    // Ambil semua film dari semua genre (halaman 1 saja)
    const movieGenrePromises = (movieGenres || []).map(async (genre) => {
      const movies = await getMoviesByGenre(genre.id, 1);
      return movies || [];
    });

    // Ambil semua serial TV dari semua kategori (halaman 1 saja)
    const tvCategoryPromises = tvCategories.map(async (category) => {
      const series = await getTvSeriesByCategory(category, 1);
      return series || [];
    });

    // Ambil semua serial TV dari semua genre (halaman 1 saja)
    const tvGenrePromises = (tvGenres || []).map(async (genre) => {
      const series = await getTvSeriesByGenre(genre.id, 1);
      return series || [];
    });

    // Gabungkan semua hasil pengambilan data
    const [movieCategoryResults, movieGenreResults, tvCategoryResults, tvGenreResults] = await Promise.allSettled([
      Promise.all(movieCategoryPromises),
      Promise.all(movieGenrePromises),
      Promise.all(tvCategoryPromises),
      Promise.all(tvGenrePromises)
    ]).then(results => 
      results.map(result => result.status === 'fulfilled' ? result.value.flat() : [])
    );

    // Gabungkan semua film dan serial TV
    const allMovies = [...movieCategoryResults, ...movieGenreResults].flat();
    const allTvShows = [...tvCategoryResults, ...tvGenreResults].flat();

    // Gunakan Map untuk menyimpan ID unik agar tidak ada duplikasi URL
    const uniqueMovies = new Map();
    allMovies.forEach(movie => {
      if (movie?.id && movie?.title) {
        uniqueMovies.set(movie.id, movie);
      }
    });

    const uniqueTvShows = new Map();
    allTvShows.forEach(tvShow => {
      if (tvShow?.id && tvShow?.name) {
        uniqueTvShows.set(tvShow.id, tvShow);
      }
    });

    console.log(`Jumlah film unik: ${uniqueMovies.size}`);
    console.log(`Jumlah serial TV unik: ${uniqueTvShows.size}`);
    
    // Buat URL statis, kategori, dan genre
    const staticUrls = [
      { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ];

    const movieCategoryUrls = movieCategories.map((category) => ({
      url: `${BASE_URL}/movie/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }));

    const tvCategoryUrls = tvCategories.map((category) => ({
      url: `${BASE_URL}/tv/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }));
    
    const movieGenreUrls = (movieGenres || []).map((genre) => ({
      url: `${BASE_URL}/movie/genre/${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));
    
    const tvGenreUrls = (tvGenres || []).map((genre) => ({
      url: `${BASE_URL}/tv/genre/${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    // Buat URL slug film dari data yang sudah ada (tanpa mengambil detail ulang)
    const movieSlugUrls = Array.from(uniqueMovies.values()).map((movie) => {
      const year = movie.release_date?.substring(0, 4);
      return {
        url: `${BASE_URL}/movie/${movie.id}/${createSlug(movie.title, year)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      };
    });

    // Buat URL slug serial TV dari data yang sudah ada
    const tvSlugUrls = Array.from(uniqueTvShows.values()).map((tvShow) => {
      const year = tvShow.first_air_date?.substring(0, 4);
      return {
        url: `${BASE_URL}/tv/${tvShow.id}/${createSlug(tvShow.name, year)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
      };
    });

    const allUrls = [
      ...staticUrls,
      ...movieCategoryUrls,
      ...tvCategoryUrls,
      ...movieGenreUrls,
      ...tvGenreUrls,
      ...movieSlugUrls,
      ...tvSlugUrls,
    ];

    console.log(`Total URL dalam sitemap: ${allUrls.length}`);
    console.log('Sitemap CineVisio berhasil dibuat');

    return allUrls;

  } catch (error) {
    console.error("Kesalahan saat membuat sitemap:", error);
    
    // Return minimal sitemap dengan URL utama jika error
    return [
      { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ];
  }
}
