const puppeteer = require("puppeteer");
async function scrapeCodechefRating(username) {
 
  let browser;

  try {
    browser = await puppeteer.launch({
    
      headless: "new",
    });

    const page = await browser.newPage();
    const url = `https://www.codechef.com/users/${username}`;

  
    await page.goto(url, { waitUntil: "networkidle2" });

    
    const ratingSelector = ".rating-number";

   
    await page.waitForSelector(ratingSelector, { timeout: 10000 }); // 10-second timeout

    const rating = await page.$eval(ratingSelector, (el) => el.textContent.trim());

    return rating || null; 

  } catch (e) {
    console.error(`Error scraping rating for user "${username}":`, e.message);
    return null; 
  } finally {

    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { scrapeCodechefRating };