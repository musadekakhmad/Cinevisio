// components/layout/Footer.jsx

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaRss, FaVideo, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-gray-400 py-12 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
           <FaVideo className="text-blue-500 text-3xl mr-3" />
           <a href="https://cinevisio.netlify.app" className="text-2xl font-bold text-white hover:text-red-600">Cine Visio</a>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
            <a href="https://youtube.com" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={24} />
            </a>
          </div>
        </div>
        
        <div className="mb-8 text-center">
          <h3 className="text-white text-xl font-semibold mb-4">Stay Updated with the Latest Releases</h3>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-gray-800 text-white text-sm rounded-l-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg transition-colors text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">&copy; {year} Cine Visio. All rights reserved.</p>
            <p className="text-xs mt-2 text-gray-500">
              Made with <FaHeart className="inline text-red-500" /> by movie lovers
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <a href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors mb-2 md:mb-0">Privacy Policy</a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors mb-2 md:mb-0">Terms of Service</a>
            <a href="/dmca" className="text-gray-400 hover:text-blue-400 transition-colors mb-2 md:mb-0">DMCA</a>
            <a href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMDB API
            </a>{' '}
            &{' '}
            <a
              href="https://nextjs.org"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Disclaimer: Cine Visio does not host any videos or content on its server. All content is provided by non-affiliated third parties.
          </p>
          
          <div className="mt-4 flex items-center justify-center text-sm text-gray-400 hover:text-blue-400 transition-colors">
            <FaRss className="mr-2" />
            <a href="/rss" className="hover:text-blue-400">RSS Feed</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
