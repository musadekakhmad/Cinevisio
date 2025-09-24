// components/layout/Navbar.jsx

"use client";

import Link from 'next/link';
import { FaVideo, FaChevronDown, FaBars, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { getMovieGenres, getTvSeriesGenres } from '../../lib/api';
import SearchBar from '../SearchBar';
import { useEffect, useState } from 'react';

// Reusable class for dropdown items for consistency
const dropdownItemClass = "block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-800 hover:text-white transition-colors duration-200";

// Reusable class for sub-dropdown triggers
const subDropdownTriggerClass = "flex justify-between items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-blue-700 cursor-pointer";

// Utility function to create a slug from a genre name
const createSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Define DropdownMenu component outside of Navbar
const DropdownMenu = ({ title, categories, genres, genrePathPrefix }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsOpen(false);
      setIsGenresOpen(false); // Pastikan sub-dropdown juga tertutup
    }, 100); // Penundaan 100ms
  };

  // Handler khusus untuk sub-dropdown Genres
  const handleGenresMouseEnter = () => {
    setIsGenresOpen(true);
  };

  const handleGenresMouseLeave = () => {
    setIsGenresOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center text-white hover:text-green-600 transition-colors duration-200 font-bold"
      >
        {title} <FaChevronDown className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-slate-800 dark:bg-gray-800 rounded-md shadow-lg z-20">
          <div className="py-1">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className={dropdownItemClass}
                onClick={() => setIsOpen(false)} // Close parent dropdown on item click
              >
                {category.label}
              </Link>
            ))}
            {genres.length > 0 && (
              <div
                className="relative"
                onMouseEnter={handleGenresMouseEnter}
                onMouseLeave={handleGenresMouseLeave}
              >
                <button className={subDropdownTriggerClass}>
                  Genres <FaChevronDown className={`ml-1 transition-transform duration-200 ${isGenresOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGenresOpen && (
                  <div className="absolute top-0 left-full mt-0 w-48 bg-slate-800 dark:bg-gray-800 rounded-md shadow-lg z-30 ml-1">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/${genrePathPrefix}/genre/${createSlug(genre.name)}`}
                          className={dropdownItemClass}
                          onClick={() => { setIsOpen(false); setIsGenresOpen(false); }} // Close all on item click
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const [adultContentType, setAdultContentType] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [fetchedMovieGenres, fetchedTvGenres] = await Promise.all([
          getMovieGenres(),
          getTvSeriesGenres()
        ]);
        setMovieGenres(fetchedMovieGenres);
        setTvGenres(fetchedTvGenres);
      } catch (error) {
        console.error("Error fetching genres in Navbar:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleAdultContentClick = (type) => {
    setAdultContentType(type);
    setShowAdultWarning(true);
  };

  const confirmAdultContent = () => {
    if (adultContentType === 'erotic') {
      window.location.href = '/adult/erotic-movies';
    } else if (adultContentType === 'adult-list') {
      window.location.href = '/adult/adult-movies';
    }
    setShowAdultWarning(false);
  };

  return (
    <nav className="bg-slate-900 dark:bg-gray-900 p-4 sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Logo mengarah ke Trendingpage (/) - halaman about */}
          <Link href="/" className="flex items-center text-3xl font-bold transition-colors duration-200 group">
            <FaVideo className="text-white mr-2 group-hover:text-yellow-200 transition-colors" />
            <span className="rainbow-text hover:text-white transition-colors">
              Cinevisio
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {/* Trending mengarah ke /Trending (halaman trending) */}
            <Link href="/Trending" className="text-white font-bold hover:text-green-600 transition-colors">
              Trending
            </Link>
            <DropdownMenu
              title="Movies"
              categories={[
                { href: "/movie/popular", label: "Popular" },
                { href: "/movie/now_playing", label: "Now Playing" },
                { href: "/movie/upcoming", label: "Upcoming" },
                { href: "/movie/top_rated", label: "Top Rated" },
              ]}
              genres={movieGenres}
              genrePathPrefix="movie"
            />
            <DropdownMenu
              title="Tv Series"
              categories={[
                { href: "/tv-show/popular", label: "Popular" },
                { href: "/tv-show/airing_today", label: "Airing Today" },
                { href: "/tv-show/on_the_air", label: "On The Air" },
                { href: "/tv-show/top_rated", label: "Top Rated" },
              ]}
              genres={tvGenres}
              genrePathPrefix="tv-show"
            />
            
            {/* Tombol Erotic */}
            <button
              onClick={() => handleAdultContentClick('erotic')}
              className="text-white font-bold hover:text-blue-600 transition-colors py-2"
            >
              Erotic
            </button>
            
            {/* Tombol Adult */}
            <button
              onClick={() => handleAdultContentClick('adult-list')}
              className="text-white font-bold hover:text-red-600 transition-colors py-2"
            >
              Adult
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="w-72 md:w-80 lg:w-96 hidden md:block">
            <SearchBar />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 rounded-md bg-slate-800 dark:bg-gray-700 hover:bg-slate-700 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 dark:bg-gray-800 p-4">
          <div className="mb-4">
            <SearchBar />
          </div>
          <div className="flex flex-col space-y-3">
            {/* Trending mobile - mengarah ke /Trending */}
            <Link 
              href="/Trending" 
              className="text-white font-bold hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trending
            </Link>
            
            {/* Tombol Erotic untuk mobile */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleAdultContentClick('erotic');
              }}
              className="text-white font-bold hover:text-green-600 transition-colors py-2"
            >
              Erotic Content
            </button>
            
            {/* Tombol Adult untuk mobile */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleAdultContentClick('adult-list');
              }}
              className="text-white font-bold hover:text-green-600 transition-colors py-2"
            >
              Adult Movies
            </button>
            
            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">Movies</h3>
              <div className="flex flex-col space-y-2 pl-4">
                <Link 
                  href="/movie/popular" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Popular
                </Link>
                <Link 
                  href="/movie/now_playing" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Now Playing
                </Link>
                <Link 
                  href="/movie/upcoming" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upcoming
                </Link>
                <Link 
                  href="/movie/top_rated" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Rated
                </Link>
                
                <div className="pt-2">
                  <h4 className="text-gray-400 text-sm font-bold mb-1">Genres</h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {movieGenres.map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/movie/genre/${createSlug(genre.name)}`}
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-3">
              <h3 className="text-white font-bold mb-2">TV Series</h3>
              <div className="flex flex-col space-y-2 pl-4">
                <Link 
                  href="/tv-show/popular" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Popular
                </Link>
                <Link 
                  href="/tv-show/airing_today" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Airing Today
                </Link>
                <Link 
                  href="/tv-show/on_the_air" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  On The Air
                </Link>
                <Link 
                  href="/tv-show/top_rated" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Rated
                </Link>
                
                <div className="pt-2">
                  <h4 className="text-gray-400 text-sm font-bold mb-1">Genres</h4>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {tvGenres.map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/tv-show/genre/${createSlug(genre.name)}`}
                        className="text-xs text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Peringatan Konten Dewasa */}
      {showAdultWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-red-500">
              <FaExclamationTriangle className="text-2xl mr-2" />
              <h3 className="text-xl font-bold">Adult Content Warning</h3>
            </div>
            <p className="text-gray-300 mb-6">
              This content is intended for viewers aged 18 and over only.
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAdultWarning(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdultContent}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS untuk efek rainbow */}
      <style jsx>{`
        .rainbow-text {
          font-size: 1.8rem;
          background-image: linear-gradient(
            to right,
            #ff0000, #ff8000, #ffff00, #80ff00, 
            #00ff00, #00ff80, #00ffff, #0080ff, 
            #0000ff, #8000ff, #ff00ff, #ff0080
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 300% 300%;
          animation: rainbow 4s ease infinite;
        }
        
        .rainbow-hover:hover {
          background-image: linear-gradient(
            to right,
            #ff0000, #ff8000, #ffff00, #80ff00, 
            #00ff00, #00ff80, #00ffff, #0080ff, 
            #0000ff, #8000ff, #ff00ff, #ff0080
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 300% 300%;
          animation: rainbow 2s ease infinite;
        }
        
        @keyframes rainbow {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </nav>
  );
}