import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/watchlist/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRecommendations(response.data.recommendations || []);
        setUserPreferences(response.data.userPreferences);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181a20] pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-logo mb-2">
              Analyzing your taste...
            </h2>
            <p className="text-gray-400">
              Preparing personalized recommendations based on your watchlist
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-[#181a20] pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-logo mb-4">
              No Recommendations Yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Add some anime to your watchlist to get personalized AI
              recommendations based on your taste!
            </p>
            <Link
              to="/"
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              Add Anime to Watchlist
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181a20] pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-logo mb-4">
            AI-Powered Recommendations
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Personalized anime suggestions based on your watchlist
          </p>

          {/* User Preferences Analysis */}
          {userPreferences && (
            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-logo mb-4">
                Your Anime Profile
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {userPreferences.totalAnime}
                  </div>
                  <div className="text-sm text-gray-400">Total Anime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {userPreferences.completedCount}
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {userPreferences.watchingCount}
                  </div>
                  <div className="text-sm text-gray-400">Watching</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {userPreferences.planToWatchCount}
                  </div>
                  <div className="text-sm text-gray-400">Plan to Watch</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-400">
                  Favorite status:{" "}
                  <span className="text-yellow-400 font-medium capitalize">
                    {userPreferences.favoriteStatus}
                  </span>
                </span>
              </div>
            </div>
          )}

          <button
            onClick={fetchRecommendations}
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Refresh Recommendations
          </button>
        </div>

        {/* Recommendations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommendations.map((rec) => (
            <div key={rec.mal_id} className="card flex gap-6 items-center">
              <img
                src={rec.image}
                alt={rec.title}
                className="w-28 h-40 object-cover rounded-xl shadow-lg border-2 border-[#ffd700]/20"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-logo mb-2">
                  {rec.title}
                </h2>
                <p className="text-gray-300 mb-2 line-clamp-3">
                  {rec.synopsis}
                </p>
                <Link
                  to={rec.mal_id ? `/anime/${rec.mal_id}` : "#"}
                  className="btn-primary px-4 py-2 text-sm mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
