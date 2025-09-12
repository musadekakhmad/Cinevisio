// app/[mediaType]/[id]/[slug]/page.js

import { notFound } from 'next/navigation';
import MovieImage from '@/components/MovieImage';
import MovieCard from '@/components/MovieCard';
import WatchNowButton from '@/components/WatchNowButton';
import Link from 'next/link';

/*
  API Configuration
  Don't forget to fill in your API KEY here.
  BASE_URL points to a TMDB proxy to avoid CORS issues.
  IMAGE_BASE_URL is the base URL for poster images.
*/
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // <-- FILL WITH YOUR API KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/*
  Function to get dynamic metadata (Important for SEO)
  This will create specific Open Graph and Twitter Card tags for each page.
*/
export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { mediaType, id, slug } = awaitedParams;

  const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
  const details = res.ok ? await res.json() : null;

  if (!details) {
    return {};
  }

  const title = `${details.title || details.name} | Cine Visio`;
  const description = details.overview || 'Your ultimate destination for high-quality free movie and TV show streaming.';
  const imageUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/original${details.poster_path}`
    : 'https://placehold.co/1200x630/000000/FFFFFF?text=No+Image';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://cinevisio.netlify.app/${mediaType}/${id}/${slug}`,
      siteName: 'Cine Visio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
      appId: 'cut.erna.984',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

/*
  Data Fetching Functions for Detail Page
  This is a collection of asynchronous functions that fetch data from the API.
  Each function has basic error handling.
*/
async function getMediaDetails(mediaType, id) {
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
  if (!res.ok) {
    notFound();
  }
  return res.json();
}

async function getMediaCredits(mediaType, id) {
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}`);
  if (!res.ok) {
    return { cast: [], crew: [] };
  }
  return res.json();
}

async function getMediaVideos(mediaType, id) {
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`);
  if (!res.ok) {
    return { results: [] };
  }
  return res.json();
}

async function getSimilarMedia(mediaType, id) {
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}/similar?api_key=${API_KEY}`);
  if (!res.ok) {
    return { results: [] };
  }
  return res.json();
}

async function getMediaReviews(mediaType, id) {
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}/reviews?api_key=${API_KEY}`);
  if (!res.ok) {
    return { results: [] };
  }
  return res.json();
}

const getDirector = (crew) => {
  const director = crew.find(member => member.job === 'Director');
  return director ? { name: director.name, id: director.id } : { name: 'Unknown', id: null };
};

/*
  Main Page Component
  This is the asynchronous React component that renders the entire detail page.
  It fetches all the necessary data and displays it.
*/
export default async function MediaDetailPage({ params }) {
  const awaitedParams = await params;
  const { mediaType, id } = awaitedParams;

  const [details, credits, videos, similar, reviews] = await Promise.all([
    getMediaDetails(mediaType, id),
    getMediaCredits(mediaType, id),
    getMediaVideos(mediaType, id),
    getSimilarMedia(mediaType, id),
    getMediaReviews(mediaType, id)
  ]);

  const director = getDirector(credits.crew);
  const officialTrailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const trailerKey = officialTrailer ? officialTrailer.key : null;
  const cast = credits.cast.slice(0, 10);
  const similarMovies = similar.results.slice(0, 6);
  const userReviews = reviews.results.slice(0, 5);

  const mediaTitle = details.title || details.name;
  const mediaTagline = details.tagline;
  const mediaOverview = details.overview;
  const mediaReleaseDate = details.release_date || details.first_air_date;
  const runtime = details.runtime; // For movies
  const episodeRuntime = details.episode_run_time?.[0]; // For TV shows
  const status = details.status;

  // Dynamic icon based on status
  const statusIcon = (() => {
    switch (status) {
      case 'Released':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-green-400 transform transition-transform duration-300 hover:scale-125" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        );
      case 'In Production':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-yellow-400 transform transition-transform duration-300 hover:scale-125" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3.5-3.5zm-2.5 13.5a.5.5 0 0 1-.708 0L3 11.5l1.5-1.5 6.5 6.5-1.5 1.5-2.5-2.5 3-3-4.5-4.5-2 2-2-2 3-3-4.5-4.5L.146 1.854a.5.5 0 0 0 0 .707l3.5 3.5a.5.5 0 0 0 .707 0L8.5 2.5l-6.5 6.5-1.5 1.5 1.5 1.5-3.5 3.5a.5.5 0 0 0 .707.707L4 15.5l1.5-1.5L10 16z"/>
          </svg>
        );
      case 'Canceled':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-red-400 transform transition-transform duration-300 hover:scale-125" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-gray-400 transform transition-transform duration-300 hover:scale-125" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm2 12V2h12v12H2z"/>
            <path d="M4 7h8v2H4z"/>
          </svg>
        );
    }
  })();

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden md:flex">
          <div className="md:w-1/3 p-4">
            <MovieImage
              src={details.poster_path ? `${IMAGE_BASE_URL}${details.poster_path}` : 'https://placehold.co/500x750?text=No+Image'}
              alt={`Poster for ${mediaTitle}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">{mediaTitle}</h1>
            {mediaTagline && (
              <h2 className="text-xl font-light text-gray-400 mb-4">{mediaTagline}</h2>
            )}
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Movie Details</h2>
              {/* Rating and release date side by side */}
              <div className="flex items-center text-yellow-500 mb-4">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-gray-300">{details.vote_average?.toFixed(1)}</span>
                <span className="mx-2 text-gray-500">|</span>
                {mediaReleaseDate && (
                  <span className="flex items-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 mr-1 text-yellow-500" viewBox="0 0 16 16">
                      <path d="M12 11c-1.333 0-2-1-2-2s-.667-2-2-2c-1.333 0-2 1-2 2s-.667 2-2 2c-1.333 0-2-1-2-2s-.667-2-2-2c-1.333 0-2 1-2 2s-.667 2-2 2c-1.333 0-2-1-2-2v5c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2v-5c0 1-1 2-2 2zM12 8c1.333 0 2 1 2 2s.667 2 2 2c1.333 0 2-1 2-2s-.667-2 2-2c1.333 0 2 1 2 2s-.667 2 2 2c1.333 0 2-1 2-2v-5c0-1.105-.895-2-2-2h-12c-1.105 0-2 .895-2 2v5c0-1 1-2 2-2z"/>
                    </svg>
                    <span>{mediaReleaseDate}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {details.genres?.map(genre => (
                  <Link key={genre.id} href={`/genre/${mediaType}/${genre.id}`} className="bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-red-700 transition-colors duration-300">
                    {genre.name}
                  </Link>
                ))}
              </div>
              
              {/* Group for short details */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                {/* Status */}
                <div className="flex items-center">
                  <span className="flex items-center text-gray-400 font-bold">
                    {statusIcon}
                    Status:
                  </span>
                  <span className="ml-2 text-gray-300">{status}</span>
                </div>
                {/* Language */}
                <div className="flex items-center">
                  <span className="flex items-center text-gray-400 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.203-1.393.668-2.072 1.547-.732.946-1.245 2.189-1.579 3.49-.078.298-.173.668-.222 1.05-.045.358-.063.79-.063 1.22l-.002.164.004.162.007.272a8.006 8.006 0 0 0 .445 1.554C3.25 10.966 5.766 12 8 12.002c2.234 0 4.75-1.034 5.922-2.308.204-.216.388-.475.545-.778a6.953 6.953 0 0 0 .265-1.127.818.818 0 0 0-.012-.058A7.989 7.989 0 0 0 8 1.077zM4.309 3.003c.66-.465 1.353-.827 2.052-1.127a6.972 6.972 0 0 1 3.596 0c.699.3.139.662.8 1.127.701.493 1.255 1.08 1.637 1.702-1.742-.317-3.418-.456-5.467-.323C5.748 4.35 4.98 4.095 4.309 3.003zM1.006 8a6.992 6.992 0 0 1 1.764-4.576c.49.529.983 1.157 1.346 1.839-1.144.385-2.002 1.205-2.61 2.737zM8 14.002a6.96 6.96 0 0 1-3.665-1.13c-.66.465-1.353.827-2.052 1.127A7.006 7.006 0 0 0 8 14.002zM14.994 8a6.993 6.993 0 0 1-1.764 4.576c-.49-.529-.983-1.157-1.346-1.839 1.144-.385 2.002-1.205 2.61-2.737z"/>
                    </svg>
                    Language:
                  </span>
                  <span className="ml-2 text-gray-300">{details.original_language.toUpperCase()}</span>
                </div>
                {/* Director */}
                <div className="flex items-center">
                  <span className="flex items-center text-gray-400 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15 12h-1c0-.466-.317-.9-1-1.333V9c0-1-.333-2-1-2.5V4c0-1.105.895-2 2-2s2 .895 2 2v2.5c-.667.5-1.5 1.5-1.5 2.5v1.667c.683.433 1 .867 1 1.333zM8 14.5c-.828 0-1.5.672-1.5 1.5h3c0-.828-.672-1.5-1.5-1.5zM12 11c0 1.105-.895 2-2 2h-4c-1.105 0-2-.895-2-2v-2.5c0-.667.5-1.5 1-2.5V4c0-1.105.895-2 2-2h2c1.105 0 2 .895 2 2v2.5c.667 1 1.5 1.833 1.5 2.5v2.5z"/>
                    </svg>
                    Director:
                  </span>
                  <span className="ml-2 text-gray-300">{director.name}</span>
                </div>
              </div>

              {/* Separate lines for long details */}
              <div className="mb-2">
                <div className="flex items-start">
                  <span className="flex-shrink-0 flex items-center text-gray-400 font-bold mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-indigo-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zM11 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.788 1.077C5.101 11.2 4.316 11 3.5 11c-.533 0-1.026.12-.468.328-1.536 2.531-3.235 3.197-3.96 3.197H.5c-.276 0-.5.224-.5.5s.224.5.5.5h15c.276 0 .5-.224.5-.5s-.224-.5-.5-.5h-2.148c-.725 0-2.424-.666-3.96-3.197zM4.5 9.5A2.5 2.5 0 1 1 2 7a2.5 2.5 0 0 1 2.5 2.5z"/>
                    </svg>
                    Cast:
                  </span>
                  <span className="text-gray-300">
                    {cast.map((actor, index) => (
                      <span key={actor.id}>
                        {actor.name}
                        {index < cast.length - 1 && ', '}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              
              {details.homepage && (
                <div className="mb-2">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 flex items-center text-gray-400 font-bold mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-sky-400" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5H.5zM1 2.5h14v12H1v-12zM8 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1c-1.333 0-2-1-2-2s-.667-2-2-2v5c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2v-5c0 1-1 2-2 2zM12 8c1.333 0 2 1 2 2s.667 2 2 2c1.333 0 2-1 2-2s-.667-2 2-2c1.333 0 2 1 2 2s-.667 2 2 2c1.333 0 2-1 2-2v-5c0-1.105-.895-2-2-2h-12c-1.105 0-2 .895-2 2v5c0-1 1-2 2-2z"/>
                      </svg>
                      Homepage:
                    </span>
                    <a href={details.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {details.homepage}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-2">Synopsis</h3>
          <p className="text-gray-300 leading-relaxed text-justify">{mediaOverview}</p>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Trailer</h3>
          {trailerKey ? (
            <div className="relative w-full overflow-hidden rounded-lg shadow-lg" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            </div>
          ) : (
            <p className="text-gray-500">No trailer available.</p>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Similar Movies</h3>
          {similarMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {similarMovies.map(item => (
                <MovieCard key={item.id} media={item} mediaType={mediaType} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No similar movies available.</p>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">User Reviews</h3>
          {userReviews.length > 0 ? (
            <div className="space-y-6">
              {userReviews.map(review => (
                <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-lg text-white">{review.author}</p>
                    {review.author_details.rating && (
                      <div className="flex items-center ml-4 text-yellow-500">
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm ml-1 text-gray-300">{review.author_details.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm italic">Created on: {new Date(review.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-300 mt-4 leading-relaxed">{review.content.split(' ').slice(0, 50).join(' ')}... <Link href={review.url} target="_blank" className="text-blue-400 hover:text-blue-300">Read more</Link></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
        
        <div className="flex justify-center mt-12 mb-8">
          <WatchNowButton mediaType={mediaType} mediaId={id} />
        </div>
      </div>
    </div>
  );
}
