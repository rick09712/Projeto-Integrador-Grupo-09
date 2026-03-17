'use strict';
require('dotenv').config();         

const express = require('express');
const cors = require('cors');


const { initializeDb, pool } = require('./database'); 

const app = express();

app.use(express.json());
app.use(cors());


app.get('/ofertas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ofertas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
});


async function startServer() {
  try {
    await initializeDb();                // já faz log de sucesso
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar a aplicação:', err);
    process.exit(1);
  }
}


process.on('SIGINT', async () => {
  console.log('\n⚡ Graceful shutdown iniciado...');
  try {
    if (pool) {
      await pool.end();
      console.log('✅ Pool PostgreSQL fechado.');
    }
  } catch (e) {
    console.error('Erro ao fechar pool:', e);
  }
  process.exit(0);
});

// ---------------------------------------------------------------
// Boot
// ---------------------------------------------------------------
startServer();

module.exports = app;   
