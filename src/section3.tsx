// section3.tsx
import React, { useEffect, useRef, useState } from "react";
import "./section3.css";
import { gsap } from "gsap";

/* ================== 공용 헬퍼 ================== */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// 활성 슬라이드가 될 때 내부 요소들의 α를 복구 (클릭 전환 후 하얀 화면 방지)
function resetSlideAlpha(slideEl: HTMLElement | null) {
  if (!slideEl) return;

  const centerImg = slideEl.querySelector<HTMLElement>(".section3Meddle .marvelImg");
  const leftGroup = slideEl.querySelector<HTMLElement>(".section3Left");
  const rightLogo = slideEl.querySelector<HTMLElement>(".disneyLogo1");
  const rightGhostImg = slideEl.querySelector<HTMLElement>(".disneyBlock img");

  gsap.set([centerImg, leftGroup, rightLogo, rightGhostImg], {
    clearProps: "opacity,visibility",
    autoAlpha: 1,
  });
}

// App(가상스크롤)로 특정 y 이동
function vscrollTo(y: number) {
  window.dispatchEvent(new CustomEvent("vscroll:to", { detail: { y } }));
}

// App(가상스크롤) 잠금/해제
function vscrollLock() {
  window.dispatchEvent(new Event("vscroll:lock"));
}
function vscrollUnlock() {
  window.dispatchEvent(new Event("vscroll:unlock"));
}

// 가상스크롤 기준 섹션 스냅 이동(상단/하단 정렬)
function scrollToSectionEdgeVirtual(selector: string, edge: "top" | "bottom", currentY: number) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  let target = currentY + rect.top;

  if (edge === "bottom") {
    target = target + el.offsetHeight - window.innerHeight;
  }

  target = Math.max(0, target);
  vscrollTo(target);
}

/* ================== 타입 ================== */
type LayoutVars = {
  leftTop?: number | string;
  leftLeft?: number | string;
  leftWidth?: number | string;
  leftGap?: number | string;

  centerW?: number | string;
  centerH?: number | string;

  vpTop?: number | string;
  vpRight?: number | string;
  vpSize?: number | string;

  rightBottom?: number | string;
  rightRight?: number | string;
  rightWidth?: number | string;

  disneyTop?: number | string;
  dLogoTop?: number | string;
  dLogoLeft?: number | string;
  dLogoSize?: number | string;

  logoW?: number | string;
  textFS?: number | string;
  textLH?: number | string;
  textMaxW?: number | string;

  logoTop?: number | string;
  logoLeft?: number | string;
  textTop?: number | string;
  textLeft?: number | string;

  centerMaxW?: number | string;
  centerMaxH?: number | string;
  centerX?: number | string;
  centerY?: number | string;
  centerScale?: number | string;

  rightImgW?: number | string;
  rightImgH?: number | string;
  rightImgTop?: number | string;
  rightImgLeft?: number | string;
  rightImgRight?: number | string;

  ghostOpacity?: number | string;
  ghostGray?: number | string;
};

type SlideData = {
  id?: string;
  logo: string;
  text: string;
  image: string;
  rightLogo?: string;
  rightGhost?: string;
  layout?: LayoutVars;
  layoutSm?: LayoutVars;
};

type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>;

const toVars = (v?: LayoutVars): CSSVarStyle => {
  const unit = (n?: number | string) => (n === undefined ? undefined : typeof n === "number" ? `${n}px` : n);

  return {
    ...(v?.leftTop !== undefined && { ["--left-top"]: unit(v.leftTop) }),
    ...(v?.leftLeft !== undefined && { ["--left-left"]: unit(v.leftLeft) }),
    ...(v?.leftWidth !== undefined && { ["--left-width"]: unit(v.leftWidth) }),
    ...(v?.leftGap !== undefined && { ["--left-gap"]: unit(v.leftGap) }),

    ...(v?.centerMaxW !== undefined && { ["--center-max-w"]: unit(v.centerMaxW) }),
    ...(v?.centerMaxH !== undefined && { ["--center-max-h"]: unit(v.centerMaxH) }),
    ...(v?.centerW !== undefined && { ["--center-w"]: unit(v.centerW) }),
    ...(v?.centerH !== undefined && { ["--center-h"]: unit(v.centerH) }),
    ...(v?.centerX !== undefined && { ["--center-x"]: unit(v.centerX) }),
    ...(v?.centerY !== undefined && { ["--center-y"]: unit(v.centerY) }),
    ...(v?.centerScale !== undefined && { ["--center-scale"]: v.centerScale }),

    ...(v?.vpTop !== undefined && { ["--vp-top"]: unit(v.vpTop) }),
    ...(v?.vpRight !== undefined && { ["--vp-right"]: unit(v.vpRight) }),
    ...(v?.vpSize !== undefined && { ["--vp-size"]: unit(v.vpSize) }),

    ...(v?.rightBottom !== undefined && { ["--right-bottom"]: unit(v.rightBottom) }),
    ...(v?.rightRight !== undefined && { ["--right-right"]: unit(v.rightRight) }),
    ...(v?.rightWidth !== undefined && { ["--right-width"]: unit(v.rightWidth) }),

    ...(v?.disneyTop !== undefined && { ["--disney-top"]: unit(v.disneyTop) }),
    ...(v?.dLogoTop !== undefined && { ["--dlogo-top"]: unit(v.dLogoTop) }),
    ...(v?.dLogoLeft !== undefined && { ["--dlogo-left"]: unit(v.dLogoLeft) }),
    ...(v?.dLogoSize !== undefined && { ["--dlogo-size"]: unit(v.dLogoSize) }),

    ...(v?.logoTop !== undefined && { ["--left-logo-top"]: unit(v.logoTop) }),
    ...(v?.logoLeft !== undefined && { ["--left-logo-left"]: unit(v.logoLeft) }),
    ...(v?.logoW !== undefined && { ["--logo-w"]: unit(v.logoW) }),

    ...(v?.textTop !== undefined && { ["--left-text-top"]: unit(v.textTop) }),
    ...(v?.textLeft !== undefined && { ["--left-text-left"]: unit(v.textLeft) }),
    ...(v?.textFS !== undefined && { ["--text-fs"]: unit(v.textFS) }),
    ...(v?.textLH !== undefined && { ["--text-lh"]: unit(v.textLH) }),
    ...(v?.textMaxW !== undefined && { ["--text-mw"]: unit(v.textMaxW) }),

    ...(v?.rightImgW !== undefined && { ["--right-img-w"]: unit(v.rightImgW) }),
    ...(v?.rightImgH !== undefined && { ["--right-img-h"]: unit(v.rightImgH) }),
    ...(v?.rightImgTop !== undefined && { ["--right-img-top"]: unit(v.rightImgTop) }),
    ...(v?.rightImgLeft !== undefined && { ["--right-img-left"]: unit(v.rightImgLeft) }),
    ...(v?.rightImgRight !== undefined && { ["--right-img-right"]: unit(v.rightImgRight) }),

    ...(v?.ghostOpacity !== undefined && { ["--ghost-opacity"]: v.ghostOpacity }),
    ...(v?.ghostGray !== undefined && {
      ["--ghost-gray"]: typeof v.ghostGray === "number" ? `${v.ghostGray}%` : v.ghostGray,
    }),
  };
};

/* ================== 유틸 ================== */
type LegacyMQL = {
  addListener: (listener: (ev: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (ev: MediaQueryListEvent) => void) => void;
};

function useIsMobile(bp = 768) {
  const [is, setIs] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const m = window.matchMedia(`(max-width:${bp}px)`);

    const onChange = (ev?: MediaQueryListEvent) => {
      // ev가 있으면 ev.matches, 없으면 현재 m.matches
      setIs(ev?.matches ?? m.matches);
    };

    // 최초 1회 동기화
    onChange();

    //  modern (표준)
    if (typeof m.addEventListener === "function" && typeof m.removeEventListener === "function") {
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    }

    //  legacy Safari fallback (deprecated지만 호환)
    const legacy = m as unknown as Partial<LegacyMQL>;
    const add = legacy.addListener;
    const remove = legacy.removeListener;

    if (typeof add === "function" && typeof remove === "function") {
      add.call(m, onChange);
      return () => remove.call(m, onChange);
    }

    return;
  }, [bp]);

  return is;
}

const mergeLayout = (base?: LayoutVars, override?: LayoutVars): LayoutVars => ({
  ...(base || {}),
  ...(override || {}),
});

/* ================== 데이터 ================== */
const baseSlides: SlideData[] = [
  {
    id: "marvel",
    logo: "/section3Img/marvelLogo.png",
    text: `마블 팬이라면 누구나 마음 속에<span class="br-m"></span> 자신만의 영웅 이야기가 있기 마련이죠.<br/>자신만의 세계를 만들고<span class="br-m"></span> 마음 속의 이야기를 한껏 펼쳐보세요!`,
    image: "/section3Img/marvelImg.png",
    rightLogo: "/section3Img/disneyLogo1.png",
    layout: { leftTop: 220, centerY: -6, textTop: 160, rightImgW: 340, rightImgTop: 70, rightImgLeft: 0 },
  },
  {
    id: "disney",
    logo: "/section3Img/disneyLogo2.png",
    text: `수십 년의 감성이 모여 완성되는 디즈니의 상징,<br/>정교한 디테일 속에 담긴 이야기를 <span class="br-m"></span>직접 만나보세요.`,
    image: "/section3Img/disneyImg.png",
    rightLogo: "/section3Img/ninjagoLogo1.png",
    layout: {
      leftTop: "14%",
      leftLeft: "13%",
      leftWidth: "24vw",
      leftGap: 20,
      textTop: "80%",
      centerH: "81.1vh",
      centerX: -30,
      centerY: 0,
      vpTop: 620,
      vpRight: 440,
      vpSize: 200,
      rightBottom: 80,
      rightRight: 0,
      rightWidth: "21.6vw",
      rightImgW: "21.6vw",
      rightImgTop: 130,
      rightImgRight: "6%",
      disneyTop: 110,
      dLogoTop: 220,
      dLogoLeft: -50,
      dLogoSize: 120,
    },
    layoutSm: {
      leftTop: "8%",
      leftLeft: "3%",
      leftWidth: "40vw",
      centerH: "50vh",
      centerX: 0,
      centerY: -40,
      vpTop: 360,
      vpRight: 24,
      vpSize: 140,
      rightRight: "-18%",
      rightWidth: "33vw",
      rightBottom: 0,
      rightImgW: "31vw",
      rightImgH: 150,
      rightImgTop: 30,
      rightImgLeft: "-20px",
    },
  },
  {
    id: "ninjago",
    logo: "/section3Img/ninjagoLogo2.png",
    text: `수많은 이야기와 닌자가 오가는 <span class="br-m"></span> 닌자고 시티의 중심,<br/>모험은 이곳에서 시작됩니다.`,
    image: "/section3Img/ninjagoImg.png",
    rightLogo: "/section3Img/starwarsLogo1.png",
    layout: {
      leftTop: "20%",
      leftLeft: "5%",
      leftWidth: "27vw",
      textTop: "160%",
      centerY: 20,
      vpTop: 200,
      vpRight: 0,
      vpSize: 200,
      rightBottom: 80,
      rightRight: 0,
      rightWidth: "30vw",
      rightImgW: "22vw",
      rightImgTop: 210,
      rightImgLeft: 0,
      disneyTop: 160,
      dLogoTop: 120,
      dLogoLeft: -10,
      dLogoSize: 120,
    },
    layoutSm: {
      leftTop: "13%",
      leftLeft: "6%",
      leftWidth: "40vw",
      centerY: "-20%",
      vpTop: 330,
      vpRight: 20,
      vpSize: 130,
      rightRight: "-33%",
      rightWidth: "50vw",
      rightImgH: "auto",
      rightImgW: "34vw",
      rightImgTop: 0,
      rightImgLeft: 10,
    },
  },
  {
    id: "starwars",
    logo: "/section3Img/starwarsLogo2.png",
    text: `세월을 넘어 사랑받아온 은하계 밀레니엄 팔콘,<br/>최고의 세팅과 압도적 디테일을<span class="br-m"></span> 지금 만나보세요.`,
    image: "/section3Img/starwarsImg.png",
    rightLogo: "/section3Img/cityLogo1.png",
    layout: {
      leftTop: 180,
      leftLeft: "5%",
      leftWidth: "27vw",
      textTop: 160,
      centerW: "43vw",
      centerX: 20,
      centerY: 170,
      vpTop: 460,
      vpRight: 85,
      vpSize: 200,
      rightBottom: 100,
      rightRight: -20,
      rightWidth: "30vw",
      rightImgW: "24vw",
      rightImgTop: 260,
      rightImgLeft: 0,
      disneyTop: 20,
      dLogoTop: 280,
      dLogoLeft: -20,
      dLogoSize: 131,
    },
    layoutSm: {
      leftTop: "20%",
      leftLeft: "10%",
      leftWidth: 380,
      textTop: "600%",
      centerW: "auto",
      centerH: "auto",
      centerX: 0,
      centerY: "5%",
      centerScale: 1,
      vpTop: 360,
      vpRight: 24,
      vpSize: 140,
      rightRight: 10,
      rightWidth: "20vw",
      rightImgW: "45vw",
      rightImgTop: 0,
      rightImgLeft: 0,
    },
  },
  {
    id: "city",
    logo: "/section3Img/cityLogo2.png",
    text: "거대한 임무를 가르고 나아가는 북극 탐사선,<br/>신비한 대자연 속에서 모험이 펼쳐집니다.",
    image: "/section3Img/cityImg.png",
    rightLogo: "/section3Img/harryPotterLogo1.png",
    layout: {
      leftTop: 150,
      leftLeft: "5%",
      leftWidth: "24vw",
      textTop: 160,
      textLeft: 80,
      centerW: "41vw",
      centerX: "-50px",
      centerY: 30,
      vpTop: 450,
      vpRight: 580,
      vpSize: 200,
      rightBottom: 130,
      rightRight: -20,
      rightWidth: "30vw",
      rightImgW: "23vw",
      rightImgTop: 260,
      rightImgLeft: -10,
      disneyTop: 10,
      dLogoTop: 320,
      dLogoLeft: 50,
      dLogoSize: 131,
    },
    layoutSm: {
      leftTop: "16%",
      leftLeft: "10%",
      leftWidth: 380,
      textTop: "430%",
      textLeft: 40,
      centerX: "3%",
      centerY: "-12%",
      centerW: "auto",
      centerH: "auto",
      vpTop: 340,
      vpRight: 24,
      vpSize: 140,
      rightRight: 12,
      rightWidth: 280,
      rightImgW: 240,
      rightImgTop: 60,
      rightImgLeft: 40,
    },
  },
  {
    id: "harry",
    logo: "/section3Img/harryPotterLogo2.png",
    text: "수많은 마법사의 꿈이 머물렀던 곳, 호그와트.<br/>신비로운 마법의 세계로 모험을 떠나보세요.",
    image: "/section3Img/harryPotterImg.png",
    layout: {
      leftTop: 180,
      leftLeft: "5%",
      leftWidth: "23vw",
      textTop: 100,
      textLeft: "17%",
      centerW: "40vw",
      centerX: -100,
      centerY: 0,
      vpTop: 402,
      vpRight: -125,
      vpSize: 200,
      rightBottom: 120,
      rightRight: 80,
    },
    layoutSm: {
      leftTop: "16%",
      leftLeft: "10%",
      leftWidth: 380,
      textLeft: 40,
      centerW: "auto",
      centerH: "auto",
      centerX: 0,
      centerY: "-20%",
      vpTop: 320,
      vpRight: 20,
      vpSize: 130,
      rightRight: 16,
    },
  },
];

const slides: SlideData[] = baseSlides.map((s, i, arr) => ({
  ...s,
  rightGhost: i < arr.length - 1 ? arr[i + 1].image : undefined,
}));

/* ================== 슬라이드 뷰 ================== */
type GhostClick = (imgEl: HTMLImageElement, index: number) => void;

function Section3Slide({
  id,
  logo,
  text,
  image,
  rightLogo,
  rightGhost,
  layout,
  layoutSm,
  onGhostClick,
  index,
}: SlideData & { onGhostClick?: GhostClick; index: number }) {
  const meddleRef = useRef<HTMLUListElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  const isMobile = useIsMobile(768);
  const effectiveLayout = isMobile ? mergeLayout(layout, layoutSm) : layout || {};

  const logoAbs = !isMobile && (effectiveLayout.logoTop !== undefined || effectiveLayout.logoLeft !== undefined);
  const textAbs = !isMobile && (effectiveLayout.textTop !== undefined || effectiveLayout.textLeft !== undefined);

  const onMove: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const wrap = meddleRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const rootCls = ["s3-slide", id ? `s3-${id}` : ""].filter(Boolean).join(" ");

  const cursorStyle: CSSVarStyle = {
    ["--cursor-x"]: `${cursor.x}px`,
    ["--cursor-y"]: `${cursor.y}px`,
  };

  return (
    <div className={rootCls} style={toVars(effectiveLayout)}>
      <ul className="section3Left">
        <img className={`marvelLogo ${logoAbs ? "abs" : ""}`} src={logo} alt="브랜드 로고" />
        <p className={`leftText ${textAbs ? "abs" : ""}`} dangerouslySetInnerHTML={{ __html: text }} />
      </ul>

      <ul
        ref={meddleRef}
        className={`section3Meddle ${active ? "cursor-mode" : ""}`}
        style={cursorStyle}
        onMouseEnter={() => {
          setActive(true);
          setHovering(true);
        }}
        onMouseLeave={() => {
          setActive(false);
          setHovering(false);
        }}
        onMouseMove={onMove}
      >
        <img className="marvelImg" src={image} alt="메인 이미지" />
        <li className={`viewPoint ${hovering ? "show" : ""}`}>
          <p>VIEW MORE</p>
        </li>
      </ul>

      <div className="section3Right">
        {(rightLogo || rightGhost) && (
          <ul className="disneyPoint">
            {rightLogo && (
              <li className="disneyLogo1">
                <img src={rightLogo} alt="우측 로고" />
              </li>
            )}

            {rightGhost && (
              <li className="disneyBlock">
                {isMobile ? (
                  <img src={rightGhost} alt="다음 장 프리뷰(표시용)" />
                ) : (
                  <img
                    src={rightGhost}
                    alt="다음 장 프리뷰(표시용)"
                    onClick={(e: React.MouseEvent<HTMLImageElement>) => onGhostClick?.(e.currentTarget, index)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ================== 컨트롤러 ================== */
export default function Section3() {
  const isMobile = useIsMobile(768);

  // 모바일
  const [mIndex, setMIndex] = useState(0);
  const mobStageRef = useRef<HTMLDivElement>(null);

  // 스와이프 refs (훅 규칙 준수)
  const swipeRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    locked: false, // 가로 스와이프 확정 여부
    fired: false, // 한 번 넘겼는지(중복 방지)
    pid: -1,
    captured: false, // 가로 확정 후에만 capture
  });

  // 데스크톱 refs
  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const clickingLockRef = useRef(false);

  const count = slides.length;

  const idxRef = useRef(0);
  const lockRef = useRef(false);
  const accRef = useRef(0);

  // 가상스크롤 현재 y
  const vYRef = useRef(0);

  // 스냅/핸드오프 중복 방지
  const handoffLockRef = useRef(false);

  // 가상 y 구독
  useEffect(() => {
    const onVscroll: EventListener = (ev) => {
      const ce = ev as CustomEvent<{ y: number }>;
      vYRef.current = ce.detail?.y ?? 0;
    };

    window.addEventListener("vscroll", onVscroll);
    return () => window.removeEventListener("vscroll", onVscroll);
  }, []);

  const applyDesktopIndex = (next: number) => {
    const stack = stackRef.current;
    if (!stack) return;

    const items = Array.from(stack.querySelectorAll<HTMLElement>(".s3-slide"));
    if (items.length === 0) return;

    const idx = clamp(next, 0, count - 1);
    idxRef.current = idx;

    items.forEach((el, i) => el.classList.toggle("is-active", i === idx));
    resetSlideAlpha(items[idx]);
  };

  /* ------------------------- 데스크톱: wheel-swipe + lock/unlock + vscroll:to 핸드오프 ------------------------- */
  useEffect(() => {
    const root = rootRef.current;
    const stack = stackRef.current;
    if (!root || !stack) return;

    // 모바일이면 데스크톱 로직 사용 X
    if (isMobile) {
      vscrollUnlock();
      return;
    }

    // 최초 인덱스
    applyDesktopIndex(idxRef.current ?? 0);

    // === 튜닝값 ===
    const ENTER_ZONE = 200;
    const ALIGN_EPS = 18;
    const EDGE_ACC_TH = 140;
    const SLIDE_ACC_TH = 60;
    const PRELOCK_ZONE = Math.min(360, window.innerHeight * 0.45);

    // section3 wheel 개입 여부를 "엄격하게" 판단
    const canHandleHere = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;

      const visible = rect.bottom > 0 && rect.top < vh;
      const nearTop = rect.top > -ENTER_ZONE && rect.top < ENTER_ZONE;
      const covering = rect.top <= 0 && rect.bottom >= vh;

      return visible && (nearTop || covering);
    };

    const onWheel: EventListener = (ev) => {
      const e = ev as WheelEvent;
      if (clickingLockRef.current) return;

      const dy = e.deltaY;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;

      // (1) PRE-LOCK: "진입 직전" 스킵 방지
      const approachingFromTop = dy > 0 && rect.top > 0 && rect.top < PRELOCK_ZONE;
      const approachingFromBottom = dy < 0 && rect.bottom < vh && rect.bottom > vh - PRELOCK_ZONE;

      if (approachingFromTop || approachingFromBottom) {
        e.preventDefault();
        vscrollLock();

        if (!handoffLockRef.current) {
          handoffLockRef.current = true;
          scrollToSectionEdgeVirtual("#section3", "top", vYRef.current);

          window.setTimeout(() => {
            handoffLockRef.current = false;
          }, 520);
        }
        return;
      }

      // (2) section3 내부/근처일 때만 개입
      if (!canHandleHere()) {
        vscrollUnlock();
        return;
      }

      vscrollLock();

      if (handoffLockRef.current) {
        e.preventDefault();
        return;
      }

      const alignedTop = Math.abs(rect.top) <= ALIGN_EPS;

      // 진입 스냅
      if (!alignedTop) {
        if (dy > 0 && rect.top > 0 && rect.top < ENTER_ZONE) {
          e.preventDefault();
          handoffLockRef.current = true;
          scrollToSectionEdgeVirtual("#section3", "top", vYRef.current);
          window.setTimeout(() => (handoffLockRef.current = false), 520);
          return;
        }

        if (dy < 0 && rect.top < 0 && rect.top > -ENTER_ZONE) {
          e.preventDefault();
          handoffLockRef.current = true;
          scrollToSectionEdgeVirtual("#section3", "top", vYRef.current);
          window.setTimeout(() => (handoffLockRef.current = false), 520);
          return;
        }
      }

      const idx = idxRef.current;
      const atFirstOut = idx === 0 && dy < 0;
      const atLastOut = idx === count - 1 && dy > 0;

      // 첫/마지막 핸드오프
      if (alignedTop && (atFirstOut || atLastOut)) {
        e.preventDefault();

        accRef.current += dy;
        if (Math.abs(accRef.current) < EDGE_ACC_TH) return;

        accRef.current = 0;
        handoffLockRef.current = true;

        if (atFirstOut) {
          scrollToSectionEdgeVirtual("#section2", "bottom", vYRef.current);
        } else {
          scrollToSectionEdgeVirtual("#section4", "top", vYRef.current);
        }

        window.setTimeout(() => {
          handoffLockRef.current = false;
          vscrollUnlock();
        }, 900);

        return;
      }

      // 내부 슬라이드 전환
      e.preventDefault();

      if (lockRef.current) return;

      accRef.current += dy;
      if (Math.abs(accRef.current) < SLIDE_ACC_TH) return;

      const dir = accRef.current > 0 ? 1 : -1;
      accRef.current = 0;

      lockRef.current = true;
      applyDesktopIndex(idx + dir);

      window.setTimeout(() => {
        lockRef.current = false;
      }, 520);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      vscrollUnlock();
      accRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, count]);

  /* ------------------------- 데스크톱: 우측 프리뷰 클릭 전환 ------------------------- */
  const handleGhostClick: GhostClick = (imgEl, index) => {
    const root = rootRef.current;
    const stack = stackRef.current;
    if (!root || !stack) return;

    const nextIndex = Math.min(index + 1, count - 1);

    if (nextIndex === index) {
      vscrollLock();
      scrollToSectionEdgeVirtual("#section4", "top", vYRef.current);
      return;
    }

    if (clickingLockRef.current) return;
    clickingLockRef.current = true;

    const slideEl = imgEl.closest(".s3-slide") as HTMLElement | null;
    if (!slideEl) {
      clickingLockRef.current = false;
      return;
    }

    const centerImg = slideEl.querySelector<HTMLElement>(".section3Meddle .marvelImg");
    const leftGroup = slideEl.querySelector<HTMLElement>(".section3Left");
    const rightLogo = slideEl.querySelector<HTMLElement>(".disneyLogo1");

    const rect = imgEl.getBoundingClientRect();

    gsap.set(imgEl, {
      position: "fixed",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      zIndex: 9999,
      pointerEvents: "none",
      willChange: "transform, opacity",
    });

    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight / 2;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = targetX - cx;
    const dy = targetY - cy;

    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(imgEl, { clearProps: "all" });
          applyDesktopIndex(nextIndex);
          clickingLockRef.current = false;
        },
      })
      .to([centerImg, leftGroup, rightLogo].filter(Boolean), { autoAlpha: 0.25, duration: 0.3 }, 0)
      .to(imgEl, { x: dx, y: dy, autoAlpha: 0, duration: 1.05 }, 0);
  };

  /* ------------------------- 모바일 전용: 점 클릭 + 스와이프 ------------------------- */
  const mobileJump = (to: number) => {
    if (to === mIndex) return;

    const slideEl = mobStageRef.current?.querySelector(".s3-slide") as HTMLElement | null;
    const centerImg = slideEl?.querySelector(".section3Meddle .marvelImg");
    const leftGroup = slideEl?.querySelector(".section3Left");
    const rightLogo = slideEl?.querySelector(".disneyLogo1");

    gsap
      .timeline()
      .to([centerImg, leftGroup, rightLogo].filter(Boolean), { autoAlpha: 0, duration: 0.25, ease: "power2.out" })
      .add(() => setMIndex(to))
      .add(() => {
        const next = mobStageRef.current?.querySelector(".s3-slide") as HTMLElement | null;
        const nCenter = next?.querySelector(".section3Meddle .marvelImg");
        const nLeft = next?.querySelector(".section3Left");
        const nRight = next?.querySelector(".disneyLogo1");

        gsap.fromTo([nCenter, nLeft, nRight].filter(Boolean), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      });
  };

  // 모바일 스와이프 핸들러
  const SWIPE_MIN_PX = 42; // 이 이상 움직이면 넘김
  const SWIPE_EDGE_LOCK = 8; // 방향 판단용

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isMobile) return;
    if (e.pointerType === "mouse") return;

    const s = swipeRef.current;
    s.active = true;
    s.locked = false;
    s.fired = false;
    s.captured = false;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.pid = e.pointerId;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isMobile) return;

    const s = swipeRef.current;
    if (!s.active || s.fired) return;

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    if (!s.locked) {
      if (adx < SWIPE_EDGE_LOCK && ady < SWIPE_EDGE_LOCK) return;

      if (adx > ady) {
        // 가로 스와이프 확정
        s.locked = true;

        if (!s.captured) {
          e.currentTarget.setPointerCapture?.(s.pid);
          s.captured = true;
        }
      } else {
        // 세로 스크롤 의도 → 브라우저에 맡기기
        s.active = false;

        if (s.captured) {
          try {
            e.currentTarget.releasePointerCapture?.(s.pid);
          } catch {
            // capture가 이미 해제된 상태 등은 무시
          }
        }
        s.captured = false;
        return;
      }
    }

    // 가로 스와이프 확정된 경우에만 브라우저 동작 방지
    e.preventDefault();

    if (adx >= SWIPE_MIN_PX) {
      s.fired = true;
      if (dx < 0) mobileJump(Math.min(mIndex + 1, count - 1)); // 왼쪽 = 다음
      else mobileJump(Math.max(mIndex - 1, 0)); // 오른쪽 = 이전
    }
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const s = swipeRef.current;

    if (s.captured) {
      try {
        e.currentTarget.releasePointerCapture?.(s.pid);
      } catch {
        // capture 해제가 이미 된 경우 등은 무시
      }
    }

    s.active = false;
    s.locked = false;
    s.fired = false;
    s.pid = -1;
    s.captured = false;
  };

  /* ------------------------- 모바일 ------------------------- */
  if (isMobile) {
    // 모바일에서 데스크톱 로직 잔여 lock 방지
    vscrollUnlock();

    return (
      <section id="section3" className="s3-sticky-host">
        <div className="s3-viewport">
          <div
            className="s3-stage"
            ref={mobStageRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <Section3Slide {...slides[mIndex]} index={mIndex} />
          </div>

          <nav className="MobbleCheek" aria-label="Slides">
            {Array.from({ length: count }).map((_, i) => {
              const activeDot = i === mIndex;
              return (
                <button
                  key={i}
                  type="button"
                  className={`mc-dot ${activeDot ? "is-active" : ""}`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={activeDot ? "page" : undefined}
                  onClick={() => mobileJump(i)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <circle cx="7" cy="7" r="5.5" className="mc-fg" />
                  </svg>
                </button>
              );
            })}
          </nav>
        </div>
      </section>
    );
  }

  /* ------------------------- 데스크톱 ------------------------- */
  return (
    <section id="section3" className="s3-sticky-host" ref={rootRef}>
      <div className="s3-viewport">
        <div className="s3-stage">
          <div className="s3-stack" ref={stackRef}>
            {slides.map((s, i) => (
              <Section3Slide key={s.id ?? i} {...s} index={i} onGhostClick={handleGhostClick} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
