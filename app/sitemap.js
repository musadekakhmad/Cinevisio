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
    .replace(/-+/g, '-')
    .trim();

  // Validasi tahun lebih ketat
  if (!year || typeof year !== 'string' || year.length !== 4 || isNaN(year)) {
    return baseSlug;
  }
  
  return `${baseSlug}-${year}`;
};

// Konfigurasi caching untuk sitemap
export const revalidate = 86400; // 24 jam

export default async function sitemap() {
  const movieCategories = ['popular', 'now_playing', 'upcoming', 'top_rated'];
  const tvCategories = ['popular', 'airing_today', 'on_the_air', 'top_rated'];

  try {
    console.log('🔄 Memulai generate sitemap...');

    // Ambil genres dengan error handling
    const [movieGenres, tvGenres] = await Promise.allSettled([
      getMovieGenres(),
      getTvSeriesGenres()
    ]).then(results => 
      results.map(result => result.status === 'fulfilled' ? result.value : [])
    );

    console.log(`🎬 Genre film: ${movieGenres.length}, Genre TV: ${tvGenres.length}`);

    // Ambil data dari semua kategori (halaman 1 saja untuk efisiensi)
    const allPromises = await Promise.allSettled([
      // Movie categories
      Promise.all(movieCategories.map(category => 
        getMoviesByCategory(category, 1).catch(() => [])
      )),
      
      // Movie genres
      Promise.all(movieGenres.map(genre => 
        getMoviesByGenre(genre.id, 1).catch(() => [])
      )),
      
      // TV categories
      Promise.all(tvCategories.map(category => 
        getTvSeriesByCategory(category, 1).catch(() => [])
      )),
      
      // TV genres
      Promise.all(tvGenres.map(genre => 
        getTvSeriesByGenre(genre.id, 1).catch(() => [])
      ))
    ]);

    // Extract results dengan safety check
    const extractData = (result) => 
      result.status === 'fulfilled' ? result.value.flat().filter(Boolean) : [];

    const [movieCats, movieGens, tvCats, tvGens] = allPromises.map(extractData);

    // Gabungkan dan hapus duplikat
    const allMovies = [...movieCats, ...movieGens];
    const allTvShows = [...tvCats, ...tvGens];

    const uniqueMovies = Array.from(new Map(
      allMovies.filter(m => m?.id && m?.title).map(m => [m.id, m])
    ).values());

    const uniqueTvShows = Array.from(new Map(
      allTvShows.filter(tv => tv?.id && tv?.name).map(tv => [tv.id, tv])
    ).values());

    console.log(`📊 Film unik: ${uniqueMovies.length}, TV unik: ${uniqueTvShows.length}`);

    // URL Statis
    const staticUrls = [
      {
        url: `${BASE_URL}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${BASE_URL}/trending`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9
      },
      {
        url: `${BASE_URL}/search`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8
      }
    ];

    // URL Kategori Film
    const movieCategoryUrls = movieCategories.map(category => ({
      url: `${BASE_URL}/movie/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }));

    // URL Kategori TV
    const tvCategoryUrls = tvCategories.map(category => ({
      url: `${BASE_URL}/tv-show/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    }));

    // URL Genre Film
    const movieGenreUrls = movieGenres.map(genre => ({
      url: `${BASE_URL}/movie/genre-${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    // URL Genre TV
    const tvGenreUrls = tvGenres.map(genre => ({
      url: `${BASE_URL}/tv-show/genre-${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    // Batasi jumlah URL detail untuk menghindari sitemap terlalu besar
    const MAX_DETAIL_URLS = 500;
    const limitedMovies = uniqueMovies.slice(0, MAX_DETAIL_URLS);
    const limitedTvShows = uniqueTvShows.slice(0, MAX_DETAIL_URLS);

    // URL Detail Film
    const movieDetailUrls = limitedMovies.map(movie => {
      const year = movie.release_date?.substring(0, 4);
      const slug = createSlug(movie.title, year);
      
      return [
        {
          url: `${BASE_URL}/movie/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6
        },
        {
          url: `${BASE_URL}/movie/${slug}/stream`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5
        }
      ];
    }).flat();

    // URL Detail TV Show
    const tvDetailUrls = limitedTvShows.map(tvShow => {
      const year = tvShow.first_air_date?.substring(0, 4);
      const slug = createSlug(tvShow.name, year);
      
      return [
        {
          url: `${BASE_URL}/tv-show/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6
        },
        {
          url: `${BASE_URL}/tv-show/${slug}/stream`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5
        }
      ];
    }).flat();

    // Gabungkan semua URL
    const allUrls = [
      ...staticUrls,
      ...movieCategoryUrls,
      ...tvCategoryUrls,
      ...movieGenreUrls,
      ...tvGenreUrls,
      ...movieDetailUrls,
      ...tvDetailUrls,
    ];

    console.log(`✅ Sitemap berhasil dibuat dengan ${allUrls.length} URL`);

    return allUrls;

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    
    // Fallback minimal sitemap
    return [
      {
        url: `${BASE_URL}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${BASE_URL}/trending`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
      }
    ];
  }
}