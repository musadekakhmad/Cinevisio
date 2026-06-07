import Link from "next/link";
// Memasukkan fungsi helper yang kamu pakai di dalam loop agar tidak error undefined
import { fetchTMDB, createSlug, getImageUrl } from "@/api"; 

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const sParams = await searchParams;
  const type = sParams.type || "movie";
  const category = sParams.category || "popular";
  const search = sParams.search || "";
  const genre = sParams.genre || "";
  const genreName = sParams.genreName || "Genre";

  let endpoint = "";
  let titleLabel = "";

  // Penentuan Logic API Endpoint
  if (search) {
    endpoint = `/search/multi?query=${encodeURIComponent(search)}`;
    titleLabel = `Search Results for: "${search}"`;
  } else if (genre) {
    endpoint = `/discover/${type}?with_genres=${genre}`;
    titleLabel = `${type === "tv" ? "TV Shows" : "Movies"} » ${genreName}`;
  } else {
    // JIKA DEFAULT (HOME): Tampilkan Trending Campuran All Hari Ini bawaan asli TMDB
    if (!sParams.type && !sParams.category) {
      endpoint = "/trending/all/day";
      titleLabel = "Trending Today (Movies & TV Shows)";
    } else {
      endpoint = `/${type}/${category}`;
      titleLabel = `${type === "tv" ? "TV Shows" : "Movies"} - ${category.replace('_', ' ')}`;
    }
  }

  const data = await fetchTMDB(endpoint);
  // Filter data untuk memastikan item memiliki poster agar visual grid tetap presisi rata
  const items = data?.results?.filter(item => item.poster_path) || [];

  return (
    <div className="bg-[#0f0f0f] text-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* JUDUL SEKSYEN KATEGORI */}
        <h2 className="text-base font-black uppercase tracking-wider text-white mb-6 border-l-4 border-red-600 pl-3">
          {titleLabel}
        </h2>

        {/* HANDLE JIKA KONTEN TIDAK DITEMUKAN */}
        {items.length === 0 && (
          <p className="text-xs text-gray-500 italic py-10">No content available at the moment. Please try another filter.</p>
        )}

        {/* GRID UTAMA POSTER RATA KANAN KIRI */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => {
            const isItemTv = item.media_type === "tv" || type === "tv";
            const itemTitle = item.title || item.name;
            const itemRating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
            
            // PROTEKSI TANGGAL: Mengantisipasi crash jika data date dari TMDB kosong atau corrupt
            const rawDate = item.release_date || item.first_air_date;
            const itemYear = rawDate && !isNaN(new Date(rawDate).getTime()) 
              ? new Date(rawDate).getFullYear() 
              : "2026";
            
            // Format URL Super SEO tanpa query string bocor ke luar
            const prefix = isItemTv ? "tv-" : "";
            const slug = `${prefix}${createSlug(itemTitle)}-${item.id}`;

            return (
              <Link 
                key={item.id} 
                href={`/movie/${slug}`}
                className="group bg-[#141414] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#333] transition-all flex flex-col h-full relative"
              >
                {/* GAMBAR POSTER + FLOATING BADGE RATING */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black flex-shrink-0">
                  <img 
                    src={getImageUrl(item.poster_path, 'w342')} 
                    alt={itemTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  {/* Badge Rating Angka Emas */}
                  <span className="absolute top-2 right-2 bg-black/80 border border-[#2b2b2b] text-yellow-500 font-bold text-[10px] px-2 py-0.5 rounded shadow-md z-10">
                    ★ {itemRating}
                  </span>
                </div>

                {/* TEKS JUDUL & TAHUN */}
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
    </div>
  );
}