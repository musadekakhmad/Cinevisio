// app/movie/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube, FaUserCircle, FaStar, FaClock, FaCalendar, FaPlay } from 'react-icons/fa';
import {
  getMovieById,
  getMovieVideos,
  getMovieCredits,
  getMovieReviews,
  searchMoviesAndTv,
  getSimilarMovies,
  getMoviesByCategory,
  getMovieGenres,
  getMoviesByGenre,
} from '../../../lib/api';
import MovieList from '../../../components/MovieList';
import MediaCard from '@/components/MediaCard';

const CATEGORIES = ['now_playing', 'popular', 'top_rated', 'upcoming'];

// === FUNGSI SLUG PINTAR (HANYA SATU KALI DEKLARASI) ===
const createSmartSlug = (item, allMovies = []) => {
  const title = item.title || item.name || 'movie';
  if (!title) return '';
  
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  let year = '';
  if (item.release_date || item.first_air_date) {
    const date = item.release_date || item.first_air_date;
    year = date.substring(0, 4);
  }

  // LOGIKA PINTAR: Deteksi duplikat judul+tahun
  if (allMovies && allMovies.length > 0) {
    const duplicateMovies = allMovies.filter(movie => {
      const movieTitle = movie.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const currentTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const movieYear = movie.release_date?.substring(0, 4);
      
      return movieTitle === currentTitle && movieYear === year && movie.id !== item.id;
    });

    if (duplicateMovies.length > 0) {
      return `${baseSlug}-${year}-${item.id}`.replace(/-+/g, '-').replace(/-$/, '');
    }
    
    const sameTitleDifferentYear = allMovies.filter(movie => {
      const movieTitle = movie.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const currentTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const movieYear = movie.release_date?.substring(0, 4);
      
      return movieTitle === currentTitle && movieYear !== year && movie.id !== item.id;
    });

    if (sameTitleDifferentYear.length > 0) {
      return `${baseSlug}-${year}`.replace(/-+/g, '-').replace(/-$/, '');
    }
  }

  return `${baseSlug}-${year}`.replace(/-+/g, '-').replace(/-$/, '');
};

// HANYA SATU FUNGSI parseSmartSlug (HAPUS DUPLIKASI)
const parseSmartSlug = (slug) => {
  // Pattern 1: judul-tahun-id (untuk duplikat)
  const patternWithId = /^(.+)-(\d{4})-(\d+)$/;
  const patternWithoutId = /^(.+)-(\d{4})$/;
  const patternTitleWithId = /^(.+)-(\d+)$/;
  
  let match = slug.match(patternWithId);
  if (match) {
    return {
      title: match[1].replace(/-/g, ' '),
      year: match[2],
      id: parseInt(match[3]),
      hasId: true,
      type: 'duplicate'
    };
  }
  
  match = slug.match(patternWithoutId);
  if (match) {
    return {
      title: match[1].replace(/-/g, ' '),
      year: match[2],
      hasId: false,
      type: 'unique'
    };
  }
  
  match = slug.match(patternTitleWithId);
  if (match) {
    return {
      title: match[1].replace(/-/g, ' '),
      id: parseInt(match[2]),
      hasId: true,
      type: 'fallback'
    };
  }
  
  return null;
};

// === KOMPONEN MOVIE CARD ===
const MovieCard = ({ movie, allMovies = [] }) => {
  const slug = createSmartSlug(movie, allMovies);
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available';

  return (
    <Link href={`/movie/${slug}`} className="flex-shrink-0 w-32 md:w-48 text-center group block">
      <div className="relative w-full h-auto rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-lg">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={200}
          height={300}
          className="w-full h-auto object-cover rounded-lg"
          unoptimized={!movie.poster_path}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex flex-col justify-end p-3 transition-all duration-300">
          <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-xs md:text-sm font-semibold text-white truncate mb-1">
              {movie.title}
            </h3>
            {movie.release_date && (
              <span className="text-[10px] md:text-xs text-gray-400">
                ({movie.release_date.substring(0, 4)})
              </span>
            )}
            <div className="flex items-center justify-center mt-1">
              <FaStar className="text-yellow-400 text-xs mr-1" />
              <span className="text-xs text-white">{movie.vote_average?.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// === METADATA ===
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    let movieData = null;

    if (CATEGORIES.includes(slug)) {
      const title = slug.replace(/_/g, ' ').toUpperCase();
      return {
        title: `Cinevisio - ${title} Movies`,
        description: `Explore the ${title} movies collection on Cinevisio.`,
      };
    }

    const genreMatch = slug.match(/^genre-(\d+)$/);
    if (genreMatch) {
      const genreId = genreMatch[1];
      const genres = await getMovieGenres();
      const genreName = genres.find(g => g.id == genreId)?.name || 'Unknown';
      return {
        title: `Cinevisio - ${genreName} Movies`,
        description: `Discover ${genreName} movies on Cinevisio.`,
      };
    }

    const parsedSlug = parseSmartSlug(slug);
    
    if (parsedSlug) {
      if (parsedSlug.id) {
        movieData = await getMovieById(parsedSlug.id);
      } else if (parsedSlug.title && parsedSlug.year) {
        const searchResults = await searchMoviesAndTv(parsedSlug.title);
        movieData = searchResults.find(movie => 
          movie.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '') === 
          parsedSlug.title.toLowerCase().replace(/[^a-z0-9\s]/g, '') &&
          movie.release_date?.startsWith(parsedSlug.year)
        );
        
        if (movieData) {
          movieData = await getMovieById(movieData.id);
        }
      }
    }

    if (!movieData) {
      return {
        title: 'Cinevisio',
        description: 'Find your favorite movies to stream.',
      };
    }

    const socialImage = movieData.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`
      : movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : `https://placehold.co/1200x630/1f2937/d1d5db?text=${encodeURIComponent(movieData.title)}`;

    return {
      title: `Cinevisio - ${movieData.title}`,
      description: movieData.overview || `Watch ${movieData.title} on Cinevisio`,
      openGraph: {
        title: movieData.title,
        description: movieData.overview || `Watch ${movieData.title} online`,
        url: `https://cinevisio.netlify.app/movie/${slug}`,
        siteName: 'Cinevisio',
        images: [{ url: socialImage, width: 1200, height: 630, alt: `${movieData.title} poster` }],
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title: movieData.title,
        description: movieData.overview || `Watch ${movieData.title} on Cinevisio`,
        images: [socialImage],
      },
    };
  } catch (error) {
    return {
      title: 'Cinevisio',
      description: 'Find your favorite movies to stream.',
    };
  }
}

// === KOMPONEN UTAMA ===
export default async function MoviePage({ params }) {
  const { slug } = await params;

  if (CATEGORIES.includes(slug)) {
    const movies = await getMoviesByCategory(slug);
    const title = slug.replace(/_/g, ' ').toUpperCase();
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {title} Movies
        </h1>
        {movies?.length > 0 ? <MovieList movies={movies} /> : <p className="text-center text-white">No movies in this category.</p>}
      </div>
    );
  }

  const genreMatch = slug.match(/^genre-(\d+)$/);
  if (genreMatch) {
    const genreId = genreMatch[1];
    const genres = await getMovieGenres();
    const genreName = genres.find(g => g.id == genreId)?.name || 'Unknown';
    const moviesByGenre = await getMoviesByGenre(genreId);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-white">
          {genreName} Movies
        </h1>
        {moviesByGenre?.length > 0 ? <MovieList movies={moviesByGenre} /> : <p className="text-center text-white">No movies in this genre.</p>}
      </div>
    );
  }

  let movieData = null;
  const parsedSlug = parseSmartSlug(slug);

  if (parsedSlug) {
    if (parsedSlug.id) {
      movieData = await getMovieById(parsedSlug.id);
    } else if (parsedSlug.title && parsedSlug.year) {
      const searchResults = await searchMoviesAndTv(parsedSlug.title);
      movieData = searchResults.find(movie => 
        movie.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '') === 
        parsedSlug.title.toLowerCase().replace(/[^a-z0-9\s]/g, '') &&
        movie.release_date?.startsWith(parsedSlug.year)
      );
      if (movieData) movieData = await getMovieById(movieData.id);
    }
  }

  if (!movieData) notFound();

  const [videos, credits, reviews, similarMovies] = await Promise.all([
    getMovieVideos(movieData.id),
    getMovieCredits(movieData.id),
    getMovieReviews(movieData.id),
    getSimilarMovies(movieData.id),
  ]);

  const backdropUrl = movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null;
  const posterUrl = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null;
  const trailer = videos?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const cast = credits.cast.slice(0, 10);
  const crew = credits.crew.filter(m => ['Director', 'Writer', 'Screenplay'].includes(m.job)).slice(0, 5);
  const userReviews = reviews?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-8">
      {backdropUrl && (
        <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
          <Image src={backdropUrl} alt={`${movieData.title} backdrop`} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
      )}

      <div className="p-4 sm:p-8 md:p-12 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row items-start md:space-x-8">
          <div className="w-full md:w-1/3 flex-shrink-0 mb-6 md:mb-0">
            <Image
              src={posterUrl || `https://placehold.co/500x750/1f2937/d1d5db?text=Poster+Not+Available`}
              alt={movieData.title}
              width={500}
              height={750}
              className="w-full h-auto rounded-lg shadow-xl"
              priority
              unoptimized={!posterUrl}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 mb-2">{movieData.title}</h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-4 italic">{movieData.tagline}</p>
            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                <FaStar className="text-yellow-400 mr-1" />
                {movieData.vote_average.toFixed(1)} / 10
              </span>
              <span className="text-gray-400 text-sm">{movieData.release_date?.substring(0, 4)}</span>
              <span className="text-gray-400 text-sm">
                {movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : 'N/A'}
              </span>
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-2">Synopsis</h2>
            <p className="text-gray-300 text-justify mb-6">{movieData.overview || 'Synopsis not available.'}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
              <div>
                <p><strong>Genre:</strong> {movieData.genres?.map(g => g.name).join(', ')}</p>
                <p><strong>Status:</strong> {movieData.status}</p>
              </div>
              <div>
                <p><strong>Director:</strong> {crew.find(m => m.job === 'Director')?.name || 'N/A'}</p>
                <p><strong>Website:</strong> <a href={movieData.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{movieData.homepage}</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 md:p-12">
        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Main Cast</h2>
          {cast.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {cast.map(actor => (
                <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-600">
                    {actor.profile_path ? (
                      <Image src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} width={96} height={96} className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FaUserCircle className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400">Cast information not available.</p>}
        </div>

        {trailer && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Trailer</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe className="w-full aspect-video rounded-xl shadow-lg" src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen />
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">User Reviews</h2>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map(review => (
                <div key={review.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-white">{review.author}</p>
                  <p className="text-sm text-gray-300 mt-1 text-justify">{review.content}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400">No reviews for this movie yet.</p>}
        </div>

        {similarMovies && similarMovies.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Similar Movies</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
              {similarMovies.slice(0, 10).map(item => (
                <MovieCard key={item.id} movie={item} allMovies={similarMovies} />
              ))}
            </div>
          </div>
        )}
		
        <div className="mt-12 text-center">
          <Link href={`/movie/${slug}/stream`}>
            <button className="bg-blue-700 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg">
              🎬 Stream Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}