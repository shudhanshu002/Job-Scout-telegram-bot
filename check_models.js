require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function checkModels() {
    console.log('🔑 Checking API Key...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ Error: GEMINI_API_KEY is missing from .env');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // We cannot "list" models easily with the basic SDK helper,
    // so we will try the 3 most common names to see which one replies.

    const candidates = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.0-pro', 'gemini-pro'];

    for (const modelName of candidates) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hello, are you there?');
            const response = await result.response;
            console.log(`✅ SUCCESS! Model '${modelName}' is working.`);
            console.log(`   Reply: ${response.text()}`);
            return; // Stop after finding a working one
        } catch (error) {
            console.log(`❌ Failed (${modelName}): ${error.status || error.message}`);
            if (error.message.includes('403')) {
                console.log('   (This usually means the API key is invalid or API is not enabled)');
            }
        }
    }
}

checkModels();
