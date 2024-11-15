const express = require('express');
const axios = require("axios");
const cheerio = require('cheerio');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data
app.use(express.static(__dirname + '/public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));

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
        fs.writeFileSync(`./tmp/cheesestore-${new Date().toISOString().split('T')[0]}.json`, JSON.stringify(output, null, 2));

        res.status(200).send("JSON File successfully created, File has been moved to /tmp folder.");
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).send("An error occurred while fetching the data.");
    }
});

app.get("/first-challenge", async (req, res) => {
    try {
        // This sends the API get request through axios by mimicking a browser request to get the HTML from the webpage
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

// GET Route to render the form
app.get("/index", function (req, res) {
    res.render("index", {
        title: "Fetch with User Input",
        products: []
    });
});

// POST Route to handle form submission from ejs index view
app.post("/submit-input", async (req, res) => {
    try {
        const userInput = req.body.userInput;
        
        if (!userInput) {
            return res.status(400).send("Please enter a search term.");
        }

        console.log("User Input: ", userInput);

        const response = await axios.get(`https://www.tesco.com/groceries/en-GB/search?query=${userInput}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            },
            timeout: 10000
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

        res.render("index", {
            title: "Fetch with User Input",
            products
        });
    }
    catch (error) {
        if(error.code === "ECONNABORTED") {
            console.error("Request timed out");
            return res.status(504).send("Request timed out. Please try again.");
        }
        else {
            console.error("Error: ", error);
            res.status(500).send("An error occurred while processing the data.");
        }
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});