// www/js/app.js
import { initArena } from "./arena3d.js";
import { Combat } from "./combat.js";
import { renderMarket, nftStore } from "./market.js";

window.onload = () => {
  // Inicializa arena
  initArena("arena-container");

  // Inicializa marketplace
  renderMarket("market-container", id => {
    const nft = nftStore.find(n=>n.id===id);
    alert(`Compraste ${nft.name} por ${nft.priceUSDT} USDT`);
  });

  // Botón de prueba combate
  document.getElementById("start-combat").onclick = () => {
    // Toma 3 cartas de ejemplo
    const p1 = [
      { id:101, name:"Riko", hp:100, atk:30, def:20, speed:50, skill:0.2 },
      { id:102, name:"Hanzo", hp:90, atk:40, def:15, speed:60, skill:0.1 },
      { id:103, name:"Kuro", hp:120, atk:25, def:30, speed:40, skill:0.05 },
    ];
    const p2 = [
      { id:201, name:"Sub-Zero", hp:110, atk:35, def:25, speed:45, skill:0.15 },
      { id:202, name:"Scorpion", hp:95, atk:45, def:10, speed:70, skill:0.2 },
      { id:203, name:"Raiden", hp:100, atk:30, def:20, speed:55, skill:0.1 },
    ];
    const combat = new Combat(p1, p2);
    while (!combat.isFinished()) {
      combat.step();
    }
    console.table(combat.log);
    alert(`Ganador: ${combat.getWinner()}`);
  };
};
