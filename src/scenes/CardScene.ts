import Phaser from 'phaser';
import { W, H, txt, button } from '../ui';
import { chapters } from '../data/chapters';
import { state, save } from '../state';
import { drawBackdrop, figure, prop } from '../art';
import { setMood, sfx } from '../audio';

const CARD_THEME: Record<number, string> = { 1: 'palace', 2: 'desert', 3: 'mountain', 4: 'storm', 5: 'sea' };
const CARD_BG: Record<number, number> = { 1: 0xd9a441, 2: 0xe0b878, 3: 0x7a9a5a, 4: 0x4a5a7a, 5: 0x5a9ad0 };

// 챕터 시작 카드 / 마지막 엔딩 카드
export class CardScene extends Phaser.Scene {
  constructor() { super('Card'); }

  create(data: { chapter: number }) {
    const ch = chapters.find(c => c.id === data.chapter);

    if (!ch) {                                   // 엔딩
      setMood('triumph'); sfx('win');
      this.add.rectangle(W / 2, H / 2, W, H, 0xe8b86a);
      drawBackdrop(this, 'desert', 0xe8b86a);
      prop(this, 'crowd', 620, 470, 1.4);
      figure(this, 'moses', 300, 480, 1.4, 'smile');
      figure(this, 'miriam', 440, 480, 1.3, 'smile');
      this.add.rectangle(W / 2, 150, W - 120, 250, 0x140f22, 0.82).setStrokeStyle(3, 0xffe9a8);
      txt(this, W / 2, 80, '모세 이야기 1부 끝!', 52, '#ffe9a8').setOrigin(0.5);
      txt(this, W / 2, 148, `믿음 ${state.faith}  ·  용기 ${state.courage}  ·  지혜 ${state.wisdom}`, 28, '#ffffff').setOrigin(0.5);
      txt(this, W / 2, 205, '다음 이야기: 광야의 모험 — 곧 만나요!', 22, '#d8cdf2').setOrigin(0.5);
      button(this, W / 2, 280, 260, 52, '처음으로', () => this.scene.start('Title'));
      return;
    }

    setMood('title');
    state.chapter = ch.id;
    state.node = ch.start;
    save();

    this.add.rectangle(W / 2, H / 2, W, H, 0x1b1626);
    drawBackdrop(this, CARD_THEME[ch.id] ?? 'desert', CARD_BG[ch.id] ?? 0x888888);
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.45);
    txt(this, W / 2, 140, `제 ${ch.id} 장`, 30, '#e8dcff').setOrigin(0.5);
    txt(this, W / 2, 210, ch.title, 54, '#ffe9a8').setOrigin(0.5).setStroke('#000000', 6);
    txt(this, W / 2, 280, `📖 ${ch.verse}`, 22, '#ffffff').setOrigin(0.5);
    button(this, W / 2, 380, 240, 56, '시작하기', () => this.scene.start('Story', { resume: true }));
  }
}
