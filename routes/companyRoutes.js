const express = require('express');
const router = express.Router();
require('express-group-routes');
const companyController = require('../controller/companyController')
router.group("/companies", (router) => {
    router.post('/add', companyController.addCompany);
    router.get('/', companyController.getCompanies);
    router.get('/:companyId', companyController.getCompanies);
    router.delete('/delete', companyController.deleteCompanies);
    router.get('/download/csv', companyController.downloadCompaniesCSV);
});

module.exports = router;
