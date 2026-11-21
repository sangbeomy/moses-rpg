# 모세 이야기 RPG

성경 속 인물들의 이야기를 아이들과 함께 즐기는 한국어 RPG. 1장은 **모세** (출애굽기 2–4장).

## 개발
```
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 생성
```

## 구조
- `src/data/chapters.ts` — 이야기(대사, 선택지, 전투 연결). 새 장면은 여기에 추가
- `src/data/enemies.ts` — 적
- `src/scenes/` — Title / Card / Story / Battle (Phaser 3)
- 진행 상황은 브라우저 `localStorage`에 자동 저장

## 배포
- **Netlify**: 저장소 연결 → 빌드 `npm run build`, 게시 `dist` (`netlify.toml` 포함)
- **GitHub Pages**: Settings → Pages → Source를 *GitHub Actions*로 설정 (`.github/workflows/pages.yml`)

## 그림과 소리
- 그림은 모두 코드로 그린 벡터 일러스트입니다 (`src/art.ts`). 인물·소품·배경을 조합해서 장면을 만들어요.
  - 새 장면: `SC`에 한 줄 추가 → 이야기 노드의 `art: '장면이름'` 으로 연결
  - 모든 장면 미리보기: 주소 끝에 `?gallery=1` (2, 3, … 페이지)
- 음악과 효과음은 WebAudio로 만들어요 (`src/audio.ts`). 파일이 없고, 오른쪽 위 동그란 버튼으로 끌 수 있어요.
  - 노드에 `music: 'holy'` / `sfx: 'splash'` 를 쓰면 분위기와 소리를 바꿀 수 있어요.
- 진행 저장 키(`moses-rpg-save-v1`)와 이야기 노드 id는 바꾸지 않아요 — 업데이트 후에도 저장한 곳에서 이어서 할 수 있어요.
