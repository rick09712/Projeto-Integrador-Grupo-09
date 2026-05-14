'use strict';
require('dotenv').config();         

const express = require('express');
const cors = require('cors');

const { initializeDb, pool } = require('./database'); 

const app = express();

app.use(express.json());

// ✅ CORS - permitir requisições da Vercel
const corsOptions = {
  origin: [
    'https://projeto-integrador-grupo-09.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 🔍 Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 📥 GET - listar ofertas
app.get('/ofertas', async (req, res) => {
  try {
    console.log('📥 GET /ofertas chamado');
    const result = await pool.query('SELECT * FROM ofertas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar ofertas:', error);
    res.status(500).json({ error: 'Erro ao buscar ofertas', details: error.message });
  }
});

// 📤 POST - criar oferta
app.post('/ofertas', async (req, res) => {
  try {
    console.log('📤 POST /ofertas chamado com dados:', req.body);
    
    const {
      nome_produto,
      descricao,
      preco_original,
      preco_desconto,
      validade,
      tipo,
      empresa,
      contato
    } = req.body;

    // Validação básica
    if (!nome_produto || !tipo || !empresa || !contato || !validade) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const result = await pool.query(
      `INSERT INTO ofertas 
      (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id`,
      [
        nome_produto,
        descricao,
        preco_original || 0,
        preco_desconto || 0,
        validade,
        tipo,
        empresa,
        contato
      ]
    );

    console.log('✅ Oferta criada com ID:', result.rows[0].id);
    res.status(201).json({ id: result.rows[0].id, message: 'Oferta cadastrada com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao criar oferta:', error);
    res.status(500).json({ error: 'Erro ao criar oferta', details: error.message });
  }
});

// 🗑 DELETE - excluir oferta
app.delete('/ofertas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑 DELETE /ofertas/:id chamado para ID:', id);

    const deleteResult = await pool.query('DELETE FROM ofertas WHERE id = $1', [id]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }

    console.log('✅ Oferta deletada com sucesso');
    res.json({ message: 'Oferta removida com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir oferta:', error);
    res.status(500).json({ error: 'Erro ao excluir oferta', details: error.message });
  }
});

// 🚀 START
async function startServer() {
  const PORT = process.env.PORT || 3001;

  try {
    await initializeDb();
    console.log('✅ Banco conectado!');
  } catch (err) {
    console.error('⚠️ Banco falhou:', err.message);
    console.error('Stack:', err.stack);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`📡 CORS habilitado para: ${corsOptions.origin.join(', ')}`);
  });
}

startServer();

module.exports = app;
