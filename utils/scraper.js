const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
require('dotenv').config(); 
const scrapeWebsite = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const name = $('meta[property="og:site_name"]').attr('content') || $('title').text();
    const description = $('meta[name="description"]').attr('content');
    const companyLogo = $('link[rel="icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href');
    const facebook = $('a[href*="facebook.com"]').attr('href');
    const linkedin = $('a[href*="linkedin.com"]').attr('href');
    const twitter = $('a[href*="twitter.com"]').attr('href');
    const instagram = $('a[href*="instagram.com"]').attr('href');
    let address = $('address').text() || $('div[class*="address"]').text() || $('span[class*="address"]').text();
    address = address.trim().replace(/\s+/g, ' ');

    let phone = $('a[href^="tel:"]').first().text().trim();
    if (phone.includes('\n')) {
      phone = phone.split('\n').map(line => line.trim()).filter(line => line !== '').join(', ');
    }

    let email = $('a[href^="mailto:"]').first().text().trim();
    if (email.includes('\n')) {
      email = email.split('\n').map(line => line.trim()).filter(line => line !== '').join(', ');
    } else if (email.includes('@')) {
      email = email.replace(/\s+/g, ' ');
    }

    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_EXECUTABLE_PATH,
      headless: true 
    });
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();

    return { url,name, description, companyLogo, facebook, linkedin, twitter, instagram, address, phone, email, screenshot };
  } catch (error) {
    console.error('Error scraping website:', error);
    return null;
  }
};
  
module.exports = {scrapeWebsite};
