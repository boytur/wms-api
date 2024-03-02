const express = require('express');
const app = express()
const port = 5555;
const sequelize = require('./db/db');
const morgan = require('morgan');
// Import Sequelize models
const { Category, MasterProduct, Warehouse, User, LotIn, InProductOrder, Rack, Space, LotOut, OutProductOrder, OnshelfProduct, OutProductList } = require('./models/models');
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

// Get masprod list
app.get('/api/masprods', async (req, res) => {
  try {
    const mas_products = await MasterProduct.findAll({
      include: [
        {
          model: Category,
          attributes: ['cat_name']
        }
      ]
    });
    if (!mas_products) { return res.send(404) };

    return res.status(200).json({
      mas_products: mas_products
    })
  }
  catch (err) {
    console.error('Error getting masprod list');
  }
});

// ดู space จาก id คลังและ id rack
app.get('/api/space/:wh_id/:rack_id', async (req, res) => {
  try {
    const { rack_id, wh_id } = req.params;
    const spaces = await Space.findAll({
      where: {
        rack_id: rack_id,
      },
      include: [
        {
          model: Rack,
          where: {
            wh_id: wh_id
          },
          attributes: ['rack_name']
        }
      ],
      attributes: ['space_id', 'space_name', 'space_capacity', 'rack_id'],
    });

    if (spaces.length > 0) {
      return res.status(200).send({
        all: spaces.length,
        rack_id: rack_id,
        spaces: spaces
      });
    }

    return res.status(404).send({
      msg: "Spaces not found"
    });

  } catch (err) {
    console.log('Error getting space', err);
    return res.status(500).send({ err: 'Internal server error' });
  }
});

// ดูรายการสินค้าจาก lot_id
app.get('/api/lot/:lot_id', async (req, res) => {
  try {
    const { lot_id } = req.params;

    const inProductOrders = await InProductOrder.findAll({
      where: { lot_in_id: lot_id },
      attributes: ['in_prod_amount', 'lot_in_id'],
      include: [{
        model: MasterProduct,
        attributes: ['mas_prod_name']
      }],
      raw: true
    });

    if (inProductOrders.length > 0) {
      return res.status(200).send({
        lot_id: lot_id,
        all_prod: inProductOrders.length,
        product_in_lots: inProductOrders
      });
    } else {
      return res.status(404).send({ message: "No products found for the given lot ID" });
    }
  } catch (err) {
    console.error('Error getting lot products', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

// ดูว่า master product เราเก็บไว้ไหนบ้าง
app.get('/api/masprod/:mas_prod_id', async (req, res) => {
  try {
    const { mas_prod_id } = req.params;

    // ค้นหาข้อมูล InProductOrder ที่เกี่ยวข้องกับ Master Product ด้วย ID ของ Master Product
    const in_prod = await InProductOrder.findAll({
      where: {
        mas_prod_id: mas_prod_id,
      },
      attributes: ['in_prod_id', 'in_prod_amount'],
      include: [
        {
          model: OnshelfProduct,
          attributes: ['space_id', 'on_prod_amount'],
          raw: true,
          include: [
            {
              model: Space,
              attributes: ['space_name'],
              raw: true,
              include: [
                {
                  model: Rack,
                  attributes: ['rack_name'],
                  raw: true,
                  include: [
                    {
                      model: Warehouse,
                      attributes: ['wh_name']
                    }
                  ],
                  raw: true
                }
              ]
            }
          ]
        }
      ],
    });

    return res.status(200).send({
      products_details: in_prod
    });

  } catch (err) {
    console.log('Error getting products', err);
    return res.status(500).send({ err: 'Internal server error' });
  }
});

// เพิ่มพื้นที่จัดเก็บ
app.post('/api/add-spaces', async (req, res) => {
  try {
    const { rack_name, spaces, wh_id } = req.body;
    const rack = await Rack.create({
      rack_name,
      wh_id
    });

    let details = {
      rack_crated: rack_name,
      all_space: [],
    };

    for (let i = 0; i < spaces.length; i++) {
      const space = await Space.create({
        space_name: spaces[i],
        space_capacity: 100,
        rack_id: rack.rack_id
      });
      details.all_space.push(space.space_name)
    };

    res.status(201).send
      ({ message: 'Spaces added successfully', details });
  }
  catch (err) {
    console.log(err)
  }
});

// ดูว่า space นั้นมีอะไรเก็บไว้บ้าง
app.get('/api/prods-in-space/:space_id', async (req, res) => {
  try {
    const { space_id } = req.params;

    const products = await Space.findAll({
      where: { space_id: space_id },
      attributes: ['space_id', 'space_name', 'space_capacity'],
      include: [
        {
          model: OnshelfProduct,
          attributes: ['on_prod_amount'],
          include: [
            {
              model: InProductOrder,
              attributes: [],
              include: [
                {
                  model: MasterProduct,
                  attributes: ['mas_prod_id', 'mas_prod_name'],
                  raw: true
                }
              ]
            }
          ]
        }
      ],
      raw: true
    });

    const formattedProducts = products.map(product => ({
      on_prod_amount: product['OnshelfProducts.on_prod_amount'],
      product_id: product['OnshelfProducts.InProductOrder.MasterProduct.mas_prod_id'],
      product_name: product['OnshelfProducts.InProductOrder.MasterProduct.mas_prod_name']
    }));

    return res.status(200).send({
      "all": products.length,
      "space_id": products[0].space_id,
      "space_name": products[0].space_name,
      "space_capacity": products[0].space_capacity,
      "products": formattedProducts,
    });
  } catch (err) {
    console.log('Error getting products', err);
    return res.status(500).send({ err: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});