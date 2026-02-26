// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const app = express();
// const PORT = 3000;

// const USERNAME = 'M-Zulqurnain688';
// const TOKEN = process.env.GITHUB_TOKEN;

// async function fetchStats() {
//     const headers = { 'Authorization': `token ${TOKEN}` };
//     const { data: events } = await axios.get(`https://api.github.com/users/${USERNAME}/events`, { headers });

//     let stats = { additions: 0, deletions: 0, repos: new Set() };
//     let commitCount = 0;

//     for (const event of events) {
//         if (event.type === 'PushEvent' && event.payload) {
//             stats.repos.add(event.public ? event.repo.name : "Private");
//             let urls = event.payload.commits ? event.payload.commits.map(c => c.url) : [/* head url logic */];

//             // For simplicity in this demo, we'll fetch just the head commit stats
//             const headUrl = `https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`;
//             try {
//                 const { data: detail } = await axios.get(headUrl, { headers });
//                 stats.additions += detail.stats.additions;
//                 stats.deletions += detail.stats.deletions;
//                 commitCount++;
//             } catch (e) { continue; }
//         }
//         if (commitCount >= 5) break; // Keep it fast for the web
//     }
//     return { ...stats, repoCount: stats.repos.size };
// }

// app.get('/github-badge', async (req, res) => {
//     try {
//         const data = await fetchStats();

//         // The SVG Template
//         const svg = `
//         <svg width="350" height="100" viewBox="0 0 350 100" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <style>
//                 .title { font: bold 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #00b4d8; }
//                 .stat { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
//                 .repo-tag { font: italic 10px 'Segoe UI', Sans-Serif; fill: #888; }
//             </style>
//             <rect width="100%" height="100%" rx="10" fill="#1c1c1c"/>
//             <text x="20" y="30" class="title">🚀 Recent Code Velocity (MZA)</text>

//             <text x="20" y="60" class="stat">➕ ${data.additions} insertions</text>
//             <text x="150" y="60" class="stat">➖ ${data.deletions} deletions</text>

//             <text x="20" y="85" class="repo-tag">Active in ${data.repoCount} repositories recently</text>

//             <circle cx="320" cy="30" r="5" fill="#2ea44f">
//                 <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
//             </circle>
//         </svg>
//         `;

//         res.setHeader('Content-Type', 'image/svg+xml');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.send(svg);

//     } catch (error) {
//         res.status(500).send("Error generating badge");
//     }
// });

// app.listen(PORT, () => console.log(`🚀 Badge server running on http://localhost:${PORT}/github-badge`));

// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const app = express();
// const PORT = process.env.PORT || 3000;

// const TOKEN = process.env.GITHUB_TOKEN;

// async function fetchUserStats(targetUser) {
//   const headers = { Authorization: `token ${TOKEN}` };

//   // Fetch events for the requested user
//   const { data: events } = await axios.get(
//     `https://api.github.com/users/${targetUser}/events/public`,
//     { headers },
//   );

//   // Filter for the very last PushEvent (Last Repo)
//   const lastPush = events.find((e) => e.type === "PushEvent");

//   if (!lastPush) return null;

//   const repoName = lastPush.repo.name;
//   const headSha = lastPush.payload.head;

//   // Get stats for that specific last commit
//   const commitUrl = `https://api.github.com/repos/${repoName}/commits/${headSha}`;
//   const { data: detail } = await axios.get(commitUrl, { headers });

//   return {
//     username: targetUser,
//     repo: repoName.split("/")[1], // Just the repo name, not the owner
//     additions: detail.stats.additions,
//     deletions: detail.stats.deletions,
//     date: new Date(lastPush.created_at).toLocaleDateString(),
//   };
// }

// // Route: /github-badge/abidroid or /github-badge/M-Zulqurnain688
// app.get("/github-badge/:username", async (req, res) => {
//   const { username } = req.params;
//   const themeColor = req.query.color || "00b4d8"; // Allow custom colors via ?color=hex
//   const secondaryColor = '00F0FF'; // Cyber Cyan

//   try {
//     const data = await fetchUserStats(username);

//     if (!data) throw new Error("No recent activity");

//     // const svg = `
//     // <svg width="400" height="110" viewBox="0 0 400 110" fill="none" xmlns="http://www.w3.org/2000/svg">
//     //     <style>
//     //         .title { font: bold 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${themeColor}; }
//     //         .stat { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
//     //         .repo-tag { font: italic 11px 'Segoe UI', Sans-Serif; fill: #aaa; }
//     //         .date-tag { font: 10px 'Segoe UI', Sans-Serif; fill: #666; }
//     //     </style>
//     //     <rect width="100%" height="100%" rx="12" fill="#1c1c1c"/>

//     //     <text x="25" y="35" class="title">🚀 Latest Activity: ${data.username}</text>

//     //     <text x="25" y="65" class="stat">➕ ${data.additions} insertions</text>
//     //     <text x="160" y="65" class="stat">➖ ${data.deletions} deletions</text>

//     //     <text x="25" y="90" class="repo-tag">📂 Repo: ${data.repo}</text>
//     //     <text x="310" y="90" class="date-tag">${data.date}</text>

//     //     <circle cx="370" cy="30" r="4" fill="#2ea44f">
//     //         <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
//     //     </circle>
//     // </svg>
//     // `;
//     const svg = `
// <svg width="450" height="140" viewBox="0 0 450 140" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Outfit:wght@600&display=swap');
//         .title { font: 600 16px 'Outfit', sans-serif; fill: #fff; letter-spacing: 1px; }
//         .username { fill: #${themeColor}; font-weight: 800; }
//         .stat-label { font: 700 14px 'JetBrains Mono', monospace; fill: #fff; }
//         .stat-value { font: 800 18px 'JetBrains Mono', monospace; }
//         .plus { fill: #00FF94; } /* Neon Green */
//         .minus { fill: #FF005C; } /* Neon Pink */
//         .repo { font: 500 11px 'JetBrains Mono', monospace; fill: ${secondaryColor}; opacity: 0.8; }
//         .glass { fill: rgba(15, 15, 15, 0.85); stroke: rgba(255, 255, 255, 0.1); }
//     </style>

//     <defs>
//         <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" style="stop-color:#${themeColor};stop-opacity:1" />
//             <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
//         </linearGradient>
//         <filter id="glow">
//             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
//             <feMerge>
//                 <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
//             </feMerge>
//         </filter>
//     </defs>

//     <rect x="2" y="2" width="446" height="136" rx="20" class="glass" stroke="url(#grad)" stroke-width="2"/>

//     <text x="30" y="40" class="title">LEVEL: <tspan class="username">${data.username.toUpperCase()}</tspan></text>

//     <circle cx="410" cy="35" r="5" fill="#00FF94" filter="url(#glow)">
//         <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
//     </circle>

//     <g transform="translate(30, 75)">
//         <text x="0" y="0" class="stat-label">INS: <tspan class="stat-value plus">++${data.additions}</tspan></text>
//         <text x="180" y="0" class="stat-label">DEL: <tspan class="stat-value minus">--${data.deletions}</tspan></text>
//     </g>

//     <text x="30" y="115" class="repo">~/current_project: ${data.repo}</text>
//     <text x="340" y="115" font-family="JetBrains Mono" font-size="9" fill="#555">${data.date}</text>

// </svg>
// `;

//     res.setHeader("Content-Type", "image/svg+xml");
//     res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour to save your token
//     res.send(svg);
//   } catch (error) {
//     res.status(404).send(`<svg>...</svg>`); // You can send a "User Not Found" SVG here
//   }
// });

// app.listen(PORT, () => console.log(`🚀 Service Live on Port ${PORT}`));

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

    // <style>
    //     @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Outfit:wght@600&display=swap');
    //     .title { font: 600 16px 'Outfit', sans-serif; fill: #fff; letter-spacing: 1px; }
    //     .username { fill: #${themeColor}; font-weight: 800; }
    //     .stat-label { font: 700 14px 'JetBrains Mono', monospace; fill: #fff; }
    //     .stat-value { font: 800 18px 'JetBrains Mono', monospace; }
    //     .plus { fill: #00FF94; }
    //     .minus { fill: #FF005C; }
    //     .repo { font: 500 11px 'JetBrains Mono', monospace; fill: ${secondaryColor}; opacity: 0.8; }
    //     .glass { fill: rgba(15, 15, 15, 0.85); stroke: rgba(255, 255, 255, 0.1); }
    // </style>
    //     const svg = `
    //     <svg width="450" height="140" viewBox="0 0 450 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <style>
    //     /* Notice the &amp; between the two font families */
    //     @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&amp;family=Outfit:wght@600&amp;display=swap');

    //     .title { font: 600 16px 'Outfit', sans-serif; fill: #fff; letter-spacing: 1px; }
    //     .username { fill: #${themeColor}; font-weight: 800; }
    //     .stat-label { font: 700 14px 'JetBrains Mono', monospace; fill: #fff; }
    //     .stat-value { font: 800 18px 'JetBrains Mono', monospace; }
    //     .plus { fill: #00FF94; }
    //     .minus { fill: #FF005C; }
    //     .repo { font: 500 11px 'JetBrains Mono', monospace; fill: ${secondaryColor}; opacity: 0.8; }
    //     .glass { fill: rgba(15, 15, 15, 0.85); stroke: rgba(255, 255, 255, 0.1); }
    // </style>
    //         <defs>
    //             <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
    //                 <stop offset="0%" style="stop-color:#${themeColor};stop-opacity:1" />
    //                 <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    //             </linearGradient>
    //             <filter id="glow">
    //                 <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
    //                 <feMerge>
    //                     <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
    //                 </feMerge>
    //             </filter>
    //         </defs>
    //         <rect x="2" y="2" width="446" height="136" rx="20" class="glass" stroke="url(#grad)" stroke-width="2"/>
    //         <text x="30" y="40" class="title">LEVEL: <tspan class="username">${data.username.toUpperCase()}</tspan></text>
    //         <circle cx="410" cy="35" r="5" fill="#00FF94" filter="url(#glow)">
    //             <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
    //         </circle>
    //         <g transform="translate(30, 75)">
    //             <text x="0" y="0" class="stat-label">INS: <tspan class="stat-value plus">++${data.additions}</tspan></text>
    //             <text x="180" y="0" class="stat-label">DEL: <tspan class="stat-value minus">--${data.deletions}</tspan></text>
    //         </g>
    //         <text x="30" y="115" class="repo">~/current_project: ${data.repo}</text>
    //         <text x="340" y="115" font-family="JetBrains Mono" font-size="9" fill="#555">${data.date}</text>
    //     </svg>`;

    // const svg = `
    // <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <style>
    //         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
    //         .label { font: 400 14px 'Inter', sans-serif; fill: #FE428E; }
    //         .value { font: 700 28px 'Inter', sans-serif; fill: #F8D06E; }
    //         .header { font: 700 18px 'Inter', sans-serif; fill: #fff; }
    //         .repo-text { font: 400 12px 'Inter', sans-serif; fill: #999; }
    //         .divider { stroke: #333; stroke-width: 1; }
    //     </style>

    //     <rect width="495" height="195" rx="10" fill="#151515"/>
    //     <rect x="0.5" y="0.5" width="494" height="194" rx="9.5" stroke="#333" fill="none"/>

    //     <text x="25" y="35" class="header">🔥 Contribution Pulse: ${data.username}</text>

    //     <line x1="165" y1="65" x2="165" y2="155" class="divider"/>
    //     <line x1="330" y1="65" x2="330" y2="155" class="divider"/>

    //     <g transform="translate(25, 85)">
    //         <text x="70" y="30" class="value" text-anchor="middle">${data.additions}</text>
    //         <text x="70" y="60" class="label" text-anchor="middle">Insertions</text>
    //         <text x="70" y="85" class="repo-text" text-anchor="middle">Latest Push</text>
    //     </g>

    //     <g transform="translate(190, 85)">
    //         <text x="70" y="30" class="value" text-anchor="middle" style="fill: #00FF94;">${data.deletions}</text>
    //         <text x="70" y="60" class="label" text-anchor="middle" style="fill: #00F0FF;">Deletions</text>
    //         <text x="70" y="85" class="repo-text" text-anchor="middle">${data.date}</text>
    //     </g>

    //     <g transform="translate(355, 85)">
    //         <text x="70" y="30" class="value" text-anchor="middle">${data.additions - data.deletions}</text>
    //         <text x="70" y="60" class="label" text-anchor="middle" style="fill: #BD00FF;">Net Growth</text>
    //         <text x="70" y="85" class="repo-text" text-anchor="middle">Lines</text>
    //     </g>

    //     <text x="25" y="175" class="repo-text" font-style="italic">~/repo: ${data.repo}</text>

    //     <circle cx="470" cy="30" r="4" fill="#2ea44f">
    //         <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    //     </circle>
    // </svg>
    // `;

    // const svg = `
    // <svg width="495" height="210" viewBox="0 0 495 210" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <style>
    //         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;family=JetBrains+Mono:wght@700&amp;display=swap');

    //         /* Animation Logic */
    //         @keyframes fadeInRight {
    //             from { opacity: 0; transform: translateX(-15px); }
    //             to { opacity: 1; transform: translateX(0); }
    //         }

    //         .animate {
    //             animation: fadeInRight 0.6s ease-out forwards;
    //             opacity: 0;
    //         }
    //         .delay-1 { animation-delay: 0.2s; }
    //         .delay-2 { animation-delay: 0.4s; }
    //         .delay-3 { animation-delay: 0.6s; }

    //         .label { font: 400 14px 'Inter', sans-serif; fill: #FE428E; }
    //         .value { font: 700 28px 'Inter', sans-serif; fill: #F8D06E; }
    //         .header { font: 700 18px 'Inter', sans-serif; fill: #fff; }
    //         .repo-text { font: 400 12px 'Inter', sans-serif; fill: #999; }
    //         .divider { stroke: #333; stroke-width: 1; }
    //     </style>

    //     <rect width="495" height="210" rx="10" fill="#151515"/>
    //     <rect x="0.5" y="0.5" width="494" height="209" rx="9.5" stroke="#333" fill="none"/>

    //     <text x="25" y="35" class="header">🔥 Contribution Pulse: ${data.username}</text>

    //     <line x1="165" y1="65" x2="165" y2="155" class="divider"/>
    //     <line x1="330" y1="65" x2="330" y2="155" class="divider"/>

    //     <g transform="translate(25, 85)" class="animate delay-1">
    //         <text x="70" y="30" class="value" text-anchor="middle">${data.additions}</text>
    //         <text x="70" y="55" class="label" text-anchor="middle">Insertions</text>
    //         <text x="70" y="80" class="repo-text" text-anchor="middle">Latest Push</text>
    //     </g>

    //     <g transform="translate(190, 85)" class="animate delay-2">
    //         <text x="70" y="30" class="value" text-anchor="middle" style="fill: #00FF94;">${data.deletions}</text>
    //         <text x="70" y="55" class="label" text-anchor="middle" style="fill: #00F0FF;">Deletions</text>
    //         <text x="70" y="80" class="repo-text" text-anchor="middle">${data.date}</text>
    //     </g>

    //     <g transform="translate(355, 85)" class="animate delay-3">
    //         <text x="70" y="30" class="value" text-anchor="middle">${data.additions - data.deletions}</text>
    //         <text x="70" y="55" class="label" text-anchor="middle" style="fill: #BD00FF;">Net Growth</text>
    //         <text x="70" y="80" class="repo-text" text-anchor="middle">Lines</text>
    //     </g>

    //     <text x="25" y="190" class="repo-text" font-style="italic">~/repo: ${data.repo}</text>

    //     <circle cx="470" cy="30" r="4" fill="#2ea44f">
    //         <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    //     </circle>
    // </svg>
    // `;

    // <text x="25" y="35" class="header">🔥 Contribution Pulse: ${data.username}</text>

    //     const svg = `
    // <svg width="495" height="195" viewBox="0 0(495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <style>
    //         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;family=JetBrains+Mono:wght@700&amp;display=swap');

    //         .header { font: 700 18px 'Inter', sans-serif; fill: #fff; }
    //         .value { font: 700 28px 'Inter', sans-serif; fill: #F8D06E; }
    //         .label { font: 400 14px 'Inter', sans-serif; fill: #FE428E; }
    //         .repo-text { font: 400 12px 'Inter', sans-serif; fill: #999; }
    //         .divider { stroke: #333; stroke-width: 1; }
    //     </style>

    //     <rect width="495" height="195" rx="10" fill="#151515"/>
    //     <rect x="0.5" y="0.5" width="494" height="194" rx="9.5" stroke="#333" fill="none"/>

    //     <text x="25" y="35" class="header">${data.username}'s Stats:</text>

    //     <line x1="165" y1="60" x2="165" y2="140" class="divider"/>
    //     <line x1="330" y1="60" x2="330" y2="140" class="divider"/>

    //     <g transform="translate(25, 75)">
    //         <text x="70" y="25" class="value" text-anchor="middle">${data.additions}
    //             <animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.2s" fill="freeze" />
    //         </text>
    //         <text x="70" y="50" class="label" text-anchor="middle">Insertions</text>
    //         <text x="70" y="70" class="repo-text" text-anchor="middle">Latest Push</text>
    //     </g>

    //     <g transform="translate(190, 75)">
    //         <text x="70" y="25" class="value" text-anchor="middle" style="fill: #00FF94;">${data.deletions}
    //             <animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.4s" fill="freeze" />
    //         </text>
    //         <text x="70" y="50" class="label" text-anchor="middle" style="fill: #00F0FF;">Deletions</text>
    //         <text x="70" y="70" class="repo-text" text-anchor="middle">${data.date}</text>
    //     </g>

    //     <g transform="translate(355, 75)">
    //         <text x="70" y="25" class="value" text-anchor="middle">${data.additions - data.deletions}
    //             <animate attributeName="opacity" from="0" to="1" dur="0.6s" begin="0.6s" fill="freeze" />
    //         </text>
    //         <text x="70" y="50" class="label" text-anchor="middle" style="fill: #BD00FF;">Net Growth</text>
    //         <text x="70" y="70" class="repo-text" text-anchor="middle">Lines</text>
    //     </g>

    //     <text x="25" y="175" class="repo-text" font-style="italic">~/repo: ${data.repo}</text>

    //     <circle cx="470" cy="30" r="4" fill="#2ea44f">
    //         <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    //     </circle>
    // </svg>
    // `;

    //     const svg = `
    // <svg width="495" height="200" viewBox="0 0 495 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <style>
    //         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&amp;family=JetBrains+Mono:wght@700&amp;display=swap');

    //         .header { font: 700 16px 'Inter', sans-serif; fill: #fff; opacity: 0.9; }
    //         .value { font: 700 32px 'Inter', sans-serif; fill: #F8D06E; }
    //         .label { font: 700 13px 'Inter', sans-serif; fill: #FE428E; letter-spacing: 0.5px; }
    //         .sub-label { font: 400 11px 'Inter', sans-serif; fill: #AAAAAA; }
    //         .divider { stroke: #333; stroke-width: 1; }
    //         .repo-bar { fill: rgba(255, 255, 255, 0.03); }
    //     </style>

    //     <rect width="495" height="200" rx="12" fill="#0D1117"/> <rect x="0.5" y="0.5" width="494" height="199" rx="11.5" stroke="#30363D" fill="none"/>

    //     <text x="25" y="35" class="header">📊 Recent Activity Dashboard: ${data.username}</text>

    //     <line x1="165" y1="65" x2="165" y2="145" class="divider"/>
    //     <line x1="330" y1="65" x2="330" y2="145" class="divider"/>

    //     <g transform="translate(25, 80)">
    //         <text x="70" y="25" class="value" text-anchor="middle">${data.additions}
    //             <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
    //         </text>
    //         <text x="70" y="52" class="label" text-anchor="middle">ADDITIONS</text>
    //         <text x="70" y="72" class="sub-label" text-anchor="middle">Last Commit</text>
    //     </g>

    //     <g transform="translate(190, 80)">
    //         <text x="70" y="25" class="value" text-anchor="middle" style="fill: #39D353;">${data.deletions}
    //             <animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="0.2s" fill="freeze" />
    //         </text>
    //         <text x="70" y="52" class="label" text-anchor="middle" style="fill: #00F0FF;">DELETIONS</text>
    //         <text x="70" y="72" class="sub-label" text-anchor="middle">${data.date}</text>
    //     </g>

    //     <g transform="translate(355, 80)">
    //         <text x="70" y="25" class="value" text-anchor="middle">${data.additions - data.deletions}
    //             <animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="0.4s" fill="freeze" />
    //         </text>
    //         <text x="70" y="52" class="label" text-anchor="middle" style="fill: #BD00FF;">NET CHANGE</text>
    //         <text x="70" y="72" class="sub-label" text-anchor="middle">Lines</text>
    //     </g>

    //     <rect x="0" y="165" width="495" height="35" rx="0" ry="0" class="repo-bar"/>
    //     <text x="25" y="188" class="sub-label" font-family="JetBrains Mono">
    //         <tspan fill="#6E7681">active_repo:</tspan> ${data.repo}
    //     </text>

    //     <circle cx="465" cy="30" r="4" fill="#238636">
    //         <animate attributeName="fill" values="#238636;#39D353;#238636" dur="2s" repeatCount="indefinite" />
    //     </circle>
    // </svg>
    // `;

//     const svg = `
// <svg width="495" height="210" viewBox="0 0 495 210" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&amp;family=JetBrains+Mono:wght@700&amp;display=swap');
        
//         .header { font: 700 16px 'Inter', sans-serif; fill: #fff; opacity: 0.8; }
//         .hero-value { font: 900 42px 'Inter', sans-serif; fill: #00FF94; filter: url(#glow); }
//         .side-value { font: 700 24px 'Inter', sans-serif; fill: #F8D06E; }
//         .label { font: 700 12px 'Inter', sans-serif; fill: #FE428E; letter-spacing: 1px; }
//         .sub-label { font: 400 10px 'Inter', sans-serif; fill: #666; }
//         .repo-text { font: 500 11px 'JetBrains Mono', monospace; fill: #00F0FF; }
        
//         @keyframes dash {
//             to { stroke-dashoffset: 0; }
//         }
//         .progress-ring {
//             stroke-dasharray: 283;
//             stroke-dashoffset: 283;
//             animation: dash 1.5s ease-out forwards;
//         }
//     </style>

//     <defs>
//         <filter id="glow">
//             <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
//             <feMerge>
//                 <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
//             </feMerge>
//         </filter>
//         <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" style="stop-color:#00FF94;stop-opacity:1" />
//             <stop offset="100%" style="stop-color:#00F0FF;stop-opacity:1" />
//         </linearGradient>
//     </defs>

//     <rect width="495" height="250" rx="15" fill="#09090B"/>
//     <rect x="0.5" y="0.5" width="494" height="249" rx="14.5" stroke="#27272A" fill="none"/>

//     <text x="25" y="35" class="header">⚔️ Contribution Quest: ${data.username}</text>

//     <g transform="translate(60, 110)">
//         <text x="0" y="0" class="side-value" text-anchor="middle">-${data.deletions}</text>
//         <text x="0" y="25" class="label" text-anchor="middle" style="fill:#FF005C">DELETIONS</text>
//     </g>

//     <g transform="translate(247, 110)">
//         <circle cx="0" cy="-10" r="62" stroke="#18181B" stroke-width="8" fill="none" />
//         <circle cx="0" cy="-10" r="54" class="progress-ring" stroke="url(#circleGrad)" stroke-width="6" stroke-linecap="round" fill="none" transform="rotate(-90 0 -10)" />
        
//         <text x="0" y="8" 
//               class="hero-value" 
//               text-anchor="middle"
//               textLength="${data.additions > 999 ? '80' : ''}" 
//               lengthAdjust="spacingAndGlyphs"
//               style="font-size: ${data.additions > 999 ? '28px' : '42px'};">
//             ${data.additions}
//         </text>
        
//         <text x="0" y="75" class="label" text-anchor="middle">INSERTIONS</text>
//     </g>

//     <g transform="translate(430, 110)">
//         <text x="0" y="0" class="side-value" text-anchor="middle">+${data.additions - data.deletions}</text>
//         <text x="0" y="25" class="label" text-anchor="middle" style="fill:#BD00FF">NET XP</text>
//     </g>

//     <rect x="25" y="195" width="445" height="1" fill="#27272A"/>
//     <text x="25" y="215" class="repo-text">~/target: ${data.repo}</text>
//     <text x="410" y="215" class="sub-label" text-anchor="end">${data.date}</text>

//     <circle cx="470" cy="30" r="4" fill="#00FF94" filter="url(#glow)">
//         <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
//     </circle>
// </svg>
// `;

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
                  textLength="${data.additions > 999 ? '80' : ''}" 
                  lengthAdjust="spacingAndGlyphs"
                  style="font-size: ${data.additions > 999 ? '28px' : '42px'};">
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

    // <g transform="translate(247, 110)">
    //   <circle
    //     cx="0"
    //     cy="-10"
    //     r="55"
    //     stroke="#18181B"
    //     stroke-width="8"
    //     fill="none"
    //   />
    //   <circle
    //     cx="0"
    //     cy="-10"
    //     r="45"
    //     class="progress-ring"
    //     stroke="url(#circleGrad)"
    //     stroke-width="6"
    //     stroke-linecap="round"
    //     fill="none"
    //     transform="rotate(-90 0 -10)"
    //   />

    //   <text x="0" y="8" class="hero-value" text-anchor="middle">
    //     ${data.additions}
    //   </text>
    //   <text x="0" y="65" class="label" text-anchor="middle">
    //     INSERTIONS
    //   </text>
    // </g>;

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
