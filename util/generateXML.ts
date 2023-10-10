// Generate RSS XML based on feed data
export function generateRssXml(
	feed: any
) {
	const itemsXml = feed.items
		.map((item: any) => {
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
