import type { Chapter } from './types';

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
      { id: 'end', bg: 0x3a2f4a, icon: '🚶', text: '모세는 아론과 함께 다시 이집트를 향해 길을 떠났어요. (다음 이야기: 열 가지 재앙 — 곧 만나요!)', endChapter: true },
    ],
  },
];
