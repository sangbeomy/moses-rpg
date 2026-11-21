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
