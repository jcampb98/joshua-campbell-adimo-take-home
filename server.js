const express = require('express');
const axios = require("axios");
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://cdn.adimo.co/clients/Adimo/test/index.html");
        const html = response.data;
        const $ = cheerio.load(html);
        const products = [];
        
        // This use's cheerio after loading the HTML from the API fetch
        // And utilises cheerio each function to loop through the html that matches to 'item'
        // to extract the item element under "details"
        $(".item").each((index, element) => {
            const title = $(element).find("h1").text();
            const price = parseFloat($(element).find(".price").text().replace('£', '')); 
            const image = $(element).find("img").attr("src"); 

            products.push({ title, price, image});
        });

        const totalItems = products.length;
        const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalItems;

        const output = { products, totalItems, averagePrice };
        fs.writeFileSync('./tmp/cheesestore.json', JSON.stringify(output, null, 2));

        res.status(200).send("JSON File successfully created, File has been moved to /tmp folder.");
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).send("An error occurred while fetching the data.");
    }
});

app.get("/first-challenge", async (req, res) => {
    try {
        const response = await axios.get("https://www.tesco.com/groceries/en-GB/search?query=nestle", {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const products = [];
        
        $(".LD7hL").each((index, element) => {
            const title = $(element).find("h3").text();
            const price = parseFloat($(element).find("p.cXlRF").text().replace('£', '')); 
            const image = $(element).find("img").attr("src"); 

            products.push({ title, price, image});
        });

        const output = { products };
        fs.writeFileSync(`./tmp/nestle-tesco-${new Date().toISOString().split('T')[0]}.json`, JSON.stringify(output, null, 2));

        res.status(200).send("JSON File successfully created, Nestle File has been moved to /tmp folder.");
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).send("An error occurred while fetching the data.");
    }
});