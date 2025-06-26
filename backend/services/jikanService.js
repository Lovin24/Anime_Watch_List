const axios = require("axios");

const BASE_URL = "https://api.jikan.moe/v4";

// Search anime by title (returns the first match)
async function fetchAnimeByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/anime`, {
      params: { q: title, limit: 1 },
    });
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.error("Jikan fetch error:", error.message);
    return null;
  }
}

module.exports = { fetchAnimeByTitle };
