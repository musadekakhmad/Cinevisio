import { useEffect, useState } from 'react';

// Fungsi untuk mendapatkan URL gambar poster
const getImageUrl = (posterPath) => {
  if (!posterPath) {
    return 'https://placehold.co/500x750/1f2937/d1d5db?text=No+Image';
  }
  
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

// Fungsi untuk menampilkan rating dengan format yang konsisten
const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return Number(rating).toFixed(1); // Format: 7.0, 6.4, etc.
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gunakan useEffect untuk mengambil data film
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=e975c6020c641883ae0518774843b4f6&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1');
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Movie Data Failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-400 text-lg">Loading Movie...</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-400 text-lg">Movie Not Found</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Trending Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => {
          return (
            <a 
              key={movie.id} 
              href={`#${movie.id}`} // Tautan hash sementara untuk simulasi klik
              className="block"
            >
              <div className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title || 'Movie Image'}
                    className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                  />
                  
                  {/* Rating overlay - hanya satu elemen rating */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {formatRating(movie.vote_average)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {movie.title || 'Title not available'}
                  </h3>
                  {movie.release_date && (
                    <p className="text-xs text-gray-400">
                      ({movie.release_date.substring(0, 4)})
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
