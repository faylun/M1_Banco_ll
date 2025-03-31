const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Customer extends Model {}

Customer.init({
  customer_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  store_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  first_name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  last_name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING 
  },
  address_id: { 
    type: DataTypes.INTEGER
  }
}, { 
  sequelize, 
  modelName: 'customer', 
  tableName: 'customer', 
  timestamps: false 
});

module.exports = Customer;