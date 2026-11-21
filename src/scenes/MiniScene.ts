import Phaser from 'phaser';
import { W, H, txt, button, shake } from '../ui';
import { state, save } from '../state';
import type { MiniGame } from '../data/types';

// 화면에 쓰이는 글자 (폰트 미리 불러오기용)
export const MINI_TEXT = '재앙 번째 기회 다시 도전 성공 아쉬워요 하나님이 도와주실 거예요 도움을 받아 조금 쉬워졌어요 지팡이 들기 순서대로 눌러요 남은 시간 초 찾았어요 빛을 움직여 힌트 이쪽이에요 마리 개 ❤️';

const attempts: Record<string, number> = {};
type Game = MiniGame & { nodeId: string };

export class MiniScene extends Phaser.Scene {
  private g!: Game;
  private easy = false;
  private lives = 3;
  private ended = false;
  private livesText!: Phaser.GameObjects.Text;
  private info!: Phaser.GameObjects.Text;
  private tick: (dt: number) => void = () => {};

  constructor() { super('Mini'); }

  init(d: Game) {
    this.g = d;
    this.ended = false;
    this.easy = (attempts[d.nodeId] ?? 0) >= 2;   // 두 번 실패하면 하나님이 도와주세요 (쉬워짐)
    this.tick = () => {};
  }

  update(_t: number, dt: number) { if (!this.ended) this.tick(dt); }

  create() {
    const g = this.g;
    this.add.rectangle(W / 2, H / 2, W, H, g.bg ?? 0x333333);
    this.add.rectangle(W / 2, 28, W, 56, 0x000000, 0.45);
    txt(this, 16, 12, `${g.plague ? `재앙 ${g.plague}/10 · ` : ''}${g.title}`, 24, '#ffe9a8');
    this.livesText = txt(this, W - 16, 12, '', 24).setOrigin(1, 0);
    this.info = txt(this, W / 2, 66, g.prompt + (this.easy ? '\n(도움을 받아 조금 쉬워졌어요)' : ''), 22, '#ffffff', W - 80).setOrigin(0.5, 0);
    this.info.setAlign('center');
    this.lives = 3 + (this.easy ? 2 : 0) + (g.kind === 'dodge' ? Math.min(3, Math.floor(state.courage / 2)) : 0);
    this.showLives();

    ({ timing: () => this.timing(), tap: () => this.tapGame(), dodge: () => this.dodge(),
       seek: () => this.seek(), sequence: () => this.sequence() })[g.kind]();
  }

  private showLives() {
    const g = this.g;
    const uses = g.kind === 'timing' || g.kind === 'dodge' || (g.kind === 'tap' && !!g.bad);
    this.livesText.setText(uses ? '❤️'.repeat(Math.max(0, this.lives)) : '');
  }

  private loseLife() {
    if (this.ended) return;
    this.lives--; this.showLives(); shake(this, this.livesText, 6);
    if (this.lives <= 0) this.fail();
  }

  private win() {
    if (this.ended) return;
    this.ended = true;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55);
    txt(this, W / 2, H / 2 - 20, '🎉 성공!', 72, '#ffe9a8').setOrigin(0.5);
    this.time.delayedCall(1200, () => {
      state.node = this.g.win; save();
      this.scene.start('Story', { resume: false });
    });
  }

  private fail() {
    if (this.ended) return;
    this.ended = true;
    attempts[this.g.nodeId] = (attempts[this.g.nodeId] ?? 0) + 1;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.65);
    txt(this, W / 2, H / 2 - 70, '😢 아쉬워요!', 56, '#ffe9a8').setOrigin(0.5);
    txt(this, W / 2, H / 2 - 10, '하나님이 도와주실 거예요. 다시 도전해요!', 24, '#ffffff').setOrigin(0.5);
    button(this, W / 2, H / 2 + 70, 260, 60, '다시 도전', () => this.scene.restart(this.g));
  }

  private rnd(a: number, b: number) { return a + Math.random() * (b - a); }

  // ── 1) 타이밍: 움직이는 표시가 초록 칸에 있을 때 누르기 ──────────────
  private timing() {
    const g = this.g, goal = g.goal ?? 3;
    const x0 = 130, tw = 700, y = 300;
    const zoneW = Math.min(0.34, 0.11 + state.faith * 0.012 + (this.easy ? 0.09 : 0));
    let hits = 0, pos = 0, dir = 1, zc = this.rnd(0.25, 0.75);
    const base = 0.00055 * (g.speed ?? 1) * (this.easy ? 0.7 : 1);

    txt(this, W / 2, 170, g.icon, 100).setOrigin(0.5);
    this.add.rectangle(x0 + tw / 2, y, tw, 36, 0x222222).setStrokeStyle(3, 0xffffff);
    const zone = this.add.rectangle(0, y, tw * zoneW, 36, 0x44cc66);
    const marker = this.add.rectangle(x0, y, 10, 56, 0xffffff);
    const count = txt(this, W / 2, 350, `0 / ${goal}`, 30, '#ffe9a8').setOrigin(0.5);
    const place = () => zone.setX(x0 + tw * zc);
    place();

    const press = () => {
      if (this.ended) return;
      if (Math.abs(pos - zc) <= zoneW / 2) {
        hits++; count.setText(`${hits} / ${goal}`);
        this.cameras.main.flash(150, 255, 255, 255);
        if (hits >= goal) return this.win();
        zc = this.rnd(0.2, 0.8); place();
      } else this.loseLife();
    };
    button(this, W / 2, 440, 320, 70, '🙌 지팡이 들기!', press, 0x8f6a3f);
    this.input.keyboard?.on('keydown-SPACE', press);
    this.tick = (dt) => {
      pos += dir * dt * (base + hits * 0.00012);
      if (pos >= 1) { pos = 1; dir = -1; } else if (pos <= 0) { pos = 0; dir = 1; }
      marker.setX(x0 + tw * pos);
    };
  }

  // ── 2) 누르기: 나타나는 것을 눌러요 (눌러선 안 되는 것도 있어요) ──────
  private tapGame() {
    const g = this.g, goal = g.goal ?? 10;
    let left = (g.time ?? 20) * (this.easy ? 1.5 : 1) + Math.min(4, state.wisdom);
    let got = 0;
    const status = txt(this, W / 2, 500, '', 26, '#ffe9a8').setOrigin(0.5);
    const refresh = () => status.setText(`${g.icon} ${got} / ${goal}      ⏱️ ${Math.ceil(left)}초`);
    refresh();

    const spawn = () => {
      if (this.ended) return;
      const isBad = !!g.bad && Math.random() < 0.28;
      const t = txt(this, this.rnd(80, 880), this.rnd(150, 440), isBad ? g.bad! : g.icon, 68).setOrigin(0.5);
      t.setInteractive({ useHandCursor: true });
      t.once('pointerdown', () => {
        if (this.ended) return;
        t.disableInteractive();
        this.tweens.add({ targets: t, scale: 1.6, alpha: 0, duration: 180, onComplete: () => t.destroy() });
        if (isBad) { this.loseLife(); return; }
        got++; refresh();
        if (got >= goal) this.win();
      });
      this.tweens.add({ targets: t, alpha: 0, delay: 1100, duration: 400, onComplete: () => t.destroy() });
    };
    this.time.addEvent({ delay: this.easy ? 700 : 520, loop: true, callback: spawn });
    this.tick = (dt) => {
      left -= dt / 1000; refresh();
      if (left <= 0) this.fail();
    };
  }

  // ── 3) 피하기: 떨어지는 것을 피해 좌우로 움직여요 ──────────────────
  private dodge() {
    const g = this.g;
    let left = (g.time ?? 18) * (this.easy ? 0.75 : 1);
    const total = left;
    const me = txt(this, W / 2, 470, '🧙‍♂️', 64).setOrigin(0.5);
    let targetX = W / 2, invuln = 0;
    const bar = this.add.rectangle(0, 110, 0, 10, 0xffe9a8).setOrigin(0, 0.5);
    const falling: { o: Phaser.GameObjects.Text; vy: number }[] = [];

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { targetX = p.x; });
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => { targetX = p.x; });
    const keys = this.input.keyboard?.createCursorKeys();

    this.time.addEvent({
      delay: this.easy ? 650 : 440, loop: true,
      callback: () => {
        if (this.ended) return;
        const o = txt(this, this.rnd(50, 910), 130, g.icon, 52).setOrigin(0.5);
        falling.push({ o, vy: this.rnd(230, 340) * (this.easy ? 0.75 : 1) });
      },
    });
    this.tick = (dt) => {
      const s = dt / 1000;
      if (keys?.left.isDown) targetX -= 460 * s;
      if (keys?.right.isDown) targetX += 460 * s;
      targetX = Phaser.Math.Clamp(targetX, 40, W - 40);
      me.x += (targetX - me.x) * Math.min(1, s * 14);
      invuln = Math.max(0, invuln - dt);
      me.setAlpha(invuln > 0 ? 0.4 : 1);

      for (let i = falling.length - 1; i >= 0; i--) {
        const f = falling[i];
        f.o.y += f.vy * s;
        if (invuln <= 0 && Math.abs(f.o.x - me.x) < 38 && Math.abs(f.o.y - me.y) < 44) {
          f.o.destroy(); falling.splice(i, 1);
          invuln = 1000; this.loseLife();
        } else if (f.o.y > H + 40) { f.o.destroy(); falling.splice(i, 1); }
      }
      left -= s;
      bar.width = W * (1 - Math.max(0, left) / total);
      if (left <= 0) this.win();
    };
  }

  // ── 4) 찾기: 어둠 속에서 빛을 움직여 보이지 않는 것을 찾아요 ────────
  private seek() {
    const g = this.g, goal = g.goal ?? 5;
    let left = (g.time ?? 45) * (this.easy ? 1.5 : 1);
    const radius = 105 + state.wisdom * 8 + (this.easy ? 60 : 0);
    const pts: { x: number; y: number }[] = [];
    while (pts.length < goal) {
      const p = { x: this.rnd(80, 880), y: this.rnd(150, 470) };
      if (pts.every(q => Phaser.Math.Distance.Between(p.x, p.y, q.x, q.y) > 150)) pts.push(p);
    }
    const items = pts.map(p => ({ ...p, o: txt(this, p.x, p.y, g.icon, 54).setOrigin(0.5).setAlpha(0), found: false }));
    const glow = this.add.circle(W / 2, H / 2, radius, 0xffe9a8, 0.12).setStrokeStyle(2, 0xffe9a8, 0.5);
    const status = txt(this, W / 2, 505, '', 24, '#ffe9a8').setOrigin(0.5);
    let found = 0, lx = W / 2, ly = H / 2;

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => { lx = p.x; ly = p.y; });
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => { lx = p.x; ly = p.y; });
    this.tick = (dt) => {
      glow.setPosition(lx, ly);
      left -= dt / 1000;
      for (const it of items) {
        if (it.found) continue;
        const d = Phaser.Math.Distance.Between(lx, ly, it.x, it.y);
        it.o.setAlpha(Phaser.Math.Clamp(1.4 - d / radius, 0, 1));
        if (d < 44) {
          it.found = true; found++;
          this.tweens.add({ targets: it.o, scale: 1.5, alpha: 1, duration: 250, yoyo: true });
          it.o.setAlpha(1);
          if (found >= goal) this.win();
        }
      }
      status.setText(`${g.icon} ${found} / ${goal}      ⏱️ ${Math.ceil(left)}초`);
      if (left <= 0) this.fail();
    };
  }

  // ── 5) 순서: 올바른 순서대로 눌러요 (틀려도 괜찮아요, 힌트가 나와요) ─
  private sequence() {
    const g = this.g, steps = g.steps ?? [];
    let k = 0, wrong = 0;
    txt(this, W / 2, 150, g.icon, 70).setOrigin(0.5);
    const order = Phaser.Utils.Array.Shuffle([...steps]);
    const btns = order.map((label, i) => {
      const b = button(this, W / 2, 235 + i * 76, 780, 64, label, () => pick(label, b, i), 0x5b3f8f);
      return b;
    });
    const pick = (label: string, b: Phaser.GameObjects.Container, _i: number) => {
      if (this.ended || !b.input?.enabled) return;
      if (label === steps[k]) {
        k++;
        b.disableInteractive();
        (b.list[0] as Phaser.GameObjects.Rectangle).setFillStyle(0x3f7f5b);
        const num = txt(this, 0, 0, `${k}`, 28, '#ffe9a8').setOrigin(0.5);
        b.add(num); num.setPosition(-370, 0);
        if (k >= steps.length) this.win();
      } else {
        wrong++; shake(this, b, 10);
        if (wrong >= 2 || state.wisdom >= 3) {
          const hintIdx = order.indexOf(steps[k]);
          this.tweens.add({ targets: btns[hintIdx], scale: 1.05, duration: 350, yoyo: true, repeat: 3 });
        }
      }
    };
  }
}
