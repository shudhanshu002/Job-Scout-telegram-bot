const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// 1. Send the Job Card
async function sendAlert(job) {
    const message = `
🎯 <b>Match Found!</b> (${job.aiAnalysis.score}%)

<b>${job.title}</b>
<i>${job.source}</i>

🤖 <b>AI Note:</b> ${job.aiAnalysis.reason}

<a href="${job.link}">🔗 Apply Link</a>
`;

    const opts = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✅ I Applied', callback_data: `APPLY_${job._id}` },
                    { text: '💾 Save', callback_data: `SAVE_${job._id}` },
                ],
                [{ text: '❌ Not Interested', callback_data: `IGNORE_${job._id}` }],
            ],
        },
    };

    await bot.sendMessage(process.env.MY_TELEGRAM_ID, message, opts);
}

// 2. Handle Button Clicks
// We export a function to attach the listener in the main file
function setupBotListeners(JobModel) {
    bot.on('callback_query', async (callbackQuery) => {
        const actionData = callbackQuery.data; // e.g., "APPLY_6543abc..."
        const msg = callbackQuery.message;

        const [action, jobId] = actionData.split('_');

        // Map button actions to DB statuses
        const statusMap = {
            APPLY: 'APPLIED',
            SAVE: 'SAVED',
            IGNORE: 'IGNORED',
        };

        if (statusMap[action]) {
            await JobModel.findByIdAndUpdate(jobId, { status: statusMap[action] });

            // Update the message so you know you clicked it
            await bot.editMessageText(`✅ Marked as ${statusMap[action]}`, {
                chat_id: msg.chat.id,
                message_id: msg.message_id,
            });
        }
    });
}

module.exports = { sendAlert, setupBotListeners };
