'use strict';


const express = require('express');
const cors = require('cors');
const initializeDb = require('./database'); 

const app = express();

app.use(express.json());
app.use(cors()); 


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


async function startServer() {
  try {
    
    await initializeDb();
    console.log('✅ Conexão com PostgreSQL estabelecida.');

    
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
    // O módulo database exporta o pool (ver patch abaixo)
    const { pool } = require('./database');
    if (pool) {
      await pool.end();
      console.log('✅ Pool PostgreSQL fechado.');
    }
  } catch (e) {
    console.error('Erro ao fechar pool:', e);
  }
  process.exit(0);
});


startServer();

module.exports = app;
