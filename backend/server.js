'use strict';
require('dotenv').config();         

const express = require('express');
const cors = require('cors');

const { initializeDb, pool } = require('./database'); 

const app = express();

app.use(express.json());
app.use(cors());

// 🔍 Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 📥 GET - listar ofertas
app.get('/ofertas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ofertas ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
});

// 📤 POST - criar oferta
app.post('/ofertas', async (req, res) => {
  try {
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

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao criar oferta:', error);
    res.status(500).json({ error: 'Erro ao criar oferta' });
  }
});

// 🗑 DELETE - excluir oferta
app.delete('/ofertas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM ofertas WHERE id = $1', [id]);

    res.json({ message: 'Oferta removida com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir oferta:', error);
    res.status(500).json({ error: 'Erro ao excluir oferta' });
  }
});

// 🚀 START
async function startServer() {
  const PORT = process.env.PORT || 3000;

  try {
    await initializeDb();
    console.log('✅ Banco conectado!');
  } catch (err) {
    console.error('⚠️ Banco falhou:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

startServer();

module.exports = app;
