const express = require('express');
const openDb = require('./database');
const cors = require('cors'); 

const app = express();
const PORT = 3001;


app.use(cors()); 
app.use(express.json()); 

// Inicializa o banco de dados e as rotas
(async () => {
  const db = await openDb();

  // ROTA 1: Listar todas as ofertas (Jornada da Mariana)
  app.get('/api/ofertas', async (req, res) => {
    try {
      // Busca as ofertas ordenadas pela mais recente
      const ofertas = await db.all('SELECT * FROM ofertas ORDER BY data_publicacao DESC');
      res.json(ofertas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar ofertas.', error: error.message });
    }
  });

  // ROTA 2: Cadastrar nova oferta (Jornada do Carlos)
  app.post('/api/ofertas', async (req, res) => {
    const { nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato } = req.body;

    if (!nome_produto || !validade || !tipo || !empresa) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
      const result = await db.run(
        'INSERT INTO ofertas (nome_produto, descricao, preco_original, preco_desconto, validade, tipo, empresa, contato, data_publicacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))',
        [nome_produto, descricao, parseFloat(preco_original) || 0, parseFloat(preco_desconto) || 0, validade, tipo, empresa, contato]
      );
      res.status(201).json({ 
        message: 'Oferta cadastrada com sucesso!', 
        id: result.lastID,
        data: req.body
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cadastrar oferta.', error: error.message });
    }
  });
    
  // ROTA 3: Remover uma oferta por ID (Jornada do Carlos - Gerenciamento)
  app.delete('/api/ofertas/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.run('DELETE FROM ofertas WHERE id = ?', id);

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Oferta não encontrada.' });
      }

      res.status(200).json({ message: `Oferta com ID ${id} removida com sucesso.`, id });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover oferta.', error: error.message });
    }
  });
    

  // Rota de teste
  app.get('/', (req, res) => {
    res.send('Backend da PoC de Combate ao Desperdício de Alimentos está rodando!');
  });


  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });

})();