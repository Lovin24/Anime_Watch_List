const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load .env variables

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use correct key from .env

async function getAnimeRecommendation(promptText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(promptText);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate recommendations from Gemini API");
  }
}

module.exports = { getAnimeRecommendation };
