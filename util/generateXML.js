"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRssXml = void 0;
// Generate RSS XML based on feed data
function generateRssXml(feed) {
    const itemsXml = feed.items
        .map((item) => {
        return `
            <item>
                <title>${item.title}</title>
                <description>${item.description}</description>
                <!-- Add other item elements here -->
            </item>
        `;
    })
        .join('');
    const rssXml = `
        <rss version="2.0">
            <channel>
                <title>${feed.name}</title>
                <!-- Add other feed elements here -->
                ${itemsXml}
            </channel>
        </rss>
    `;
    return rssXml;
}
exports.generateRssXml = generateRssXml;
