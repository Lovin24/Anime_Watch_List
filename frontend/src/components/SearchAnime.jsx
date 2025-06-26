import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function SearchAnime({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { token } = useAuth();

  const searchAnime = async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${q}`);
      const data = await res.json();
      setResults((data.data || []).slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch from Jikan:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async (anime) => {
    try {
      await axios.post(
        "/watchlist",
        {
          animeId: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
          status: "plan to watch",
          score: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onAdd();
      toast.success("Anime added to watchlist!");
      setQuery("");
      setResults([]);
    } catch (err) {
      console.error("Failed to add anime:", err);
      toast.error("Failed to add anime to watchlist");
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for your favorite anime..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            searchAnime(e.target.value);
          }}
          className="w-full pl-12 pr-4 py-4 text-lg bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-300 mb-4">
            Search Results ({results.length})
          </h3>
          <div className="grid gap-4">
            {results.map((anime) => (
              <div
                key={anime.mal_id}
                className="group bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  {/* Anime Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-16 h-24 object-cover rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                  </div>

                  {/* Anime Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/anime/${anime.mal_id}`} className="block">
                      <h4 className="text-lg font-semibold text-white truncate group-hover:text-purple-300 transition-colors cursor-pointer">
                        {anime.title}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {anime.synopsis || "No description available"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {anime.episodes || "?"} episodes
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {anime.score || "?"}/10
                      </span>
                      <span className="px-2 py-1 bg-gray-600/50 rounded-full text-xs">
                        {anime.type || "TV"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/anime/${anime.mal_id}`}
                      className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
                      title="View Details"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Details
                    </Link>
                    <button
                      onClick={() => handleAdd(anime)}
                      className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm"
                      title="Add to Watchlist"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {query && !isSearching && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No anime found
          </h3>
          <p className="text-gray-400">
            Try searching for a different anime title
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchAnime;
