import Link from "next/link";
import { fetchTMDB, getImageUrl } from "@/api";

export const dynamic = 'force-dynamic'; // 🟢 Memaksa halaman dinamis ini di-render saat diakses, bukan saat build ekspor statis

// 1. Meta Tags Dinamis (Sudah diperbaiki dengan await params)
export async function generateMetadata({ params }) {
  const { slugId } = await params; // 🟢 Di-await dulu di sini
  const id = slugId.split("-").pop();
  
  const movie = await fetchTMDB(`/movie/${id}?language=en-US`);
  
  if (!movie) {
    return { title: "Movie Not Found - CineVisio" };
  }

  return {
    title: `Watch ${movie.title} (${movie.release_date?.substring(0, 4) || ""}) Free On CineVisio`,
    description: `Streaming ${movie.title} full movie online in HD quality. ${movie.overview?.substring(0, 150)}...`,
  };
}

// 2. Komponen Utama (Sudah diperbaiki dengan await params)
export default async function MovieDetailPage({ params }) {
  const { slugId } = await params; // 🟢 Di-await dulu di sini
  const id = slugId.split("-").pop();
  
  const movie = await fetchTMDB(`/movie/${id}?language=en-US`);

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">
        Film tidak ditemukan atau API error.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-500">Home</Link> &raquo; <span>Movies</span> &raquo; <span className="text-gray-300">{movie.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 bg-[#141414] p-6 rounded-2xl border border-[#222]">
        <div className="w-full md:w-1/4 flex-shrink-0 mx-auto md:mx-0 max-w-[280px]">
          <div className="aspect-[2/3] rounded-xl overflow-hidden border border-[#333] shadow-lg">
            <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} className="w-full h-full object-cover"/>
          </div>
        </div>

        <div className="w-full md:w-3/4 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">{movie.title}</h1>
            <p className="text-sm text-gray-400 italic mb-4">{movie.tagline || "No tagline available."}</p>
            <div className="flex flex-wrap gap-2 text-xs mb-6">
              <span className="bg-[#222] px-3 py-1 rounded-full text-red-500 font-semibold">⭐ {movie.vote_average?.toFixed(1)}</span>
              <span className="bg-[#222] px-3 py-1 rounded-full text-gray-300">{movie.release_date?.substring(0, 4)}</span>
              <span className="bg-[#222] px-3 py-1 rounded-full text-gray-300">{movie.runtime} min</span>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-2">Storyline</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{movie.overview || "No description available for this movie."}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 border-t border-[#222] pt-6">
            <Link href={`/stream/movie/${movie.id}`} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-center py-3.5 px-6 rounded-xl transition duration-300 shadow-md hover:scale-[1.02] transform">
              🚀 WATCH FULL MOVIE
            </Link>
            <Link href={`/trailer/movie/${movie.id}`} className="bg-[#222] hover:bg-[#333] text-gray-200 font-medium text-center py-3.5 px-6 rounded-xl transition duration-300 border border-[#444]">
              🎬 Watch Trailer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}