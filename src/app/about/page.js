import Link from "next/link";

export const metadata = {
  title: "About CineVisio - Free Online Streaming Destination",
  description: "Learn more about CineVisio, your ultimate destination for high quality streaming movies and TV shows completely free.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-300 leading-relaxed text-justify font-sans">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-red-600 tracking-wider">About CINEVISIO</h1>
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Your Ultimate Destination for Free Online Streaming</p>
      </div>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">Welcome to CINEVISIO</h2>
        <p className="text-sm">CINEVISIO is a revolutionary free streaming platform that brings the magic of cinema directly to your screen. Founded in 2026, we have quickly established ourselves as one of the most trusted and user-friendly destinations for watching movies and TV shows online without any subscription fees or hidden costs.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">Our Mission</h2>
        <p className="text-sm">At CINEVISIO, we believe that great entertainment should be accessible to everyone, regardless of their budget or geographic location. Our mission is to democratize access to quality content by providing a seamless, ad-supported streaming experience that rivals premium platforms. We work tirelessly to ensure our library is constantly updated with the latest releases, timeless classics, and hidden gems from around the world.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">What Makes CINEVISIO Different?</h2>
        <p className="text-sm">Unlike traditional streaming services that require monthly subscriptions, credit cards, and lengthy commitments, CINEVISIO offers completely free access to thousands of movies and TV episodes. Our platform is designed with the user experience in mind - intuitive navigation, lightning-fast search, and multiple streaming options ensure you never miss a moment of your favorite content.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">Our Content Library</h2>
        <p className="text-sm">CINEVISIO aggregates content from the world's most comprehensive movie database, TMDB (The Movie Database). This partnership allows us to offer an extensive catalog spanning every genre imaginable - from heart-pounding action thrillers and laugh-out-loud comedies to thought-provoking documentaries and edge-of-your-seat horror films. Our TV show collection includes popular series, critically acclaimed dramas, reality shows, anime, and children's programming.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">How CINEVISIO Works</h2>
        <p className="text-sm">Using CINEVISIO is incredibly simple. Browse our homepage to discover trending content, use the search bar to find specific titles, or explore our dropdown menus to filter movies and TV shows by category (Popular, Now Playing, Upcoming, Top Rated) or by genre (Action, Comedy, Drama, Horror, Romance, Sci-Fi, Thriller, and more). Click on any poster to access detailed information including plot summaries, cast lists, directors, ratings, runtime, and release dates.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">Streaming Quality & Options</h2>
        <p className="text-sm">CINEVISIO provides multiple streaming sources to ensure reliable playback in HD quality. Our platform integrates with trusted external players that deliver smooth, buffer-free viewing experiences. Whether you're watching on a desktop computer, laptop, tablet, or smartphone, our responsive design automatically adapts to your screen size for optimal viewing.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">No Account Required</h2>
        <p className="text-sm">One of CINEVISIO's core principles is privacy. Unlike other platforms that demand personal information, email addresses, or payment details, CINEVISIO allows you to start watching immediately with zero commitment. We don't track your viewing history, we don't sell your data, and we never ask for unnecessary permissions. Your privacy is completely respected.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-red-600 mb-3 uppercase tracking-wide border-l-4 border-red-600 pl-3">Legal Compliance</h2>
        <p className="text-sm">CINEVISIO operates as a streaming aggregator. We do not host any video files on our servers. All content accessed through our platform is sourced from external third-party streaming providers. We respect intellectual property rights and copyright laws, and we encourage users to support official releases whenever possible.</p>
      </section>
      
      <div className="bg-[#141414] p-6 rounded-xl border border-[#222] mt-10 text-center shadow-inner">
        <p className="text-base font-bold text-white tracking-wide">CINEVISIO - Your Gateway to Unlimited Entertainment</p>
        <p className="text-xs text-gray-500 mt-2">© 2026 CINEVISIO. All rights reserved. | Powered by TMDB API</p>
        <div className="mt-4 text-xs">
          <Link href="/" className="text-red-500 font-semibold hover:underline">Return to Streaming Home</Link>
        </div>
      </div>
      
    </div>
  );
}