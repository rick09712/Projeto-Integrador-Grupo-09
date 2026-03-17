'use strict';

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

console.log("🔎 DATABASE_URL:", databaseUrl);

if (!databaseUrl) {
  console.error('❌ DATABASE_URL não definida!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('🔗 Conectado ao PostgreSQL!');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool:', err);
});

async function initializeDb() {
  try {
    const client = await pool.connect();

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
        data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Banco pronto");

    client.release();
  } catch (error) {
    console.error('❌ ERRO REAL DO BANCO:', error);
    throw error;
  }
}

module.exports = {
  initializeDb,
  pool,
};
