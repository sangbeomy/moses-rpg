export type Stat = 'faith' | 'courage' | 'wisdom';
export type Effects = Partial<Record<Stat, number>>;

export interface Choice { text: string; next: string; effects?: Effects; flag?: string }

// 미니게임: 재앙마다 다른 방식으로 도전해요. 실패해도 괜찮아요 — 다시 도전하면 점점 쉬워져요.
export interface MiniGame {
  kind: 'timing' | 'tap' | 'dodge' | 'seek' | 'sequence';
  title: string;
  prompt: string;
  icon: string;              // 목표물/그림 (tap: 누를 것, dodge: 떨어지는 것, seek: 찾을 것)
  bad?: string;              // tap: 누르면 안 되는 것
  goal?: number;             // timing: 성공 횟수 / tap: 개수 / seek: 찾을 개수
  time?: number;             // 제한 시간(초): tap, dodge(버티는 시간), seek
  speed?: number;            // timing: 속도 배율
  steps?: string[];          // sequence: 올바른 순서
  win: string;               // 성공하면 갈 노드
  plague?: number;
  bg?: number;
}

export interface StoryNode {
  id: string;
  speaker?: string;          // 말하는 사람 (없으면 해설)
  text: string;
  bg?: number;               // 배경색 (0xRRGGBB)
  icon?: string;             // 큰 이모지 일러스트 (임시 그림)
  verse?: string;            // 성경 참조 (예: 출애굽기 2:11)
  effects?: Effects;
  next?: string;             // 생략하면 배열의 다음 노드로 이동
  choices?: Choice[];
  battle?: { enemy: string; win: string; lose: string };
  minigame?: MiniGame;
  plague?: number;           // 재앙 번호 (1~10) — 화면 위에 표시
  endChapter?: boolean;      // 챕터 끝
}

export interface Chapter { id: number; title: string; verse: string; start: string; nodes: StoryNode[] }

export interface Enemy { id: string; name: string; icon: string; hp: number; atk: number; intro: string }
