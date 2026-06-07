"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// List Kategori Utama (Baru ditambahkan)
const MOVIE_CATEGORIES = [
  { slug: "popular", name: "🔥 Popular" },
  { slug: "top_rated", name: "⭐ Top Rated" },
  { slug: "upcoming", name: "📅 Upcoming" },
  { slug: "now_playing", name: "🎬 Now Playing" }
];

const TV_CATEGORIES = [
  { slug: "popular", name: "🔥 Popular" },
  { slug: "top_rated", name: "⭐ Top Rated" },
  { slug: "on_the_air", name: "📺 On The Air" },
  { slug: "airing_today", name: "⚡ Airing Today" }
];

// List Genre Lengkap Movie
const MOVIE_GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Document" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" },
  { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" }, { id: 53, name: "Thriller" }, { id: 10752, name: "War" }, { id: 37, name: "Western" }
];

// List Genre Lengkap TV Shows (Sudah Disingkat)
const TV_GENRES = [
  { id: 10759, name: "Act-Vent" }, { id: 16, name: "Animation" }, { id: 35, name: "Comedy" }, 
  { id: 80, name: "Crime" }, { id: 99, name: "Doc" }, { id: 18, name: "Drama" }, 
  { id: 10751, name: "Family" }, { id: 10762, name: "Kids" }, { id: 9648, name: "Mystery" }, 
  { id: 10763, name: "News" }, { id: 10764, name: "Reality" }, 
  { id: 10765, name: "Sci-Fant" }, { id: 10766, name: "Soap" }, { id: 10767, name: "Talk" }, 
  { id: 10768, name: "War-Pol" }, { id: 37, name: "Western" }
];

export default function HeaderNav() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="bg-[#141414] border-b border-[#222] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO & MENU NAVIGASI */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-red-600 font-black text-2xl tracking-tighter hover:opacity-90">
            CINEVISIO
          </Link>
          
          <nav className="hidden md:flex items-center space-x-5 text-xs font-bold uppercase tracking-wide">
            
            {/* HOME */}
            <Link href="/" className="text-gray-300 hover:text-white transition py-2">
              Home
            </Link>
            
            {/* DROPDOWN MOVIES */}
            <div className="relative group py-2">
              <span className="text-gray-400 group-hover:text-white cursor-pointer transition flex items-center gap-1">
                Movies <span className="text-[9px]">▼</span>
              </span>
              <div className="absolute left-0 mt-2 w-[550px] bg-[#141414] border border-[#262626] rounded-xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col gap-3">
                
                {/* Bagian Kategori Utama */}
                <div className="grid grid-cols-4 gap-2 border-b border-[#222] pb-3">
                  {MOVIE_CATEGORIES.map((cat) => (
                    <Link key={cat.slug} href={`/?type=movie&category=${cat.slug}`} className="text-[10px] text-center text-white bg-[#222] hover:bg-red-600 p-2 rounded-lg transition font-bold tracking-wider">
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {/* Bagian List Genre */}
                <div className="grid grid-cols-5 gap-2">
                  {MOVIE_GENRES.map((g) => (
                    <Link key={g.id} href={`/?type=movie&genre=${g.id}&genreName=${g.name}`} className="text-[11px] text-gray-400 hover:bg-[#222] hover:text-white p-1.5 rounded transition font-medium truncate">
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* DROPDOWN TV SHOWS */}
            <div className="relative group py-2">
              <span className="text-gray-400 group-hover:text-white cursor-pointer transition flex items-center gap-1">
                TV Shows <span className="text-[9px]">▼</span>
              </span>
              <div className="absolute left-0 mt-2 w-[550px] bg-[#141414] border border-[#262626] rounded-xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col gap-3">
                
                {/* Bagian Kategori Utama */}
                <div className="grid grid-cols-4 gap-2 border-b border-[#222] pb-3">
                  {TV_CATEGORIES.map((cat) => (
                    <Link key={cat.slug} href={`/?type=tv&category=${cat.slug}`} className="text-[10px] text-center text-white bg-[#222] hover:bg-red-600 p-2 rounded-lg transition font-bold tracking-wider">
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {/* Bagian List Genre */}
                <div className="grid grid-cols-5 gap-2">
                  {TV_GENRES.map((g) => (
                    <Link key={`${g.id}-${g.name}`} href={`/?type=tv&genre=${g.id}&genreName=${g.name}`} className="text-[11px] text-gray-400 hover:bg-[#222] hover:text-white p-1.5 rounded transition font-medium truncate">
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <Link href="/about" className="text-gray-400 hover:text-white transition py-2">
              About
            </Link>

          </nav>
        </div>

        {/* BOX PENCARIAN UTAMA */}
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-xs md:max-w-sm">
          <input
            type="text"
            placeholder="Search Movies / TV Shows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#222] border border-[#333] text-white placeholder-gray-500 px-3 py-1.5 text-xs rounded-l focus:outline-none focus:border-red-600 transition"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-xs font-bold rounded-r transition">
            🔍
          </button>
        </form>

      </div>
    </header>
  );
}