'use strict';
require('dotenv').config();         

const express = require('express');
const cors = require('cors');

const { initializeDb, pool } = require('./database'); 

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configurado para produção
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://projeto-integrador-grupo-09.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS não permitido'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('✅ CORS habilitado para produção');

// 🔍 Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: '🚀 Backend rodando com sucesso!'
  });
});

// 📥 GET - listar ofertas
app.get('/ofertas', async (req, res) => {
  try {
    console.log('📥 GET /ofertas chamado');
    const result = await pool.query('SELECT * FROM ofertas ORDER BY id DESC');
    console.log(`✅ ${result.rows.length} ofertas encontradas`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar ofertas:', error.message);
    res.status(500).json({ 
      error: 'Erro ao buscar ofertas',
      message: error.message 
    });
  }
});

// 📤 POST - criar oferta
app.post('/ofertas', async (req, res) => {
  try {
    console.log('📤 POST /ofertas chamado');
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    
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

    // ✅ Validação
    if (!nome_produto || !tipo || !empresa || !contato || !validade) {
      console.warn('⚠️ Campos obrigatórios faltando');
      return res.status(400).json({ 
        error: 'Campos obrigatórios faltando',
        required: ['nome_produto', 'tipo', 'empresa', 'contato', 'validade']
      });
    }

    const result = await pool.query(
      `INSERT INTO ofertas 
      (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nome_produto, tipo, empresa`,
      [
        nome_produto,
        descricao || null,
        parseFloat(preco_original) || 0,
        parseFloat(preco_desconto) || 0,
        validade,
        tipo,
        empresa,
        contato
      ]
    );

    const novaOferta = result.rows[0];
    console.log(`✅ Oferta criada com sucesso! ID: ${novaOferta.id}`);
    
    res.status(201).json({ 
      success: true,
      id: novaOferta.id,
      message: `Oferta "${novaOferta.nome_produto}" cadastrada com sucesso!`,
      oferta: novaOferta
    });
  } catch (error) {
    console.error('❌ Erro ao criar oferta:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erro ao criar oferta',
      message: error.message 
    });
  }
});

// 🗑 DELETE - excluir oferta
app.delete('/ofertas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑 DELETE /ofertas/${id} chamado`);

    // Validar se é um número
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const deleteResult = await pool.query('DELETE FROM ofertas WHERE id = $1', [id]);

    if (deleteResult.rowCount === 0) {
      console.warn(`⚠️ Oferta ${id} não encontrada`);
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }

    console.log(`✅ Oferta ${id} deletada com sucesso`);
    res.json({ 
      success: true,
      message: 'Oferta removida com sucesso',
      deletedId: id
    });
  } catch (error) {
    console.error('❌ Erro ao excluir oferta:', error.message);
    res.status(500).json({ 
      error: 'Erro ao excluir oferta',
      message: error.message 
    });
  }
});

// 🛠 Error handler para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada', path: req.path });
});

// 🚀 START
async function startServer() {
  const PORT = process.env.PORT || 3001;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  try {
    console.log(`\n🔧 Iniciando servidor em modo: ${NODE_ENV}`);
    await initializeDb();
    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 ======================================`);
    console.log(`🚀 Backend rodando em porta: ${PORT}`);
    console.log(`🚀 Ambiente: ${NODE_ENV}`);
    console.log(`🚀 Health check: http://localhost:${PORT}/health`);
    console.log(`🚀 ======================================\n`);
  });
}

startServer();

module.exports = app;
