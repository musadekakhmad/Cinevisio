import { fetchTMDB } from "@/api"; 

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function StreamPage({ params }) {
  const { type, id } = await params;
  
  if (isNaN(id)) {
    return { title: "Streaming Player - CINEVISIO" };
  }

  const data = await fetchTMDB(`/${type}/${id}`);
  const title = data?.title || data?.name || "Content";
  return {
    title: `Watch ${title} Free HD Streaming - CINEVISIO`,
    description: `Watch free streaming ${title} online with high quality servers on CINEVISIO.`,
  };
}

// 2. KOMPONEN HALAMAN UTAMA PLAYER
export default async function StreamPage({ params, searchParams }) {
  const { type, id } = await params;
  const sParams = await searchParams;
  const currentServer = sParams.server || "1";

  // Pengaman jika ID bukan angka murni
  if (isNaN(id)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-[#0f0f0f] text-gray-100 min-h-screen">
        <p className="text-red-500 font-bold">Invalid Content ID.</p>
        <Link href="/" className="text-xs text-gray-400 underline mt-2 block">Back to Home</Link>
      </div>
    );
  }

  const data = await fetchTMDB(`/${type}/${id}`);
  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-[#0f0f0f] text-red-500 font-bold min-h-screen">
        Content data load failed.
      </div>
    );
  }

  // KUNCI VARIABEL DI SINI: Pastikan dideklarasikan sebagai 'title' agar tidak crash di bawah
  const title = data.title || data.name;

  // URL penyedia player pihak ketiga internasional
  const embedUrls = {
    "1": `https://vidsrc.to/embed/${type}/${id}`,
    "2": `https://vidsrc.me/${type}/${id}`
  };

  const finalEmbedUrl = embedUrls[currentServer] || embedUrls["1"];

  return (
    <div className="bg-[#0f0f0f] text-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* BREADCRUMB */}
        <div className="text-xs text-gray-500 mb-4 font-medium">
          <Link href="/" className="hover:text-red-500 transition">Home</Link> &raquo; 
          <span className="capitalize"> {type}</span> &raquo; 
          <span className="text-gray-300"> Watch {title}</span>
        </div>

        {/* JUDUL WATCHING YANG SEBELUMNYA CRASH */}
        <h1 className="text-xl md:text-2xl font-black text-white mb-4 uppercase tracking-wide">
          Streaming: <span className="text-red-600">{title}</span>
        </h1>

        {/* BOX CONTAINER VIDEO PLAYER */}
        <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-[#222] shadow-2xl">
          <iframe 
            src={finalEmbedUrl}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          ></iframe>
        </div>

        {/* PANEL STRATEGI MULTI SERVER */}
        <div className="mt-6 bg-[#141414] p-4 rounded-xl border border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Streaming Server:</h3>
            <p className="text-[10px] text-gray-600 mt-0.5">If the current server buffers, please switch to alternative servers below.</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/stream/${type}/${id}?server=1`} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${currentServer === "1" ? "bg-red-600 text-white border-red-600" : "bg-[#222] text-gray-400 border-[#333] hover:text-white"}`}
            >
              🚀 Server 1 (VidLink)
            </Link>
            <Link 
              href={`/stream/${type}/${id}?server=2`} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${currentServer === "2" ? "bg-red-600 text-white border-red-600" : "bg-[#222] text-gray-400 border-[#333] hover:text-white"}`}
            >
              ⚡ Server 2 (VidSrc)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}