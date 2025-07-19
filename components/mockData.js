// mockData.js

// Tokens para Radar.js
export const tokens = [
  {
    id: '1',
    name: 'ShadowToken',
    network: 'Ethereum',
    liquidity: '1,200,000',
    date: '2025-06-12',
    color: '#ff1a1a', // para gráficos
  },
  {
    id: '2',
    name: 'KunoichiCoin',
    network: 'Binance Smart Chain',
    liquidity: '850,000',
    date: '2025-07-01',
    color: '#13a77a',
  },
  {
    id: '3',
    name: 'NinjaDAO',
    network: 'Polygon',
    liquidity: '540,000',
    date: '2025-05-22',
    color: '#3344ff',
  },
  {
    id: '4',
    name: 'DragonShard',
    network: 'Avalanche',
    liquidity: '300,000',
    date: '2025-04-30',
    color: '#ffdd33',
  },
  {
    id: '5',
    name: 'StealthFi',
    network: 'Solana',
    liquidity: '150,000',
    date: '2025-07-15',
    color: '#33ddff',
  },
];

// NFTs para Gallery.js
export const nfts = Array.from({ length: 100 }).map((_, i) => {
  const collections = ['Samurái Shadow', 'Kunoichi Night', 'Shinobi Legacy', 'Dragón Oscuro'];
  const rarities    = ['Común', 'Raro', 'Épico', 'Legendario'];
  return {
    id: `${i + 1}`,
    name: `${collections[i % collections.length]} #${i + 1}`,
    image: require(`./assets/nft${(i % 6) + 1}.png`), // nft1.png … nft6.png
    collection: collections[i % collections.length],
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    stats: {
      HP:     Math.floor(Math.random() * 100) + 50,   // 50–149
      ATK:    Math.floor(Math.random() * 80) + 20,    // 20–99
      DEF:    Math.floor(Math.random() * 70) + 10,    // 10–79
      SPD:    Math.floor(Math.random() * 60) + 5,     // 5–64
      CRT:    Math.floor(Math.random() * 30) + 5,     // 5–34 (%)
      Skill:  Math.floor(Math.random() * 5) + 1,      // 1–5
      Energy: Math.floor(Math.random() * 50) + 50,    // 50–99
    },
    priceEth: (Math.random() * 0.2 + 0.01).toFixed(3), // 0.01–0.21 ETH
  };
});

// Ítems para Marketplace.js
export const marketplaceItems = [
  {
    id: 'm1',
    name: 'Katana de Sombra',
    icon: require('./assets/icons/katana.png'),
    priceNSQD: 120,
    priceUSD: '$24.00',
    rarity: 'Épico',
  },
  {
    id: 'm2',
    name: 'Shuriken Plateado',
    icon: require('./assets/icons/shuriken.png'),
    priceNSQD: 45,
    priceUSD: '$9.00',
    rarity: 'Raro',
  },
  {
    id: 'm3',
    name: 'Armadura Ninja',
    icon: require('./assets/icons/armor.png'),
    priceNSQD: 300,
    priceUSD: '$60.00',
    rarity: 'Legendario',
  },
  {
    id: 'm4',
    name: 'Pergamino Secreto',
    icon: require('./assets/icons/scroll.png'),
    priceNSQD: 75,
    priceUSD: '$15.00',
    rarity: 'Raro',
  },
  {
    id: 'm5',
    name: 'Capa Fantasma',
    icon: require('./assets/icons/cape.png'),
    priceNSQD: 200,
    priceUSD: '$40.00',
    rarity: 'Épico',
  },
  {
    id: 'm6',
    name: 'Pergamino Maestro',
    icon: require('./assets/icons/scroll_master.png'),
    priceNSQD: 500,
    priceUSD: '$100.00',
    rarity: 'Legendario',
  },
];

// Cursos gamificados para Courses.js
export const courses = [
  {
    id: 'c1',
    title: 'Introducción al Arte Ninja',
    level: 'Iniciado',
    progress: 0.2,  // 20%
    rewardNSQD: 20,
  },
  {
    id: 'c2',
    title: 'Técnicas de Sigilo',
    level: 'Intermedio',
    progress: 0.45, // 45%
    rewardNSQD: 45,
  },
  {
    id: 'c3',
    title: 'Maestría en Combate',
    level: 'Avanzado',
    progress: 0.7,  // 70%
    rewardNSQD: 70,
  },
  {
    id: 'c4',
    title: 'Leyenda Ninja',
    level: 'Maestro',
    progress: 0.9,  // 90%
    rewardNSQD: 100,
  },
];

// Exportar todo junto (opcional)
export default {
  tokens,
  nfts,
  marketplaceItems,
  courses,
};
