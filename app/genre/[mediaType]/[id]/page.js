import MovieCard from '@/components/MovieCard';
import { notFound } from 'next/navigation';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// Fungsi untuk mengambil data genre dari API
async function getGenre(mediaType) {
  const res = await fetch(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`);
  if (!res.ok) {
    return { genres: [] };
  }
  return res.json();
}

// Fungsi untuk mengambil media berdasarkan genre
async function getMediaByGenre(mediaType, genreId) {
  const res = await fetch(`${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}`);
  if (!res.ok) {
    notFound();
  }
  return res.json();
}

export default async function GenrePage({ params }) {
  // Wait for the params object before destructuring its properties.
  // This is required in Next.js 14 to prevent asynchronous access errors.
  const awaitedParams = await params;
  const { mediaType, id } = awaitedParams;
  
  const [genres, data] = await Promise.all([
    getGenre(mediaType),
    getMediaByGenre(mediaType, id)
  ]);

  const genreName = genres.genres.find(genre => genre.id === parseInt(id))?.name || 'Unknown Genre';

  const title = `${mediaType === 'movie' ? 'Movies' : 'TV Shows'} - ${genreName}`;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
        {title}
      </h1>

      {data && data.results && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.results.map(item => (
            <MovieCard key={item.id} media={item} mediaType={mediaType} />
          ))}
        </div>
      )}
    </div>
  );
}
