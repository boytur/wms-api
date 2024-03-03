const express = require('express');
const app = express()
const port = 5555;
const sequelize = require('./db/db');
const morgan = require('morgan');
// Import Sequelize models
const { Category, MasterProduct, Warehouse, User, LotIn, InProductOrder, Rack, Space, LotOut, OutBoundProductOrder, OnshelfProduct, OutProductList } = require('./models/models');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Sync models (automatically creates tables)
const auto = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}
//auto();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const CMasterProduct = require('./Controllers/CMasterProducts');
const CRack = require('./Controllers/CRacks');
const CLots = require('./Controllers/CLots');
app.use(CMasterProduct);
app.use(CRack);
app.use(CLots);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});