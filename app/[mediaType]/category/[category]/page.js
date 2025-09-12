import MovieCard from '@/components/MovieCard';
import { notFound } from 'next/navigation';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// Fungsi untuk mengambil data berdasarkan mediaType dan category
async function getMediaByCategory(mediaType, category) {
  // Ganti URL API agar sesuai dengan kategori, bukan genre.
  const res = await fetch(`${BASE_URL}/${mediaType}/${category}?api_key=${API_KEY}`);
  if (!res.ok) {
    notFound();
  }
  return res.json();
}

export default async function CategoryPage({ params }) {
  // Tunggu (await) objek params sebelum mendekonstruksi propertinya.
  // Ini diperlukan di Next.js 14 untuk mencegah error akses asinkron.
  const awaitedParams = await params;
  const { mediaType, category } = awaitedParams;
  
  const data = await getMediaByCategory(mediaType, category);

  const title = `${category.replace(/_/g, ' ').toUpperCase()} ${mediaType === 'movie' ? 'Movies' : 'TV Shows'}`;

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
