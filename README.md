# LEGO — Virtual Scroll Interactive Portfolio (React + TypeScript)

> 브라우저 기본 스크롤 대신 **가상 스크롤(Virtual Scroll)** 을 구현해  
> 섹션 간 전환/애니메이션 타이밍을 일관되게 제어하는 인터랙티브 포트폴리오입니다.

## Demo
- Live: https://lego-x31y.vercel.app/
- Repo: https://github.com/Guhang-web/lego

---

## Tech Stack
- React + TypeScript
- Vite
- CSS (섹션별 분리)
- Custom Event 기반 스크롤 상태 전달 (`vscroll`)

---

## Key Architecture 

### 1. Virtual Scroll (App.tsx)
이 프로젝트는 실제 브라우저 스크롤 대신, 다음 구조로 “스크롤 느낌”을 직접 구현합니다.

- `wheel` 입력을 받아 목표 스크롤 값(`targetYRef`)을 갱신
- `requestAnimationFrame` 루프에서 현재 값(`currentYRef`)을 목표값으로 **부드럽게 보간(easing)**
- 결과를 콘텐츠 래퍼에 `translate3d`로 적용하여 화면을 이동시킴

```ts
el.style.transform = `translate3d(0, ${-currentYRef.current}px, 0)`;
```
### 2. Scroll State 공유 방식: CustomEvent

가상 스크롤의 현재 위치는 매 프레임 `CustomEvent`로 브로드캐스트합니다.
- dispatch:
  - `window.dispatchEvent(new CustomEvent("vscroll", { detail: { y } }))`
- 섹션 구독:
  - `window.addEventListener("vscroll", ...)`
또한 “이동/잠금” 같은 제어도 이벤트로 분리되어 있습니다.

- `vscroll:to` : 특정 y로 강제 이동
- `vscroll:lock` / `vscroll:unlock` : 휠 입력 잠금(예: 섹션 내부 연출이 끝날 때까지 고정)

---

### 3. Layout 측정/범위 제한

콘텐츠 높이를 측정해 최대 스크롤 범위(`maxYRef`)를 계산합니다.

- `contentHeight - viewportHeight` 로 최대 이동 가능 범위 산정
- `clamp()`로 `target/current` 값이 범위를 벗어나지 않도록 보정

---

## Page Composition (FullPageNav.tsx)

`FullPageNav`가 실제 페이지(섹션)를 조립합니다.

- `Section1~5` + `Footer`
- 각 섹션은 `<section id="sectionX">` 형태로 구분 (앵커 이동/네비게이션 연결에 유리)

---

## Sections Overview

### Section 1 — Intro (Video + Navigation)
- 배경 영상 기반 인트로 섹션
- 메뉴 네비게이션을 통해 섹션 이동의 진입점을 제공

### Section 2 — Parallax Object (LEGO Center Follow)
- 중앙 레고 이미지를 스크롤 진행도에 연동
- 스크롤에 따라 레고 이미지가 위/아래로 자연스럽게 이동하는 연출

### Section 3 — Wheel-based Slide Showcase
- 휠 입력 기반으로 슬라이드가 전환되는 구조
- 중앙 이미지는 Hover 인터랙션 제공
- 좌측(흑색) 이미지 클릭 시 다음 슬라이드로 이동하는 네비게이션 동작 포함

### Section 4 — Drop & Settle Animation
- 섹션 진입 시 레고 오브젝트들이 “떨어지는” 연출로 등장
- 각 오브젝트가 지정 위치로 안착하며 마무리되는 애니메이션

### Section 5 — Pop-out & Settle Animation
- Section4와 유사한 “안착” 컨셉이지만, 낙하가 아닌 “튀어나오는(pop-out)” 방식
- 이미지들이 등장 후 제자리로 정렬/안착되는 애니메이션

---

## File Structure

src/
- `App.tsx`
  - 가상 스크롤 코어 (wheel + RAF + transform)
  - `vscroll` 커스텀 이벤트 발행, `to/lock` 제어 수신
- `FullPageNav.tsx`
  - 섹션 조립(Section1~5, Footer)
- `section1.tsx ~ section5.tsx`
  - 섹션 단위 UI/연출
- `section1.css ~ section5.css`
  - 섹션별 스타일
- `reset.css` / `index.css` / `App.css`
  - 전역/레이아웃 스타일
