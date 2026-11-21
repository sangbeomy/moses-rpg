import Phaser from 'phaser';
import { W, H, txt, button } from '../ui';
import { resetState, hasSave, load } from '../state';
import { drawBackdrop, figure, prop } from '../art';
import { setMood } from '../audio';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    setMood('title');
    if (!this.scene.isActive('Hud')) this.scene.launch('Hud');   // 항상 위에 떠 있는 소리 버튼
    this.add.rectangle(W / 2, H / 2, W, H, 0xe8b86a);
    drawBackdrop(this, 'desert', 0xe8b86a);
    prop(this, 'sheep', 150, 505, 1.5);
    prop(this, 'sheep', 290, 528, 1.1);
    figure(this, 'moses', 810, 515, 1.35, 'smile');

    txt(this, W / 2, 84, '모세 이야기', 72, '#fff3c4').setOrigin(0.5).setStroke('#5a3a10', 8);
    txt(this, W / 2, 152, '성경 속 영웅들의 모험 · 모세 편', 26, '#ffffff').setOrigin(0.5).setStroke('#5a3a10', 5);

    button(this, W / 2, 290, 280, 60, '▶ 새로 시작', () => {
      resetState();
      this.scene.start('Card', { chapter: 1 });
    });
    if (hasSave()) {
      button(this, W / 2, 365, 280, 60, '📖 이어하기', () => {
        load();
        this.scene.start('Story', { resume: true });
      }, 0x3f7f5b);
    }
    txt(this, W / 2, 205, '🔊 소리가 나요 (위쪽 동그란 버튼으로 끌 수 있어요)', 18, '#ffffff').setOrigin(0.5).setStroke('#5a3a10', 4);
  }
}
