import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, loader;
let players = [[], []];   // 0: jugador, 1: enemigo
let currentPlayer = 0;
let turnCount = 0;

/**
 * Inicializa la escena 3D y el renderer dentro del contenedor con id=containerId
 */
export function initCombatArena(containerId) {
  const container = document.getElementById(containerId);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = ''; // limpia contenido
  container.appendChild(renderer.domElement);

  // Iluminación
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xff1a1a, 0.8);
  dir.position.set(5, 10, 7);
  scene.add(dir);

  // Carga de modelos
  loader = new GLTFLoader();

  // Piso
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  animate();
}

/**
 * Carga hasta 3 modelos GLB por jugador y los posiciona
 * @param {number} playerIndex 0=jugador,1=enemigo
 * @param {string[]} modelUris URIs de los glb
 */
export function loadPlayerCards(playerIndex, modelUris) {
  const baseX = playerIndex === 0 ? -4 : 4;
  // Elimina previos
  players[playerIndex].forEach(ent => scene.remove(ent.mesh));
  players[playerIndex] = [];

  modelUris.slice(0, 3).forEach((uri, i) => {
    loader.load(uri, gltf => {
      const mesh = gltf.scene;
      mesh.scale.set(1.5, 1.5, 1.5);
      mesh.position.set(baseX + i * 3, 0, 0);
      scene.add(mesh);
      players[playerIndex].push({
        mesh,
        hp: 100,
        atk: 20 + i * 5,
        def: 10 + i * 3,
        speed: 5 + i * 2,
      });
    });
  });
}

/**
 * Ejecuta un turno de combate
 */
export function playTurn() {
  const me = players[currentPlayer];
  const enemy = players[1 - currentPlayer];
  if (!me.length || !enemy.length) return;

  // Atacante = mayor speed, objetivo = menor hp
  const attacker = me.reduce((a, b) => (a.speed > b.speed ? a : b));
  const target = enemy.reduce((a, b) => (a.hp < b.hp ? a : b));

  const dmg = Math.max(attacker.atk - target.def, 1);
  target.hp -= dmg;
  console.log(`Turno ${turnCount}: Jugador ${currentPlayer} inflige ${dmg}`);

  // Visual feedback: flash rojo sobre objetivo
  flashRed(target.mesh);

  if (target.hp <= 0) {
    scene.remove(target.mesh);
    players[1 - currentPlayer] = enemy.filter(e => e !== target);
  }

  currentPlayer = 1 - currentPlayer;
  turnCount++;
}

/** Efecto gráfico sencillo de daño */
function flashRed(mesh) {
  const orig = mesh.material.color.clone();
  mesh.material.color.set(0xff0000);
  setTimeout(() => mesh.material.color.copy(orig), 200);
}

/** Bucle de render */
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
