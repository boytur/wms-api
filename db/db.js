const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306, 
    username: 'root', 
    password: 'root', 
    database: 'wms-cluster-2',
    logging: false
});

module.exports = sequelize;
