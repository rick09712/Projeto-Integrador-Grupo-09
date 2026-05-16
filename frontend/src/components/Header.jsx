import React from 'react';
import './Header.css'; 

const Header = ({ activeView, setView }) => {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-main">
          <div className="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path d="M24 9c6.5 0 11.9 4.2 13.8 10h-5.2l7.6 8 7.8-8h-5C40.9 10.4 33.2 4 24 4 16.6 4 10.2 8 6.8 14l4.4 2.4C13.7 12 18.5 9 24 9Z" />
              <path d="M9 24c0-2.1.4-4.1 1.2-5.9l4.6 2.5-2.8-10.7-10.7 2.9 4.5 2.5C4.6 17.9 4 20.9 4 24c0 8 4.7 14.9 11.5 18.2l2.1-4.5C12.5 35.2 9 30 9 24Z" />
              <path d="M37.3 31.2C34.8 35.9 29.8 39 24 39c-2.2 0-4.2-.5-6.1-1.3l2.6-4.4-10.8 2.4 2.5 10.8 2.7-4.6C17.6 43.2 20.7 44 24 44c7.7 0 14.5-4.3 17.9-10.6l-4.6-2.2Z" />
            </svg>
          </div>
            <h1>Food Waste</h1>
        </div>
        <span>Projeto Integrador Grupo 05</span>
      </div>
      <nav>
        <button className={`nav-button ${activeView === 'ofertas' ? 'active' : ''}`} onClick={() => setView('ofertas')}>
          Ver Ofertas (Mariana)
        </button>
        <button className={`nav-button ${activeView === 'cadastro' ? 'active' : ''}`} onClick={() => setView('cadastro')}>
          Cadastrar Oferta (Carlos)
        </button>
        <button className={`nav-button ${activeView === 'dicas' ? 'active' : ''}`} onClick={() => setView('dicas')}>
          Educação / Dicas
        </button>
      </nav>
    </header>
  );
};

export default Header;
