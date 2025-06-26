const axios = require("axios");

const BASE_URL = "https://api.jikan.moe/v4";

// Search anime by title (returns the first match)
async function fetchAnimeByTitle(title) {
  function normalizeTitle(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  try {
    // Try original title
    let response = await axios.get(`${BASE_URL}/anime`, {
      params: { q: title, limit: 1 },
    });
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    // Try normalized title if original fails
    const normTitle = normalizeTitle(title);
    if (normTitle !== title) {
      response = await axios.get(`${BASE_URL}/anime`, {
        params: { q: normTitle, limit: 1 },
      });
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
    }
    return null;
  } catch (error) {
    console.error("Jikan fetch error:", error.message);
    return null;
  }
}

module.exports = { fetchAnimeByTitle };
