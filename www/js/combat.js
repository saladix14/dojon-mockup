// www/js/combat.js // Lógica de combate por turnos: hasta 3 NFT por jugador

class Combat { constructor(playerA, playerB) { this.players = [playerA, playerB]; // Cada player tiene un array de hasta 3 cartas: { id, name, hp, atk, def, speed, skills: [...] } this.turnOrder = []; this.log = []; }

// Ordena el turno según speed de cada carta activa initTurnOrder() { const fighters = []; this.players.forEach((player, pid) => { player.cards.forEach(card => { fighters.push({ ...card, playerId: pid }); }); }); // Orden descendente de speed this.turnOrder = fighters.sort((a, b) => b.speed - a.speed); }

// Ejecuta una ronda completa runRound() { this.initTurnOrder(); this.turnOrder.forEach(fighter => { if (fighter.hp <= 0) return; // carta muerta const opponentPlayer = this.players[1 - fighter.playerId]; const target = this.selectTarget(opponentPlayer); if (!target) return; this.attack(fighter, target); }); this.cleanupDeaths(); }

// Selecciona objetivo aleatorio vivo del oponente selectTarget(opponent) { const alive = opponent.cards.filter(c => c.hp > 0); if (!alive.length) return null; return alive[Math.floor(Math.random() * alive.length)]; }

// Calcula daño y registra log attack(attacker, defender) { const baseDamage = Math.max(attacker.atk - defender.def, 1); // Opcional: factor crítico const crit = Math.random() < (attacker.crit || 0) ? 1.5 : 1; const damage = Math.floor(baseDamage * crit); defender.hp = Math.max(defender.hp - damage, 0); this.log.push({ from: attacker.name, to: defender.name, damage, hpLeft: defender.hp, critical: crit > 1 }); }

// Elimina cartas con hp 0 cleanupDeaths() { this.players.forEach(player => { player.cards = player.cards.filter(c => c.hp > 0); }); }

// Verifica si hay un ganador getWinner() { const aliveA = this.players[0].cards.some(c => c.hp > 0); const aliveB = this.players[1].cards.some(c => c.hp > 0); if (aliveA && !aliveB) return this.players[0]; if (aliveB && !aliveA) return this.players[1]; return null; // sigue el combate }

// Ejecuta combate completo hasta fin runBattle() { while (!this.getWinner()) { this.runRound(); // Prevención de bucle infinito if (this.log.length > 1000) break; } const winner = this.getWinner(); this.log.push({ result: winner ? ${winner.name} wins! : 'Draw' }); return { winner, log: this.log }; } }

// Export para uso en React Native module.exports = Combat;

