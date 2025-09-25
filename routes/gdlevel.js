const express = require("express");
const axios = require("axios");
const router = express.Router();

module.exports.routes = {
  name: "Geometry Dash Level Search ID",
  desc: "The details of a Geometry Dash level based on its ID",
  category: "Geometry Dash",
  usages: "/api/gdlevel",
  query: "?id=110903207",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Level ID is required." });
  }

  try {
    const response = await axios.get(`https://gdbrowser.com/api/level/${id}`);
    const data = response.data;

    const filteredData = {
      name: data.name,
      id: data.id,
      description: data.description,
      author: data.author,
      playerID: data.playerID,
      accountID: data.accountID,
      difficulty: data.difficulty,
      downloads: data.downloads,
      likes: data.likes,
      disliked: data.disliked,
      length: data.length,
      platformer: data.platformer,
      stars: data.stars,
      orbs: data.orbs,
      diamonds: data.diamonds,
      featured: data.featured,
      featuredPosition: data.featuredPosition,
      epic: data.epic,
      legendary: data.legendary,
      mythic: data.mythic,
      gameVersion: data.gameVersion,
      editorTime: data.editorTime,
      totalEditorTime: data.totalEditorTime,
      version: data.version,
      copiedID: data.copiedID,
      twoPlayer: data.twoPlayer,
      officialSong: data.officialSong,
      customSong: data.customSong,
      coins: data.coins,
      verifiedCoins: data.verifiedCoins,
      starsRequested: data.starsRequested,
      ldm: data.ldm,
      objects: data.objects,
      large: data.large,
      cp: data.cp,
      partialDiff: data.partialDiff,
      difficultyFace: data.difficultyFace,
      songName: data.songName,
      songAuthor: data.songAuthor,
      songSize: data.songSize,
      songID: data.songID,
      songLink: data.songLink,
    };

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch level data.", details: error.message });
  }
};
