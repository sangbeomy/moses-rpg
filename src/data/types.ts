export type Stat = 'faith' | 'courage' | 'wisdom';
export type Effects = Partial<Record<Stat, number>>;

export interface Choice { text: string; next: string; effects?: Effects; flag?: string }

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
  endChapter?: boolean;      // 챕터 끝
}

export interface Chapter { id: number; title: string; verse: string; start: string; nodes: StoryNode[] }

export interface Enemy { id: string; name: string; icon: string; hp: number; atk: number; intro: string }
