"use client";

import React from 'react';
import Link from 'next/link';
import { FaHome, FaFilm, FaTv, FaSearch, FaStar, FaUsers, FaGlobe } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-900/50 to-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-orange-400">
            Cinevisio - Ultimate Movie & TV Series Database
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Your comprehensive guide to movies, TV series, reviews, and streaming information. Discover, explore, and enjoy cinematic excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <FaHome /> Home
            </Link>
            <Link href="/movie/genre/action" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <FaFilm /> Browse Movies
            </Link>
            <Link href="/tv-show/genre/crime" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <FaTv /> Browse TV Series
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm">
          {/* Introduction */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <img
                src="https://live.staticflickr.com/65535/54808372248_bc81f9db3e_b.jpg"
                alt="Movie reels and cinema tickets - Ultimate movie database"
                width={1024}
                height={416}
                className="rounded-xl shadow-2xl mx-auto mb-8"
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-300">
                Discover the World of Cinema with Cine Visio
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Cine Visio is Indonesia's Worldwide most complete movie and TV series information platform. 
                We provide accurate data, user reviews, streaming guides, and everything you need about films and television shows.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center text-orange-300">
              Why Choose Cine Visio?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-700/50 p-6 rounded-xl text-center">
                <FaFilm className="text-4xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">10,000+ Movies</h3>
                <p className="text-gray-400">Comprehensive database from classic to latest releases</p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center">
                <FaTv className="text-4xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">5,000+ TV Series</h3>
                <p className="text-gray-400">Complete TV show information with seasons and episodes</p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center">
                <FaSearch className="text-4xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
                <p className="text-gray-400">Find movies, actors, and directors with advanced search</p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center">
                <FaStar className="text-4xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">User Reviews</h3>
                <p className="text-gray-400">Real ratings and reviews from our community</p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center">
                <FaUsers className="text-4xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                <p className="text-gray-400">Join thousands of movie enthusiasts sharing their passion</p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl text-center">
                <FaGlobe className="text-4xl text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Content</h3>
                <p className="text-gray-400">Movies and TV series from around the world</p>
              </div>
            </div>
          </section>

          {/* Detailed Sections */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-300">
              Complete Movie Database Indonesia
            </h2>
            <div className="space-y-6 text-justify">
              <p>
                <strong>Cine Visio</strong> is your ultimate destination for <strong>movie information Indonesia</strong> and 
                <strong> TV series database</strong>. We provide the most accurate and up-to-date information about 
                <strong> latest movies</strong>, <strong>popular TV shows</strong>, <strong>movie reviews</strong>, and 
                <strong> streaming guides</strong>. Our platform is designed for both casual viewers and hardcore cinephiles.
              </p>
              <p>
                As the <strong>best movie website Indonesia</strong>, we offer comprehensive details including cast and crew information, 
                plot summaries, ratings, trailers, and where to watch. Whether you're looking for 
                <strong> Hollywood blockbusters</strong>, <strong>independent films</strong>, or <strong>international cinema</strong>, 
                Cine Visio has you covered.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-300">
              Streaming Guide & Watch Recommendations
            </h2>
            <div className="space-y-6 text-justify">
              <p>
                Find <strong>where to watch movies online</strong> and <strong>TV series streaming platforms</strong> with our comprehensive 
                streaming guide. We help you discover <strong>best movies to watch</strong> and 
                <strong> top-rated TV shows</strong> based on your preferences.
              </p>
              <p>
                Our platform includes <strong>movie recommendations</strong>, <strong>genre exploration</strong>, and 
                <strong> personalized suggestions</strong> to enhance your viewing experience. From 
                <strong> action movies</strong> to <strong>drama series</strong>, from <strong>comedy films</strong> to 
                <strong> thriller TV shows</strong> - we've got all genres covered.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-orange-300">
              SEO Optimized Movie Content
            </h2>
            <div className="space-y-6 text-justify">
              <p>
                Cine Visio is optimized for search engines to ensure you can easily find information about 
                <strong> watch movies online free</strong>, <strong>latest movie releases 2024</strong>, 
                <strong> best TV series to binge-watch</strong>, and <strong>movie streaming sites</strong>.
              </p>
              <p>
                We cover all major keywords including <strong>"movie database"</strong>, <strong>"TV series information"</strong>, 
                <strong>"film reviews"</strong>, <strong>"where to watch movies"</strong>, <strong>"movie genres"</strong>, 
                and <strong>"entertainment guide Indonesia"</strong>.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-300">
              Start Your Cinematic Journey Today!
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of movie lovers who trust Cine Visio for their entertainment needs. 
              Discover, explore, and enjoy the world of cinema like never before.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-3">
                <FaHome className="text-xl" /> Go to Homepage
              </Link>
              <Link href="/movie/genre/action" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-3">
                <FaFilm className="text-xl" /> Explore Movies
              </Link>
              <Link href="/tv-show/genre/crime" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-3">
                <FaTv className="text-xl" /> Browse TV Series
              </Link>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="bg-orange-900/30 rounded-xl p-8 text-center mb-12">
            <h3 className="text-2xl font-bold mb-6 text-orange-300">Cine Visio by Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-orange-400">10,000+</div>
                <div className="text-gray-400">Movies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">5,000+</div>
                <div className="text-gray-400">TV Series</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">50,000+</div>
                <div className="text-gray-400">Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">100,000+</div>
                <div className="text-gray-400">Reviews</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}