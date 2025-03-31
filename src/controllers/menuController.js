const { createReadlineInterface, prompt } = require('../utils/inputUtils');
const { listarEntidades } = require('../services/listingService');
const { inserirCliente } = require('../services/customerService');
const { inserirFilme } = require('../services/filmService');
const { inserirAluguel } = require('../services/rentalService');

/**
 * Displays the main menu and handles user selection
 */
async function menuPrincipal() {
  const rl = createReadlineInterface();
  
  try {
    displayMenu();
    
    const opcao = await prompt(rl, 'Escolha uma opção: ');
    rl.close();
    
    await handleMenuOption(opcao);
  } catch (error) {
    console.error("Erro no menu principal:", error);
    rl.close();
  }
}

/**
 * Displays the menu options
 */
function displayMenu() {
  console.log("\n===== MENU PRINCIPAL =====");
  console.log("1. Listar entidades e relacionamentos");
  console.log("2. Inserir novo cliente");
  console.log("3. Inserir novo filme");
  console.log("4. Inserir novo aluguel");
  console.log("0. Sair\n");
}

/**
 * Handles the selected menu option
 * @param {string} opcao - The selected option
 */
async function handleMenuOption(opcao) {
  switch (opcao) {
    case '1':
      await listarEntidades();
      await menuPrincipal();
      break;
    case '2':
      await inserirCliente();
      await menuPrincipal();
      break;
    case '3':
      await inserirFilme();
      await menuPrincipal();
      break;
    case '4':
      await inserirAluguel();
      await menuPrincipal();
      break;
    case '0':
      console.log("Saindo do programa...");
      break;
    default:
      console.log("Opção inválida!");
      await menuPrincipal();
  }
}

module.exports = { menuPrincipal };