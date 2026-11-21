import Phaser from 'phaser';
import { FONT } from '../ui';
import { unlock, isMuted, setMuted, markUiClick } from '../audio';

// 모든 화면 위에 항상 떠 있는 작은 소리 켜기/끄기 버튼
export class HudScene extends Phaser.Scene {
  constructor() { super('Hud'); }

  create() {
    const bg = this.add.circle(0, 0, 19, 0x000000, 0.45).setStrokeStyle(2, 0xffffff, 0.8);
    const icon = this.add.text(0, 1, isMuted() ? '🔇' : '🔊', { fontFamily: FONT, fontSize: '20px' }).setOrigin(0.5);
    const btn = this.add.container(556, 24, [bg, icon]).setSize(44, 44);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      markUiClick();
      unlock();
      setMuted(!isMuted());
      icon.setText(isMuted() ? '🔇' : '🔊');
    });
    // 첫 터치/키 입력 때 소리 잠금 해제
    this.input.on('pointerdown', () => unlock());
    this.input.keyboard?.on('keydown', () => unlock());
  }
}
