import { generateRssXml } from './util/generateXML';
const fs = require('fs');
const parser = require('rss-parser');
const { v4: uuidv4 } = require('uuid');

// Define a file path for storing feeds data
const FEEDS_FILE_PATH = './feeds.json';

// Initialize rssFeeds from the file or as an empty object
// Define an object to store RSS feeds
var rssFeeds: any = {};

// Load existing feeds from the file, if it exists
try {
	rssFeeds = JSON.parse(
		fs.readFileSync(FEEDS_FILE_PATH)
	);
} catch (err) {
	// Handle file read error or non-existent file
}

export function createFeed(
	name: string
) {
	// Check if a feed with the given name already exists
	const existingFeed: any =
		Object.values(rssFeeds).find(
			(feed: any) =>
				feed.name === name
		);

	if (existingFeed) {
		return {
			uuid: existingFeed.uuid,
			...existingFeed,
		};
	} else {
		const uuid = uuidv4();
		rssFeeds[uuid] = {
			name,
			items: [],
		};

		// Save rssFeeds to the file
		fs.writeFileSync(
			FEEDS_FILE_PATH,
			JSON.stringify(rssFeeds)
		);

		return {
			uuid,
			name,
			items: [],
		};
	}
}

// Append an item to an existing RSS feed
export function appendFeed(
	uuid: string | number,
	title: string,
	link: string,
	description: string,
	pubDate: string
) {
	if (!rssFeeds[uuid]) {
		console.warn(
			'No Feed found for ' + uuid
		);
		throw new Error(
			'Feed does not exist. Create the feed first.'
		);
	}

	const item = {
		title: title,
		link: link,
		description: description,
		pubDate: pubDate,
	};

	try {
		rssFeeds[uuid].items.push(item);

		// Save rssFeeds to the file after appending the item
		fs.writeFileSync(
			FEEDS_FILE_PATH,
			JSON.stringify(rssFeeds)
		);
		return '200 OK Write to feed';
	} catch (error: any) {
		return { error: error.message };
	}
}

// Retrieve an RSS feed
export function retrieveFeed(
	uuid: any
) {
	if (!rssFeeds[uuid]) {
		throw new Error(
			'Feed does not exist. Create the feed first.'
		);
	}

	const feed = rssFeeds[uuid];
	const rssXml = generateRssXml(feed);
	return rssXml;
}

export function listActiveFeeds() {
	const activeFeeds = Object.values(
		rssFeeds
	).map((feed: any) => ({
		uuid: feed.uuid,
		name: feed.name,
	}));

	return activeFeeds;
}

// Function to clear data for a specific UUID
export function clearFeed(uuid: any) {
	if (rssFeeds[uuid]) {
		delete rssFeeds[uuid];

		// Save rssFeeds to the file after clearing the feed
		fs.writeFileSync(
			FEEDS_FILE_PATH,
			JSON.stringify(rssFeeds)
		);
	}
}

// Function to clear data for multiple UUIDs
export function clearFeedsByUUIDs(
	uuidsToKeep: any
) {
	uuidsToKeep.forEach(
		(uuidToKeep: any) => {
			if (rssFeeds[uuidToKeep]) {
				delete rssFeeds[uuidToKeep];
			}
		}
	);

	// Save rssFeeds to the file after clearing feeds without specified UUIDs
	fs.writeFileSync(
		FEEDS_FILE_PATH,
		JSON.stringify(rssFeeds)
	);
}
