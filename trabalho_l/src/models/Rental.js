const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Rental extends Model {}

Rental.init({
  rental_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  rental_date: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  inventory_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  customer_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  return_date: { 
    type: DataTypes.DATE 
  },
  staff_id: {
    type: DataTypes.INTEGER
  }
}, { 
  sequelize, 
  modelName: 'rental', 
  tableName: 'rental', 
  timestamps: false 
});

module.exports = Rental;