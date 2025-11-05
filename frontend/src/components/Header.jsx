import React from 'react';
import './Header.css'; 

const Header = ({ setView }) => {
  return (
    <header className="app-header">
      <h1>♻️ Food Waste</h1>
      <nav>
        <button className="nav-button" onClick={() => setView('ofertas')}>
          Ver Ofertas (Mariana)
        </button>
        <button className="nav-button" onClick={() => setView('cadastro')}>
          Cadastrar Oferta (Carlos)
        </button>
        {/*  Botão para a Seção Educativa */}
        <button className="nav-button" onClick={() => setView('dicas')} style={{ backgroundColor: '#ffc107', color: '#333' }}>
          Educação / Dicas
        </button>
      </nav>
    </header>
  );
};

export default Header;