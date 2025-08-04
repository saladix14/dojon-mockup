import { Audio } from 'expo-av';

let sound;

export const playClick = async () => {
  if (sound) await sound.unloadAsync();

  sound = new Audio.Sound();
  await sound.loadAsync(require('../assets/sounds/btn_click.wav'));
  await sound.playAsync();
};
