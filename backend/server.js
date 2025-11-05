const express = require('express');
const initializeDb = require('./database');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicializa o banco de dados e define as rotas
(async () => {
  const pool = await initializeDb();

  // 🟢 ROTA 1: Listar todas as ofertas
  app.get('/api/ofertas', async (req, res) => {
    try {
     
      const result = await pool.query('SELECT * FROM ofertas ORDER BY data_publicacao DESC');

      
      const ofertas = result.rows.map(oferta => ({
        ...oferta,
        preco_original: oferta.preco_original ? parseFloat(oferta.preco_original) : 0,
        preco_desconto: oferta.preco_desconto ? parseFloat(oferta.preco_desconto) : 0
      }));

      res.json(ofertas);
    } catch (error) {
      console.error('❌ Erro ao buscar ofertas:', error);
      res.status(500).json({ message: 'Erro ao buscar ofertas.', error: error.message });
    }
  });

  // 🟡 ROTA 2: Cadastrar nova oferta
  app.post('/api/ofertas', async (req, res) => {
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

    if (!nome_produto || !validade || !tipo || !empresa) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
      const query = `
        INSERT INTO ofertas (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
      `;

      const values = [
        nome_produto,
        descricao,
        parseFloat(preco_original) || 0,
        parseFloat(preco_desconto) || 0,
        validade,
        tipo,
        empresa,
        contato
      ];

      const result = await pool.query(query, values);

      console.log('✅ Nova oferta cadastrada:', req.body);

      res.status(201).json({
        message: 'Oferta cadastrada com sucesso!',
        id: result.rows[0].id,
        data: req.body
      });
    } catch (error) {
      console.error('❌ Erro ao cadastrar oferta:', error);
      res.status(500).json({ message: 'Erro ao cadastrar oferta.', error: error.message });
    }
  });

  // 🔴 ROTA 3: Remover uma oferta por ID
  app.delete('/api/ofertas/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM ofertas WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Oferta não encontrada.' });
      }

      console.log(`🗑️ Oferta com ID ${id} removida com sucesso.`);
      res.status(200).json({ message: `Oferta com ID ${id} removida com sucesso.`, id });
    } catch (error) {
      console.error('❌ Erro ao remover oferta:', error);
      res.status(500).json({ message: 'Erro ao remover oferta.', error: error.message });
    }
  });

  // ⚙️ Rota de teste
  app.get('/', (req, res) => {
    res.send('✅ Backend da PoC de Combate ao Desperdício de Alimentos está rodando!');
  });

  // 🚀 Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
})();
