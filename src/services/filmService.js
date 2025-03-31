const { Film, Inventory } = require('../models');
const { createReadlineInterface, prompt } = require('../utils/inputUtils');

/**
 * Creates a new film and adds copies to inventory
 */
async function inserirFilme() {
  const rl = createReadlineInterface();
  
  try {
    const filmData = await collectFilmData(rl);
    const newFilm = await createFilm(filmData);
    
    console.log("Novo filme inserido:", newFilm.toJSON());
    
    // Add copies to inventory
    const qtdInventario = await prompt(rl, 'Quantas cópias deste filme deseja adicionar ao inventário? ');
    await addFilmToInventory(newFilm.film_id, parseInt(qtdInventario));
    
    console.log(`${qtdInventario} cópias adicionadas ao inventário.`);
  } catch (error) {
    console.error("Erro ao inserir filme:", error);
  } finally {
    rl.close();
  }
}

/**
 * Collects film data from user input
 * @param {readline.Interface} rl - The readline interface
 * @returns {Object} The film data
 */
async function collectFilmData(rl) {
  const title = await prompt(rl, 'Digite o título do filme: ');
  const description = await prompt(rl, 'Digite a descrição do filme: ');
  const release_year = await prompt(rl, 'Digite o ano de lançamento: ');
  const rental_rate = await prompt(rl, 'Digite o valor do aluguel (ex: 4.99): ');
  
  return {
    title,
    description,
    release_year: parseInt(release_year),
    rental_rate: parseFloat(rental_rate),
    language_id: 1 // Default language ID
  };
}

/**
 * Creates a new film in the database
 * @param {Object} filmData - The film data
 * @returns {Film} The created film
 */
async function createFilm(filmData) {
  return await Film.create(filmData);
}

/**
 * Adds copies of a film to inventory
 * @param {number} filmId - The film ID
 * @param {number} quantity - The number of copies to add
 */
async function addFilmToInventory(filmId, quantity) {
  const inventoryItems = [];
  
  for (let i = 0; i < quantity; i++) {
    inventoryItems.push({
      film_id: filmId,
      store_id: 1 // Default store ID
    });
  }
  
  await Inventory.bulkCreate(inventoryItems);
}

module.exports = {
  inserirFilme,
  collectFilmData,
  createFilm,
  addFilmToInventory
};