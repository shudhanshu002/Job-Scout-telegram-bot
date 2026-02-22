const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeJob(jobTitle, jobDescription) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 💡 CUSTOMIZE YOUR PROFILE HERE
    const myProfile = `
    - Role: Frontend/Fullstack Developer (Node.js, React, MongoDB)
    - Location: India (Timezone GMT+5:30)
    - Requirement: MUST be 100% Remote or Remote-First.
    - Exclusions: Cannot accept "US Citizens Only", "EU Residents Only".
  `;

    const prompt = `
    Act as a Recruiter. Analyze this job against my profile.
    
    MY PROFILE: ${myProfile}

    JOB TITLE: ${jobTitle}
    JOB DESCRIPTION: ${jobDescription.substring(0, 1500)}...

    Strictly return a JSON object with this format (no markdown):
    {
      "match": boolean, 
      "reason": "One short sentence why it matches or fails (e.g. 'Requires US Citizenship')",
      "score": number (0-100 based on tech stack match)
    }
  `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Clean up if Gemini returns Markdown code blocks
        const cleanJson = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('AI Brain Error:', error);
        return { match: false, reason: 'AI Failed', score: 0 };
    }
}

module.exports = { analyzeJob };
