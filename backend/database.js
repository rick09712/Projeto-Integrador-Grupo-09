'use strict';

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

let pgPool = null;

const sampleOfertas = [
  {
    id: 1,
    nome_produto: 'Cesta de frutas maduras',
    descricao: 'Frutas boas para consumo imediato ou preparo de vitaminas.',
    preco_original: 28.9,
    preco_desconto: 14.9,
    validade: '2026-05-20',
    tipo: 'venda',
    empresa: 'Supermercado do Carlos',
    contato: '(11) 98765-4321',
    data_publicacao: new Date().toISOString(),
  },
  {
    id: 2,
    nome_produto: 'Pães do dia',
    descricao: 'Pães frescos separados para doação no fim do expediente.',
    preco_original: 0,
    preco_desconto: 0,
    validade: '2026-05-16',
    tipo: 'doacao',
    empresa: 'Hortifruti Sustentável',
    contato: '(11) 91234-5678',
    data_publicacao: new Date().toISOString(),
  },
  {
    id: 3,
    nome_produto: 'Iogurtes naturais',
    descricao: 'Lotes refrigerados com validade próxima, ideais para consumo nos próximos dias.',
    preco_original: 24.5,
    preco_desconto: 12.0,
    validade: '2026-05-18',
    tipo: 'venda',
    empresa: 'Mercado Boa Mesa',
    contato: '(11) 93456-7788',
    data_publicacao: new Date().toISOString(),
  },
  {
    id: 4,
    nome_produto: 'Verduras para sopa',
    descricao: 'Folhas e legumes próprios para preparo de caldos, sopas e refogados.',
    preco_original: 0,
    preco_desconto: 0,
    validade: '2026-05-17',
    tipo: 'doacao',
    empresa: 'Hortifruti Sustentável',
    contato: '(11) 91234-5678',
    data_publicacao: new Date().toISOString(),
  },
  {
    id: 5,
    nome_produto: 'Kit de legumes selecionados',
    descricao: 'Batata, cenoura, abobrinha e tomate com ótimo aproveitamento para refeições.',
    preco_original: 32.0,
    preco_desconto: 18.5,
    validade: '2026-05-19',
    tipo: 'venda',
    empresa: 'Sacola Verde',
    contato: '(11) 95511-2200',
    data_publicacao: new Date().toISOString(),
  },
  {
    id: 6,
    nome_produto: 'Bolos simples fatiados',
    descricao: 'Fatias embaladas individualmente, disponíveis para retirada no balcão.',
    preco_original: 0,
    preco_desconto: 0,
    validade: '2026-05-16',
    tipo: 'doacao',
    empresa: 'Padaria Ponto Certo',
    contato: '(11) 97654-3300',
    data_publicacao: new Date().toISOString(),
  },
];

let memoryOfertas = sampleOfertas.map((oferta) => ({ ...oferta }));
let nextMemoryId = memoryOfertas.length + 1;

function normalizeOferta(params) {
  const [
    nome_produto,
    descricao,
    preco_original,
    preco_desconto,
    validade,
    tipo,
    empresa,
    contato,
  ] = params;

  return {
    id: nextMemoryId++,
    nome_produto,
    descricao,
    preco_original,
    preco_desconto,
    validade,
    tipo,
    empresa,
    contato,
    data_publicacao: new Date().toISOString(),
  };
}

const memoryPool = {
  async query(sql, params = []) {
    const normalizedSql = sql.trim().toLowerCase();

    if (normalizedSql.startsWith('select')) {
      return { rows: [...memoryOfertas].sort((a, b) => b.id - a.id) };
    }

    if (normalizedSql.startsWith('insert')) {
      const oferta = normalizeOferta(params);
      memoryOfertas.unshift(oferta);

      return {
        rows: [
          {
            id: oferta.id,
            nome_produto: oferta.nome_produto,
            tipo: oferta.tipo,
            empresa: oferta.empresa,
          },
        ],
      };
    }

    if (normalizedSql.startsWith('delete')) {
      const id = Number(params[0]);
      const previousLength = memoryOfertas.length;
      memoryOfertas = memoryOfertas.filter((oferta) => oferta.id !== id);

      return { rowCount: previousLength - memoryOfertas.length };
    }

    return { rows: [] };
  },

  async connect() {
    return {
      query: this.query,
      release() {},
    };
  },
};

function createPgPool() {
  const newPool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  newPool.on('connect', () => {
    console.log('🔗 Conectado ao PostgreSQL!');
  });

  newPool.on('error', (err) => {
    console.error('❌ Erro no pool:', err.message);
  });

  return newPool;
}

function isConnectionError(error) {
  const message = error?.message?.toLowerCase() || '';

  return (
    message.includes('connection terminated') ||
    message.includes('connection timeout') ||
    message.includes('client has encountered a connection error') ||
    message.includes('terminating connection') ||
    error?.code === 'ECONNRESET' ||
    error?.code === 'ETIMEDOUT'
  );
}

async function resetPgPool() {
  if (pgPool) {
    await pgPool.end().catch(() => {});
  }

  pgPool = createPgPool();
}

async function queryWithRetry(sql, params) {
  if (!pgPool) {
    return memoryPool.query(sql, params);
  }

  try {
    return await pgPool.query(sql, params);
  } catch (error) {
    if (!isConnectionError(error)) {
      throw error;
    }

    console.warn('⚠️ Conexão com PostgreSQL caiu. Reconectando e tentando novamente...');
    await resetPgPool();
    return pgPool.query(sql, params);
  }
}

async function seedOfertasIfEmpty(client) {
  const countResult = await client.query('SELECT COUNT(*)::int AS count FROM ofertas');

  if (countResult.rows[0].count > 0) {
    console.log('✅ Banco já possui ofertas cadastradas');
    return;
  }

  for (const oferta of sampleOfertas) {
    await client.query(
      `INSERT INTO ofertas
      (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        oferta.nome_produto,
        oferta.descricao,
        oferta.preco_original,
        oferta.preco_desconto,
        oferta.validade,
        oferta.tipo,
        oferta.empresa,
        oferta.contato,
      ]
    );
  }

  console.log('✅ Ofertas iniciais cadastradas no banco');
}

const pool = {
  async query(sql, params) {
    return queryWithRetry(sql, params);
  },

  async connect() {
    return (pgPool || memoryPool).connect();
  },
};

async function initializeDb() {
  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL não definida. Usando dados locais em memória.');
    return;
  }

  pgPool = createPgPool();

  try {
    const client = await pgPool.connect();

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

    await seedOfertasIfEmpty(client);

    console.log("✅ Banco pronto");

    client.release();
  } catch (error) {
    console.error('❌ ERRO REAL DO BANCO:', error);

    if (isProduction) {
      throw error;
    }

    console.warn('⚠️ Falha no PostgreSQL. Usando dados locais em memória.');
    pgPool = null;
  }
}

module.exports = {
  initializeDb,
  pool,
};
