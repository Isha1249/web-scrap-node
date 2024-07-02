const {Company} = require('../models/CompanyModel.js');
const {scrapeWebsite} = require('../utils/scraper.js');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
//Save company(Adding)
const addCompany = async (req, res) => {
    const { url } = req.body;
    try{
        const existingCompany = await Company.findOne({ url });
        if (existingCompany) {
        return res.status(400).json({ status:false,message: 'Data already exists for this URL' });
        }
        const companyData = await scrapeWebsite(url);
        if (companyData) {
            const company = new Company(companyData);
            await company.save();
            res.status(200).json({status:true,message:"Company Added",company});
        } else {
            res.status(400).json({ status:false, error: 'Unable to scrape website' });
        }
    }
    catch (error) {
        res.status(500).json({ status: false,
            message: error.message || "Some error occurred while adding company"
        });
    }
};
//Reterive All Company and fetch By Id also
const getCompanies = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const companyId = req.params.companyId;
  
      if (companyId) {
        const company = await Company.findById({ _id: companyId });
        if (company) {
          res.status(200).json({ status: true, message: "Company Detail", company });
        } else {
          res.status(404).json({ status: false, error: 'Company not found' });
        }
      } else {
        const matchStage = { deletedAt: null};
        if (search) {
            matchStage.name = { $regex: search, $options: 'i' };
        }
        const pipeline = [{
            $match: matchStage
        },
        {$sort: { createdAt: -1 }},
        {$facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: (page - 1) * limit }, { $limit: parseInt(limit) }]
            }
        }];
  
        const results = await Company.aggregate(pipeline).exec();
        const companies = results[0].data;
        const total = results[0].metadata.length ? results[0].metadata[0].total : 0;
  
        res.status(200).json({
          status: true,
          message: "Companies List was successfully retrieved",
          companies,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          totalCompanies: total,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Some error occurred"
      });
    }
};
  
//Delete Company(multiselected)
const deleteCompanies = async (req, res) => {
    try{
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ status: false, message: 'Invalid input: IDs must be a non-empty array' });
        }
        await Company.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
        );
        res.status(200).json({ status:true,message: 'Deleteion Successfull' });
    }catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Some error occurred"
          });
    }
};
//Download/Generate CSV
const downloadCompaniesCSV = async (req, res) => {
    const companies = await Company.find({deletedAt:null}).exec();
    const fields = [
      'name',
      'description',
      'logo',
      'facebook',
      'linkedin',
      'twitter',
      'instagram',
      'address',
      'phone',
      'email',
    ];
    const opts = { fields };
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(companies);
        const filePath = path.join(__dirname, '../uploads', 'companies.csv');
        fs.writeFileSync(filePath, csv, 'utf-8');
        console.log('CSV file saved successfully:', filePath);
        console.log(filePath);
        res.header('Content-Type', 'text/csv');
        res.attachment('companies.csv');
        res.send(csv);
    
    } catch (err) {
        console.error('Error generating or saving CSV:', err);
      res.status(500).json({ status:false,message: 'Error generating CSV' });
    }
}; 


module.exports = {
  addCompany,getCompanies,deleteCompanies,downloadCompaniesCSV
};
