const Anime = require("../models/Anime");
const { getAnimeRecommendation } = require("../services/geminiService");
const { fetchAnimeByTitle } = require("../services/jikanService");

// Get user's anime watchlist
const getUserWatchlist = async (req, res) => {
  try {
    const watchlist = await Anime.find({ user: req.user._id });
    res.status(200).json({ success: true, watchlist });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch watchlist" });
  }
};

// Add new anime to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { animeId, title, image, status, score } = req.body;

    // Optional: check for duplicates
    const existing = await Anime.findOne({ user: req.user._id, animeId });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Anime already in watchlist" });
    }

    // Fetch total episodes and mal_id from Jikan API
    let episodes = 0;
    let mal_id = null;
    try {
      const animeData = await fetchAnimeByTitle(title);
      if (animeData) {
        if (animeData.episodes) {
          episodes = animeData.episodes;
        }
        if (animeData.mal_id) {
          mal_id = animeData.mal_id;
        }
      }
    } catch (err) {
      console.error("Failed to fetch data from Jikan API", err);
    }

    const newEntry = new Anime({
      user: req.user._id,
      animeId,
      title,
      image,
      status,
      score,
      episodes,
      episodesWatched: 0,
      mal_id,
    });

    await newEntry.save();
    res.status(201).json({
      success: true,
      message: "Anime added to watchlist",
      anime: newEntry,
    });
  } catch (error) {
    console.error("Add to Watchlist Error:", error);
    res.status(500).json({ success: false, message: "Failed to add anime" });
  }
};

// Update anime in watchlist
const updateWatchlistEntry = async (req, res) => {
  try {
    const updated = await Anime.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Anime not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Anime updated", anime: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Delete anime from watchlist
const deleteFromWatchlist = async (req, res) => {
  try {
    const deleted = await Anime.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Anime not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Anime removed from watchlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Get AI-powered anime recommendations
const getRecommendations = async (req, res) => {
  try {
    // Get user's watchlist
    const watchlist = await Anime.find({ user: req.user._id });

    if (watchlist.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
        message:
          "Add some anime to your watchlist to get personalized recommendations!",
      });
    }

    // Analyze user preferences
    const statusCounts = {};
    const animeTitles = [];

    watchlist.forEach((anime) => {
      // Count status preferences
      statusCounts[anime.status] = (statusCounts[anime.status] || 0) + 1;
      animeTitles.push(anime.title);
    });

    // Determine user preferences
    const favoriteStatus = Object.keys(statusCounts).reduce((a, b) =>
      statusCounts[a] > statusCounts[b] ? a : b
    );

    const totalAnime = watchlist.length;
    const completedCount = statusCounts["completed"] || 0;
    const watchingCount = statusCounts["watching"] || 0;
    const planToWatchCount = statusCounts["plan to watch"] || 0;

    // Create a more detailed prompt for better recommendations
    const prompt = `Based on this user's anime watchlist analysis:

ANIME LIST: ${animeTitles.join(", ")}

USER PREFERENCES ANALYSIS:
- Total anime in list: ${totalAnime}
- Most common status: ${favoriteStatus}
- Completed: ${completedCount}
- Currently watching: ${watchingCount}
- Plan to watch: ${planToWatchCount}

Please recommend 5 diverse anime that would be perfect for this user. Consider their preferences and provide personalized reasons.

For each recommendation, provide:
1. The exact anime title
2. A SHORT explanation (1-2 sentences) of why this anime would appeal to them based on their specific watchlist and preferences
3. The anime type (TV, Movie, OVA, etc.)
4. A brief description (1-2 sentences)
5. A specific reason tied to their watchlist (e.g., "If you enjoyed X, you'll love this because...")

Format your response as a JSON array with this structure:
[
  {
    "title": "Anime Title",
    "reason": "Short explanation of why this anime would appeal to the user based on their specific watchlist and preferences",
    "type": "TV/Movie/OVA",
    "description": "Brief description of the anime",
    "personalizedReason": "Specific reason tied to their watchlist preferences"
  }
]

Make sure each recommendation is different and tailored to their specific tastes. Only return the JSON array, no additional text.`;

    let recommendations;
    try {
      // Call Gemini API using the new service
      const responseText = await getAnimeRecommendation(prompt);

      // Try to parse the JSON response
      try {
        // Clean the response text to extract JSON
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError);
        console.log("Raw response:", responseText);
        throw new Error("Failed to parse AI response");
      }
    } catch (apiError) {
      console.error("Gemini API Error:", apiError);

      // Use dynamic fallback recommendations based on user preferences
      const allFallbackRecommendations = [
        {
          title: "Attack on Titan",
          reason: `Based on your ${totalAnime} anime watchlist, you seem to enjoy intense storytelling and complex narratives. Attack on Titan offers a masterful blend of action, mystery, and emotional depth that would perfectly complement your collection.`,
          type: "TV",
          description:
            "Humanity's last stand against giant humanoid creatures in a post-apocalyptic world.",
          personalizedReason: `If you enjoyed the dramatic storytelling in your list, you'll love this because it delivers one of the most compelling narratives in anime history.`,
        },
        {
          title: "Death Note",
          reason: `Your watchlist shows an appreciation for psychological depth and strategic thinking. Death Note is a masterpiece of psychological thriller that will keep you on the edge of your seat with its brilliant mind games and moral complexity.`,
          type: "TV",
          description:
            "A high school student finds a supernatural notebook that can kill anyone whose name is written in it.",
          personalizedReason: `If you liked the strategic elements in your anime, you'll love this because it's essentially a high-stakes chess game between genius minds.`,
        },
        {
          title: "Fullmetal Alchemist: Brotherhood",
          reason: `Given your diverse anime collection, you'd appreciate this epic adventure that combines fantasy, action, and deep emotional storytelling. It's considered one of the most complete anime experiences ever created.`,
          type: "TV",
          description:
            "Two brothers seek to restore their bodies after a failed alchemical experiment.",
          personalizedReason: `If you enjoyed the world-building in your list, you'll love this because it creates one of the most detailed and consistent fantasy worlds in anime.`,
        },
        {
          title: "Demon Slayer",
          reason: `Your watchlist indicates you enjoy modern anime with stunning visuals and compelling characters. Demon Slayer offers breathtaking animation quality and emotional storytelling that would be a perfect addition to your collection.`,
          type: "TV",
          description:
            "A young man becomes a demon slayer to save his sister and avenge his family.",
          personalizedReason: `If you appreciated the visual quality in your anime, you'll love this because it features some of the most beautiful animation ever produced.`,
        },
        {
          title: "One Punch Man",
          reason: `Based on your anime preferences, you'd enjoy this unique take on superhero stories that combines humor, action, and social commentary. It's a refreshing break from traditional anime tropes while still being incredibly entertaining.`,
          type: "TV",
          description:
            "A hero who can defeat any opponent with a single punch struggles with boredom and recognition.",
          personalizedReason: `If you liked the comedy elements in your list, you'll love this because it's one of the funniest and most self-aware anime ever made.`,
        },
        {
          title: "My Hero Academia",
          reason: `Your watchlist suggests you enjoy character-driven stories with growth and development. My Hero Academia offers a perfect blend of superhero action, character development, and emotional storytelling that would resonate with your taste.`,
          type: "TV",
          description:
            "A world where people with superpowers train to become heroes.",
          personalizedReason: `If you enjoyed character development in your anime, you'll love this because it shows incredible growth from weak to strong characters.`,
        },
        {
          title: "Hunter x Hunter",
          reason: `Your anime collection shows an appreciation for complex world-building and strategic battles. Hunter x Hunter delivers intricate storytelling with some of the most well-thought-out power systems and character development in anime.`,
          type: "TV",
          description:
            "A young boy embarks on a journey to become a Hunter and find his father.",
          personalizedReason: `If you liked strategic elements in your list, you'll love this because it has some of the most intelligent battle strategies ever conceived.`,
        },
        {
          title: "Steins;Gate",
          reason: `Based on your watchlist, you seem to appreciate complex narratives and psychological depth. Steins;Gate is a masterpiece of time travel storytelling that combines science fiction with deep emotional resonance.`,
          type: "TV",
          description:
            "A scientist accidentally discovers time travel and must prevent a dystopian future.",
          personalizedReason: `If you enjoyed complex storytelling in your anime, you'll love this because it's one of the most intricately plotted anime ever made.`,
        },
        {
          title: "Code Geass",
          reason: `Your anime preferences indicate you enjoy strategic thinking and complex political narratives. Code Geass offers a brilliant mix of mecha action, political intrigue, and psychological warfare that would captivate your attention.`,
          type: "TV",
          description:
            "A prince uses supernatural powers to lead a rebellion against an empire.",
          personalizedReason: `If you liked strategic mind games in your list, you'll love this because it features some of the most brilliant tactical thinking in anime.`,
        },
        {
          title: "Parasyte",
          reason: `Your watchlist shows you appreciate dark themes and psychological horror. Parasyte delivers a unique blend of body horror, philosophical questions, and emotional storytelling that would appeal to your darker tastes.`,
          type: "TV",
          description:
            "A high school student's hand is taken over by an alien parasite.",
          personalizedReason: `If you enjoyed dark themes in your anime, you'll love this because it explores deep philosophical questions about humanity and survival.`,
        },
        {
          title: "Mob Psycho 100",
          reason: `Based on your diverse anime collection, you'd appreciate this unique take on supernatural powers that combines humor, action, and deep character development. It's both entertaining and emotionally resonant.`,
          type: "TV",
          description:
            "A powerful psychic tries to live a normal life while dealing with supernatural threats.",
          personalizedReason: `If you enjoyed character growth in your list, you'll love this because it shows incredible personal development and self-acceptance.`,
        },
        {
          title: "The Promised Neverland",
          reason: `Your watchlist indicates you enjoy psychological thrillers and strategic thinking. The Promised Neverland offers a masterful blend of horror, strategy, and emotional storytelling that will keep you on the edge of your seat.`,
          type: "TV",
          description:
            "Children discover their orphanage is actually a farm for monsters.",
          personalizedReason: `If you liked psychological elements in your anime, you'll love this because it's one of the most intense psychological thrillers in anime.`,
        },
        {
          title: "Jujutsu Kaisen",
          reason: `Your anime preferences show you enjoy modern action with stunning visuals and compelling characters. Jujutsu Kaisen offers breathtaking animation, complex power systems, and emotional depth that would be perfect for your collection.`,
          type: "TV",
          description:
            "A teenager becomes a sorcerer to fight curses and save his friend.",
          personalizedReason: `If you appreciated modern animation quality in your list, you'll love this because it features some of the most stunning fight scenes ever animated.`,
        },
        {
          title: "Vinland Saga",
          reason: `Based on your watchlist, you seem to appreciate historical settings and complex character development. Vinland Saga offers a masterful blend of historical accuracy, brutal action, and deep philosophical themes that would resonate with your taste.`,
          type: "TV",
          description: "A young Viking seeks revenge in medieval Europe.",
          personalizedReason: `If you enjoyed character development in your anime, you'll love this because it shows one of the most profound character transformations in anime history.`,
        },
      ];

      // Select 5 random recommendations for variety
      const shuffled = allFallbackRecommendations.sort(
        () => Math.random() - 0.5
      );
      recommendations = shuffled.slice(0, 5);
    }

    // After recommendations are generated, enrich with images from Jikan
    const fallbackAnimeData = {
      "One Punch Man": {
        mal_id: 30276,
        image: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
      },
      "Attack on Titan": {
        mal_id: 16498,
        image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      },
      "Death Note": {
        mal_id: 1535,
        image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
      },
      "Fullmetal Alchemist: Brotherhood": {
        mal_id: 5114,
        image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
      },
      "Demon Slayer": {
        mal_id: 38000,
        image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
      },
      "My Hero Academia": {
        mal_id: 31964,
        image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
      },
      "Hunter x Hunter": {
        mal_id: 11061,
        image: "https://cdn.myanimelist.net/images/anime/1337/99013.jpg",
      },
      "Steins;Gate": {
        mal_id: 9253,
        image: "https://cdn.myanimelist.net/images/anime/5/73199.jpg",
      },
      "Code Geass": {
        mal_id: 1575,
        image: "https://cdn.myanimelist.net/images/anime/4/9391.jpg",
      },
      Parasyte: {
        mal_id: 22535,
        image: "https://cdn.myanimelist.net/images/anime/3/73178.jpg",
      },
      // Add more as needed
    };

    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        let image = null;
        let mal_id = null;
        try {
          const anime = await fetchAnimeByTitle(rec.title);
          if (anime) {
            if (
              anime.images &&
              anime.images.jpg &&
              anime.images.jpg.large_image_url
            ) {
              image = anime.images.jpg.large_image_url;
            }
            if (anime.mal_id) {
              mal_id = anime.mal_id;
            }
          }
        } catch (e) {
          image = null;
          mal_id = null;
        }
        // Fallback mapping for popular anime
        if (!mal_id && fallbackAnimeData[rec.title]) {
          mal_id = fallbackAnimeData[rec.title].mal_id;
        }
        if (!image && fallbackAnimeData[rec.title]) {
          image = fallbackAnimeData[rec.title].image;
        }
        return { ...rec, image, mal_id };
      })
    );

    res.status(200).json({
      success: true,
      recommendations: enrichedRecommendations,
      watchlistCount: watchlist.length,
      userPreferences: {
        totalAnime,
        favoriteStatus,
        completedCount,
        watchingCount,
        planToWatchCount,
      },
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};

module.exports = {
  getUserWatchlist,
  addToWatchlist,
  updateWatchlistEntry,
  deleteFromWatchlist,
  getRecommendations,
};
