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