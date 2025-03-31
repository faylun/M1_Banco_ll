const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Inventory extends Model {}

Inventory.init({
  inventory_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  film_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  store_id: {
    type: DataTypes.INTEGER
  }
}, { 
  sequelize, 
  modelName: 'inventory', 
  tableName: 'inventory', 
  timestamps: false 
});

module.exports = Inventory;