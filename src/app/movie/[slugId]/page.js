import Link from "next/link";
import { fetchTMDB, getImageUrl, createSlug } from "@/api";

export const dynamic = 'force-dynamic';

// HELPER PINTAR: Mengambil data TMDB, Auto-Switch Tipe jika salah, dan Sembunyikan Log 404
async function fetchSafeTMDB(type, id, extraPath = "") {
  const path = extraPath ? `/${extraPath}` : "";
  const primaryEndpoint = `/${type}/${id}${path}`;
  
  try {
    return await fetchTMDB(primaryEndpoint);
  } catch (error) {
    // Jika error 404 terjadi pada Movie di request utama, coba selamatkan dengan menembak kategori TV
    if (error.message && error.message.includes("404") && type === "movie" && !extraPath) {
      const fallbackEndpoint = `/tv/${id}`;
      try {
        return await fetchTMDB(fallbackEndpoint);
      } catch (fallbackError) {
        return null;
      }
    }
    
    // Meredam semua jenis error 404 (data tidak ditemukan) agar tidak mengotori terminal CMD
    if (error.message && error.message.includes("404")) {
      return null;
    }

    // Selain error 404 (misal internet putus / API mati), tetap munculkan log untuk debugging
    console.error(`TMDB Network Error [${primaryEndpoint}]:`, error.message);
    return null;
  }
}

// GENERATE DYNAMIC METADATA
export async function generateMetadata({ params }) {
  const { slugId } = await params;
  const id = slugId.split("-").pop();
  const isTv = slugId.startsWith("tv-");
  const type = isTv ? "tv" : "movie";

  if (isNaN(id)) return { title: "Detail Streaming - CINEVISIO" };

  const data = await fetchSafeTMDB(type, id);
  if (!data) return { title: "Content Not Found - CINEVISIO" };

  const title = data.title || data.name || "Content";
  const year = data.release_date || data.first_air_date ? new Date(data.release_date || data.first_air_date).getFullYear() : "2026";
  
  return {
    title: `Watch ${title} (${year}) Full Movie Streaming Free HD - CINEVISIO`,
    description: `Stream ${title} (${year}) online with multiple subtitles options on CINEVISIO.`,
  };
}

// HALAMAN UTAMA DETAIL
export default async function DetailPage({ params }) {
  const { slugId } = await params;
  
  // Deteksi tipe konten berdasarkan awalan slug
  const isTv = slugId.startsWith("tv-");
  const type = isTv ? "tv" : "movie";
  const id = slugId.split("-").pop();

  if (isNaN(id)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500 font-bold min-h-screen bg-[#0f0f0f]">
        Invalid Content ID.
      </div>
    );
  }

  // 1. Panggil data utama menggunakan fungsi baru yang aman dari log merah
  const data = await fetchSafeTMDB(type, id);

  // Jika data utama kosong (ID tidak terdaftar di TMDB), tampilkan pesan error rapi
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400 min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-black text-red-600 uppercase">⚠️ Content Not Found (404)</h2>
        <p className="text-xs text-gray-500 max-w-md">
          Maaf bro, konten dengan ID <span className="text-white font-bold">#{id}</span> tidak ditemukan di database TMDB.
        </p>
        <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded transition mt-2">
          Back to Home
        </Link>
      </div>
    );
  }

  // Jaga-jaga jika ada auto-switch tipe di latar belakang, sesuaikan tipe aslinya demi akurasi sub-request
  const realType = data.first_air_date ? "tv" : "movie";

  // 2. Panggil data tambahan menggunakan fungsi baru (Parameter di baris 81, 82, 83 sudah disinkronkan!)
  const credits = await fetchSafeTMDB(realType, id, "credits");
  const similarData = await fetchSafeTMDB(realType, id, "similar");

  const title = data.title || data.name;
  const year = data.release_date || data.first_air_date ? new Date(data.release_date || data.first_air_date).getFullYear() : "2026";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "0.0";
  const runtime = data.runtime ? `${data.runtime} min` : data.episode_run_time?.[0] ? `${data.episode_run_time[0]} min` : "N/A";
  
  const director = credits?.crew?.find(c => c.job === "Director")?.name || "Unknown";
  const writer = credits?.crew?.find(c => c.job === "Writer" || c.job === "Screenplay")?.name || "Unknown";
  
  const castList = credits?.cast?.slice(0, 15).map(c => c.name).join(", ") || "No Cast Data Available";
  const recommendations = similarData?.results?.slice(0, 6) || [];

  return (
    <div className="bg-[#0f0f0f] text-gray-100 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* BREADCRUMB */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1 font-medium">
          <Link href="/" className="hover:text-red-500 transition">Home</Link> &raquo;
          <span className="uppercase text-gray-400 font-bold">{realType}</span> &raquo;
          <span className="text-gray-300 truncate">{title}</span>
        </div>

        <Link href="/" className="inline-block text-xs font-bold text-red-600 hover:text-red-500 mb-6 transition">
          &larr; Back
        </Link>

        {/* BOX CONTAINER UTAMA */}
        <div className="flex flex-col lg:flex-row gap-8 items-start bg-[#141414] border border-[#1f1f1f] p-6 rounded-2xl shadow-xl">
          
          {/* POSTER KIRI */}
          <div className="w-full lg:w-64 flex-shrink-0 mx-auto">
            <img 
              src={getImageUrl(data.poster_path, 'w500')} 
              alt={title}
              className="w-full h-auto rounded-xl border border-[#2b2b2b] shadow-2xl object-cover aspect-[2/3]"
            />
          </div>

          {/* AREA DATA KANAN */}
          <div className="flex-grow space-y-5 w-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                {title} <span className="text-gray-500 font-normal">({year})</span>
              </h1>
              
              {/* RATING & DURASI BAR */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400 mt-3">
                <span className="flex items-center gap-1 text-yellow-500 bg-[#222] px-2.5 py-1 rounded border border-[#333]">
                  ⭐ {rating}/10 ({data.vote_count || 0} votes)
                </span>
                <span className="flex items-center gap-1 bg-[#222] px-2.5 py-1 rounded border border-[#333]">
                  🎬 {runtime}
                </span>
                <span className="flex items-center gap-1 bg-[#222] px-2.5 py-1 rounded border border-[#333]">
                  📅 {data.release_date || data.first_air_date || "Unknown"}
                </span>
              </div>
            </div>

            {/* STRUKTUR INFORMASI META AWAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-[#222] pt-4 leading-relaxed">
              <p><span className="text-gray-500 font-bold inline-block w-16">Genres:</span> <span className="text-gray-300">{data.genres?.map(g => g.name).join(", ")}</span></p>
              <p><span className="text-gray-500 font-bold inline-block w-16">Director:</span> <span className="text-red-500 font-semibold">{director}</span></p>
              <p><span className="text-gray-500 font-bold inline-block w-16">Writer:</span> <span className="text-gray-300">{writer}</span></p>
              <p><span className="text-gray-500 font-bold inline-block w-16">Status:</span> <span className="text-gray-400">{data.status || "Released"}</span></p>
            </div>

            {/* STRUKTUR GRID 2 KOLOM KHUSUS ACTOR DAN PLOT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs border-t border-[#222] pt-4 leading-relaxed text-justify">
              {/* KOLOM KIRI: ACTOR */}
              <div className="space-y-1">
                <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Cast / Actors:</h3>
                <p className="text-gray-300 font-medium">{castList}</p>
              </div>

              {/* KOLOM KANAN: PLOT / OVERVIEW */}
              <div className="space-y-1">
                <h3 className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">Plot Summary:</h3>
                <p className="text-gray-400">{data.overview || "No detailed plot summary available for this content."}</p>
              </div>
            </div>

            {/* BUTTONS ACTION */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#222]">
              <Link 
                href={`/trailer/${realType}/${id}`}
                className="bg-blue-700 hover:bg-red-700 text-white text-xs font-black px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all uppercase"
              >
                ▶ Trailer
              </Link>
              <Link 
                href={`/stream/${realType}/${id}`}
                className="bg-red-700 hover:bg-blue-700 text-white text-xs font-black px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-all border border-[#3d3d3d] uppercase"
              >
                ▶ Watch Now
              </Link>
            </div>
          </div>
        </div>

        {/* YOU MAY ALSO LIKE */}
        {recommendations.length > 0 && (
          <div className="mt-12 border-t border-[#1f1f1f] pt-8">
            <h2 className="text-base font-black uppercase tracking-wider text-red-600 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((item) => {
                const itemTitle = item.title || item.name;
                const itemYear = new Date(item.release_date || item.first_air_date).getFullYear() || "2026";
                const itemRating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
                
                const itemPrefix = realType === "tv" ? "tv-" : "";
                const itemSlug = `${itemPrefix}${createSlug(itemTitle)}-${item.id}`;

                return (
                  <Link 
                    key={item.id} 
                    href={`/movie/${itemSlug}`}
                    className="group bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#333] transition-all flex flex-col h-full relative"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-black flex-shrink-0">
                      <img 
                        src={getImageUrl(item.poster_path, 'w342')} 
                        alt={itemTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 bg-black/80 border border-[#333] text-yellow-500 font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                        ★ {itemRating}
                      </span>
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-between min-w-0">
                      <h3 className="text-[11px] font-bold text-gray-300 group-hover:text-white transition truncate w-full">
                        {itemTitle}
                      </h3>
                      <div className="text-[10px] text-gray-500 font-medium mt-1">
                        {itemYear}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}