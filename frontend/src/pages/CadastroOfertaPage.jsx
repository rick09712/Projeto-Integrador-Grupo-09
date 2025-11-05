import React, { useState, useEffect } from 'react';
import './CadastroOfertaPage.css'; 

const CadastroOfertaPage = () => {
  const [formData, setFormData] = useState({
    nome_produto: '',
    descricao: '',
    preco_original: '',
    preco_desconto: '',
    validade: '',
    tipo: 'venda',
    empresa: 'Supermercado do Carlos', 
    contato: '(11) 98765-4321', 
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [ofertasAtivas, setOfertasAtivas] = useState([]);


  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ofertas');
      const data = await response.json();
     
      setOfertasAtivas(data.filter(o => o.empresa === 'Supermercado do Carlos' || o.empresa === 'Hortifruti Sustentável')); 
    } catch (err) {
      console.error('Erro ao carregar ofertas ativas:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('http://localhost:3001/api/ofertas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        throw new Error(data.message || 'Falha ao cadastrar a oferta.');
      }

      setMessage(`Oferta cadastrada com sucesso! ID: ${data.id}.`);
      setFormData({ 
        nome_produto: '',
        descricao: '',
        preco_original: '',
        preco_desconto: '',
        validade: '',
        tipo: 'venda',
        empresa: 'Supermercado do Carlos',
        contato: '(11) 98765-4321',
      });
      fetchOfertas(); // Atualiza a lista após o cadastro
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    }
  };

  const handleExcluir = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja remover a oferta: "${nome}" (ID: ${id})?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/ofertas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir a oferta.');
      }
      
      const data = await response.json();
      setMessage(data.message);
      setIsError(false);
      fetchOfertas(); // Atualiza a lista após a exclusão
    } catch (error) {
      setIsError(true);
      setMessage(`Erro ao excluir: ${error.message}`);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastrar Nova Oferta (Jornada de Carlos)</h2>
      <p>Utilize esta interface para escoar excedentes e reduzir o prejuízo financeiro!</p>
      
      {message && (
        <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>
      )}

      <form onSubmit={handleSubmit} className="cadastro-form">
        {/* ... Campos do formulário (mantidos os mesmos) ... */}
        <label>
          Nome do Produto*:
          <input type="text" name="nome_produto" value={formData.nome_produto} onChange={handleChange} required />
        </label>

        <label>
          Descrição:
          <textarea name="descricao" value={formData.descricao} onChange={handleChange} />
        </label>

        <label>
          Tipo*:
          <select name="tipo" value={formData.tipo} onChange={handleChange} required>
            <option value="venda">Venda com Desconto</option>
            <option value="doacao">Doação</option>
          </select>
        </label>

        <div className="input-group">
          <label>
            Preço Original (R$):
            <input type="number" name="preco_original" value={formData.preco_original} onChange={handleChange} step="0.01" />
          </label>
          <label>
            Preço com Desconto (R$):
            <input type="number" name="preco_desconto" value={formData.preco_desconto} onChange={handleChange} step="0.01" />
          </label>
        </div>

        <label>
          Data de Validade*:
          <input type="date" name="validade" value={formData.validade} onChange={handleChange} required />
        </label>

        <button type="submit" className="submit-button">Cadastrar Oferta</button>
      </form>
      
      <div className="gerenciamento-ofertas">
        <h3>Minhas Ofertas Ativas</h3>
        {ofertasAtivas.length === 0 ? (
          <p>Nenhuma oferta ativa no momento.</p>
        ) : (
          <ul className="lista-ofertas-gerenciamento">
            {ofertasAtivas.map(oferta => (
              <li key={oferta.id} className={`oferta-item ${oferta.tipo}`}>
                <span>{oferta.nome_produto}</span>
                <small> (ID: {oferta.id}) - Validade: {oferta.validade}</small>
                <button 
                  className="botao-excluir" 
                  onClick={() => handleExcluir(oferta.id, oferta.nome_produto)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default CadastroOfertaPage;