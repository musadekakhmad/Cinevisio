import Link from "next/link";
import { fetchTMDB } from "@/api";

export const dynamic = 'force-dynamic'; // 🟢 Memaksa halaman dinamis ini di-render saat diakses

// 1. Meta Tags (Sudah diperbaiki dengan await params)
export async function generateMetadata({ params }) {
  const { type, id } = await params; // 🟢 Di-await dulu di sini
  const data = await fetchTMDB(`/${type}/${id}?language=en-US`);
  if (!data) return { title: "Watch Stream - CineVisio" };
  const titleName = data.title || data.name;
  return {
    title: `Stream ${titleName} Full HD Free Online - CineVisio`,
    description: `Watch streaming online ${titleName} with english and multi-language subtitles on CineVisio server.`,
  };
}

// 2. Komponen Utama (Sudah diperbaiki dengan await params & searchParams)
export default async function StreamPage({ params, searchParams }) {
  const { type, id } = await params; // 🟢 Di-await dulu di sini
  const { server } = await searchParams; // 🟢 Di-await dulu di sini
  
  const data = await fetchTMDB(`/${type}/${id}?language=en-US`);
  const titleName = data ? (data.title || data.name) : "Content";
  const activeServer = server || "1";

  let embedUrl = activeServer === "1" 
    ? `https://vidsrc.to/embed/${type}/${id}` 
    : `https://multiembed.mov/?video_id=${id}&tmdb=1`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            <span className="text-red-500">Watching:</span> {titleName}
          </h1>
          <p className="text-xs text-gray-400 mt-1">If the current server errors, please switch to another server below.</p>
        </div>
        <Link href="/" className="text-xs bg-[#222] hover:bg-[#333] border border-[#333] px-4 py-2 rounded-lg text-gray-300 transition text-center self-start sm:self-center">
          ⬅ Back to Home
        </Link>
      </div>

      <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#222] relative aspect-video">
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen scrolling="no" frameBorder="0" allow="autoplay; encrypted-media"></iframe>
      </div>

      <div className="mt-6 bg-[#141414] p-4 rounded-xl border border-[#222] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Select Server:</span>
          <Link href={`/stream/${type}/${id}?server=1`} className={`px-4 py-2 text-xs font-semibold rounded-lg transition duration-200 ${activeServer === "1" ? "bg-red-600 text-white shadow-md" : "bg-[#222] text-gray-300 hover:bg-[#333]"}`}>
            🚀 Server 1 (VidSrc)
          </Link>
          <Link href={`/stream/${type}/${id}?server=2`} className={`px-4 py-2 text-xs font-semibold rounded-lg transition duration-200 ${activeServer === "2" ? "bg-red-600 text-white shadow-md" : "bg-[#222] text-gray-300 hover:bg-[#333]"}`}>
            ⚡ Server 2 (Backup)
          </Link>
        </div>
        <div>
          <a href="PASTE_URL_SMARTLINK_ADSTERRA_ANDA_DI_SINI" target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold text-xs px-4 py-2 rounded-lg transition transform hover:scale-105">
            🔥 FIX PLAYER / SLOW LOADING? CLICK HERE
          </a>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-gray-500 leading-relaxed bg-[#111] p-3 rounded-lg border border-[#1c1c1c]">
        <p><strong>Note for global users:</strong> All streaming links are populated automatically via third-party APIs. If you encounter infinite buffering or broken videos, please switch servers or activate a VPN targeting United States / European locations for smoother bandwidth routes.</p>
      </div>
    </div>
  );
}