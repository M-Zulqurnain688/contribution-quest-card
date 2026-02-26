require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = process.env.GITHUB_TOKEN;

async function fetchUserStats(targetUser) {
  const headers = { Authorization: `token ${TOKEN}` };

  try {
    const { data: events } = await axios.get(
      `https://api.github.com/users/${targetUser}/events/public`,
      { headers },
    );

    if (!Array.isArray(events) || events.length === 0) return null;

    const lastPush = events.find(
      (e) => e.type === "PushEvent" && e.payload.head,
    );

    if (!lastPush) return null;

    const repoName = lastPush.repo.name;
    const headSha = lastPush.payload.head;

    const commitUrl = `https://api.github.com/repos/${repoName}/commits/${headSha}`;
    const { data: detail } = await axios.get(commitUrl, { headers });

    return {
      username: targetUser,
      repo: repoName.split("/")[1],
      additions: detail.stats?.additions || 0,
      deletions: detail.stats?.deletions || 0,
      date: new Date(lastPush.created_at).toLocaleDateString(),
    };
  } catch (err) {
    console.error("Fetch Error:", err.message);
    return null;
  }
}

app.get("/github-badge/:username", async (req, res) => {
  const { username } = req.params;
  const themeColor = req.query.color || "BD00FF";
  const secondaryColor = "00F0FF";

  try {
    const data = await fetchUserStats(username);

    // If no data, send a specialized "User/Stats Not Found" SVG
    if (!data) {
      res.setHeader("Content-Type", "image/svg+xml");
      return res.send(`
            <svg width="400" height="110" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" rx="12" fill="#1c1c1c"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FF005C" font-family="Arial">
                    User Stats Not Found or Rate Limited
                </text>
            </svg>
        `);
    }
    // 1. Precise Math for the Ring
    const radius = 54;
    const circumference = 2 * Math.PI * radius; // ~339.29

    const svg = `
<svg width="495" height="260" viewBox="0 0 495 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
        
        .header { font: 700 16px 'Inter', sans-serif; fill: #fff; opacity: 0.8; }
        .hero-value { font: 900 42px 'Inter', sans-serif; fill: #00FF94; filter: url(#glow); }
        .side-value { font: 700 24px 'Inter', sans-serif; fill: #F8D06E; }
        .label { font: 700 12px 'Inter', sans-serif; fill: #FE428E; letter-spacing: 1px; }
        .sub-label { font: 400 10px 'Inter', sans-serif; fill: #666; }
        .repo-text { font: 500 11px 'JetBrains Mono', monospace; fill: #00F0FF; }
        
        @keyframes fillAnim {
            from { stroke-dashoffset: ${circumference}; }
            to { stroke-dashoffset: 0; }
        }
        .progress-ring {
            stroke-dasharray: ${circumference};
            stroke-dashoffset: ${circumference};
            animation: fillAnim 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
    </style>

    <defs>
        <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00FF94;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00F0FF;stop-opacity:1" />
        </linearGradient>
    </defs>

    <rect width="495" height="260" rx="15" fill="#09090B"/>
    <rect x="0.5" y="0.5" width="494" height="259" rx="14.5" stroke="#27272A" fill="none"/>

    <text x="25" y="45" class="header">⚔️ Contribution Quest: ${data.username}</text>

    <g transform="translate(0, 15)">
        <g transform="translate(60, 130)">
            <text x="0" y="0" class="side-value" text-anchor="middle">-${data.deletions}</text>
            <text x="0" y="25" class="label" text-anchor="middle" style="fill:#FF005C">DELETIONS</text>
        </g>

        <g transform="translate(247, 130)">
            <circle cx="0" cy="-15" r="62" stroke="#18181B" stroke-width="8" fill="none" />
            <circle cx="0" cy="-15" r="54" class="progress-ring" 
                    stroke="url(#circleGrad)" stroke-width="6" stroke-linecap="round" fill="none" 
                    transform="rotate(-90 0 -15)" />
            
            <text x="0" y="3" class="hero-value" text-anchor="middle"
                  textLength="${data.additions > 999 ? "80" : ""}" 
                  lengthAdjust="spacingAndGlyphs"
                  style="font-size: ${data.additions > 999 ? "28px" : "42px"};">
                ${data.additions}
            </text>
            <text x="0" y="72" class="label" text-anchor="middle">INSERTIONS</text>
        </g>

        <g transform="translate(430, 130)">
            <text x="0" y="0" class="side-value" text-anchor="middle">+${data.additions - data.deletions}</text>
            <text x="0" y="25" class="label" text-anchor="middle" style="fill:#BD00FF">NET XP</text>
        </g>
    </g>

    <rect x="25" y="225" width="445" height="1" fill="#27272A"/>
    <text x="25" y="245" class="repo-text">~/target: ${data.repo}</text>
    <text x="410" y="245" class="sub-label" text-anchor="end">${data.date}</text>

    <circle cx="470" cy="40" r="4" fill="#00FF94" filter="url(#glow)">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
    </circle>
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(svg);
  } catch (error) {
    console.error("Main Route Error:", error.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`🚀 Service Live on Port ${PORT}`));

module.exports = app;
