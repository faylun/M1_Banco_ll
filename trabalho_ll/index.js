const readline = require("readline");
const fs = require("fs");
const { Sequelize, DataTypes } = require("sequelize");

// Conectar ao banco de dados
const sequelize = new Sequelize("sakila", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Definir o modelo da tabela `dados`
const Dados = sequelize.define(
  "dados",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    sex: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
    jobTitle: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "dados",
  }
);

// Criar interface para entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função para importar dados do CSV
async function importarCSV(nomeArquivo) {
  try {
    console.log("📌 Conectando ao banco...");
    await sequelize.authenticate();
    console.log("✅ Conexão bem-sucedida!");

    await sequelize.sync({ force: true }); // Criação da tabela antes da importação
    console.log("✅ Tabela 'dados' criada!");

    const csvData = fs.readFileSync(nomeArquivo, "utf-8");
    const linhas = csvData.split("\n").map((linha) => linha.trim()).filter(Boolean);
    if (linhas.length < 2) {
      console.error("⚠️ Arquivo CSV vazio ou inválido!");
      return;
    }

    const header = linhas[0].split(",").map((h) => h.trim());
    const dados = linhas.slice(1).map((linha) => {
      const valores = linha.split(",").map((v) => v.trim());
      const objeto = {};
      header.forEach((coluna, index) => {
        objeto[coluna] = valores[index] || null;
      });
      return objeto;
    });

    await Dados.bulkCreate(
      dados.map((item) => ({
        userId: item["User Id"],
        firstName: item["First Name"],
        lastName: item["Last Name"],
        sex: item["Sex"],
        email: item["Email"],
        phone: item["Phone"],
        dateOfBirth: item["Date of birth"],
        jobTitle: item["Job Title"],
      })),
      { ignoreDuplicates: true }
    );

    console.log("✅ Importação concluída!");
  } catch (error) {
    console.error("❌ Erro ao importar:", error);
  }
}

// Função para filtrar por nome
async function filtrarPorNome(term) {
  try {
    console.log(`🔎 Buscando registros com '${term}' no nome...`);
    const resultados = await Dados.findAll({
      where: {
        [Sequelize.Op.or]: [
          { firstName: { [Sequelize.Op.like]: `%${term}%` } },
          { lastName: { [Sequelize.Op.like]: `%${term}%` } },
        ],
      },
    });

    console.log(`✅ Encontrados ${resultados.length} registros.`);
    return resultados;
  } catch (error) {
    console.error("❌ Erro ao buscar dados:", error);
    return [];
  }
}

// Executar importação e depois permitir busca
async function iniciar() {
  await importarCSV("people-100000.csv");
  console.log("✅ Banco de dados pronto para buscas!");
  rl.question("Digite parte do nome para buscar: ", (input) => {
    filtrarPorNome(input).then((resultados) => {
      console.log(resultados.map((r) => r.toJSON()));
      rl.close();
      sequelize.close();
    });
  });
}

iniciar();
