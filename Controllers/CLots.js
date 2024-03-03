
const express = require('express');
const { MasterProduct, InBoundOrder } = require('../models/models');
const router = express.Router();

// ดูรายการสินค้าจาก lot_id
router.get('/api/lot', async (req, res) => {
    try {
        const { lot_in_id } = req.query;

        const InBoundOrders = await InBoundOrder.findAll({
            where: { lot_in_id: lot_in_id },
            attributes: ['inbound_amount', 'lot_in_id'],
            include: [{
                model: MasterProduct,
                attributes: ['mas_prod_name']
            }],
            raw: true
        });

        if (InBoundOrders.length > 0) {
            return res.status(200).send({
                lot_id: lot_id,
                all_prod: InBoundOrders.length,
                product_in_lots: InBoundOrders
            });
        } else {
            return res.status(404).send({ message: "No products found for the given lot ID" });
        }
    } catch (err) {
        console.error('Error getting lot products', err);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router;