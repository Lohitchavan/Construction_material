const express = require('express');
const connectDb = require('./utils/db');
const supplierRoutes = require('./routes/supplier.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();

app.use(express.json());
app.use('/api/supplier', supplierRoutes);
app.use('/api/supplier/auth', authRoutes);


const PORT = process.env.PORT || 5001;

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Supplier app running on ${PORT}`));
  })
  .catch(err => console.error(err));
