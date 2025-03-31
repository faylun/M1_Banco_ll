const { Customer, Film, Inventory, Rental } = require('../models');
const { createReadlineInterface, prompt } = require('../utils/inputUtils');

/**
 * Creates a new customer and optionally creates a rental for them
 */
async function inserirCliente() {
  const rl = createReadlineInterface();
  
  try {
    const customerData = await collectCustomerData(rl);
    const newCustomer = await createCustomer(customerData);
    
    console.log("Novo cliente inserido:", newCustomer.toJSON());
    
    const criarAluguel = await prompt(rl, 'Deseja criar um aluguel para este cliente? (s/n): ');
    
    if (criarAluguel.toLowerCase() === 's') {
      await createRentalForCustomer(rl, newCustomer.customer_id);
    }
  } catch (error) {
    console.error("Erro ao inserir cliente:", error);
  } finally {
    rl.close();
  }
}

/**
 * Collects customer data from user input
 * @param {readline.Interface} rl - The readline interface
 * @returns {Object} The customer data
 */
async function collectCustomerData(rl) {
  const store_id = await prompt(rl, 'Digite o ID da loja (store_id): ');
  const first_name = await prompt(rl, 'Digite o primeiro nome do cliente: ');
  const last_name = await prompt(rl, 'Digite o sobrenome do cliente: ');
  const email = await prompt(rl, 'Digite o email do cliente: ');
  
  return {
    store_id: parseInt(store_id),
    first_name,
    last_name,
    email,
    address_id: 1 // Default address ID
  };
}

/**
 * Creates a new customer in the database
 * @param {Object} customerData - The customer data
 * @returns {Customer} The created customer
 */
async function createCustomer(customerData) {
  return await Customer.create(customerData);
}

/**
 * Creates a rental for a customer
 * @param {readline.Interface} rl - The readline interface
 * @param {number} customerId - The customer ID
 */
async function createRentalForCustomer(rl, customerId) {
  // Show available films
  const filmes = await Film.findAll({
    attributes: ['film_id', 'title'],
    limit: 10
  });
  
  console.log("Filmes disponíveis:");
  filmes.forEach(filme => {
    console.log(`${filme.film_id}: ${filme.title}`);
  });
  
  const film_id = await prompt(rl, 'Selecione o ID do filme: ');
  
  // Check if film has available inventory
  const inventario = await Inventory.findOne({
    where: { film_id },
    include: {
      model: Rental,
      required: false,
      where: { return_date: null }
    }
  });
  
  if (!inventario) {
    console.log("Não há cópias disponíveis deste filme no inventário.");
    return;
  }
  
  // Create rental
  const rental = await Rental.create({
    customer_id: customerId,
    inventory_id: inventario.inventory_id,
    rental_date: new Date(),
    staff_id: 1
  });
  
  console.log("Novo aluguel criado:", rental.toJSON());
}

module.exports = {
  inserirCliente,
  collectCustomerData,
  createCustomer,
  createRentalForCustomer
};