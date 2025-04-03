const { Sequelize } = require('sequelize');
const { menuPrincipal } = require('./src/controllers/menuController');

const sequelize = new Sequelize('mysql://root:root@localhost:3306/sakila');

/**
 * Initializes the application
 */
async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
    await menuPrincipal();
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  }
}

// Start the application if this file is executed directly
if (require.main === module) {
  iniciar();
}

module.exports = { iniciar };