# web-scrap-node

This project provides a Node.js RESTful API for managing company data through web scraping and MongoDB.

## Features
1.Add Company: Endpoint to add a new company by scraping its website for relevant data.

2.Retrieve Companies: Endpoint to fetch a list of companies with pagination and optional search functionality.

3.Fetch Company by ID: Endpoint to retrieve details of a specific company.

4.Delete Companies: Endpoint to soft-delete multiple companies.

5.Generate CSV: Endpoint to generate and download a CSV file containing active company data.

## Technology Used-
Node.js
Express.js
MongoDB (via Mongoose)
Puppeteer (for web scraping)
Axios (for HTTP requests)
Cheerio (for web scraping)
json2csv (for CSV generation)

## API Endpoints-

`/companies/add`
POST: Add a new company by providing a URL. This endpoint scrapes the website for company details and adds it to the database.

`/companies`
GET: Retrieve a paginated list of all active companies. Supports optional search by company name.

`/companies/:companyId`
GET: Retrieve details of a specific company by ID.

`/companies/delete`
DELETE: Soft-delete multiple companies by providing an array of company IDs.

`/companies/download/csv`
GET: Generate and download a CSV file containing details of all active companies.
