const Customer = require('./Customer');
const Film = require('./Film');
const Inventory = require('./Inventory');
const Rental = require('./Rental');

// Define relationships
Customer.hasMany(Rental, { foreignKey: 'customer_id' });
Rental.belongsTo(Customer, { foreignKey: 'customer_id' });

Film.hasMany(Inventory, { foreignKey: 'film_id' });
Inventory.belongsTo(Film, { foreignKey: 'film_id' });

Inventory.hasMany(Rental, { foreignKey: 'inventory_id' });
Rental.belongsTo(Inventory, { foreignKey: 'inventory_id' });

module.exports = {
  Customer,
  Film,
  Inventory,
  Rental
};