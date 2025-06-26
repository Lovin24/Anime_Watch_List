"// pages/SearchPage.jsx";

import { useState } from "react";
import SearchAnime from "../components/SearchAnime";
import SearchFilters from "../components/SearchFilters";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function SearchPage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    type: "",
  });

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#181a20] pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-logo mb-4">
            Discover Anime
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Search through thousands of anime titles and add your favorites to
            your personal watchlist
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-6xl mx-auto">
          <div className="card border border-[#23242b] shadow-2xl">
            {/* Search Filters */}
            <SearchFilters filters={filters} onChange={setFilters} />

            {/* Search Component */}
            <SearchAnime onAdd={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
