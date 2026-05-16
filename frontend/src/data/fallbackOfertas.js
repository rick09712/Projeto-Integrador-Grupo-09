export const fallbackOfertas = [
  {
    id: 1,
    nome_produto: 'Cesta de frutas maduras',
    descricao: 'Frutas boas para consumo imediato ou preparo de vitaminas.',
    preco_original: 28.9,
    preco_desconto: 14.9,
    validade: '2026-05-20',
    tipo: 'venda',
    empresa: 'Supermercado do Carlos',
    contato: '(11) 98765-4321',
  },
  {
    id: 2,
    nome_produto: 'Pães do dia',
    descricao: 'Pães frescos separados para doação no fim do expediente.',
    preco_original: 0,
    preco_desconto: 0,
    validade: '2026-05-16',
    tipo: 'doacao',
    empresa: 'Hortifruti Sustentável',
    contato: '(11) 91234-5678',
  },
  {
    id: 3,
    nome_produto: 'Iogurtes naturais',
    descricao: 'Lotes refrigerados com validade próxima, ideais para consumo nos próximos dias.',
    preco_original: 24.5,
    preco_desconto: 12,
    validade: '2026-05-18',
    tipo: 'venda',
    empresa: 'Mercado Boa Mesa',
    contato: '(11) 93456-7788',
  },
  {
    id: 4,
    nome_produto: 'Verduras para sopa',
    descricao: 'Folhas e legumes próprios para preparo de caldos, sopas e refogados.',
    preco_original: 0,
    preco_desconto: 0,
    validade: '2026-05-17',
    tipo: 'doacao',
    empresa: 'Hortifruti Sustentável',
    contato: '(11) 91234-5678',
  },
  {
    id: 5,
    nome_produto: 'Kit de legumes selecionados',
    descricao: 'Batata, cenoura, abobrinha e tomate com ótimo aproveitamento para refeições.',
    preco_original: 32,
    preco_desconto: 18.5,
    validade: '2026-05-19',
    tipo: 'venda',
    empresa: 'Sacola Verde',
    contato: '(11) 95511-2200',
  },
  {
    id: 6,
    nome_produto: 'Bolos simples fatiados',
    descricao: 'Fatias embaladas individualmente, disponíveis para retirada no balcão.',
    preco_original: 0,
    preco_desconto: 0,
    validade: '2026-05-16',
    tipo: 'doacao',
    empresa: 'Padaria Ponto Certo',
    contato: '(11) 97654-3300',
  },
];

const STORAGE_KEY = 'foodWasteLocalOfertas';

export function getLocalOfertas() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return [...saved, ...fallbackOfertas];
}

export function saveLocalOferta(oferta) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const localOferta = {
    ...oferta,
    id: `local-${Date.now()}`,
    preco_original: parseFloat(oferta.preco_original) || 0,
    preco_desconto: parseFloat(oferta.preco_desconto) || 0,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([localOferta, ...saved]));
  return localOferta;
}

export function removeLocalOferta(id) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(saved.filter((oferta) => oferta.id !== id))
  );
}
