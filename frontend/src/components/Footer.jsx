import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          &copy; 2025 Projeto Integrador II: Ánalise e Desenvolvimento de Sistemas - SENAC EAD.
        </p>
        <p className="group-info">
          Desenvolvido pelo GRUPO 09:
          ELIEZER SANTOS MONTEIRO, GABRIEL HENRIQUE PEREIRA, JOÃO PEDRO DE PAIVA ANDRADE, 
          JULIANA SARA LOPES, RICHARD VILLALBA DUARTE.
        </p>
      </div>
    </footer>
  );
};

export default Footer;