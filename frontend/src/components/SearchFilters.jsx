// components/SearchFilters.jsx
function SearchFilters({ filters, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* Status Filter */}
      <div className="relative">
        <select
          className="w-full appearance-none bg-gray-700/50 border border-gray-600/50 text-white px-4 py-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="">Any Status</option>
          <option value="airing">Currently Airing</option>
          <option value="complete">Finished Airing</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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

      {/* Type Filter */}
      <div className="relative">
        <select
          className="w-full appearance-none bg-gray-700/50 border border-gray-600/50 text-white px-4 py-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
        >
          <option value="">Any Format</option>
          <option value="tv">TV Series</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="special">Special</option>
          <option value="ona">ONA</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
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

      {/* Clear Filters Button */}
      <button
        onClick={() => onChange({ query: "", status: "", type: "" })}
        className="px-4 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Clear Filters
      </button>
    </div>
  );
}

export default SearchFilters;
