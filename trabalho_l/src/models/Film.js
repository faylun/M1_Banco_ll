const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Film extends Model {}

Film.init({
  film_id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  release_year: { 
    type: DataTypes.INTEGER 
  },
  rental_rate: { 
    type: DataTypes.DECIMAL(4,2) 
  },
  language_id: {
    type: DataTypes.INTEGER
  }
}, { 
  sequelize, 
  modelName: 'film', 
  tableName: 'film', 
  timestamps: false 
});

module.exports = Film;