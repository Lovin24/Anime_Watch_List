import { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/AuthContext";
import SearchAnime from "../components/SearchAnime";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Watchlist() {
  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [editData, setEditData] = useState({ status: "", score: "" });
  const { token } = useAuth();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get("/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimeList(res.data.watchlist);
      console.log(res.data.watchlist);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleDelete = async (animeId) => {
    try {
      await axios.delete(`/watchlist/${animeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWatchlist();
      toast.success("Anime removed from watchlist");
    } catch (err) {
      console.error("Failed to delete anime:", err);
      toast.error("Failed to remove anime");
    }
  };

  const handleUpdate = async (animeId) => {
    try {
      await axios.put(
        `/watchlist/${animeId}`,
        { status: editData.status, score: editData.score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingAnimeId(null);
      fetchWatchlist();
      toast.success("Anime updated successfully");
    } catch (err) {
      console.error("Failed to update anime:", err);
      toast.error("Failed to update anime");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "watching":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "dropped":
        return "bg-red-500";
      case "plan to watch":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const statusCounts = {
    all: animeList.length,
    watching: animeList.filter((a) => a.status === "watching").length,
    completed: animeList.filter((a) => a.status === "completed").length,
    dropped: animeList.filter((a) => a.status === "dropped").length,
    "plan to watch": animeList.filter((a) => a.status === "plan to watch")
      .length,
  };

  const filteredAnimeList =
    statusFilter === "all"
      ? animeList
      : animeList.filter((anime) => anime.status === statusFilter);
  const searchedAnimeList = filteredAnimeList.filter((anime) =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedAnimeList = [...searchedAnimeList].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "rating-high") {
      return b.score - a.score;
    } else if (sortBy === "rating-low") {
      return a.score - b.score;
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#181a20]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 px-8 py-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-logo mb-4">
            My Watchlist
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Track your anime journey and manage your personal collection
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="btn-primary px-8 py-3 text-lg"
            >
              {showSearch ? "Hide Search" : "Add New Anime"}
            </button>
            <Link
              to="/recommendations"
              className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
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
              AI Recommendations
            </Link>
          </div>
          <div className="w-24 h-1 bg-[#ffd700] mx-auto mt-8 rounded-full"></div>
        </div>
      </div>

      {/* Search Section */}
      {showSearch && (
        <div className="px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="card border border-[#23242b] shadow-2xl">
              <SearchAnime onAdd={fetchWatchlist} />
            </div>
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      <div className="px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Always show filter controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Collection ({sortedAnimeList.length} of{" "}
                  {animeList.length})
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>
                    {
                      sortedAnimeList.filter((a) => a.status === "completed")
                        .length
                    }{" "}
                    completed
                  </span>
                  <span>
                    {
                      sortedAnimeList.filter((a) => a.status === "watching")
                        .length
                    }{" "}
                    watching
                  </span>
                  <span>
                    {
                      sortedAnimeList.filter(
                        (a) => a.status === "plan to watch"
                      ).length
                    }{" "}
                    plan to watch
                  </span>
                </div>
              </div>
              {/* Filter and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-[#23242b] border border-[#ffd700]/40 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] backdrop-blur-sm"
                  >
                    <option value="all">All Status ({statusCounts.all})</option>
                    <option value="watching">
                      Watching ({statusCounts.watching})
                    </option>
                    <option value="completed">
                      Completed ({statusCounts.completed})
                    </option>
                    <option value="dropped">
                      Dropped ({statusCounts.dropped})
                    </option>
                    <option value="plan to watch">
                      Plan to Watch ({statusCounts["plan to watch"]})
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {/* Sort Options */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-[#23242b] border border-[#ffd700]/40 text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] backdrop-blur-sm"
                  >
                    <option value="title">Sort by Title</option>
                    <option value="rating-high">
                      Sort by Rating (High to Low)
                    </option>
                    <option value="rating-low">
                      Sort by Rating (Low to High)
                    </option>
                    <option value="status">Sort by Status</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 mb-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700] 
                      ${
                        statusFilter === status
                          ? "bg-[#ffd700] text-[#181a20] shadow-lg"
                          : "bg-[#23242b] text-gray-200 hover:bg-[#ffd700]/20 hover:text-yellow-300"
                      }
                    `}
                  >
                    {status === "all" ? "All" : getStatusText(status)} ({count})
                  </button>
                ))}
              </div>
              <div
                className="relative w-full sm:w-80"
                style={{ maxWidth: "320px" }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full sm:w-80 px-4 py-2 rounded-lg border border-[#ffd700]/40 bg-[#23242b] text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-[#ffd700]"
                  style={{ maxWidth: "320px" }}
                />
              </div>
            </div>
          </div>

          {/* Anime grid or empty message */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading your watchlist...</p>
            </div>
          ) : sortedAnimeList.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">
                No anime found
              </h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setStatusFilter("all")}
                  className="btn-primary px-6 py-3"
                >
                  Show All Anime
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedAnimeList.map((anime) => (
                <div
                  key={anime._id}
                  className="group relative bg-[#23242b] rounded-2xl overflow-hidden border-2 border-[#181a20] hover:border-[#ffd700] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer"
                  onClick={(e) => {
                    if (
                      e.target.closest("button") ||
                      e.target.tagName === "INPUT" ||
                      e.target.tagName === "SELECT" ||
                      e.target.tagName === "FORM"
                    )
                      return;
                    if (anime.mal_id) {
                      navigate(`/anime/${anime.mal_id}`);
                    } else {
                      navigate(`/search?q=${encodeURIComponent(anime.title)}`);
                    }
                  }}
                >
                  {/* Card Content (clickable) */}
                  <div className="flex-1 flex flex-col p-6">
                    {/* Anime Image */}
                    <div className="relative mb-4">
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-[#ffd700]/30"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(
                            anime.status
                          )}`}
                        >
                          {getStatusText(anime.status)}
                        </span>
                      </div>
                    </div>
                    {/* Title and Score */}
                    <div className="flex-1">
                      <h3
                        className="text-lg font-extrabold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors drop-shadow-lg"
                        style={{ textShadow: "0 2px 8px #0008" }}
                      >
                        {anime.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span
                            className="text-white font-semibold text-base drop-shadow"
                            style={{ textShadow: "0 2px 8px #0008" }}
                          >
                            {anime.score}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Episode Progress */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-400 mb-1">
                        Progress
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={anime.episodes || 0}
                          value={anime.episodesWatched || 0}
                          onChange={async (e) => {
                            const newEpisodesWatched = Number(e.target.value);
                            await axios.put(
                              `/watchlist/${anime._id}`,
                              { episodesWatched: newEpisodesWatched },
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchWatchlist();
                          }}
                          className="w-16 px-2 py-1 rounded bg-[#23242b] text-white border border-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                        />
                        <span className="text-gray-400 text-xs">
                          / {anime.episodes || "?"}
                        </span>
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-yellow-400"
                            style={{
                              width: `${
                                anime.episodes && anime.episodesWatched
                                  ? Math.min(
                                      100,
                                      (anime.episodesWatched / anime.episodes) *
                                        100
                                    )
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Edit/Remove Buttons (not clickable for details) */}
                  {editingAnimeId === anime._id ? (
                    <form
                      className="bg-[#23242b] rounded-2xl p-6 shadow-xl w-full max-w-md mx-auto flex flex-col gap-4 mt-2"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        let updatedData = { ...editData };
                        if (editData.status === "completed") {
                          updatedData.episodesWatched = anime.episodes;
                        } else {
                          updatedData.episodesWatched = 0;
                        }
                        await axios.put(
                          `/watchlist/${anime._id}`,
                          {
                            status: updatedData.status,
                            score: updatedData.score,
                            episodesWatched: updatedData.episodesWatched,
                          },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setEditingAnimeId(null);
                        fetchWatchlist();
                        toast.success("Anime updated successfully");
                      }}
                    >
                      <label className="block text-sm text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={editData.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setEditData((prev) => ({
                            ...prev,
                            status: newStatus,
                            episodesWatched:
                              newStatus === "completed" ? anime.episodes : 0,
                          }));
                        }}
                        className="w-full p-2 rounded-lg bg-[#23242b] text-white border border-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700] mb-2"
                      >
                        <option value="watching">Watching</option>
                        <option value="completed">Completed</option>
                        <option value="plan to watch">Plan to Watch</option>
                        <option value="dropped">Dropped</option>
                      </select>

                      <label className="block text-sm text-gray-300 mb-1">
                        Score
                      </label>
                      <div className="flex items-center gap-2 mb-4">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={editData.score}
                          onChange={(e) =>
                            setEditData({ ...editData, score: e.target.value })
                          }
                          className="w-20 px-2 py-1 rounded bg-[#23242b] text-white border border-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700] text-center font-bold text-lg"
                          placeholder="Score (0-10)"
                        />
                        <span className="text-gray-400">/ 10</span>
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 active:bg-green-700 transition-all duration-150 flex items-center justify-center gap-2 shadow-md"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAnimeId(null)}
                          className="flex-1 px-4 py-2 rounded-full bg-gray-600 text-white font-bold hover:bg-gray-700 active:bg-gray-800 transition-all duration-150 flex items-center justify-center gap-2 shadow-md"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex gap-2 mt-2 z-30 relative px-6 pb-6">
                      <button
                        onClick={() => {
                          setEditingAnimeId(anime._id);
                          setEditData({
                            status: anime.status,
                            score: anime.score,
                            episodesWatched: anime.episodesWatched || 0,
                          });
                        }}
                        className="px-6 py-2 text-sm font-bold rounded-full bg-white text-[#181a20] border border-[#e5e7eb] hover:bg-[#f3f4f6] hover:border-[#ffd700] focus:outline-none focus:ring-2 focus:ring-[#ffd700] transition-all duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(anime._id)}
                        className="px-6 py-2 text-sm font-bold rounded-full bg-red-500 text-white border border-[#e5e7eb] hover:bg-red-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-150"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}

export default Watchlist;
