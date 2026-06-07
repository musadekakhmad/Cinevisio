import Link from "next/link";
import { fetchTMDB } from "@/api";

export const dynamic = 'force-dynamic'; // 🟢 Memaksa halaman dinamis ini di-render saat diakses

// 1. Meta Tags (Sudah diperbaiki dengan await params)
export async function generateMetadata({ params }) {
  const { type, id } = await params; // 🟢 Di-await dulu di sini
  const data = await fetchTMDB(`/${type}/${id}?language=en-US`);
  if (!data) return { title: "Watch Official Trailer - CineVisio" };
  const titleName = data.title || data.name;
  return {
    title: `${titleName} Official Trailer Online Free - CineVisio`,
    description: `Watch the official movie trailer and teaser for ${titleName} in Full HD on CineVisio.`,
  };
}

// 2. Komponen Utama (Sudah diperbaiki dengan await params)
export default async function TrailerPage({ params }) {
  const { type, id } = await params; // 🟢 Di-await dulu di sini

  const data = await fetchTMDB(`/${type}/${id}?language=en-US`);
  const titleName = data ? (data.title || data.name) : "Content";

  const videoData = await fetchTMDB(`/${type}/${id}/videos?language=en-US`);
  const officialTrailer = videoData?.results?.find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  ) || videoData?.results?.[0];

  const youtubeKey = officialTrailer?.key;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#222] pb-4">
        <div>
          <span className="text-xs bg-red-600/20 text-red-500 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Official Trailer</span>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-2">{titleName}</h1>
        </div>
        <Link href={data ? `/movie/${id}` : "/"} className="text-xs bg-[#222] hover:bg-[#333] border border-[#333] px-4 py-2 rounded-lg text-gray-300 transition text-center self-start sm:self-center">
          ⬅ Back to Details
        </Link>
      </div>

      <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#222] relative aspect-video">
        {youtubeKey ? (
          <iframe src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&modestbranding=1`} className="w-full h-full" allowFullScreen frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm p-6 text-center">
            🎬 <span className="mt-2">Sorry, the official trailer for this content is currently unavailable.</span>
          </div>
        )}
      </div>

      <div className="mt-6 bg-[#141414] p-5 rounded-xl border border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Enjoyed the trailer?</h3>
          <p className="text-xs text-gray-400 mt-0.5">Click the button on the right to stream the full length feature now.</p>
        </div>
        <Link href={`/stream/${type}/${id}`} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-lg transition transform hover:scale-[1.03] w-full sm:w-auto text-center shadow-lg">
          🚀 STREAM FULL MOVIE NOW
        </Link>
      </div>
    </div>
  );
}