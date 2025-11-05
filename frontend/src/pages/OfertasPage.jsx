import React, { useEffect, useState } from 'react';
import './OfertasPage.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const OfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ofertas`);
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
          {ofertas.map((oferta) => {
            const precoOriginal = oferta.preco_original ? parseFloat(oferta.preco_original) : 0;
            const precoDesconto = oferta.preco_desconto ? parseFloat(oferta.preco_desconto) : 0;

            return (
              <div
                key={oferta.id}
                className={`oferta-card ${oferta.tipo === 'doacao' ? 'doacao' : 'venda'}`}
              >
                <h3>{oferta.nome_produto}</h3>
                <p className="tipo-tag">{oferta.tipo?.toUpperCase()}</p>
                <p><strong>Empresa:</strong> {oferta.empresa}</p>
                <p><strong>Descrição:</strong> {oferta.descricao}</p>
                <p><strong>Validade:</strong> {oferta.validade}</p>

                {oferta.tipo === 'venda' ? (
                  <div className="precos">
                  
                    <span className="preco-original">
                      R$ {precoOriginal.toFixed(2)}
                    </span>
                    <span className="preco-desconto">
                      R$ {precoDesconto.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="doacao-texto">Entre em contato para a retirada.</p>
                )}

                <button
                  className="contato-button"
                  onClick={() =>
                    alert(`Entre em contato com ${oferta.empresa}: ${oferta.contato}`)
                  }
                >
                  Reservar / Contato
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OfertasPage;
