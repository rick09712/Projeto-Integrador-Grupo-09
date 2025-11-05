import React from 'react';
import './DicasPage.css';

const DicasPage = () => {
  // URL do vídeo do YouTube para incorporação 
  const videoUrl = "https://www.youtube.com/embed/cI1HSiiW0ag";

  return (
    <div className="dicas-container">
      <h2>📚 Seção de Educação e Sustentabilidade</h2>
      <p>A conscientização é o primeiro passo para reduzir o desperdício de alimentos. Aprenda como ser mais eficiente no seu consumo!</p>
      
      <div className="dicas-grid">
        
        <div className="dica-card">
          <h3>1. Planejamento Inteligente</h3>
          <p>Sempre faça uma lista antes de ir ao supermercado. Evitar compras por impulso reduz a chance de adquirir itens que você não usará antes do vencimento.</p>
        </div>

        <div className="dica-card">
          <h3>2. Aproveitamento Integral</h3>
          <p>Use talos, folhas e cascas! Muitos nutrientes estão nessas partes. Utilize cascas de frutas para fazer doces ou chás, e talos de vegetais em caldos e sopas (como o caldo de legumes que a Mariana pode fazer!).</p>
        </div>

        <div className="dica-card">
          <h3>3. Técnica PEPS</h3>
          <p>Organize sua geladeira e despensa usando a técnica "Primeiro que Entra, Primeiro que Sai" (PEPS). Coloque itens mais antigos ou próximos do vencimento na frente para consumi-los primeiro.</p>
        </div>

        <div className="dica-card video-card">
          <h3>4. Tutorial em Vídeo (Reaproveitamento)</h3>
          <p>Assista a este vídeo para aprender receitas que utilizam sobras de alimentos e maximizam o reaproveitamento, evitando desperdício de comida e dinheiro!</p>
          
         
          <div className="video-responsive">
            <iframe
              width="560" 
              height="315" 
              src={videoUrl}
              title="YouTube video player - Reaproveitamento de Alimentos"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DicasPage;