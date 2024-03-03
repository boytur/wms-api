const express = require('express');
const { Space, Rack, OnshelfProduct, InBoundOrder, MasterProduct} = require('../models/models');
const router = express.Router();

// ดู space จาก id คลังและ id rack
router.get('/api/spaces', async (req, res) => {
    try {
        const { rack_id } = req.query;
        const { wh_id } = req.body;
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

// ดูว่า space นั้นมีอะไรเก็บไว้บ้าง
router.get('/api/prods-in-space', async (req, res) => {
    try {
      const { space_id } = req.query;
  
      const products = await Space.findAll({
        where: { space_id: space_id },
        attributes: ['space_id', 'space_name', 'space_capacity'],
        include: [
          {
            model: OnshelfProduct,
            attributes: ['on_prod_amount'],
            include: [
              {
                model: InBoundOrder,
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

// เพิ่มพื้นที่จัดเก็บ
router.post('/api/add-spaces', async (req, res) => {
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

module.exports = router;