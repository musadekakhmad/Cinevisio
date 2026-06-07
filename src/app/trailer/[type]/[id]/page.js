import Link from "next/link";
import { fetchTMDB, createSlug } from "@/api";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function TrailerPage({ params }) {
  const { type, id } = await params;

  // Tarik data film/TV untuk mendapatkan judul aslinya demi pembuatan slug URL yang akurat
  let data = null;
  try {
    data = await fetchTMDB(`/${type}/${id}`);
  } catch (e) {
    // Jika gagal, coba fallback silang tipe
    try {
      data = await fetchTMDB(`/${type === "movie" ? "tv" : "movie"}/${id}`);
    } catch (err) {}
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500 font-bold bg-[#0f0f0f] min-h-screen">
        Trailer data unavailable.
        <Link href="/" className="block text-xs text-gray-500 underline mt-4">Back to Home</Link>
      </div>
    );
  }

  const title = data.title || data.name;
  const isTv = type === "tv" || data.first_air_date;
  
  // Rancang ulang URL tujuan agar mengarah ke format SEO baru kita: /movie/judul-id atau /movie/tv-judul-id
  const prefix = isTv ? "tv-" : "";
  const targetSlugId = `${prefix}${createSlug(title)}-${id}`;

  // Ambil data video/trailer dari TMDB
  let videoData = null;
  try {
    videoData = await fetchTMDB(`/${isTv ? "tv" : "movie"}/${id}/videos`);
  } catch (e) {}

  const trailer = videoData?.results?.find(
    (v) => v.type === "Trailer" && (v.site === "YouTube" || v.site === "Youtube")
  );

  return (
    <div className="bg-[#0f0f0f] text-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* TOMBOL KEMBALI KUNCI SEO - Membawa user balik ke halaman detail yang tepat */}
        <Link 
          href={`/movie/${targetSlugId}`} 
          className="inline-block text-xs font-bold text-red-600 hover:text-red-500 mb-6 transition"
        >
          &larr; Back to Details
        </Link>

        <h1 className="text-xl md:text-2xl font-black text-white mb-6 uppercase tracking-wide">
          Official Trailer: <span className="text-gray-400">{title}</span>
        </h1>

        {trailer ? (
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#222] shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        ) : (
          <div className="aspect-video w-full bg-[#141414] rounded-2xl border border-[#222] flex flex-col items-center justify-center text-gray-500 text-sm font-bold gap-2 shadow-inner">
            <span>📺 Video trailer belum tersedia untuk konten ini.</span>
            <span className="text-xs font-normal text-gray-600">Silakan tonton langsung melalui tombol Watch Now.</span>
          </div>
        )}

      </div>
    </div>
  );
}