const Parser = require('rss-parser');
const parser = new Parser();

// Reliable RSS Feeds for Remote Work
const FEEDS = [
    { url: 'https://weworkremotely.com/categories/remote-programming-jobs.rss', name: 'WeWorkRemotely' },
    { url: 'https://remoteok.com/rss', name: 'RemoteOK' },
];

async function fetchJobs() {
    let jobs = [];

    for (const source of FEEDS) {
        try {
            console.log(`📡 Scanning ${source.name}...`);
            const feed = await parser.parseURL(source.url);

            const parsed = feed.items.map((item) => ({
                guid: item.guid || item.link,
                title: item.title,
                link: item.link,
                // RSS feeds sometimes put description in 'content' or 'contentSnippet'
                description: item.content || item.contentSnippet || '',
                source: source.name,
                pubDate: item.pubDate,
            }));

            jobs = [...jobs, ...parsed];
        } catch (err) {
            console.error(`❌ Error scanning ${source.name}:`, err.message);
        }
    }
    return jobs;
}

module.exports = { fetchJobs };
