import React, { useEffect, useState } from 'react';
import './OfertasPage.css';
import { getLocalOfertas } from '../data/fallbackOfertas';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://projeto-integrador-grupo-09.onrender.com';

const OfertasPage = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      
      const response = await fetch(`${API_URL}/ofertas`);

      if (!response.ok) {
        throw new Error('Falha ao carregar as ofertas.');
      }

      const data = await response.json();
      setOfertas(data);
    } catch (err) {
      console.warn('API indisponível. Exibindo ofertas locais:', err.message);
      setOfertas(getLocalOfertas());
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando ofertas...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  const vendas = ofertas.filter((oferta) => oferta.tipo === 'venda');
  const doacoes = ofertas.filter((oferta) => oferta.tipo === 'doacao');
  const economiaEstimada = vendas.reduce((total, oferta) => {
    const precoOriginal = parseFloat(oferta.preco_original) || 0;
    const precoDesconto = parseFloat(oferta.preco_desconto) || 0;

    return total + Math.max(precoOriginal - precoDesconto, 0);
  }, 0);

  return (
    <div className="ofertas-container">
      <section className="ofertas-hero">
        <div>
          <span className="hero-kicker">Consumo consciente</span>
          <h2>Ofertas de Alimentos Próximos ao Vencimento (Jornada de Mariana)</h2>
          <p>Acesse alimentos de qualidade com preços acessíveis, encontre doações disponíveis e ajude a combater o desperdício.</p>
        </div>

        <div className="hero-summary">
          <div>
            <strong>{ofertas.length}</strong>
            <span>itens ativos</span>
          </div>
          <div>
            <strong>{vendas.length}</strong>
            <span>ofertas</span>
          </div>
          <div>
            <strong>{doacoes.length}</strong>
            <span>doações</span>
          </div>
        </div>
      </section>

      <section className="impact-panel" aria-label="Resumo das oportunidades">
        <div className="impact-card">
          <span className="impact-icon">R$</span>
          <div>
            <strong>Economia estimada</strong>
            <p>Até R$ {economiaEstimada.toFixed(2)} em descontos nas ofertas cadastradas.</p>
          </div>
        </div>
        <div className="impact-card">
          <span className="impact-icon">%</span>
          <div>
            <strong>Venda com desconto</strong>
            <p>Produtos bons para consumo com preço reduzido antes do vencimento.</p>
          </div>
        </div>
        <div className="impact-card">
          <span className="impact-icon">+</span>
          <div>
            <strong>Doação solidária</strong>
            <p>Alimentos disponíveis para retirada por quem pode aproveitar agora.</p>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <h3>Disponíveis agora</h3>
        <p>Confira as oportunidades cadastradas por estabelecimentos parceiros.</p>
      </div>

      {ofertas.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhuma oferta disponível no momento.</strong>
          <p>Quando um estabelecimento cadastrar uma venda com desconto ou doação, ela aparecerá aqui automaticamente.</p>
        </div>
      ) : (
        <div className="ofertas-grid">
          {ofertas.map((oferta) => {
            const precoOriginal = oferta.preco_original ? parseFloat(oferta.preco_original) : 0;
            const precoDesconto = oferta.preco_desconto ? parseFloat(oferta.preco_desconto) : 0;
            const economia = Math.max(precoOriginal - precoDesconto, 0);

            return (
              <div
                key={oferta.id}
                className={`oferta-card ${oferta.tipo === 'doacao' ? 'doacao' : 'venda'}`}
              >
                <div className="card-topline">
                  <p className="tipo-tag">{oferta.tipo === 'doacao' ? 'DOAÇÃO' : 'OFERTA'}</p>
                  <span>Validade: {oferta.validade}</span>
                </div>

                <h3>{oferta.nome_produto}</h3>
                <p><strong>Empresa:</strong> {oferta.empresa}</p>
                <p><strong>Descrição:</strong> {oferta.descricao}</p>

                {oferta.tipo === 'venda' ? (
                  <div className="precos-box">
                    <div className="precos">
                      <span className="preco-original">
                        R$ {precoOriginal.toFixed(2)}
                      </span>
                      <span className="preco-desconto">
                        R$ {precoDesconto.toFixed(2)}
                      </span>
                    </div>
                    <span className="economia-tag">Economize R$ {economia.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="doacao-box">
                    <strong>Retirada gratuita</strong>
                    <p className="doacao-texto">Entre em contato com o estabelecimento para combinar a retirada.</p>
                  </div>
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
