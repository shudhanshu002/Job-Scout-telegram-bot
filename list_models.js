require('dotenv').config();

async function listMyModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('❌ No API Key found in .env');
        return;
    }

    console.log('📡 Connecting to Google API to fetch your model list...');

    // We use direct REST fetch to bypass any SDK defaults
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('❌ API Error:', data.error.message);
            return;
        }

        if (!data.models) {
            console.log('⚠️ No models found. This means the API is enabled but has no models active yet.');
            return;
        }

        console.log('\n✅ SUCCESS! Here are the models your key can access:');
        console.log('------------------------------------------------');

        // Filter and print only the ones we care about
        const usefulModels = data.models.filter((m) => m.name.includes('gemini'));

        usefulModels.forEach((model) => {
            // Remove the "models/" prefix for display
            const cleanName = model.name.replace('models/', '');
            console.log(`Model Code: "${cleanName}"`);
        });
        console.log('------------------------------------------------');
        console.log("👉 Copy one of the 'Model Codes' above into your src/services/aiFilter.js file.");
    } catch (err) {
        console.error('Network Error:', err);
    }
}

listMyModels();
