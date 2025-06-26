import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#181a20] text-gray-300 border-t border-[#23242b] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand/Info */}
        <div>
          <h2 className="text-2xl font-extrabold text-logo mb-2">
            AnimeWatchList
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Your modern, otaku-inspired anime watchlist and recommendation
            platform. Track, discover, and share your anime journey!
          </p>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[#ffd700] transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ffd700] transition">
                Watchlist
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ffd700] transition">
                Search
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ffd700] transition">
                Recommendations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ffd700] transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#ffd700] transition">
                Contact
              </a>
            </li>
          </ul>
        </div>
        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Contact</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#ffd700]" />
              <a
                href="mailto:lakshay.lovin@gmail.com"
                className="hover:text-[#ffd700] transition"
              >
                lakshay.lovin@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaLinkedin className="text-[#ffd700]" />
              <a
                href="https://www.linkedin.com/in/lakshay-tewtiya-1a41b32b8/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffd700] transition"
              >
                LinkedIn
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaGithub className="text-[#ffd700]" />
              <a
                href="https://github.com/Lovin24"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffd700] transition"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
        {/* Dummy Info/Newsletter */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-2">
            Subscribe for the latest anime news and updates (coming soon!)
          </p>
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-3 py-2 rounded-lg bg-[#23242b] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700] mb-2"
            disabled
          />
          <button
            className="w-full px-3 py-2 rounded-lg bg-[#ffd700] text-[#181a20] font-bold cursor-not-allowed opacity-60"
            disabled
          >
            Subscribe
          </button>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs py-4 border-t border-[#23242b]">
        © 2025 AnimeWatchList. All rights reserved.
      </div>
    </footer>
  );
}
