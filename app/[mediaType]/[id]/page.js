// app/[mediaType]/[id]/page.js
// Ini adalah contoh halaman detail media yang akan membuat meta tag dinamis
// untuk film dan acara TV.
import { notFound } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import MovieDetailInfo from '@/components/MovieDetailInfo';
import MovieImage from '@/components/MovieImage';
import WatchNowButton from '@/components/WatchNowButton';

// Konfigurasi API
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // <-- ISI DENGAN API KEY ANDA
const API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w1280'; // URL untuk gambar OG

// Fungsi untuk mengambil data media (film atau acara TV)
async function getMediaData(mediaType, id) {
  if (!id || !mediaType) {
    return null;
  }
  const url = `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

// Fungsi generateMetadata (server-side)
// Ini adalah fitur Next.js yang dijalankan di server untuk menghasilkan meta tag
export async function generateMetadata({ params }) {
  const { mediaType, id } = params;
  const media = await getMediaData(mediaType, id);

  // Jika media tidak ditemukan, kembalikan meta tag default atau notFound
  if (!media) {
    return notFound();
  }

  const mediaTitle = media.title || media.name || 'Cine Visio';
  const mediaDescription = media.overview || `Informasi tentang ${mediaTitle} di Cine Visio.`;
  const mediaImage = media.backdrop_path ? `${IMAGE_BASE_URL}${media.backdrop_path}` : 'https://placehold.co/1200x630/1e40af/ffffff?text=Cine+Visio';

  return {
    title: `${mediaTitle} | Cine Visio`,
    description: mediaDescription,
    openGraph: {
      title: `${mediaTitle} | Cine Visio`,
      description: mediaDescription,
      url: `https://cinevisio.netlify.app/${mediaType}/${media.id}`,
      siteName: 'Cine Visio',
      images: [
        {
          url: mediaImage,
          width: 1280,
          height: 720,
          alt: mediaTitle,
        },
      ],
      locale: 'id_ID',
      type: mediaType === 'movie' ? 'video.movie' : 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title: `${mediaTitle} | Cine Visio`,
      description: mediaDescription,
      images: [mediaImage],
    },
  };
}

// Komponen halaman utama untuk menampilkan detail media
export default async function MediaPage({ params }) {
  const { mediaType, id } = params;

  // Fetch data di sisi server
  const media = await getMediaData(mediaType, id);
  if (!media) {
    notFound();
  }

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
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})` }}
        ></div>
        <div className="relative container mx-auto p-4 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Komponen untuk gambar (ini bisa jadi Client Component terpisah) */}
          <MovieImage movie={media} />
          {/* Komponen untuk info detail (juga bisa Client Component) */}
          <MovieDetailInfo movie={media} />
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
