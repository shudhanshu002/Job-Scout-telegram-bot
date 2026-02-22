require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');

const Job = require('./models/Job');
const { fetchJobs } = require('./services/fetcher');
const { analyzeJob } = require('./services/aiFilter');
const { sendAlert, setupBotListeners } = require('./services/telegram');

// Connect DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.log('❌ DB Error:', err));

// Start Telegram Listeners
setupBotListeners(Job);

// Helper to pause execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runJobScout() {
    console.log('--- 🕵️ Starting Scout Cycle ---');

    try {
        const allJobs = await fetchJobs();
        console.log(`found ${allJobs.length} raw jobs.`);

        for (const [index, job] of allJobs.entries()) {
            try {
                const exists = await Job.findOne({ guid: job.guid });
                if (exists) continue;

                const text = (job.title + job.description).toLowerCase();
                if (!text.includes('node') && !text.includes('react') && !text.includes('javascript')) {
                    continue;
                }

                console.log(`[${index + 1}/${allJobs.length}] 🧠 Analyzing: ${job.title}`);

                // ✂️ TRUNCATION FIX: Take only first 3000 chars
                // This stops "input_token_count" errors from huge descriptions
                const safeDescription = job.description ? job.description.substring(0, 3000) : '';

                // 4. AI Analysis
                const analysis = await analyzeJob(job.title, safeDescription);

                // Check for AI "glitch" or rejection
                if (analysis.reason && (analysis.reason.includes('AI Failed') || analysis.reason.includes('Error'))) {
                    console.error(`⏳ AI Glitch detected (Rate Limit).`);
                    console.error(`💤 Pausing for 90 seconds to fully reset quota...`);
                    await delay(90000); // Increased to 90s to be safe
                    continue;
                }

                if (analysis.match) {
                    const newJob = await Job.create({
                        ...job,
                        aiAnalysis: {
                            isMatch: analysis.match,
                            reason: analysis.reason,
                            confidence: analysis.score,
                        },
                    });

                    await sendAlert(newJob);
                    console.log(`--> 🔔 Notification sent for ${job.title}`);
                } else {
                    console.log(`--> 🚫 Rejected: ${analysis.reason}`);
                }

                // 6. STANDARD DELAY
                await delay(10000);
            } catch (jobError) {
                console.error(`❌ Unexpected Error:`, jobError.message);
                // If it crashes, wait a bit before moving on
                await delay(10000);
            }
        }
    } catch (cycleError) {
        console.error('❌ Critical Error in Scout Cycle:', cycleError);
    }

    console.log('--- Cycle Complete ---');
}

// Run every 1 Hour
cron.schedule('0 * * * *', runJobScout);

// Run once immediately on start
runJobScout();
