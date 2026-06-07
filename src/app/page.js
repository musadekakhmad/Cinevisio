import Link from "next/link";
import { fetchTMDB, getImageUrl, createSlug } from "@/api";

// Fungsi Komponen Utama Homepage (Berjalan langsung di Server)
export default async function HomePage() {
  // 1. Ambil data Film Trending & Top Rated langsung dari server TMDB
  const trendingData = await fetchTMDB("/trending/movie/day?language=en-US");
  const topRatedData = await fetchTMDB("/movie/top_rated?language=en-US&page=1");

  const trendingMovies = trendingData?.results?.slice(0, 8) || [];
  const topRatedMovies = topRatedData?.results?.slice(0, 8) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* SECTION 1: TRENDING MOVIES */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-wide border-l-4 border-red-600 pl-3">
            Trending Today
          </h2>
          <span className="text-xs text-gray-400">Target Market: US / LatAm / EU</span>
        </div>
        
        {/* Grid Poster Film (16:9 atau Poster Standar Responsif) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {trendingMovies.map((movie) => {
            const slug = createSlug(movie.title);
            // URL Dynamic Route Next.js akan berbentuk: /movie/title-slug-id
            const detailUrl = `/movie/${slug}-${movie.id}`;

            return (
              <Link href={detailUrl} key={movie.id} className="group block bg-[#141414] rounded-lg overflow-hidden border border-[#222] hover:border-red-600 transition duration-300">
                <div className="relative aspect-[2/3] w-full bg-[#222]">
                  <img 
                    src={getImageUrl(movie.poster_path, 'w342')} 
                    alt={movie.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-xs font-semibold truncate group-hover:text-red-500 transition">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: TOP RATED MOVIES */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-wide border-l-4 border-red-600 pl-3">
            Top Rated Global
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topRatedMovies.map((movie) => {
            const slug = createSlug(movie.title);
            const detailUrl = `/movie/${slug}-${movie.id}`;

            return (
              <Link href={detailUrl} key={movie.id} className="group block bg-[#141414] rounded-lg overflow-hidden border border-[#222] hover:border-red-600 transition duration-300">
                <div className="relative aspect-[2/3] w-full bg-[#222]">
                  <img 
                    src={getImageUrl(movie.poster_path, 'w342')} 
                    alt={movie.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-xs font-semibold truncate group-hover:text-red-500 transition">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "0.0"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}