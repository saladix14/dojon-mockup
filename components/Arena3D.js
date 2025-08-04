import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { EngineView, Filament } from 'react-native-filament';

export default function Arena3D({ playerModels=[], enemyModels=[] }) {
  const engine = useMemo(() => Filament.Engine.create(), []);
  const scene  = useMemo(() => engine.createScene(), [engine]);

  useEffect(() => {
    const loader = Filament.ResourceLoader.create({ engine });

    // Cargar jugadores
    playerModels.forEach((uri, i) => {
      loader.loadModel(uri).then(entity => {
        engine.getTransformManager().setTransform(
          entity, [ -1 + i*1, 0, 0 ], [0,0,0,1], [0.5,0.5,0.5]
        );
        scene.addEntity(entity);
      });
    });
    // Cargar enemigos
    enemyModels.forEach((uri,i) => {
      loader.loadModel(uri).then(entity => {
        engine.getTransformManager().setTransform(
          entity, [ 1 - i*1, 0, 0 ], [0,0,0,1], [0.5,0.5,0.5]
        );
        scene.addEntity(entity);
      });
    });
    // Cámara
    const camEntity = engine.createEntity();
    engine.createCameraComponent(camEntity, { fov: 45, near: 0.1, far: 100 });
    engine.getTransformManager().setTransform(camEntity, [0,2,5], [0,0,0,1], [1,1,1]);
    scene.addCamera(camEntity);
    // Luz
    const light = engine.createEntity();
    engine.createLightComponent(light, { color:[1,1,1], intensity:100000, type:'directional', direction:[-1,-1,-1] });
    scene.addEntity(light);
  }, [engine, scene, playerModels, enemyModels]);

  return <EngineView style={styles.view} scene={scene} engine={engine} />;
}

const styles = StyleSheet.create({
  view: { flex: 1, backgroundColor: '#000' }
});
