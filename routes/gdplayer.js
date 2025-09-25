const express = require("express");
const axios = require("axios");
const router = express.Router();

module.exports.routes = {
  name: "Geometry Dash Profile Player",
  desc: "Geometry Dash profile of a player based on Original Server By Robtop",
  category: "Geometry Dash",
  usages: "/api/gdprofile",
  query: "?player=jonell10",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player username is required." });
  }

  try {
    const response = await axios.get(`https://gdbrowser.com/api/profile/${player}`);
    const data = response.data;

    const filteredData = {
      username: data.username,
      playerID: data.playerID,
      accountID: data.accountID,
      rank: data.rank,
      stars: data.stars,
      diamonds: data.diamonds,
      coins: data.coins,
      userCoins: data.userCoins,
      demons: data.demons,
      moons: data.moons,
      cp: data.cp,
      icon: data.icon,
      friendRequests: data.friendRequests,
      messages: data.messages,
      commentHistory: data.commentHistory,
      moderator: data.moderator,
      youtube: data.youtube,
      twitter: data.twitter,
      twitch: data.twitch,
      ship: data.ship,
      ball: data.ball,
      ufo: data.ufo,
      wave: data.wave,
      robot: data.robot,
      spider: data.spider,
      swing: data.swing,
      jetpack: data.jetpack,
      col1: data.col1,
      col2: data.col2,
      colG: data.colG,
      deathEffect: data.deathEffect,
      glow: data.glow,
      classicDemonsCompleted: data.classicDemonsCompleted,
      platformerDemonsCompleted: data.platformerDemonsCompleted,
      classicLevelsCompleted: data.classicLevelsCompleted,
      platformerLevelsCompleted: data.platformerLevelsCompleted,
      col1RGB: data.col1RGB,
      col2RGB: data.col2RGB,
      colGRGB: data.colGRGB,
    };

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile data.", details: error.message });
  }
};
