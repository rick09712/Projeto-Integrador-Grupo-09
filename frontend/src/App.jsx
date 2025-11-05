import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer'; 
import OfertasPage from './pages/OfertasPage';
import CadastroOfertaPage from './pages/CadastroOfertaPage';
import DicasPage from './pages/DicasPage'; 
import './App.css'; 

function App() {
 
  const [view, setView] = useState('ofertas'); 

  const renderContent = () => {
    switch (view) {
      case 'ofertas':
        return <OfertasPage />;
      case 'cadastro':
        return <CadastroOfertaPage />;
      case 'dicas': 
        return <DicasPage />;
      default:
        return <OfertasPage />;
    }
  };

  return (
    <div className="app-container">
      <Header setView={setView} />
      <main className="content">
        {renderContent()}
      </main>
      <Footer /> 
    </div>
  );
}

export default App;