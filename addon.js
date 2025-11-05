const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

const API_KEY = "YOUR_TMDB_API_KEY"; // Replace with your actual TMDb key

const builder = new addonBuilder({
  id: "org.amie.tmdbaddon",
  version: "1.0.0",
  name: "TMDb Metadata Addon",
  description: "Enhances Stremio with TMDb movie metadata",
  types: ["movie"],
  resources: ["meta"],
  idPrefixes: ["tt"]
});

builder.defineMetaHandler(async ({ id }) => {
  try {
    const tmdbId = id.replace("tt", ""); // assumes IMDb ID format
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}`);
    const data = response.data;

    return {
      meta: {
        id: id,
        name: data.title,
        description: data.overview,
        poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        background: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
        releaseInfo: data.release_date,
        runtime: `${data.runtime} min`,
        genres: data.genres.map(g => g.name),
        imdbRating: data.vote_average.toString()
      }
    };
  } catch (error) {
    console.error("TMDb fetch error:", error.message);
    return { meta: {} };
  }
});

module.exports = builder.getInterface();
