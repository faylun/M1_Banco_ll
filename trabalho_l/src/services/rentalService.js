const { Customer, Film, Inventory, Rental } = require('../models');
const { createReadlineInterface, prompt } = require('../utils/inputUtils');

/**
 * Creates a new rental
 */
async function inserirAluguel() {
  const rl = createReadlineInterface();
  
  try {
    // Show available customers
    const customerId = await selectCustomer(rl);
    
    // Show available films
    const filmId = await selectFilm(rl);
    
    // Check available inventory
    const availableInventory = await checkInventoryAvailable(filmId);
    
    if (!availableInventory) {
      console.log("Não há cópias disponíveis deste filme no inventário.");
      return;
    }
    
    // Create rental
    const rental = await createRental(customerId, availableInventory.inventory_id);
    
    console.log("Novo aluguel criado:", rental.toJSON());
  } catch (error) {
    console.error("Erro ao inserir aluguel:", error);
  } finally {
    rl.close();
  }
}

/**
 * Shows and selects a customer
 * @param {readline.Interface} rl - The readline interface
 * @returns {number} The selected customer ID
 */
async function selectCustomer(rl) {
  const clientes = await Customer.findAll({
    attributes: ['customer_id', 'first_name', 'last_name'],
    limit: 10
  });
  
  console.log("Clientes disponíveis:");
  clientes.forEach(cliente => {
    console.log(`${cliente.customer_id}: ${cliente.first_name} ${cliente.last_name}`);
  });
  
  return parseInt(await prompt(rl, 'Selecione o ID do cliente: '));
}

/**
 * Shows and selects a film
 * @param {readline.Interface} rl - The readline interface
 * @returns {number} The selected film ID
 */
async function selectFilm(rl) {
  const filmes = await Film.findAll({
    attributes: ['film_id', 'title'],
    limit: 10
  });
  
  console.log("Filmes disponíveis:");
  filmes.forEach(filme => {
    console.log(`${filme.film_id}: ${filme.title}`);
  });
  
  return parseInt(await prompt(rl, 'Selecione o ID do filme: '));
}

/**
 * Checks if a film has available inventory
 * @param {number} filmId - The film ID
 * @returns {Inventory|null} The available inventory or null
 */
async function checkInventoryAvailable(filmId) {
  const inventarios = await Inventory.findAll({
    where: { film_id: filmId },
    include: {
      model: Rental,
      required: false,
      where: { return_date: null }
    }
  });
  
  const inventariosDisponiveis = inventarios.filter(inv => inv.rentals.length === 0);
  
  return inventariosDisponiveis.length > 0 ? inventariosDisponiveis[0] : null;
}

/**
 * Creates a new rental
 * @param {number} customerId - The customer ID
 * @param {number} inventoryId - The inventory ID
 * @returns {Rental} The created rental
 */
async function createRental(customerId, inventoryId) {
  return await Rental.create({
    customer_id: customerId,
    inventory_id: inventoryId,
    rental_date: new Date(),
    staff_id: 1
  });
}

module.exports = {
  inserirAluguel,
  selectCustomer,
  selectFilm,
  checkInventoryAvailable,
  createRental
};