// www/js/market.js

export const nftStore = [
  { id:1, name:"Neon Streets #1", priceUSDT:80, rarity:"Common" },
  { id:2, name:"Neon Streets #2", priceUSDT:150, rarity:"Rare" },
  // ... añade tus 300 tracks/pistas aquí
];

export function renderMarket(containerId, onBuy) {
  const container = document.getElementById(containerId);
  container.innerHTML = nftStore.map(item => `
    <div class="card">
      <h3>${item.name}</h3>
      <p>Precio: ${item.priceUSDT} USDT</p>
      <button data-id="${item.id}">Comprar</button>
    </div>
  `).join("");
  container.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => onBuy(+btn.dataset.id);
  });
}
