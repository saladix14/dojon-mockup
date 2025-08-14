import { ethers } from 'ethers';
import { FilamentView } from '../components/3d/FilamentView';

export class CoreSystem {
  static readonly GAME_CONFIG = {
    SEASON_DURATION: 90 * 24 * 3600,
    MAX_LEVEL: 100,
    BASE_REWARDS: {
      daily: 100,
      premium: 50,
      mission: 25
    },
    TOKEN_CONFIG: {
      name: 'NSQD',
      decimals: 18,
      burningRate: 0.025
    }
  };

  static calculateExperience(currentLevel: number): number {
    return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
  }

  static calculateRewards(action: string, level: number, hasSeasonPass: boolean): number {
    const baseReward = this.GAME_CONFIG.BASE_REWARDS[action] || 0;
    const levelMultiplier = 1 + (level * 0.01);
    const passMultiplier = hasSeasonPass ? 1.5 : 1;
    return Math.floor(baseReward * levelMultiplier * passMultiplier);
  }

  static calculateTokenBurn(amount: number): number {
    return amount * this.GAME_CONFIG.TOKEN_CONFIG.burningRate;
  }
}