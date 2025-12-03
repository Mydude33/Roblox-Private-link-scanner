const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST allowed' });
  }

  const { link } = req.body;

  const match = link.match(/[?&]privateServerLinkCode=([A-Za-z0-9_-]+)/);
  if (!match) {
    return res.json({ success: false, message: "No private server code found" });
  }

  const code = match[1];

  try {
    const response = await axios.get(`https://games.roblox.com/v1/vip-server/${code}`, {
      headers: { 'Referer': 'https://www.roblox.com/' },
      timeout: 8000
    });

    const data = response.data;
    res.json({
      success: true,
      name: data.name || "Private Server",
      playing: data.playing || 0,
      maxPlayers: data.maxPlayers || 50,
      owner: data.owner?.name || "Unknown"
    });

  } catch (error) {
    if (error.response?.status === 404) {
      return res.json({ success: false, message: "Dead or invalid link" });
    }
    res.json({ success: false, message: "Rate-limited or Roblox down" });
  }
};