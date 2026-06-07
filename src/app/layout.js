import "./globals.css";
import Link from "next/link";
import HeaderNav from "./HeaderNav";

export const metadata = {
  title: "CineVisio - Free Streaming Platform for Movies and TV Shows",
  description: "Watch free streaming movies and TV series online in high quality. Target English, European, and Latin American movies with multi-language subtitle options.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] text-gray-100 min-h-screen flex flex-col font-sans">
        
        {/* HEADER NAV INTERAKTIF (SEARCH, TV, GENRE) */}
        <HeaderNav />

        {/* KONTEN UTAMA */}
        <main className="flex-grow">
          {children}
        </main>

        {/* AREA NATIVE BANNER ADS */}
        <div className="w-full max-w-7xl mx-auto px-4 my-6 text-center">
          <div className="inline-block bg-[#141414] border border-[#262626] rounded-xl p-4 min-h-[150px] w-full text-gray-500 text-xs">
            <p className="mb-2 text-gray-400">Sponsored Recommendation</p>
            <div id="container-adsterra-native">Iklan Native Banner Muncul Di Sini</div>
          </div>
        </div>

        {/* FOOTER HITAM GLOBAL + ABOUT */}
        <footer className="bg-[#141414] border-t border-[#222] py-8 text-sm text-gray-400">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-center md:text-left">
              <div>
                <span className="text-red-600 font-bold tracking-wider text-base">CINEVISIO</span>
                <p className="text-xs mt-1">Free streaming platform for movies and TV shows.</p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">About Our Platform</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  CineVisio is a next-generation indexing platform engineered for global audiences. We provide high-fidelity meta-data compilation utilizing optimized architectures to serve market demands across US, Europe, and Latin America instantly.
                </p>
              </div>
              <div className="flex flex-col space-y-2 text-xs md:items-end">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <a href="#" className="hover:text-white transition">DMCA Notice</a>
                <a href="#" className="hover:text-white transition">Contact Us</a>
              </div>
            </div>
            <div className="text-center text-xs text-gray-600 border-t border-[#222] pt-4 mt-4">
              Powered by TMDB API. © 2026 CINEVISIO. All rights reserved.
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}