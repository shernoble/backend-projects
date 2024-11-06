const { program } = require("commander");
const axios = require("axios");
const express = require("express");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

program
    .version("1.0.0")
    .description("Caching Proxy")
    .option("-p, --port <number>", "Specify the port number")
    .option("-o, --origin <url>", "Specify the origin URL")
    .option("--clear-cache", "Clear the cache without starting the server")
    .action((options) => {
        if (options.clearCache) {
            cache.flushAll();
            console.log("Cache successfully cleared");
            process.exit(0); // Exit after clearing the cache
        }
    });

program.parse(process.argv);

const options = program.opts();

if (!options.port || !options.origin) {
    console.error("Please specify both --port and --origin options.");
    process.exit(1);
}

app.get("*", async (req, res) => {
    const url = `${options.origin}${req.originalUrl}`;

    // Check if response for this URL is cached
    const cachedResponse = cache.get(url);
    if (cachedResponse) {
        console.log('Serving from cache');
        res.set("X-Cache", "HIT");
        return res.send(cachedResponse);
    }

    // If not cached, fetch from origin and store in cache
    try {
        const response = await axios.get(url);

        // Cache the response data with TTL
        cache.set(url, response.data);

        console.log('Fetched from origin and cached');
        res.set("X-Cache", "MISS");
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(options.port, () => {
    console.log(`App listening on port ${options.port}`);
});
