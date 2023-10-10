"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearFeedsByUUIDs = exports.clearFeed = exports.listActiveFeeds = exports.retrieveFeed = exports.appendItem = exports.createFeed = void 0;
const generateXML_1 = require("./util/generateXML");
const fs = require('fs');
const parser = require('rss-parser');
const { v4: uuidv4 } = require('uuid');
// Define a file path for storing feeds data
const FEEDS_FILE_PATH = 'feeds.json';
// Initialize rssFeeds from the file or as an empty object
// Define an object to store RSS feeds
var rssFeeds = {};
// Load existing feeds from the file, if it exists
try {
    rssFeeds = JSON.parse(fs.readFileSync(FEEDS_FILE_PATH));
}
catch (err) {
    // Handle file read error or non-existent file
}
function createFeed(name) {
    // Check if a feed with the given name already exists
    const existingFeed = Object.values(rssFeeds).find((feed) => feed.name === name);
    if (existingFeed) {
        return Object.assign({ uuid: existingFeed.uuid }, existingFeed);
    }
    else {
        const uuid = uuidv4();
        rssFeeds[uuid] = {
            name,
            items: [],
        };
        // Save rssFeeds to the file
        fs.writeFileSync(FEEDS_FILE_PATH, JSON.stringify(rssFeeds));
        return {
            uuid,
            name,
            items: [],
        };
    }
}
exports.createFeed = createFeed;
// Append an item to an existing RSS feed
function appendItem(uuid, title, link, description, pubDate) {
    if (!rssFeeds[uuid]) {
        throw new Error('Feed does not exist. Create the feed first.');
    }
    const item = {
        title: title,
        link: link,
        description: description,
        pubDate: pubDate,
    };
    rssFeeds[uuid].items.push(item);
    // Save rssFeeds to the file after appending the item
    fs.writeFileSync(FEEDS_FILE_PATH, JSON.stringify(rssFeeds));
}
exports.appendItem = appendItem;
// Retrieve an RSS feed
function retrieveFeed(uuid) {
    if (!rssFeeds[uuid]) {
        throw new Error('Feed does not exist. Create the feed first.');
    }
    const feed = rssFeeds[uuid];
    const rssXml = (0, generateXML_1.generateRssXml)(feed);
    return rssXml;
}
exports.retrieveFeed = retrieveFeed;
function listActiveFeeds() {
    const activeFeeds = Object.values(rssFeeds).map((feed) => ({
        uuid: feed.uuid,
        name: feed.name,
    }));
    return activeFeeds;
}
exports.listActiveFeeds = listActiveFeeds;
// Function to clear data for a specific UUID
function clearFeed(uuid) {
    if (rssFeeds[uuid]) {
        delete rssFeeds[uuid];
        // Save rssFeeds to the file after clearing the feed
        fs.writeFileSync(FEEDS_FILE_PATH, JSON.stringify(rssFeeds));
    }
}
exports.clearFeed = clearFeed;
// Function to clear data for multiple UUIDs
function clearFeedsByUUIDs(uuidsToKeep) {
    uuidsToKeep.forEach((uuidToKeep) => {
        if (rssFeeds[uuidToKeep]) {
            delete rssFeeds[uuidToKeep];
        }
    });
    // Save rssFeeds to the file after clearing feeds without specified UUIDs
    fs.writeFileSync(FEEDS_FILE_PATH, JSON.stringify(rssFeeds));
}
exports.clearFeedsByUUIDs = clearFeedsByUUIDs;
