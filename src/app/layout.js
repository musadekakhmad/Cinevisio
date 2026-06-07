import "./globals.css";
import Link from "next/link";
import Script from "next/script"; // Fitur khusus Next.js untuk memuat script iklan dengan aman

export const metadata = {
  title: "CineVisio - Free Streaming Platform for Movies and TV Shows",
  description: "Watch free streaming movies and TV series online in high quality. Target English, European, and Latin American movies with multi-language subtitle options.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ========================================================= */}
        {/* 🚀 TEMPAT SCRIPT IKLAN ADSTERRA (POP-UNDER / SOCIAL BAR) */}
        {/* ========================================================= */}
        {/* Contoh pengisian Script Adsterra menggunakan tag <Script> bawaan Next.js */}
        {/* <Script 
          id="adsterra-popunder"
          strategy="afterInteractive" 
          src="//www.highperformanceformat.com/xxxxxxxxxxxxxxxxxxxxxxxx/invoke.js" 
        /> 
        */}
      </head>
      <body className="bg-[#0f0f0f] text-gray-100 min-h-screen flex flex-col font-sans">
        
        {/* 1. NAVBAR GLOBAL */}
        <header className="bg-[#141414] border-b border-[#222] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Nama Web Baru yang SEO Global */}
              <Link href="/" className="text-2xl font-bold tracking-wider text-red-600 hover:text-red-500 transition">
                CINEVISIO
              </Link>
              <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/?type=movie" className="hover:text-white transition">Movies</Link>
                <Link href="/?type=tv" className="hover:text-white transition">TV Shows</Link>
              </nav>
            </div>
            {/* Kolom Pencarian Simpel */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Movies / TV Shows..." 
                className="bg-[#222] text-sm text-white rounded-md px-4 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-red-600 border border-[#333]"
              />
            </div>
          </div>
        </header>

        {/* 2. KONTEN UTAMA (Halaman Film, Detail, Streaming akan muncul di sini) */}
        <main className="flex-grow">
          {children}
        </main>

        {/* ========================================================= */}
        {/* 💸 AREA NATIVE BANNER ADS (DI ATAS FOOTER SECARA VISUAL)   */}
        {/* ========================================================= */}
        <div className="w-full max-w-7xl mx-auto px-4 my-6 text-center">
          <div className="inline-block bg-[#141414] border border-[#262626] rounded-xl p-4 min-h-[150px] w-full text-gray-500 text-xs">
            {/* Tempat menaruh kode HTML/Script Native Banner Adsterra Anda */}
            <p className="mb-2 text-gray-400">Sponsored Recommendation</p>
            <div id="container-adsterra-native">Iklan Native Banner Muncul Di Sini</div>
          </div>
        </div>

        {/* 3. FOOTER HITAM GLOBAL */}
        <footer className="bg-[#141414] border-t border-[#222] py-8 text-sm text-gray-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <span className="text-red-600 font-bold tracking-wider text-base">CINEVISIO</span>
              <p className="text-xs mt-1">Free streaming platform for movies and TV shows.</p>
            </div>
            <div className="flex space-x-6 text-xs">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <a href="#" className="hover:text-white transition">About Us</a>
              <a href="#" className="hover:text-white transition">DMCA / Contact</a>
            </div>
            <div className="text-xs text-gray-500">
              Powered by TMDB API. © 2026 CINEVISIO. All rights reserved.
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}