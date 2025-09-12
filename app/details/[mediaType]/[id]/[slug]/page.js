import { notFound } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import MovieDetailInfo from '@/components/MovieDetailInfo';
import MovieImage from '@/components/MovieImage';
import WatchNowButton from '@/components/WatchNowButton';

// Konfigurasi API
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// ====================================================================================
// FUNGSI UNTUK MENDAPATKAN METADATA DINAMIS (Penting untuk SEO)
// Ini adalah Server Component, jadi tidak ada 'use client'
// ====================================================================================
export async function generateMetadata({ params }) {
  const { mediaType, id } = params;

  // Menggunakan try/catch untuk error handling
  try {
    const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error('Failed to fetch movie data');
    }
    const data = await res.json();
    const mediaTitle = data.title || data.name;

    return {
      title: `${mediaTitle} | Cine Visio`,
      description: data.overview || `Information about ${mediaTitle} di Cine Visio.`,
    };
  } catch (err) {
    console.error('Error fetching metadata:', err);
    return {
      title: 'Page Not Found | Cine Visio',
      description: 'The page you are looking for was not found.',
    };
  }
}

// ====================================================================================
// KOMPONEN UTAMA (SERVER COMPONENT)
// ====================================================================================
export default async function MediaDetailPage({ params }) {
  const { mediaType, id, slug } = params;

  // Fetch data di sisi server
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
  if (!res.ok) {
    notFound();
  }
  const data = await res.json();

  // Fetch data untuk rekomendasi
  const recommendationsRes = await fetch(`${BASE_URL}/${mediaType}/${id}/recommendations?api_key=${API_KEY}`);
  const recommendationsData = await recommendationsRes.json();
  const recommendations = recommendationsData?.results || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Tampilkan detail media */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})` }}
        ></div>
        <div className="relative container mx-auto p-4 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Komponen untuk gambar (ini bisa jadi Client Component terpisah) */}
          <MovieImage movie={data} />
          {/* Komponen untuk info detail (juga bisa Client Component) */}
          <MovieDetailInfo movie={data} />
        </div>
      </div>

      {/* Komponen tombol tonton sekarang (ini harus Client Component) */}
      <WatchNowButton movieId={id} />

      {/* Rekomendasi */}
      <section className="container mx-auto p-4 md:p-8 mt-12">
        <h2 className="text-3xl font-bold mb-6">Recommendations</h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recommendations.slice(0, 12).map((media) => (
              <MovieCard key={media.id} media={media} mediaType={media.media_type} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recommendations available.</p>
        )}
      </section>
    </div>
  );
}
