const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    url: { type: String, unique: true },
  name: String,
  description: String,
  companyLogo: String,
  facebook: String,
  linkedin: String,
  twitter: String,
  instagram: String,
  address: String,
  phone: String,
  email: String,
  screenshot: String,
  deletedAt: {
    type: Date, 
    default: null, 
  },
}, {
  timestamps: true,
});

const Company= mongoose.model('Company', companySchema);
module.exports= {Company};