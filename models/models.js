const { DataTypes, Model } =   require('sequelize');
const sequelize = require('../db/db');

class Category extends Model {}

Category.init({
    cat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cat_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'categories',
    timestamps: false
});

class MasterProduct extends Model {}

MasterProduct.init({
    mas_prod_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mas_prod_no: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    mas_prod_barcode: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    mas_prod_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    mas_prod_image: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    mas_prod_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'master_products',
    timestamps: false
});

Category.hasMany(MasterProduct, { foreignKey: 'cat_id' });
MasterProduct.belongsTo(Category, { foreignKey: 'cat_id' });

class Warehouse extends Model {}

Warehouse.init({
    wh_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    wh_name: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    wh_location: {
        type: DataTypes.STRING(1000),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'warehouses',
    timestamps: false
});

class User extends Model {}

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_fname: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    user_lname: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    user_password: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    user_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_role: {
        type: DataTypes.STRING(225),
        allowNull: false
    },
    wh_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: false
});

Warehouse.hasMany(User, { foreignKey: 'wh_id' });
User.belongsTo(Warehouse, { foreignKey: 'wh_id' });

class LotIn extends Model {}

LotIn.init({
    lot_in_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lot_status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'lot_ins',
    timestamps: false
});

User.hasMany(LotIn, { foreignKey: 'user_id' });
LotIn.belongsTo(User, { foreignKey: 'user_id' });

class InProductOrder extends Model {}

InProductOrder.init({
    in_prod_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    in_prod_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    in_prod_status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    mas_prod_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lot_in_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'in_product_orders',
    timestamps: false
});

MasterProduct.hasMany(InProductOrder, { foreignKey: 'mas_prod_id' });
InProductOrder.belongsTo(MasterProduct, { foreignKey: 'mas_prod_id' });
LotIn.hasMany(InProductOrder, { foreignKey: 'lot_in_id' });
InProductOrder.belongsTo(LotIn, { foreignKey: 'lot_in_id' });

class Rack extends Model {}

Rack.init({
    rack_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rack_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    wh_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'racks',
    timestamps: false
});

Warehouse.hasMany(Rack, { foreignKey: 'wh_id' });
Rack.belongsTo(Warehouse, { foreignKey: 'wh_id' });

class Space extends Model {}

Space.init({
    space_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    space_name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    space_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rack_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'spaces',
    timestamps: false
});

Rack.hasMany(Space, { foreignKey: 'rack_id' });
Space.belongsTo(Rack, { foreignKey: 'rack_id' });

class LotOut extends Model {}

LotOut.init({
    lot_out_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lot_status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'lot_outs',
    timestamps: false
});

User.hasMany(LotOut, { foreignKey: 'user_id' });
LotOut.belongsTo(User, { foreignKey: 'user_id' });

class OutProductOrder extends Model {}

OutProductOrder.init({
    out_prod_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    out_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    out_productscol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mas_prod_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lot_out_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'out_product_orders',
    timestamps: false
});

MasterProduct.hasMany(OutProductOrder, { foreignKey: 'mas_prod_id' });
OutProductOrder.belongsTo(MasterProduct, { foreignKey: 'mas_prod_id' });
LotOut.hasMany(OutProductOrder, { foreignKey: 'lot_out_id' });
OutProductOrder.belongsTo(LotOut, { foreignKey: 'lot_out_id' });

class OnshelfProduct extends Model {}

OnshelfProduct.init({
    on_prod_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    on_prod_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    on_prod_status: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    space_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    in_prod_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'onshelf_products',
    timestamps: false
});

Space.hasMany(OnshelfProduct, { foreignKey: 'space_id' });
OnshelfProduct.belongsTo(Space, { foreignKey: 'space_id' });
InProductOrder.hasMany(OnshelfProduct, { foreignKey: 'in_prod_id' });
OnshelfProduct.belongsTo(InProductOrder, { foreignKey: 'in_prod_id' });

class OutProductList extends Model {}

OutProductList.init({
    out_prod_list_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    out_prod_list_amount: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    out_prod_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    on_prod_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    out_product_listscol: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'out_product_lists',
    timestamps: false
});

OutProductOrder.hasMany(OutProductList, { foreignKey: 'out_prod_id' });
OutProductList.belongsTo(OutProductOrder, { foreignKey: 'out_prod_id' });
OnshelfProduct.hasMany(OutProductList, { foreignKey: 'on_prod_id' });
OutProductList.belongsTo(OnshelfProduct, { foreignKey: 'on_prod_id' });

module.exports = {
    Category,
    MasterProduct,
    Warehouse,
    User,
    LotIn,
    InProductOrder,
    Rack,
    Space,
    LotOut,
    OutProductOrder,
    OnshelfProduct,
    OutProductList
};
