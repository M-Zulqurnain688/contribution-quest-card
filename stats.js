// const axios = require('axios');

// // 1. Configuration
// const USERNAME = 'M-Zulqurnain688';
// // Optional: Add a Personal Access Token for higher rate limits
// // const headers = { 'Authorization': 'token YOUR_TOKEN' }; 
// const headers = {}; 

// async function getWeeklyStats() {
//     try {
//         console.log(`🚀 Fetching live activity for ${USERNAME}...\n`);

//         // 2. Get recent events
//         const eventsUrl = `https://api.github.com/users/${USERNAME}/events/public`;
//         const { data: events } = await axios.get(eventsUrl, { headers });

//         // 3. Filter only "PushEvents" from the last 7 days
//         const pushEvents = events.filter(e => e.type === 'PushEvent');

//         let totalAdditions = 0;
//         let totalDeletions = 0;

//         // 4. Loop through commits to get stats
//         // Note: We only check the last few to avoid hitting API limits
//         for (const event of pushEvents.slice(0, 5)) { 
//             for (const commit of event.payload.commits) {
//                 // Get detailed commit info
//                 const detail = await axios.get(commit.url, { headers });
//                 totalAdditions += detail.data.stats.additions;
//                 totalDeletions += detail.data.stats.deletions;
//             }
//         }

//         // 5. Output the result
//         console.log("-------------------------------------");
//         console.log(`📈 STATS FOR RECENT PUSHES:`);
//         console.log(`➕ Insertions: ${totalAdditions}`);
//         console.log(`➖ Deletions:  ${totalDeletions}`);
//         console.log(`🔥 Net Growth: ${totalAdditions - totalDeletions} lines`);
//         console.log("-------------------------------------");

//     } catch (error) {
//         console.error("Error fetching data:", error.response?.statusText || error.message);
//     }
// }

// getWeeklyStats();

// const axios = require('axios');

// const USERNAME = 'M-Zulqurnain688';
// const headers = {}; // Add your token here if you get "403 Forbidden"

// async function getWeeklyStats() {
//     try {
//         console.log(`🚀 Fetching live activity for ${USERNAME}...`);

//         const eventsUrl = `https://api.github.com/users/${USERNAME}/events/public`;
//         const { data: events } = await axios.get(eventsUrl, { headers });

//         // Safety Check: Ensure we have data
//         if (!Array.isArray(events)) {
//             console.log("No public events found or rate limit hit.");
//             return;
//         }

//         let totalAdditions = 0;
//         let totalDeletions = 0;
//         let commitCount = 0;

//         // Loop through events
//         // for (const event of events) {
//         //     // Only look at PushEvents that have commits
//         //     if (event.type === 'PushEvent' && event.payload && event.payload.commits) {

//         //         for (const commit of event.payload.commits) {
//         //             // Limit to 10 commits total to stay under rate limits during testing
//         //             if (commitCount >= 10) break;

//         //             try {
//         //                 const detail = await axios.get(commit.url, { headers });
//         //                 totalAdditions += detail.data.stats.additions;
//         //                 totalDeletions += detail.data.stats.deletions;
//         //                 commitCount++;
//         //                 console.log(`✅ Processed commit: ${commit.sha.substring(0, 7)}`);
//         //             } catch (e) {
//         //                 // Sometimes commit URLs aren't immediately accessible
//         //                 continue;
//         //             }
//         //         }
//         //     }
//         //     if (commitCount >= 10) break;
//         // }

//         for (const event of events) {
//             if (event.type === 'PushEvent' && event.payload) {

//                 // Collect SHAs from the commits array OR the 'head' property
//                 let commitSHAs = [];

//                 if (event.payload.commits && event.payload.commits.length > 0) {
//                     commitSHAs = event.payload.commits.map(c => c.url);
//                 } else if (event.payload.head) {
//                     // Construct the URL manually using the repo name and head SHA
//                     commitSHAs = [`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`];
//                 }

//                 for (const commitUrl of commitSHAs) {
//                     if (commitCount >= 10) break;

//                     try {
//                         // We use the full URL to get additions/deletions
//                         const detail = await axios.get(commitUrl, { headers });

//                         if (detail.data && detail.data.stats) {
//                             totalAdditions += detail.data.stats.additions;
//                             totalDeletions += detail.data.stats.deletions;
//                             commitCount++;
//                             console.log(`✅ Analyzed: ${event.repo.name} (${detail.data.sha.substring(0, 7)})`);
//                         }
//                     } catch (e) {
//                         continue;
//                     }
//                 }
//             }
//             if (commitCount >= 10) break;
//         }

//         console.log("\n-------------------------------------");
//         console.log(`📈 RECENT STATS FOR ${USERNAME}:`);
//         console.log(`📝 Commits Analyzed: ${commitCount}`);
//         console.log(`➕ Insertions:      ${totalAdditions}`);
//         console.log(`➖ Deletions:       ${totalDeletions}`);
//         console.log(`🔥 Net Growth:      ${totalAdditions - totalDeletions} lines`);
//         console.log("-------------------------------------");

//     } catch (error) {
//         console.error("❌ Error:", error.message);
//     }
// }

// getWeeklyStats();

// const axios = require('axios');

// const USERNAME = 'M-Zulqurnain688';
// // NOTE: To see Private Repos, you MUST put a GitHub Token here.
// // Without a token, the Public API only shows Public Repos.
// const headers = {
//     // 'Authorization': 'token YOUR_GITHUB_TOKEN_HERE' 
// };

// async function getDetailedStats() {
//     try {
//         console.log(`🚀 Fetching detailed activity for ${USERNAME}...\n`);

//         const eventsUrl = `https://api.github.com/users/${USERNAME}/events/public`;
//         const { data: events } = await axios.get(eventsUrl, { headers });

//         if (!Array.isArray(events)) return;

//         // Using an object to track stats per repository
//         let repoStats = {};

//         let commitCount = 0;

//         for (const event of events) {
//             if (event.type === 'PushEvent' && event.payload) {

//                 // Determine Repo Name
//                 const isPublic = event.public !== false;
//                 const repoName = isPublic ? event.repo.name : "🔒 Private Repo";

//                 // Initialize repo entry if it doesn't exist
//                 if (!repoStats[repoName]) {
//                     repoStats[repoName] = { additions: 0, deletions: 0, commits: 0 };
//                 }

//                 let commitUrls = [];
//                 if (event.payload.commits && event.payload.commits.length > 0) {
//                     commitUrls = event.payload.commits.map(c => c.url);
//                 } else if (event.payload.head) {
//                     commitUrls = [`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`];
//                 }

//                 for (const url of commitUrls) {
//                     if (commitCount >= 15) break; // Increased limit slightly

//                     try {
//                         const { data: detail } = await axios.get(url, { headers });

//                         repoStats[repoName].additions += detail.stats.additions;
//                         repoStats[repoName].deletions += detail.stats.deletions;
//                         repoStats[repoName].commits += 1;
//                         commitCount++;

//                         console.log(`Fetched: ${repoName} [-] Commit: ${detail.sha.substring(0, 7)}`);
//                     } catch (e) { continue; }
//                 }
//             }
//             if (commitCount >= 15) break;
//         }

//         console.log("\n=====================================");
//         console.log(`📊 REPO-WISE CONTRIBUTION REPORT`);
//         console.log("=====================================");

//         for (const [name, stats] of Object.entries(repoStats)) {
//             console.log(`📂 Repo: ${name}`);
//             console.log(`   📝 Commits:   ${stats.commits}`);
//             console.log(`   ➕ Insertions: ${stats.additions}`);
//             console.log(`   ➖ Deletions:  ${stats.deletions}`);
//             console.log(`   ✨ Net Change: ${stats.additions - stats.deletions} lines`);
//             console.log("-------------------------------------");
//         }

//     } catch (error) {
//         console.error("❌ Error:", error.message);
//     }
// }

// getDetailedStats();

require('dotenv').config(); // Loads your token from .env
const axios = require('axios');

// const USERNAME = 'M-Zulqurnain688';
// const USERNAME = 'abidroid';
const USERNAME = process.argv[2] || 'M-Zulqurnain688';
const TOKEN = process.env.GITHUB_TOKEN; // Get token from .env

const headers = {
    'Authorization': `token ${TOKEN}`
};

async function getDetailedStats() {
    try {
        console.log(`🚀 Fetching ALL activity (including Private) for ${USERNAME}...\n`);

        // Authenticated users should use /events (removes the /public)
        const eventsUrl = `https://api.github.com/users/${USERNAME}/events`;
        const { data: events } = await axios.get(eventsUrl, { headers });

        if (!Array.isArray(events)) return;

        let repoStats = {};
        let commitCount = 0;

        for (const event of events) {
            if (event.type === 'PushEvent' && event.payload) {

                // If event.public is false, it's a private repo
                const repoName = event.public ? event.repo.name : "🔒 Private Repository";

                if (!repoStats[repoName]) {
                    repoStats[repoName] = { additions: 0, deletions: 0, commits: 0 };
                }

                let commitUrls = [];
                if (event.payload.commits && event.payload.commits.length > 0) {
                    commitUrls = event.payload.commits.map(c => c.url);
                } else if (event.payload.head) {
                    commitUrls = [`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`];
                }

                for (const url of commitUrls) {
                    if (commitCount >= 20) break;

                    try {
                        const { data: detail } = await axios.get(url, { headers });
                        repoStats[repoName].additions += detail.stats.additions;
                        repoStats[repoName].deletions += detail.stats.deletions;
                        repoStats[repoName].commits += 1;
                        commitCount++;

                        console.log(`✅ Analyzed: ${repoName}`);
                    } catch (e) { continue; }
                }
            }
            if (commitCount >= 20) break;
        }

        console.log("\n=====================================");
        console.log(`📊 TOTAL CONTRIBUTION REPORT`);
        console.log("=====================================");

        for (const [name, stats] of Object.entries(repoStats)) {
            console.log(`📂 Repo: ${name}`);
            console.log(`   📝 Commits:   ${stats.commits}`);
            console.log(`   ➕ Insertions: ${stats.additions}`);
            console.log(`   ➖ Deletions:  ${stats.deletions}`);
            console.log("-------------------------------------");
        }

    } catch (error) {
        console.error("❌ Error:", error.response?.status === 401 ? "Invalid Token" : error.message);
    }
}

getDetailedStats();