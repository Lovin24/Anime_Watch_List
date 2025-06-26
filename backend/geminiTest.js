// geminiTest.js
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      "Give me a random anime recommendation."
    );
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response:\n", text);
  } catch (error) {
    console.error("Gemini test failed:\n", error);
  }
}

testGemini();
