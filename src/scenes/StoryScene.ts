import Phaser from 'phaser';
import { W, H, txt, button } from '../ui';
import { chapters } from '../data/chapters';
import type { StoryNode } from '../data/types';
import { state, applyEffects, save } from '../state';

export class StoryScene extends Phaser.Scene {
  private node!: StoryNode;
  private resume = false;
  private typing?: Phaser.Time.TimerEvent;
  private fullText = '';
  private body!: Phaser.GameObjects.Text;
  private choiceUI: Phaser.GameObjects.GameObject[] = [];
  private advanceReady = false;

  constructor() { super('Story'); }

  init(data: { resume?: boolean }) { this.resume = !!data.resume; }

  private get chapter() { return chapters.find(c => c.id === state.chapter)!; }

  private find(id: string) { return this.chapter.nodes.find(n => n.id === id)!; }

  create() {
    this.node = this.find(state.node);
    this.render(this.node, !this.resume);
    this.resume = false;
  }

  private render(n: StoryNode, applyFx: boolean) {
    this.children.removeAll(true);
    this.choiceUI = [];
    this.advanceReady = false;

    state.node = n.id;
    if (applyFx) applyEffects(n.effects);
    save();

    // 배경과 일러스트(임시: 이모지)
    this.add.rectangle(W / 2, H / 2, W, H, n.bg ?? 0x333333);
    this.add.rectangle(W / 2, 200, W, 400, 0x000000, 0.12);
    // 선택지가 있는 장면은 그림을 아래로 내리고 작게 (버튼이 위쪽을 차지)
    if (n.choices) txt(this, W / 2, 292, n.icon ?? '', 80).setOrigin(0.5);
    else txt(this, W / 2, 190, n.icon ?? '', 150).setOrigin(0.5);

    // 상단 HUD
    this.add.rectangle(W / 2, 22, W, 44, 0x000000, 0.45);
    txt(this, 16, 8, `제${state.chapter}장 ${this.chapter.title}${n.plague ? ` · 재앙 ${n.plague}/10` : ''}`, 20, '#ffe9a8');
    txt(this, W - 16, 8, `❤️ ${state.hp}/${state.maxHp}  🙏 ${state.faith}  🛡️ ${state.courage}  💡 ${state.wisdom}`, 20).setOrigin(1, 0);
    if (n.verse) txt(this, W / 2, 56, `📖 ${n.verse}`, 18, '#fff3c4').setOrigin(0.5, 0);

    // 대화창
    this.add.rectangle(W / 2, H - 100, W - 40, 180, 0x140f22, 0.92).setStrokeStyle(3, 0xffe9a8);
    if (n.speaker) {
      this.add.rectangle(110, H - 192, 150, 36, 0x5b3f8f).setStrokeStyle(2, 0xffe9a8);
      txt(this, 110, H - 192, n.speaker, 22, '#ffffff').setOrigin(0.5);
    }
    this.body = txt(this, 50, H - 178, '', 26, '#ffffff', W - 100);
    this.typeOut(n.text);

    this.input.removeAllListeners();
    this.input.on('pointerdown', () => this.onTap());
    this.input.keyboard?.removeAllListeners();
    this.input.keyboard?.on('keydown-SPACE', () => this.onTap());
    this.input.keyboard?.on('keydown-ENTER', () => this.onTap());
  }

  private typeOut(s: string) {
    this.fullText = s;
    let i = 0;
    this.typing?.remove();
    this.typing = this.time.addEvent({
      delay: 28, repeat: s.length - 1,
      callback: () => {
        i++; this.body.setText(s.slice(0, i));
        if (i >= s.length) this.finishTyping();
      },
    });
  }

  private finishTyping() {
    this.typing?.remove(); this.typing = undefined;
    this.body.setText(this.fullText);
    const n = this.node;
    if (n.choices) {
      n.choices.forEach((c, idx) => {
        const btn = button(this, W / 2, 115 + idx * 80, 800, 68, c.text, () => {
          applyEffects(c.effects);
          this.go(c.next);
        }, 0x3f7f5b);
        this.choiceUI.push(btn);
      });
    } else {
      this.advanceReady = true;
      const hint = txt(this, W - 50, H - 36, n.battle ? '⚔️ 전투 시작 ▶' : n.minigame ? '🎮 도전! ▶' : n.endChapter ? '장 마치기 ▶' : '▶', 22, '#ffe9a8').setOrigin(1, 0.5);
      this.tweens.add({ targets: hint, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });
    }
  }

  private onTap() {
    if (this.typing) { this.finishTyping(); return; }
    if (!this.advanceReady) return;
    const n = this.node;
    if (n.battle) {
      this.scene.start('Battle', n.battle);
    } else if (n.minigame) {
      this.scene.start('Mini', { ...n.minigame, nodeId: `${state.chapter}:${n.id}` });
    } else if (n.endChapter) {
      this.scene.start('Card', { chapter: state.chapter + 1 });
    } else {
      const arr = this.chapter.nodes;
      this.go(n.next ?? arr[arr.findIndex(x => x.id === n.id) + 1].id);
    }
  }

  private go(id: string) {
    this.node = this.find(id);
    this.render(this.node, true);
  }
}
