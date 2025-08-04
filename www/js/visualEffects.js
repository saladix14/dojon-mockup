// www/js/visualEffects.js
// Animaciones básicas de daño y ataque

export function flashDamage(ctx, x, y) {
  ctx.fillStyle = 'rgba(255,0,0,0.5)';
  ctx.fillRect(x-20, y-20, 40, 40);
  setTimeout(() => ctx.clearRect(x-20, y-20, 40, 40), 100);
}

export function animateAttack(canvas, from, to) {
  const ctx = canvas.getContext('2d');
  let progress = 0;
  const id = setInterval(() => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const x = from.x + (to.x - from.x) * (progress/10);
    const y = from.y + (to.y - from.y) * (progress/10);
    ctx.beginPath();
    ctx.moveTo(from.x,from.y);
    ctx.lineTo(x,y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (++progress > 10) clearInterval(id);
  }, 30);
}
