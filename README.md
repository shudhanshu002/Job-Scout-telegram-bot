# 🕵️ Job Scout Telegram Bot

An automated job scouting tool that monitors RSS feeds and uses Google Gemini AI to filter for perfect career matches.

## 🚀 Overview

Job Scout is designed for developers who want to automate their job search. It periodically scans popular remote job boards, uses AI to evaluate job descriptions against a personal profile, and sends high-confidence matches directly to your Telegram.

### Key Features
- **Automated RSS Scanning**: Regularly checks WeWorkRemotely and RemoteOK.
- **AI-Powered Filtering**: Uses Google Gemini 2.5 Flash to analyze job descriptions for technical fit and role requirements.
- **Interactive Telegram Alerts**: Receive job cards with built-in "Applied", "Save", and "Ignore" actions.
- **Persistent Tracking**: Keeps track of job statuses in MongoDB to avoid duplicate alerts and manage your funnel.
- **Smart Rate Limiting**: Intelligent delays and truncation handling to stay within AI API quotas.

## 🛠 Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **AI Engine**: [Google Generative AI](https://ai.google.dev/) (Gemini 2.5 Flash)
- **Messaging**: [Telegram Bot API](https://core.telegram.org/bots)
- **Scheduling**: [node-cron](https://www.npmjs.com/package/node-cron)

## 📋 Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)
- Google Gemini API Key
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Your Telegram Chat ID

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd job-scout
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   TELEGRAM_TOKEN=your_telegram_bot_token
   MY_TELEGRAM_ID=your_telegram_chat_id
   ```

4. **Run the Bot:**
   ```bash
   node src/index.js
   ```

## 🧠 Customization

### Update Your Profile
To change how the AI evaluates jobs, modify the `myProfile` constant in `src/services/aiFilter.js`:
```javascript
const myProfile = `
  - Role: Frontend/Fullstack Developer (Node.js, React, MongoDB)
  - Location: India (Timezone GMT+5:30)
  - Requirement: MUST be 100% Remote or Remote-First.
`;
```

### Add New Job Sources
You can add more RSS feeds in `src/services/fetcher.js`:
```javascript
const FEEDS = [
    { url: 'https://example.com/jobs.rss', name: 'ExampleSource' },
];
```

## 📄 License
This project is licensed under the ISC License.
