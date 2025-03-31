const { Customer, Film, Rental, Inventory } = require('../models');

/**
 * Lists all entities with their relationships
 */
async function listarEntidades() {
  try {
    await listarClientesComAlugueis();
    await listarFilmesComInventariosEAlugueis();
    await listarAlugueisComClientesEFilmes();
  } catch (error) {
    console.error("Erro ao listar entidades:", error);
  }
}

/**
 * Lists customers and their rentals
 */
async function listarClientesComAlugueis() {
  console.log("\n=== LISTAGEM DE CLIENTES COM SEUS ALUGUÉIS ===");
  const customers = await Customer.findAll({
    attributes: ['customer_id', 'first_name', 'last_name', 'email'],
    limit: 5,
    order: [['customer_id', 'DESC']],
    include: {
      model: Rental,
      attributes: ['rental_id', 'rental_date', 'return_date', 'inventory_id'],
      limit: 3,
      include: {
        model: Inventory,
        attributes: ['inventory_id'],
        include: {
          model: Film,
          attributes: ['film_id', 'title']
        }
      }
    }
  });
  
  console.log("Clientes e seus aluguéis:", JSON.stringify(customers, null, 2));
}

/**
 * Lists films with their inventory and rentals
 */
async function listarFilmesComInventariosEAlugueis() {
  console.log("\n=== LISTAGEM DE FILMES COM INVENTÁRIOS E ALUGUÉIS ===");
  const films = await Film.findAll({
    attributes: ['film_id', 'title', 'description', 'release_year', 'rental_rate'],
    limit: 5,
    order: [['film_id', 'DESC']],
    include: {
      model: Inventory,
      attributes: ['inventory_id'],
      limit: 3,
      include: {
        model: Rental,
        attributes: ['rental_id', 'rental_date', 'return_date', 'inventory_id', 'customer_id'],
        limit: 2,
        include: {
          model: Customer,
          attributes: ['customer_id', 'first_name', 'last_name']
        }
      }
    }
  });
  
  console.log("Filmes com inventários e aluguéis:", JSON.stringify(films, null, 2));
}

/**
 * Lists rentals with customers and films
 */
async function listarAlugueisComClientesEFilmes() {
  console.log("\n=== LISTAGEM DE ALUGUÉIS COM CLIENTES E FILMES ===");
  const rentals = await Rental.findAll({
    attributes: ['rental_id', 'rental_date', 'return_date'],
    limit: 5,
    order: [['rental_date', 'DESC']],
    include: [
      {
        model: Customer,
        attributes: ['customer_id', 'first_name', 'last_name']
      },
      {
        model: Inventory,
        attributes: ['inventory_id'],
        include: {
          model: Film,
          attributes: ['film_id', 'title', 'rental_rate']
        }
      }
    ]
  });
  
  console.log("Aluguéis com clientes e filmes:", JSON.stringify(rentals, null, 2));
}

module.exports = {
  listarEntidades,
  listarClientesComAlugueis,
  listarFilmesComInventariosEAlugueis,
  listarAlugueisComClientesEFilmes
};