const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function openDb() {
  const db = await sqlite.open({
    filename: './database.db', 
    driver: sqlite3.Database
  });

  // Cria a tabela 'ofertas' se ela não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ofertas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_produto TEXT NOT NULL,
      descricao TEXT,
      preco_original REAL,
      preco_desconto REAL,
      validade TEXT NOT NULL,
      tipo TEXT NOT NULL, -- 'venda' ou 'doacao'
      empresa TEXT NOT NULL,
      contato TEXT NOT NULL,
      data_publicacao TEXT
    );
  `);

  console.log("Banco de dados inicializado e tabela 'ofertas' verificada.");

  // Insere dados de exemplo para a Jornada da Mariana
  const count = await db.get('SELECT COUNT(*) as count FROM ofertas');
  if (count.count === 0) {
    await db.run(
      'INSERT INTO ofertas (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato, data_publicacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))',
      ['Pães Integrais', 'Pacote com 5 unidades. Próximo à data de validade (em 2 dias).', 10.00, 4.99, '2025-11-06', 'venda', 'Supermercado do Carlos', '(11) 98765-4321']
    );
    await db.run(
      'INSERT INTO ofertas (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato, data_publicacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))',
      ['Caixa de Legumes Variados', 'Ideal para sopas. Doação para ONGs ou estudantes.', 0.00, 0.00, '2025-11-07', 'doacao', 'Hortifruti Sustentável', '(11) 99999-0000']
    );
    console.log("Dados de exemplo inseridos.");
  }
  
  return db;
}

module.exports = openDb;