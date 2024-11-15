# Adimo Web Scrape Take Home Assessment

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Future Improvements](#future-improvements)

# 1. Overview

This project is a Node.js application that has three different endpoints that serve different purposes. The main endpoint fetches the data from the provided URL from the take home test fetches the HTML from a cheese store products page which then utilises cheerio to then look through each product for the Title, Image URL, and Price for each product in the HTML to then save to as a JSON file to a folder called "tmp". The second endpoint serve's the purpose of the main endpoint but instead on an actual webpage that was more complex in the HTML. The last endpoint which is a view endpoint which allow's the User to enter any term that would've been able to search on the Tesco site (e.g. "Laptop", "Pizza").

# 2. Installation

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Steps
To set up the project locally follow these steps:

1. Clone the repository: 

```git

git clone https://github.com/jcampb98/substantive-research-test

```

2. Navigate to the project directory:

``` powershell
cd joshua-campbell-adimo-test
```

3. Install dependencies:

```npm

npm install
```

4. Start the server:

```npm
npm start
```

5. Open your browser and navigate to "/" to fetch the cheese store json file:

``` url
http://localhost:3000/
```

# 3. Usage

1. Open the application in your browser.
2. Navigate to "/" in order to fetch the cheese store json file that would be stored in the "tmp" folder once completed.
3. In order to fetch the Nestle products from Tesco and store it as a json file, Navigate to "/first-challenge".
4. In order to pass the user input to the tesco url, Navigate to "/index".
5. Enter a search term in the input field (e.g. "laptop")
6. View the results of the search including the product title, price, and relevant image.

# 4. Technologies Used

- Node.js
- Express
- Axios
- Cheerio
- EJS

# 5. Future Improvements

- I would've added logic to scrape multiple pages as i noticed during the development, so i would've used Puppeter or Playwright to scrape multiple pages to click on the next buttons or the numbered paginations.
- Instead of using EJS for the HTML rendering i would've used Vue.js to develop the front-end to allow for beter front-end logic to render the products entirely without the reloading and allow for better error messaging if the front-end wasn't rendering correctly.