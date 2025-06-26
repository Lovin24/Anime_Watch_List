// services/jikan.js
import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

export const searchAnime = async (params) => {
  const response = await axios.get(`${BASE_URL}/anime`, { params });
  return response.data.data;
};

export const getAnimeDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}/anime/${id}`);
  return response.data.data;
};
