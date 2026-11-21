import Phaser from 'phaser';
import { W, H, txt, button } from '../ui';
import { chapters } from '../data/chapters';
import { state, save } from '../state';

// 챕터 시작 카드 / 마지막 엔딩 카드
export class CardScene extends Phaser.Scene {
  constructor() { super('Card'); }

  create(data: { chapter: number }) {
    this.add.rectangle(W / 2, H / 2, W, H, 0x1b1626);
    const ch = chapters.find(c => c.id === data.chapter);

    if (!ch) {
      txt(this, W / 2, 120, '🌟', 90).setOrigin(0.5);
      txt(this, W / 2, 230, '1장 끝!', 56, '#ffe9a8').setOrigin(0.5);
      txt(this, W / 2, 300, `믿음 ${state.faith}  ·  용기 ${state.courage}  ·  지혜 ${state.wisdom}`, 28, '#d8cdf2').setOrigin(0.5);
      txt(this, W / 2, 350, '다음 이야기: 열 가지 재앙과 홍해 — 곧 만나요!', 22, '#aaa0c8').setOrigin(0.5);
      button(this, W / 2, 435, 260, 56, '처음으로', () => this.scene.start('Title'));
      return;
    }

    state.chapter = ch.id;
    state.node = ch.start;
    save();

    txt(this, W / 2, 140, `제 ${ch.id} 장`, 30, '#aaa0c8').setOrigin(0.5);
    txt(this, W / 2, 210, ch.title, 54, '#ffe9a8').setOrigin(0.5);
    txt(this, W / 2, 280, `📖 ${ch.verse}`, 22, '#d8cdf2').setOrigin(0.5);
    button(this, W / 2, 380, 240, 56, '시작하기', () => this.scene.start('Story', { resume: true }));
  }
}
