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
    console.log(`Starting to scrape: ${url}`);
    const browser = await puppeteer.launch({
      headless: true ,
      executablePath: process.env.CHROME_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],

    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log(`Page loaded: ${url}`);
    await page.waitForSelector('body')
    const screenshot = await page.screenshot({ encoding: 'base64' });
    console.log('Screenshot taken');
    await browser.close();

    return { url,name, description, companyLogo, facebook, linkedin, twitter, instagram, address, phone, email, screenshot };
  } catch (error) {
    console.error('Error scraping website:', error);
    return null;
  }
};
  
module.exports = {scrapeWebsite};
