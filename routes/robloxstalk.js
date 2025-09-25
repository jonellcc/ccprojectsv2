const axios = require('axios');

module.exports.routes = {
  name: "Roblox User Stalker",
  desc: "Get detailed information about a Roblox user",
  category: "Stalk",
  query: "?user=jandel",
  usages: "/api/robloxstalk",
  method: "get",
};

module.exports.onAPI = async (req, res) => {
  const username = req.query.user;

  if (!username) {
    return res.status(400).json({ message: "Please provide a 'user' (Roblox username) to stalk." });
  }

  const apiUrl = `https://api.siputzx.my.id/api/stalk/roblox?user=${encodeURIComponent(username)}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data.status && response.data.data) {
      const userData = response.data.data;

      // Extract and format the key information
      const formattedData = {
        userId: userData.userId,
        username: userData.basic.name,
        displayName: userData.basic.displayName,
        description: userData.basic.description,
        isBanned: userData.basic.isBanned,
        hasVerifiedBadge: userData.basic.hasVerifiedBadge,
        accountCreated: userData.basic.created,
        social: {
          friendsCount: userData.social.friends.count,
          followersCount: userData.social.followers.count,
          followingCount: userData.social.following.count,
        },
        presence: userData.presence.userPresences.length > 0 ? {
          lastLocation: userData.presence.userPresences[0].lastLocation,
          type: userData.presence.userPresences[0].userPresenceType,
        } : null,
        groups: userData.groups.list.data.slice(0, 5).map(groupItem => ({ // Only show top 5 groups for brevity
          groupId: groupItem.group.id,
          groupName: groupItem.group.name,
          memberCount: groupItem.group.memberCount,
          userRole: groupItem.role.name,
          userRank: groupItem.role.rank
        })),
      };

      res.json(formattedData);
    } else {
      res.status(404).json({ message: `Roblox user '${username}' not found or API failed to retrieve data.` });
    }
  } catch (error) {
    console.error('Error calling Roblox Stalker API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
