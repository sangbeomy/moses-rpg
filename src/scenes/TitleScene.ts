import Phaser from 'phaser';
import { W, H, txt, button } from '../ui';
import { resetState, hasSave, load, state } from '../state';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    this.add.rectangle(W / 2, H / 2, W, H, 0x2a1f45);
    this.add.rectangle(W / 2, H - 70, W, 140, 0xc9a45c);
    txt(this, W / 2, 80, '📜', 90).setOrigin(0.5);
    txt(this, W / 2, 170, '모세 이야기', 64, '#ffe9a8').setOrigin(0.5);
    txt(this, W / 2, 232, '성경 속 영웅들의 모험 · 모세 편', 24, '#d8cdf2').setOrigin(0.5);

    button(this, W / 2, 330, 280, 60, '▶ 새로 시작', () => {
      resetState();
      this.scene.start('Card', { chapter: 1 });
    });
    if (hasSave()) {
      button(this, W / 2, 405, 280, 60, '📖 이어하기', () => {
        load();
        this.scene.start('Story', { resume: true });
      }, 0x3f7f5b);
    }
    txt(this, W / 2, H - 28, '화면을 눌러서 진행해요', 18, '#3a2a10').setOrigin(0.5);
    void state;
  }
}
