const scrapingbee = require("scrapingbee");
const cheerio = require("cheerio"); // for parsing HTML

async function scrapeCodechefRating(username) {
  const client = new scrapingbee.ScrapingBeeClient("GPEF4Y7OZ8RSZ5DUXIJCNPFIIASUTGE3YVXSC36YH61Q1MS9CERAER4JPQGDGYEEFBYS8ULCX63L31VT"); // replace with your key
  const url = `https://www.codechef.com/users/${username}`;

  try {
    const response = await client.get({
      url: url,
      params: {
        render_js: "true", // CodeChef sometimes requires JS rendering
      },
    });

    const decoder = new TextDecoder();
    const html = decoder.decode(response.data);

    const $ = cheerio.load(html);
    const rating = $(".rating-number").first().text().trim();

    return rating || null;
  } catch (e) {
    console.error("Error fetching rating:", e.message);
    return null;
  }
}

module.exports = { scrapeCodechefRating };
