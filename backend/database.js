'use strict';
const { Pool } = require('pg');
require('dotenv').config();   


const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    'ERRO: Variável de ambiente DATABASE_URL não definida. O PostgreSQL não irá funcionar.'
  );
  process.exit(1);
}


const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,  
  },
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  max: 20,
  statement_timeout: 30_000,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
});

// -------------------------------------------------------------------
// Função que garante que o pool está funcionando e cria a tabela
// -------------------------------------------------------------------
async function initializeDb() {
  let client;
  try {
    client = await pool.connect();
    console.log('🔗 Conectado ao PostgreSQL com sucesso!');

    // Cria a tabela caso ainda não exista
    await client.query(`
      CREATE TABLE IF NOT EXISTS ofertas (
        id SERIAL PRIMARY KEY,
        nome_produto VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco_original NUMERIC(10, 2),
        preco_desconto NUMERIC(10, 2),
        validade VARCHAR(10) NOT NULL,
        tipo VARCHAR(10) NOT NULL,
        empresa VARCHAR(255) NOT NULL,
        contato VARCHAR(50) NOT NULL,
        data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tabela 'ofertas' está pronta.");

  
    const { rows } = await client.query('SELECT COUNT(*) AS cnt FROM ofertas');
    const count = parseInt(rows[0].cnt, 10);

    if (count === 0) {
      await client.query(
        `INSERT INTO ofertas 
          (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato) 
         VALUES 
          ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          'Pães Integrais',
          'Pacote com 5 unidades. Próximo à data de validade (em 2 dias).',
          10.0,
          4.99,
          '2025-11-06',
          'venda',
          'Supermercado do Carlos',
          '(11) 98765-4321',
        ]
      );

      await client.query(
        `INSERT INTO ofertas 
          (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato) 
         VALUES 
          ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          'Caixa de Legumes Variados',
          'Ideal para sopas. Doação para ONGs ou estudantes.',
          0.0,
          0.0,
          '2025-11-07',
          'doacao',
          'Hortifruti Sustentável',
          '(11) 99999-0000',
        ]
      );

      console.log('📦 Dados de exemplo inseridos no PostgreSQL.');
    }

    client.release(); 
    return pool;     
  } catch (error) {
    if (client) client.release();
    console.error('❌ Falha ao inicializar o banco de dados:', error);
    throw error;
  }
}


module.exports = {
  initializeDb,
  pool,
};
