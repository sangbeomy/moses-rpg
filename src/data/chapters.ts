import type { Chapter, StoryNode, MiniGame, Effects } from './types';
import type { Mood, Sfx } from '../audio';

// 이야기는 모두 데이터입니다. 새 장면은 여기에 노드를 추가하면 됩니다.
// 성경 구절은 참조만 표기하고, 내용은 아이들 눈높이의 재구성입니다.
// next가 없으면 배열의 다음 노드로 넘어갑니다.
export const chapters: Chapter[] = [
  {
    id: 1, title: '이집트의 왕자', verse: '출애굽기 2:11-15', start: 'start',
    nodes: [
      { id: 'start', bg: 0xd9a441, icon: '🏛️', text: '옛날 이집트. 히브리 사람들은 종이 되어 힘든 일을 하고 있었어요.' },
      { id: 's2', bg: 0xd9a441, icon: '👶', text: '아기 모세는 나일강에서 건져져 왕궁에서 자랐어요. 하지만 모세는 자기가 히브리 사람이라는 걸 알고 있었지요.' },
      { id: 's3', bg: 0xc0803a, icon: '🧱', verse: '출애굽기 2:11', text: '어른이 된 모세는 어느 날 일터에 나가 보았어요. 동족들이 벽돌을 나르며 힘들어하고 있었어요.' },
      { id: 's4', bg: 0xc0803a, icon: '😠', verse: '출애굽기 2:11', text: '그때 감독관이 한 히브리 사람을 마구 때리는 것이 보였어요!' },
      { id: 'c1', bg: 0xc0803a, icon: '🤔', speaker: '모세', text: '어떻게 해야 할까?',
        choices: [
          { text: '🛡️ 달려가서 막는다 (용기 +1)', next: 'fight', effects: { courage: 1 } },
          { text: '💭 먼저 잠시 멈추고 생각한다 (지혜 +1)', next: 'think', effects: { wisdom: 1 } },
        ] },
      { id: 'think', bg: 0xc0803a, icon: '💭', speaker: '모세', text: '(이렇게 힘든 사람들을 모른 척할 수는 없어…) 모세는 마음이 무거웠어요. 결국 그 사람을 도우러 나섰어요.', next: 'fight' },
      { id: 'fight', bg: 0xb04a3a, icon: '⚔️', text: '모세는 맞고 있는 사람 앞을 막아섰어요!', battle: { enemy: 'overseer', win: 'after', lose: 'lose' } },
      { id: 'after', bg: 0x8a5a3a, icon: '😰', text: '일이 너무 커지고 말았어요. 모세는 놀라서 주위를 둘러보았어요. 누군가 이 일을 본 것 같아요.' },
      { id: 'a2', bg: 0x8a5a3a, icon: '👑', verse: '출애굽기 2:15', text: '이 소문이 바로 왕의 귀에 들어갔어요. 바로는 모세를 잡으려 했어요. 모세는 급히 이집트를 떠나 도망쳤어요.' },
      { id: 'a3', bg: 0x3a2f4a, icon: '🌅', text: '왕자의 옷을 벗고, 모세는 홀로 광야로 나아갔어요.', effects: { faith: 1 }, endChapter: true },
      { id: 'lose', bg: 0x3a2f4a, icon: '💫', text: '모세는 쓰러졌지만, 다시 용기를 내어 일어났어요. (체력이 회복되었어요)', next: 'fight' },
    ],
  },
  {
    id: 2, title: '미디안 광야의 우물', verse: '출애굽기 2:16-22', start: 'start',
    nodes: [
      { id: 'start', bg: 0xe0b878, icon: '🏜️', text: '모세는 뜨거운 광야를 지나 미디안 땅에 도착했어요. 목이 말라 우물가에 앉았지요.' },
      { id: 's2', bg: 0xe0b878, icon: '👧', verse: '출애굽기 2:16', text: '그때 일곱 자매가 양들에게 물을 먹이려고 우물로 왔어요. 이들은 미디안 제사장 이드로의 딸들이었어요.' },
      { id: 's3', bg: 0xd09a58, icon: '🧔', verse: '출애굽기 2:17', text: '그런데 못된 목자들이 소녀들을 쫓아내려 했어요!', battle: { enemy: 'shepherds', win: 'win', lose: 'lose' } },
      { id: 'win', bg: 0xe0b878, icon: '🐑', verse: '출애굽기 2:17', text: '모세는 소녀들을 도와 양들에게 물을 먹여 주었어요.' },
      { id: 'w2', bg: 0xe0b878, icon: '🏠', speaker: '이드로', verse: '출애굽기 2:20-21', text: '"우리 딸들을 도와준 그 사람을 어서 모셔 오너라! 함께 식사를 하자꾸나." 모세는 이드로의 집에서 살게 되었어요.' },
      { id: 'w3', bg: 0xe0b878, icon: '💍', verse: '출애굽기 2:21', text: '모세는 이드로의 딸 십보라와 결혼했어요. 그리고 40년 동안 양을 치며 조용히 살았어요.', effects: { wisdom: 1, faith: 1 } },
      { id: 'w4', bg: 0x6a8a4a, icon: '🐏', speaker: '모세', text: '양을 치는 것은 참을성을 배우는 시간이었어요. 왕자였던 모세가 겸손한 목자가 되었지요.', endChapter: true },
      { id: 'lose', bg: 0x3a2f4a, icon: '💫', text: '모세는 힘이 빠졌지만 다시 일어났어요. (체력이 회복되었어요)', next: 's3' },
    ],
  },
  {
    id: 3, title: '불타는 떨기나무', verse: '출애굽기 3-4', start: 'start',
    nodes: [
      { id: 'start', bg: 0x7a9a5a, icon: '⛰️', verse: '출애굽기 3:1', text: '어느 날 모세는 양떼를 몰고 호렙 산 가까이에 갔어요.' },
      { id: 's2', bg: 0x7a3a1a, icon: '🔥', verse: '출애굽기 3:2', text: '그런데 떨기나무에 불이 붙었는데, 나무는 타서 없어지지 않았어요! 모세는 신기해서 가까이 가 보았어요.' },
      { id: 's3', bg: 0xf0c040, icon: '✨', speaker: '하나님', verse: '출애굽기 3:4-5', text: '"모세야, 모세야! 가까이 오지 마라. 네가 선 곳은 거룩한 땅이니 신을 벗어라."' },
      { id: 's4', bg: 0xf0c040, icon: '✨', speaker: '하나님', verse: '출애굽기 3:7-10', text: '"내가 내 백성의 고통을 보았단다. 이제 너를 바로에게 보내어 그들을 이집트에서 이끌어 내게 하겠다."' },
      { id: 'c1', bg: 0xf0c040, icon: '😟', speaker: '모세', verse: '출애굽기 3:11', text: '"제가 누구라고 바로에게 가겠습니까? 저는 말도 잘 못하는데요…" 모세는 어떻게 대답할까?',
        choices: [
          { text: '🙇 두려워도 믿고 "제가 가겠습니다" 한다 (믿음 +2)', next: 'yes', effects: { faith: 2 } },
          { text: '🗣️ 말을 잘 못하는 것이 걱정이라고 솔직히 말씀드린다 (지혜 +1)', next: 'worry', effects: { wisdom: 1 } },
        ] },
      { id: 'yes', bg: 0xf0c040, icon: '✨', speaker: '하나님', verse: '출애굽기 3:12', text: '"좋다. 내가 너와 함께 있겠다."', next: 'aaron' },
      { id: 'worry', bg: 0xf0c040, icon: '✨', speaker: '하나님', verse: '출애굽기 4:11-12', text: '"내가 너와 함께 있겠다. 네 입을 지어 준 이가 누구겠느냐? 내가 네게 할 말을 가르쳐 주겠다."', next: 'aaron' },
      { id: 'aaron', bg: 0xf0c040, icon: '🤝', verse: '출애굽기 4:14-16', text: '하나님은 모세의 형 아론을 도우미로 세워 주셨어요. 모세는 혼자가 아니었답니다!' },
      { id: 'staff', bg: 0xf0c040, icon: '🐍', verse: '출애굽기 4:2-4', text: '모세의 손에 있던 평범한 지팡이는 하나님의 능력을 보이는 표징이 되었어요.', effects: { faith: 1 } },
      { id: 'end', bg: 0x3a2f4a, icon: '🚶', text: '모세는 아론과 함께 다시 이집트를 향해 길을 떠났어요.', endChapter: true },
    ],
  },
  {
    id: 4, title: '열 가지 재앙', verse: '출애굽기 5–12', start: 'start',
    nodes: [
      { id: 'start', bg: 0xc9a45c, icon: '🏛️', art: 'palace_audience', speaker: '모세', verse: '출애굽기 5:1', text: '"하나님께서 말씀하셨습니다. 내 백성을 보내어 광야에서 나를 예배하게 하라고요."' },
      { id: 's2', bg: 0xc9a45c, icon: '👑', speaker: '바로', verse: '출애굽기 5:2', text: '"여호와가 누구냐? 나는 그를 모른다. 백성을 보내지 않겠다!" 바로는 오히려 히브리 사람들에게 더 힘든 일을 시켰어요.' },
      { id: 's3', bg: 0x8a6a3a, icon: '🐍', art: 'snake_pharaoh', verse: '출애굽기 7:10-12', text: '아론이 바로 앞에 지팡이를 던지자 뱀이 되었어요! 바로의 마술사들도 흉내를 냈지만, 아론의 뱀이 그들의 뱀을 삼켜 버렸어요.' },
      { id: 's4', bg: 0x8a6a3a, icon: '😤', verse: '출애굽기 7:13', text: '그래도 바로의 마음은 돌처럼 굳어 있었어요. 하나님은 이집트에 열 가지 재앙으로 표징을 보이기로 하셨어요.' },
      { id: 's5', bg: 0x3a2f4a, icon: '🔟', speaker: '하나님', text: '"두려워하지 마라. 내가 너와 함께 있겠다." 재앙마다 다른 방법으로 도전해 봐요. 실패해도 괜찮아요!' },

      // ── 1. 피 ──
      ...plague(1, { sfx: 'splash', icon: '🩸', bg: 0x8a1c1c, verse: '출애굽기 7:14-25', title: '나일강이 피로 변하다',
        warn: '모세가 나일강가에서 바로에게 말했어요. "백성을 보내지 않으시면, 하나님이 이 강물을 피로 바꾸실 것입니다." 아론이 지팡이를 높이 들 차례예요!',
        mini: { kind: 'timing', icon: '🌊', prompt: '움직이는 표시가 초록 칸에 있을 때 "지팡이 들기!"를 눌러요 (3번)', goal: 3 },
        result: '나일강 물이 피로 변했어요! 물고기가 죽고 강에서 냄새가 났어요. 그래도 바로의 마음은 그대로였어요.', effects: { faith: 1 } }),

      // ── 2. 개구리 ──
      ...plague(2, { icon: '🐸', bg: 0x4a8a3a, verse: '출애굽기 8:1-15', title: '개구리 떼',
        warn: '"백성을 보내지 않으시면 개구리가 온 땅에 가득할 것입니다!" 개구리가 궁전과 침대와 부엌까지 올라왔어요.',
        mini: { kind: 'tap', icon: '🐸', prompt: '뛰어다니는 개구리를 눌러서 강으로 돌려보내요! (10마리)', goal: 10, time: 20 },
        result: '바로가 말했어요. "개구리를 없애 주면 백성을 보내 주겠다!" 모세가 기도하자 개구리가 사라졌어요. 그런데 바로는 숨을 돌리자 약속을 어기고 말았어요.', effects: { courage: 1 } }),

      // ── 3. 이 (선택) ──
      { id: 'p3a', bg: 0x9a8a5a, icon: '🦟', plague: 3, verse: '출애굽기 8:16-17', text: '이번에는 아론이 땅의 먼지를 치자, 먼지가 작은 벌레(이)로 변해 사람과 짐승에게 가득했어요!' },
      { id: 'p3b', bg: 0x9a8a5a, icon: '🧙', plague: 3, verse: '출애굽기 8:18-19', text: '바로의 마술사들도 따라 해 보려 했지만 이번에는 할 수 없었어요. 그들이 바로에게 말했어요. "이것은 하나님의 손가락입니다."' },
      { id: 'p3c', bg: 0x9a8a5a, icon: '🤔', art: 'desert_aaron', plague: 3, speaker: '모세', text: '그래도 바로는 듣지 않았어요. 모세는 바로에게 무엇이라고 말할까요?',
        choices: [
          { text: '🙏 "이것은 하나님의 능력입니다. 그분을 믿으세요" (믿음 +1)', next: 'p3r', effects: { faith: 1 } },
          { text: '💡 "마술사들도 못 하는 일이에요. 마음을 바꾸세요" (지혜 +1)', next: 'p3r', effects: { wisdom: 1 } },
        ] },
      { id: 'p3r', bg: 0x9a8a5a, icon: '😤', plague: 3, verse: '출애굽기 8:19', text: '그러나 바로의 마음은 더 굳어졌어요. 모세는 다음 재앙을 기다렸어요.' },

      // ── 4. 파리 떼 ──
      ...plague(4, { icon: '🐝', bg: 0xb08a3a, verse: '출애굽기 8:20-32', title: '파리 떼',
        warn: '"파리 떼가 이집트의 집집마다 가득할 것입니다. 하지만 히브리 사람들이 사는 고센 땅은 지켜 주실 거예요."',
        mini: { kind: 'tap', icon: '🐝', bad: '🐑', prompt: '파리 떼를 쫓아요! 고센 땅의 양 🐑은 누르면 안 돼요! (10마리)', goal: 10, time: 22 },
        result: '고센 땅에는 파리가 한 마리도 없었어요. 바로는 "허락할 테니 이 땅에서 제사를 드려라" 하고는, 파리가 사라지자 또다시 마음을 바꿨어요.', effects: { wisdom: 1 } }),

      // ── 5. 가축병 (선택) ──
      { id: 'p5a', bg: 0x7a8a4a, icon: '🐄', plague: 5, verse: '출애굽기 9:1-4', text: '"이집트의 소와 양과 낙타에 심한 병이 돌 것입니다. 하지만 이스라엘의 가축은 구별해서 지켜 주실 거예요."' },
      { id: 'p5b', bg: 0x7a8a4a, icon: '🐑', art: 'field_safe', plague: 5, verse: '출애굽기 9:6-7', text: '다음 날, 이집트의 가축이 병이 들었어요. 그러나 이스라엘 사람들의 가축은 한 마리도 병들지 않았어요. 바로가 사람을 보내 확인해 보았지요.' },
      { id: 'p5c', bg: 0x7a8a4a, icon: '🤔', art: 'desert_aaron', plague: 5, speaker: '모세', text: '그래도 바로는 백성을 보내지 않았어요. 모세는 어떻게 할까요?',
        choices: [
          { text: '🙏 조용히 하나님께 기도한다 (믿음 +1)', next: 'p5r', effects: { faith: 1 } },
          { text: '🛡️ 바로 앞에 다시 서서 담대히 말한다 (용기 +1)', next: 'p5r', effects: { courage: 1 } },
        ] },
      { id: 'p5r', bg: 0x7a8a4a, icon: '😤', plague: 5, text: '바로의 마음은 여전히 굳어 있었어요.' },

      // ── 6. 종기 ──
      ...plague(6, { art: 'ash', icon: '🔥', bg: 0x6a3a2a, verse: '출애굽기 9:8-12', title: '악성 종기',
        warn: '하나님이 모세에게 말씀하셨어요. "아궁이의 재를 한 줌 쥐고 바로 앞에서 하늘로 날려라." 이번에는 표시가 더 빨라요!',
        mini: { kind: 'timing', icon: '💨', prompt: '재를 하늘로 날릴 때를 맞춰요! 이번엔 더 빨라요 (4번)', goal: 4, speed: 1.35 },
        result: '재가 먼지가 되어 퍼지자 이집트 사람들과 짐승들에게 아픈 종기가 생겼어요. 마술사들도 모세 앞에 서 있을 수 없었어요. 그래도 바로의 마음은 굳어 있었어요.', effects: { courage: 1 } }),

      // ── 7. 우박 ──
      { id: 'p7a', bg: 0x4a5a7a, icon: '🌨️', plague: 7, verse: '출애굽기 9:18-21', text: '"내일 이맘때 이집트에 큰 우박이 쏟아질 것입니다. 밖에 있는 사람과 짐승은 집 안으로 피하게 하세요!" 바로의 신하 중 일부는 이 말을 듣고 서둘러 종과 가축을 집 안으로 데려갔어요.' },
      ...plague(7, { sfx: 'thunder', icon: '🌨️', bg: 0x4a5a7a, verse: '출애굽기 9:22-35', title: '우박',
        warn: '모세가 지팡이를 하늘로 뻗자 하늘이 어두워지고 우박이 쏟아졌어요! 좌우로 움직여 우박을 피해요! (마우스나 손가락으로 움직이거나 ◀ ▶ 키)',
        mini: { kind: 'dodge', icon: '❄️', prompt: '마우스·손가락·◀ ▶ 키로 움직여서 우박을 피해요! 끝까지 버티면 성공!', time: 18 },
        result: '바로가 말했어요. "이번에는 내가 잘못했다. 이제 너희를 보내겠다." 하지만 우박이 그치자 바로는 또 마음을 굳게 하고 말았어요.', effects: { courage: 1 } }, true),

      // ── 8. 메뚜기 ──
      ...plague(8, { icon: '🦗', bg: 0x7a8a2a, verse: '출애굽기 10:1-20', title: '메뚜기 떼',
        warn: '바로의 신하들이 말했어요. "왕이시여, 이집트가 망하는 걸 아직도 모르십니까? 이 사람들을 보내십시오!" 그래도 바로는 고집을 부렸어요. 바람을 타고 메뚜기 떼가 몰려와요!',
        mini: { kind: 'tap', icon: '🦗', prompt: '메뚜기가 곡식을 먹기 전에 빨리 쫓아요! (14마리)', goal: 14, time: 18 },
        result: '메뚜기 떼가 들판의 풀과 나무의 열매를 모두 먹어 버렸어요. 바로는 "내 죄를 용서해 달라" 했지만, 메뚜기가 사라지자 또 마음을 바꿨어요.', effects: { wisdom: 1 } }),

      // ── 9. 어둠 ──
      ...plague(9, { music: 'night', icon: '🌑', bg: 0x0d0a18, verse: '출애굽기 10:21-29', title: '짙은 어둠',
        warn: '"하늘로 손을 뻗어라!" 모세가 손을 들자 이집트 온 땅이 사흘 동안 깜깜한 어둠에 덮였어요. 그런데 이스라엘 사람들이 사는 곳에는 빛이 있었어요.',
        mini: { kind: 'seek', icon: '🕯️', prompt: '어둠 속에서 빛을 움직여 숨은 등불 5개를 찾아요! (손가락이나 마우스로 움직여요)', goal: 5, time: 45 },
        result: '바로가 말했어요. "썩 물러가라! 다시는 내 얼굴을 보지 마라!" 모세가 대답했어요. "맞습니다. 다시는 왕의 얼굴을 보지 않겠습니다."', effects: { faith: 1 } }),

      // ── 10. 유월절 ──
      { id: 'p10g', bg: 0x3a2a5a, icon: '🌙', music: 'night', plague: 10, speaker: '하나님', verse: '출애굽기 11:1; 12:12-13', text: '"이제 마지막 재앙을 내리겠다. 그 뒤에는 바로가 너희를 보낼 것이다. 이 밤에 내가 이집트를 지나가겠지만, 문설주에 어린양의 피가 발린 집은 내가 넘어가겠다."' },
      ...plague(10, { art: 'house_passover', icon: '🐑', bg: 0x3a2a5a, verse: '출애굽기 12:3-11', title: '유월절 준비',
        warn: '모세가 이스라엘 백성에게 하나님의 말씀을 전했어요. 하나님이 가르쳐 주신 순서대로 준비해야 해요!',
        mini: { kind: 'sequence', icon: '🏠', prompt: '하나님이 말씀하신 순서대로 눌러요!',
          steps: ['🐑 흠 없는 어린양을 골라요', '🩸 양의 피를 집 문설주에 발라요', '🍞 집 안에서 가족과 함께 식사해요', '🎒 서둘러 떠날 준비를 해요'] },
        result: '그날 밤, 하나님이 이집트를 지나가시며 마지막 재앙을 내리셨어요. 이집트 온 땅에 큰 울음소리가 퍼졌어요. 하지만 문설주에 피를 바른 이스라엘의 집은 하나님이 "넘어가" 주셨어요. 이것이 \'유월절\'이에요.', effects: { faith: 2 } }),
      { id: 'p10b', bg: 0x3a2a5a, icon: '😢', speaker: '바로', verse: '출애굽기 12:31-32', text: '바로는 밤중에 모세와 아론을 불렀어요. "너희는 일어나 내 백성 가운데서 떠나라! 가서 말한 대로 여호와를 섬겨라. 양과 소도 데리고 가라!"' },
      { id: 'p10c', bg: 0xd9a441, icon: '🌅', art: 'exodus', music: 'desert', verse: '출애굽기 12:37', text: '이스라엘 백성은 서둘러 이집트를 떠나기 시작했어요. 400년 넘게 종살이하던 땅을 드디어 벗어나는 거예요!', effects: { wisdom: 1 } },
      { id: 'p10d', bg: 0x3a2f4a, icon: '🚶', art: 'exodus', speaker: '모세', text: '하지만 모세와 백성 앞에는 아직 넓은 바다가 기다리고 있었어요… (다음 이야기: 홍해를 건너다)', endChapter: true },
    ],
  },
  {
    id: 5, title: '홍해를 건너다', verse: '출애굽기 13–15', start: 'start',
    nodes: [
      { id: 'start', bg: 0xd9a441, icon: '🌅', art: 'exodus', music: 'desert', verse: '출애굽기 13:20-21', text: '이스라엘 백성은 이집트를 떠나 광야 길로 나아갔어요. 하나님은 길을 모르는 백성을 직접 이끌어 주셨어요.' },
      { id: 's2', bg: 0x9ab8e0, icon: '☁️', art: 'pillar_cloud', verse: '출애굽기 13:21', text: '낮에는 커다란 구름 기둥이 앞서 가며 길을 알려 주었어요.' },
      { id: 's3', bg: 0x2a2f5a, icon: '🔥', art: 'pillar_fire', music: 'night', verse: '출애굽기 13:21-22', text: '밤에는 환한 불기둥이 길을 비춰 주었어요. 백성들은 밤에도 무섭지 않았답니다.' },
      { id: 's4', bg: 0x5a9ad0, icon: '🌊', art: 'shore', music: 'tense', verse: '출애굽기 14:1-2', text: '그런데 백성들이 바닷가에 이르렀을 때, 앞에는 넓고 깊은 바다가 가로막고 있었어요.' },
      { id: 's5', bg: 0xc9a45c, icon: '👑', art: 'palace_pharaoh', speaker: '바로', verse: '출애굽기 14:5-9', text: '"우리가 왜 그들을 보내 주었단 말이냐! 종들이 없어지면 누가 일을 하겠느냐!" 바로는 또 마음을 바꾸고, 병거와 군대를 이끌고 쫓아오기 시작했어요.' },
      { id: 's6', bg: 0xc9a45c, icon: '🐎', art: 'chase', verse: '출애굽기 14:9-10', text: '멀리서 먼지구름이 일어났어요. 이집트 군대가 가까이 쫓아오고 있었어요!' },
      { id: 'c1', bg: 0x5a9ad0, icon: '😨', art: 'shore', speaker: '백성', verse: '출애굽기 14:10-12', text: '"앞은 바다, 뒤는 군대예요! 차라리 이집트에 있는 게 나았어요!" 백성들이 두려워 소리쳤어요. 모세는 어떻게 할까요?',
        choices: [
          { text: '🙏 "두려워 말아요! 하나님이 지켜 주세요" (믿음 +1)', next: 'calm', effects: { faith: 1 } },
          { text: '🤝 모두 손을 잡고 서로 용기를 준다 (용기 +1)', next: 'calm', effects: { courage: 1 } },
        ] },
      { id: 'calm', bg: 0x5a9ad0, icon: '🙂', art: 'sea_calm', speaker: '모세', verse: '출애굽기 14:13-14', text: '"두려워하지 마세요! 가만히 서서 하나님이 오늘 우리를 구해 주시는 것을 보세요. 하나님이 우리를 위해 싸워 주실 거예요."' },
      { id: 'cloud', bg: 0x2a2f5a, icon: '☁️', art: 'pillar_cloud', verse: '출애굽기 14:19-20', text: '그때 앞서 가던 구름 기둥이 백성 뒤로 옮겨 와서, 이집트 군대와 이스라엘 백성 사이에 섰어요. 이집트 쪽은 어두웠고, 이스라엘 쪽은 밤새 환했어요.' },
      { id: 'god', bg: 0x5a9ad0, icon: '✨', art: 'sea_ready', music: 'holy', speaker: '하나님', verse: '출애굽기 14:15-16', text: '"모세야, 왜 두려워하느냐? 백성에게 앞으로 나아가라고 해라. 너는 지팡이를 들고 손을 바다 위로 내밀어라."' },
      { id: 'm1', bg: 0x5a9ad0, icon: '🌊', art: 'sea_ready', text: '모세가 바다 앞에 섰어요. 지팡이를 높이 들 시간이에요!',
        minigame: { kind: 'timing', title: '바다 위로 지팡이를', prompt: '움직이는 표시가 초록 칸에 있을 때 "지팡이 들기!"를 눌러요 (4번)', icon: '🌊', art: 'sea_ready', goal: 4, speed: 0.9, mood: 'holy', win: 'open', bg: 0x5a9ad0 } },
      { id: 'open', bg: 0x5a9ad0, icon: '🌊', art: 'sea_open', sfx: 'whoosh', music: 'triumph', verse: '출애굽기 14:21-22', text: '하나님이 밤새 강한 바람으로 바다를 물러가게 하셨어요. 바닷물이 갈라지고, 바다 가운데 마른 길이 생겼어요! 물이 양쪽에 벽처럼 서 있었어요.', effects: { faith: 1 } },
      { id: 'm2', bg: 0x5a9ad0, icon: '🚶', art: 'sea_open', text: '이제 백성들이 마른 땅으로 건너기 시작해요. 한 사람 한 사람 안전하게 건너도록 도와요!',
        minigame: { kind: 'tap', title: '바다 길로 인도하기', prompt: '길 위에 나타나는 사람들을 눌러서 안전하게 건너도록 도와요! (12명)', icon: '🚶', art: 'sea_open', goal: 12, time: 22, mood: 'triumph', win: 'cross', bg: 0x5a9ad0 } },
      { id: 'cross', bg: 0x5a9ad0, icon: '🌈', art: 'sea_cross', verse: '출애굽기 14:22', text: '이스라엘 백성은 마른 땅을 걸어 바다를 건넜어요. 어른도 아이도, 양과 소도 모두 안전하게요!', effects: { courage: 1 } },
      { id: 'chase', bg: 0x5a9ad0, icon: '🐎', art: 'sea_chase', music: 'tense', verse: '출애굽기 14:23-25', text: '이집트 군대도 바다 가운데로 쫓아 들어왔어요. 그런데 병거 바퀴가 자꾸 빠져서 잘 달리지 못했어요. 이집트 사람들이 말했어요. "하나님이 이스라엘을 위해 싸우시는구나!"' },
      { id: 'god2', bg: 0x5a9ad0, icon: '✨', art: 'sea_ready', music: 'holy', speaker: '하나님', verse: '출애굽기 14:26', text: '"이제 손을 바다 위로 내밀어라. 물이 다시 제자리로 돌아올 것이다."' },
      { id: 'm3', bg: 0x5a9ad0, icon: '🧍', art: 'chase', speaker: '모세', text: '"두려워 말고 가만히 서 있어요. 하나님이 싸워 주실 거예요." 이집트 군대가 가까이 와도 움직이지 말고 기다려요!',
        minigame: { kind: 'wait', title: '가만히 서서 기다리기', prompt: '이집트 군대가 가까이 와도 무서워서 움직이지 마세요! 화면을 누르지 말고 가만히 기다려요.', icon: '🌊', art: 'shore_empty', time: 10, mood: 'tense', win: 'close', bg: 0x5a9ad0 } },
      { id: 'close', bg: 0x5a9ad0, icon: '🌊', art: 'sea_close', sfx: 'splash', music: 'holy', verse: '출애굽기 14:27-28', text: '모세가 손을 내밀자 바닷물이 다시 제자리로 돌아왔어요. 쫓아오던 이집트 군대는 더 이상 따라올 수 없었어요.', effects: { faith: 2 } },
      { id: 'praise', bg: 0xd9a441, icon: '🙌', art: 'free', music: 'triumph', verse: '출애굽기 14:30-31', text: '그날 이스라엘 백성은 하나님이 얼마나 크고 놀라운 분인지 보았어요. 그리고 하나님과 그분의 종 모세를 믿게 되었어요.' },
      { id: 'miriam', bg: 0xe0b878, icon: '🥁', art: 'miriam', speaker: '미리암', verse: '출애굽기 15:20-21', text: '모세의 누나 미리암이 소고를 들고 노래했어요. "여호와께 노래하세요! 그분은 높고 높으신 분이세요!" 여인들도 모두 소고를 치며 춤을 추었어요.' },
      { id: 'm4', bg: 0xe0b878, icon: '🥁', art: 'miriam', text: '우리도 미리암과 함께 소고를 쳐요! 박자를 잘 맞춰 봐요.',
        minigame: { kind: 'timing', title: '소고 박자 맞추기', prompt: '표시가 초록 칸에 올 때 소고를 쳐서 박자를 맞춰요 (5번)', icon: '🥁', art: 'miriam', fig: 'miriam', goal: 5, speed: 0.8, mood: 'triumph', win: 'free', bg: 0xe0b878 } },
      { id: 'free', bg: 0xd9a441, icon: '🎉', art: 'free', text: '이스라엘 백성은 이제 자유로운 사람들이 되었어요! 하나님이 이 백성을 이끄시고 광야에서 새 길을 열어 주실 거예요.', effects: { faith: 1, courage: 1, wisdom: 1 } },
      { id: 'end', bg: 0x3a2f4a, icon: '🚶', art: 'free', speaker: '모세', text: '모세와 백성은 이집트 땅을 뒤로하고 광야의 길로 나아갔어요. 앞으로 또 어떤 일이 기다리고 있을까요?', endChapter: true },
    ],
  },
  {
    id: 6, title: '광야의 모험', verse: '출애굽기 15–20', start: 'start',
    nodes: [
      { id: 'start', bg: 0xe0b878, icon: '🏜️', art: 'wilderness', music: 'desert', verse: '출애굽기 15:22', text: '홍해를 건넌 백성은 넓고 뜨거운 광야로 들어갔어요. 사흘 동안 물을 찾아 걸었지만, 마실 물이 하나도 없었어요.' },
      { id: 's2', bg: 0xe0b878, icon: '😫', art: 'marah_bitter', verse: '출애굽기 15:23', text: '드디어 마라라는 곳에 도착했어요. 그런데 물이 너무 써서 마실 수가 없었어요! 그래서 이름도 "마라(쓰다)"예요.' },
      { id: 'c1', bg: 0xe0b878, icon: '😫', art: 'marah_bitter', speaker: '백성', verse: '출애굽기 15:24', text: '"물이 써서 못 마시겠어요! 우리는 뭘 마시란 말이에요?" 백성들이 불평했어요. 모세는 어떻게 할까요?',
        choices: [
          { text: '🙏 불평하는 대신 하나님께 부르짖어 기도한다 (믿음 +1)', next: 'god1', effects: { faith: 1 } },
          { text: '💬 "조금만 참고 함께 기다려 봐요" 하고 달랜다 (지혜 +1)', next: 'god1', effects: { wisdom: 1 } },
        ] },
      { id: 'god1', bg: 0xe0b878, icon: '✨', art: 'marah_wood', music: 'holy', speaker: '하나님', verse: '출애굽기 15:25', text: '모세가 하나님께 부르짖자, 하나님이 나무 한 그루를 가리켜 보여 주셨어요. "저 나무를 물에 던져 보아라."' },
      { id: 'm1', bg: 0xe0b878, icon: '💧', art: 'marah_wood', text: '하나님이 가르쳐 주신 대로 해 봐요!',
        minigame: { kind: 'sequence', title: '쓴 물을 단물로', prompt: '하나님이 가르쳐 주신 순서대로 눌러요!', icon: '💧', art: 'marah_wood', bg: 0xe0b878, win: 'sweet',
          steps: ['🙏 하나님께 부르짖어 기도해요', '🌿 하나님이 가리키신 나무를 찾아요', '💧 나무를 물에 던져요', '🥤 단물을 모두 함께 마셔요'] } },
      { id: 'sweet', bg: 0xe0b878, icon: '💧', art: 'marah_sweet', sfx: 'chime', music: 'desert', verse: '출애굽기 15:25', text: '나무를 던지자 쓰던 물이 달콤한 물이 되었어요! 백성들은 마음껏 마시며 기뻐했어요.', effects: { faith: 1 } },
      { id: 'elim', bg: 0x9ad0e0, icon: '🌴', art: 'oasis', verse: '출애굽기 15:27', text: '그다음에는 엘림이라는 곳에 갔어요. 거기에는 샘이 열두 개나 있고 종려나무가 일흔 그루나 자라고 있었어요. 백성들은 그곳에서 푹 쉬었어요.' },

      { id: 'hungry', bg: 0xe0b878, icon: '😩', art: 'wilderness', music: 'tense', verse: '출애굽기 16:2-3', text: '한 달쯤 지나자 이번에는 먹을 것이 떨어졌어요. 백성들은 "이집트에서는 고기도 빵도 실컷 먹었는데!" 하고 또 불평했어요.' },
      { id: 'god2', bg: 0xe0b878, icon: '✨', art: 'wilderness', speaker: '하나님', verse: '출애굽기 16:4', text: '"내가 하늘에서 양식을 비처럼 내려 주겠다. 날마다 그날 먹을 만큼만 거두어라."' },
      { id: 'quail', bg: 0xe0b878, icon: '🐦', art: 'quail', music: 'desert', sfx: 'whoosh', verse: '출애굽기 16:13', text: '그날 저녁, 메추라기 떼가 날아와 진 안을 가득 덮었어요. 백성들은 고기를 먹을 수 있었어요!' },
      { id: 'manna0', bg: 0xe0d890, icon: '🍞', art: 'manna', verse: '출애굽기 16:14-15', text: '아침이 되자 땅 위에 서리 같은 하얗고 작은 것이 내려 있었어요. 백성들이 서로 물었어요. "이게 뭐지?" 그것이 바로 "만나"예요.' },
      { id: 'm2', bg: 0xe0d890, icon: '🍞', art: 'manna_field', text: '아침이에요! 하늘에서 내려온 만나를 거두어요.',
        minigame: { kind: 'tap', title: '만나 거두기', prompt: '하늘에서 내려온 만나를 눌러서 거두어요! 🐛 벌레 먹은 것은 누르면 안 돼요! (10개)', icon: '🍞', bad: '🐛', art: 'manna_field', goal: 10, time: 20, win: 'manna_r', bg: 0xe0d890 } },
      { id: 'manna_r', bg: 0xe0d890, icon: '🍞', art: 'manna', sfx: 'chime', verse: '출애굽기 16:19-26', text: '하나님은 날마다 꼭 필요한 만큼만 주셨어요. 욕심을 내서 남겨 두면 벌레가 생겼어요. 여섯째 날에는 이틀 치를 주셔서, 일곱째 날에는 모두 쉴 수 있었어요.', effects: { wisdom: 1 } },

      { id: 'thirst', bg: 0xe0b878, icon: '😫', art: 'rock_dry', music: 'tense', verse: '출애굽기 17:1-3', text: '르비딤에 이르렀지만 또다시 마실 물이 없었어요. 백성들이 모세에게 크게 불평했어요. 모세는 하나님께 간절히 기도했어요.' },
      { id: 'god3', bg: 0xe0b878, icon: '✨', art: 'rock_dry', music: 'holy', speaker: '하나님', verse: '출애굽기 17:5-6', text: '"지팡이를 들고 백성 앞에 서라. 내가 호렙의 바위 위에 서 있겠다. 네가 바위를 치면 물이 나올 것이다."' },
      { id: 'm3', bg: 0xe0b878, icon: '💧', art: 'rock', text: '모세가 바위 앞에 섰어요. 지팡이로 바위를 칠 시간이에요!',
        minigame: { kind: 'timing', title: '반석을 치다', prompt: '표시가 초록 칸에 있을 때 "바위 치기!"를 눌러요 (3번)', icon: '💧', art: 'rock', goal: 3, btn: '🪨 바위 치기!', mood: 'holy', win: 'rock_r', bg: 0xe0b878 } },
      { id: 'rock_r', bg: 0xe0b878, icon: '💧', art: 'rock_water', sfx: 'splash', music: 'desert', verse: '출애굽기 17:6', text: '바위에서 맑은 물이 콸콸 흘러나왔어요! 백성도 짐승도 모두 시원하게 마셨어요.', effects: { faith: 1 } },

      { id: 'amalek0', bg: 0xd9a070, icon: '⚔️', art: 'amalek', music: 'battle', verse: '출애굽기 17:8-9', text: '그때 아말렉 사람들이 쳐들어와 이스라엘과 싸우려 했어요! 모세가 여호수아에게 말했어요. "용사들을 뽑아 나가 싸우세요. 나는 내일 하나님의 지팡이를 들고 산꼭대기에 서 있겠어요."' },
      { id: 'hill', bg: 0xd9a070, icon: '⛰️', art: 'raise', verse: '출애굽기 17:10-11', text: '모세는 아론, 훌과 함께 산꼭대기에 올랐어요. 모세가 팔을 높이 들면 이스라엘이 이기고, 팔이 내려오면 아말렉이 이겼어요!' },
      { id: 'm4', bg: 0xd9a070, icon: '💪', art: 'hill_empty', text: '모세의 팔이 내려가지 않게 도와줘요! 꾹 누르고 있어도 되고, 톡톡 눌러도 돼요.',
        minigame: { kind: 'raise', title: '팔을 높이 들어요', prompt: '화면을 꾹 누르거나 톡톡 눌러서 지팡이를 높이 들고 있어요! 팔이 내려가면 안 돼요!', icon: '💪', art: 'hill_empty', time: 20, mood: 'battle', win: 'raise_r', bg: 0xd9a070 } },
      { id: 'raise_r', bg: 0xd9a070, icon: '🎉', art: 'raise_win', music: 'triumph', sfx: 'win', verse: '출애굽기 17:12-13', text: '모세의 팔이 무거워지자, 아론과 훌이 돌을 놓아 앉게 하고 양쪽에서 팔을 붙들어 주었어요. 팔이 해 질 때까지 내려오지 않았고, 여호수아가 아말렉을 물리쳤어요! 서로 도우면 어려운 일도 이길 수 있어요.', effects: { courage: 1, faith: 1 } },

      { id: 'sinai1', bg: 0x6a5a8a, icon: '⛰️', art: 'sinai', music: 'holy', sfx: 'thunder', verse: '출애굽기 19:1-2, 16', text: '석 달째 되던 날, 백성들은 시내 산 앞에 이르렀어요. 산에는 짙은 구름이 덮이고 천둥과 번개가 치고, 나팔 소리가 크게 울렸어요. 백성들은 모두 두려워 떨었어요.' },
      { id: 'sinai2', bg: 0x6a5a8a, icon: '✨', art: 'sinai_moses', speaker: '하나님', verse: '출애굽기 19:5-6', text: '모세가 산 위로 올라가자 하나님이 말씀하셨어요. "너희가 내 말을 잘 듣고 내 약속을 지키면, 너희는 모든 백성 가운데서 내게 특별한 백성이 될 것이다."' },
      { id: 'c2', bg: 0x6a5a8a, icon: '🙋', art: 'sinai', speaker: '백성', verse: '출애굽기 19:8', text: '"여호와께서 말씀하신 것을 우리가 다 하겠습니다!" 백성들이 입을 모아 대답했어요. 모세는 어떻게 할까요?',
        choices: [
          { text: '🙏 백성들의 대답을 하나님께 그대로 전한다 (믿음 +1)', next: 'law', effects: { faith: 1 } },
          { text: '🤝 말씀을 지킬 수 있게 서로 돕자고 말해 준다 (지혜 +1)', next: 'law', effects: { wisdom: 1 } },
        ] },
      { id: 'law', bg: 0x6a5a8a, icon: '📜', art: 'tablets', speaker: '하나님', verse: '출애굽기 20:1-3', text: '하나님이 모세에게 열 가지 계명을 주셨어요. 앞의 네 가지는 하나님을 사랑하는 방법이에요.' },
      { id: 'm5', bg: 0x6a5a8a, icon: '📜', art: 'tablets', text: '하나님이 주신 첫째부터 넷째 계명을 순서대로 기억해 봐요!',
        minigame: { kind: 'sequence', title: '십계명 순서 맞추기', prompt: '첫째부터 넷째 계명을 순서대로 눌러요!', icon: '📜', art: 'tablets', mood: 'holy', bg: 0x6a5a8a, win: 'law_r',
          steps: ['첫째, 하나님 외에 다른 신을 두지 말아요', '둘째, 우상을 만들어 섬기지 말아요', '셋째, 하나님의 이름을 함부로 부르지 말아요', '넷째, 안식일을 기억하고 거룩하게 지켜요'] } },
      { id: 'law_r', bg: 0x6a5a8a, icon: '📜', art: 'tablets', verse: '출애굽기 20:12-17', text: '나머지 여섯 계명은 사람들과 사이좋게 지내는 방법이에요. 부모님을 공경하고, 해치지 않고, 가정을 소중히 지키고, 훔치지 않고, 거짓말하지 않고, 남의 것을 탐내지 말라고 하셨어요.', effects: { faith: 1, wisdom: 1 } },
      { id: 'gift', bg: 0xe0b878, icon: '💛', art: 'wilderness', music: 'desert', verse: '출애굽기 31:18', text: '하나님은 이 말씀을 돌판에 써서 모세에게 주셨어요. 하나님의 사랑과 약속이 가득 담긴 선물이었어요.' },
      { id: 'end', bg: 0x3a2f4a, icon: '🌅', art: 'wilderness', speaker: '모세', text: '모세와 백성들은 시내 산 아래에서 하나님의 말씀을 마음에 새겼어요. 그리고 약속의 땅을 향해 다시 길을 떠났어요. (다음 이야기: 약속의 땅을 향해 — 곧 만나요!)', endChapter: true },
    ],
  },
];

// 재앙 한 편 = 경고(a) → 미니게임(m) → 결과(r)
function plague(n: number, p: {
  icon: string; bg: number; verse: string; title: string; warn: string;
  mini: Omit<MiniGame, 'title' | 'win' | 'plague' | 'bg'>; result: string; effects?: Effects;
  art?: string; music?: Mood; sfx?: Sfx;
}, skipIntro = false): StoryNode[] {
  const intro: StoryNode[] = skipIntro ? [] : [
    { id: `p${n}a`, bg: p.bg, icon: p.icon, art: p.art, music: p.music, plague: n, speaker: '모세', verse: p.verse, text: p.warn },
  ];
  return [
    ...intro,
    { id: `p${n}m`, bg: p.bg, icon: p.icon, art: p.art, plague: n, text: skipIntro ? p.warn : `${n}번째 재앙: ${p.title}!`,
      minigame: { art: p.art, ...p.mini, title: p.title, plague: n, bg: p.bg, win: `p${n}r` } },
    { id: `p${n}r`, bg: p.bg, icon: p.icon, art: p.art, plague: n, verse: p.verse, text: p.result, effects: p.effects, sfx: p.sfx },
  ];
}
