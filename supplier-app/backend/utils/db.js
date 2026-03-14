// simple mongoose connection helper
const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/supplierdb';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Supplier DB connected');
};

module.exports = connectDb;
