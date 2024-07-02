const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const companiesRoutes = require('./routes/companyRoutes.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', companiesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
