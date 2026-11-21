import type { Enemy } from './types';

export const enemies: Record<string, Enemy> = {
  overseer: { id: 'overseer', name: '이집트 감독관', icon: '😠', hp: 24, atk: 4,
    intro: '감독관이 채찍을 들고 달려온다!' },
  shepherds: { id: 'shepherds', name: '심술쟁이 목자들', icon: '🧔', hp: 20, atk: 3,
    intro: '목자들이 우물가에서 소녀들을 쫓아내려 한다!' },
};
