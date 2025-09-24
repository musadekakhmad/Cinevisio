// components/MediaCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaPlay, FaTv, FaFilm, FaCalendar } from 'react-icons/fa';

// FUNGSI SLUG PINTAR YANG KONSISTEN
const createSmartSlug = (item, allMovies = []) => {
  const title = item.title || item.name || 'media';
  if (!title) return '';
  
  const baseSlug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  let year = '';
  if (item.release_date || item.first_air_date) {
    const date = item.release_date || item.first_air_date;
    year = date.substring(0, 4);
  }

  // LOGIKA PINTAR: Deteksi duplikat judul+tahun
  if (allMovies && allMovies.length > 0) {
    const duplicateMovies = allMovies.filter(movie => {
      const movieTitle = movie.title?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const currentTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const movieYear = movie.release_date?.substring(0, 4);
      
      return movieTitle === currentTitle && movieYear === year && movie.id !== item.id;
    });

    if (duplicateMovies.length > 0) {
      console.log(`🔍 MediaCard: Duplicate found for "${title}" (${year}). Adding ID.`);
      return `${baseSlug}-${year}-${item.id}`.replace(/-+/g, '-').replace(/-$/, '');
    }
  }

  return `${baseSlug}-${year}`.replace(/-+/g, '-').replace(/-$/, '');
};

export default function MediaCard({ media }) {
  return (
    <div className="media-card">
      {/* Isi komponen MediaCard */}
    </div>
  );
}
export default function MediaCard({ 
  mediaItem, 
  allMovies = [], // ✅ TAMBAHKAN PARAMETER ALLMOVIES
  showType = true, 
  showYear = true, 
  showRating = true, 
  size = 'medium' 
}) {
  // ✅ GUNAKAN createSmartSlug DENGAN allMovies
  const slug = createSmartSlug(mediaItem, allMovies);
  const mediaType = mediaItem.media_type || 'movie';
  const linkHref = `/${mediaType === 'tv' ? 'tv-show' : 'movie'}/${slug}`;
  
  const imageUrl = mediaItem.poster_path 
    ? `https://image.tmdb.org/t/p/w500${mediaItem.poster_path}`
    : `/images/placeholder-poster.jpg`;

  const title = mediaItem.title || mediaItem.name;
  const rating = mediaItem.vote_average ? mediaItem.vote_average.toFixed(1) : 'N/A';
  const year = mediaItem.release_date 
    ? new Date(mediaItem.release_date).getFullYear() 
    : mediaItem.first_air_date 
      ? new Date(mediaItem.first_air_date).getFullYear() 
      : null;

  // Size variants
  const sizeClasses = {
    small: {
      image: 'h-48',
      title: 'text-xs',
      info: 'text-xs'
    },
    medium: {
      image: 'h-64',
      title: 'text-sm',
      info: 'text-xs'
    },
    large: {
      image: 'h-80',
      title: 'text-base',
      info: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <Link 
      href={linkHref} 
      className="block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group bg-gray-900 border border-gray-700 hover:border-blue-500/50"
    >
      <div className={`relative w-full ${currentSize.image} bg-gray-800 overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk6objMcl6qVU6yUq1tKEgibJUIwDpMpMpLY2f/EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQIBAT8AX//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8AX//Z"
        />
        
        {/* Overlay dengan informasi cepat */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between mb-2">
              {showRating && (
                <div className="flex items-center bg-black/60 rounded-full px-2 py-1">
                  <FaStar className="text-yellow-400 text-xs mr-1" />
                  <span className="text-white text-xs font-bold">{rating}</span>
                </div>
              )}
              {showType && (
                <div className="flex items-center bg-blue-600/80 rounded-full px-2 py-1">
                  {mediaType === 'tv' ? (
                    <FaTv className="text-white text-xs mr-1" />
                  ) : (
                    <FaFilm className="text-white text-xs mr-1" />
                  )}
                  <span className="text-white text-xs font-bold capitalize">
                    {mediaType}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-blue-600/90 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="text-white text-lg" />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-3 bg-gradient-to-b from-gray-900 to-gray-800">
        <h3 className={`font-semibold text-white mb-2 line-clamp-2 ${currentSize.title} group-hover:text-blue-300 transition-colors`}>
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showYear && year && (
              <div className="flex items-center text-gray-400">
                <FaCalendar className="text-xs mr-1" />
                <span className={currentSize.info}>{year}</span>
              </div>
            )}
            
            {showType && (
              <div className="flex items-center text-gray-400">
                {mediaType === 'tv' ? (
                  <FaTv className="text-xs mr-1" />
                ) : (
                  <FaFilm className="text-xs mr-1" />
                )}
                <span className={currentSize.info}></span>
              </div>
            )}
          </div>

          {showRating && (
            <div className={`flex items-center text-yellow-400 ${currentSize.info}`}>
              <FaStar className="text-xs mr-1" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        {/* Genre tags (jika tersedia) */}
        {mediaItem.genre_names && mediaItem.genre_names.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {mediaItem.genre_names.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded text-xs"
              >
                {genre}
              </span>
            ))}
            {mediaItem.genre_names.length > 2 && (
              <span className="text-gray-500 text-xs">+{mediaItem.genre_names.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

// Prop types untuk dokumentasi
MediaCard.defaultProps = {
  allMovies: [],
  showType: true,
  showYear: true,
  showRating: true,
  size: 'medium'
};

// Export fungsi createSmartSlug untuk digunakan di tempat lain
export { createSmartSlug };