const express = require('express');
const router = express.Router();
const { MasterProduct, Category, InBoundOrder, OnshelfProduct, Space, Rack, Warehouse } = require('../models/models');

// Get all master products
router.get('/api/master-products', async (req, res) => {
    try {
        const mas_products = await MasterProduct.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['cat_name']
                },
            ],
        });
        return res.status(200).json({
            all: mas_products.length,
            mas_products: mas_products
        });
    } catch (error) {
        console.error('Error getting master products:', error);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

// ดูว่า master product เราเก็บไว้ไหนบ้าง
router.get('/api/masprod', async (req, res) => {
    try {
      const { mas_prod_id } = req.query;
  
      // ค้นหาข้อมูล InProductOrder ที่เกี่ยวข้องกับ Master Product ด้วย ID ของ Master Product
      const in_prod = await InBoundOrder.findAll({
        where: {
          mas_prod_id: mas_prod_id,
        },
        attributes: ['inbound_id', 'inbound_amount'],
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

module.exports = router;
