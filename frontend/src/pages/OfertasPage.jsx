import React, { useEffect, useState } from 'react';
import './OfertasPage.css'; 

const OfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ofertas');
      if (!response.ok) {
        throw new Error('Falha ao carregar as ofertas.');
      }
      const data = await response.json();
      setOfertas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando ofertas...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div className="ofertas-container">
      <h2>Ofertas de Alimentos Próximos ao Vencimento (Jornada de Mariana)</h2>
      <p>Acesse alimentos de qualidade com preços acessíveis e combata o desperdício!</p>
      
      {ofertas.length === 0 ? (
        <p>Nenhuma oferta disponível no momento.</p>
      ) : (
        <div className="ofertas-grid">
          {ofertas.map((oferta) => (
            <div key={oferta.id} className={`oferta-card ${oferta.tipo === 'doacao' ? 'doacao' : 'venda'}`}>
              <h3>{oferta.nome_produto}</h3>
              <p className="tipo-tag">{oferta.tipo.toUpperCase()}</p>
              <p><strong>Empresa:</strong> {oferta.empresa}</p>
              <p><strong>Descrição:</strong> {oferta.descricao}</p>
              <p><strong>Validade:</strong> {oferta.validade}</p>
              
              {oferta.tipo === 'venda' ? (
                <div className="precos">
                  <span className="preco-original">R$ {oferta.preco_original.toFixed(2)}</span>
                  <span className="preco-desconto">R$ {oferta.preco_desconto.toFixed(2)}</span>
                </div>
              ) : (
                <p className="doacao-texto">Entre em contato para a retirada.</p>
              )}
              
              <button className="contato-button" onClick={() => alert(`Entre em contato com ${oferta.empresa}: ${oferta.contato}`)}>
                Reservar / Contato
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfertasPage;