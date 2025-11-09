// section3.tsx (모바일 점 네비 + 데스크톱 스크롤/클릭 전환 동기화 정리본)
import React, { useRef, useState, useEffect } from "react";
import "./section3.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ================== 공용 헬퍼 ================== */
// 스크롤러 기준으로 특정 엘리먼트의 top 위치 구하기
function getOffsetTopWithinScroller(scroller: HTMLElement | null, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  if (!scroller) return window.pageYOffset + rect.top; // window가 스크롤러
  const sRect = scroller.getBoundingClientRect();
  return scroller.scrollTop + (rect.top - sRect.top);
}

// 활성 슬라이드가 될 때 내부 요소들의 α를 복구 (클릭 전환 후 하얀 화면 방지)
function resetSlideAlpha(slideEl: HTMLElement | null) {
  if (!slideEl) return;
  const centerImg = slideEl.querySelector<HTMLElement>(".section3Meddle .marvelImg");
  const leftGroup = slideEl.querySelector<HTMLElement>(".section3Left");
  const rightLogo = slideEl.querySelector<HTMLElement>(".disneyLogo1");
  const rightGhostImg = slideEl.querySelector<HTMLElement>(".disneyBlock img"); // 우측 프리뷰
  gsap.set([centerImg, leftGroup, rightLogo, rightGhostImg], {
    clearProps: "opacity,visibility",
    autoAlpha: 1,
  });
}

/* ================== 타입 ================== */
export type LayoutVars = {
  leftTop?: number | string; leftLeft?: number | string; leftWidth?: number | string; leftGap?: number | string;
  centerW?: number | string; centerH?: number | string;
  vpTop?: number | string; vpRight?: number | string; vpSize?: number | string;
  rightBottom?: number | string; rightRight?: number | string; rightWidth?: number | string;
  disneyTop?: number | string; dLogoTop?: number | string; dLogoLeft?: number | string; dLogoSize?: number | string;
  logoW?: number | string; textFS?: number | string; textLH?: number | string; textMaxW?: number | string;
  logoTop?: number | string; logoLeft?: number | string; textTop?: number | string; textLeft?: number | string;
  centerMaxW?: number | string; centerMaxH?: number | string; centerX?: number | string; centerY?: number | string; centerScale?: number | string;
  rightImgW?: number | string; rightImgH?: number | string; rightImgTop?: number | string; rightImgLeft?: number | string; rightImgRight?: number | string;
  ghostOpacity?: number | string; ghostGray?: number | string;
};

export type SlideData = {
  id?: string;
  logo: string;
  text: string;
  image: string;
  rightLogo?: string;
  rightGhost?: string;
  layout?: LayoutVars;
  layoutSm?: LayoutVars;
};

export type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>;

const toVars = (v?: LayoutVars): CSSVarStyle => {
  const unit = (n?: number | string) => n === undefined ? undefined : (typeof n === "number" ? `${n}px` : n);
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
    ...(v?.ghostGray !== undefined && { ["--ghost-gray"]: typeof v.ghostGray === "number" ? `${v.ghostGray}%` : v.ghostGray }),
  };
};

/* ================== 유틸 ================== */
function useIsMobile(bp = 768) {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(`(max-width:${bp}px)`);
    const on = () => setIs(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, [bp]);
  return is;
}
const mergeLayout = (base?: LayoutVars, override?: LayoutVars): LayoutVars =>
  ({ ...(base || {}), ...(override || {}) });

/* ================== 데이터 ================== */
export const baseSlides: SlideData[] = [
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
      leftTop: "14%", leftLeft: "13%", leftWidth: "24vw",
      leftGap: 20, textTop: "80%", centerW: "28.7vw", centerH: "81.1vh",
      centerX: -30, centerY: 0, vpTop: 620, vpRight: 440, vpSize: 200,
      rightBottom: 80, rightRight: 0, rightWidth: "21.6vw", rightImgW: "21.6vw",
      rightImgTop: 130, rightImgRight: "6%", disneyTop: 110,
      dLogoTop: 220, dLogoLeft: -50, dLogoSize: 120,
    },
    layoutSm: {
      leftTop: "8%", leftLeft: "9%", leftWidth: "40vw", textTop: "360%",
      centerMaxW: 520, centerMaxH: 520, centerW: "100%", centerH: "50vh",
      centerX: "34%", centerY: -60,
      vpTop: 360, vpRight: 24, vpSize: 140,
      rightRight: "-18%", rightWidth: "33vw", rightBottom: 0,
      rightImgW: "31vw", rightImgH: 150, rightImgTop: 0, rightImgLeft: 10,
    }
  },
  {
    id: "ninjago",
    logo: "/section3Img/ninjagoLogo2.png",
    text: `수많은 이야기와 닌자가 오가는 <span class="br-m"></span> 닌자고 시티의 중심,<br/>모험은 이곳에서 시작됩니다.`,
    image: "/section3Img/ninjagoImg.png",
    rightLogo: "/section3Img/starwarsLogo1.png",
    layout: {
      leftTop: "20%", leftLeft: "5%", leftWidth: "27vw", textTop: "160%",
      centerW: "36vw", centerX: -100, centerY: 20, vpTop: 200,
      vpRight: 0, vpSize: 200, rightBottom: 80, rightRight: 0, rightWidth: "30vw",
      rightImgW: "22vw", rightImgTop: 210, rightImgLeft: 0,
      disneyTop: 160, dLogoTop: 120, dLogoLeft: -10, dLogoSize: 120,
    },
    layoutSm: {
      leftTop: "18%", leftLeft: "6%", leftWidth: "40vw", textTop: "820%",
      centerMaxW: 520, centerMaxH: 520, centerW: "100%", centerX: "13%", centerY: "-20%", vpTop: 330,
      vpRight: 20, vpSize: 130, rightRight: "-33%", rightWidth: "50vw", rightImgH: "auto", rightImgW: "34vw",
      rightImgTop: 0, rightImgLeft: 10,
    }
  },
  {
    id: "starwars",
    logo: "/section3Img/starwarsLogo2.png",
    text: `세월을 넘어 사랑받아온 은하계 밀레니엄 팔콘,<br/>최고의 세팅과 압도적 디테일을<span class="br-m"></span> 지금 만나보세요.`,
    image: "/section3Img/starwarsImg.png",
    rightLogo: "/section3Img/cityLogo1.png",
    layout: {
      leftTop: 180, leftLeft: "5%", leftWidth: "27vw", textTop: 160,
      centerW: "43vw", centerX: 20, centerY: 170,
      vpTop: 460, vpRight: 85, vpSize: 200,
      rightBottom: 100, rightRight: -20, rightWidth: "30vw",
      rightImgW: "24vw", rightImgTop: 260, rightImgLeft: 0,
      disneyTop: 20, dLogoTop: 280, dLogoLeft: -20, dLogoSize: 131,
    },
    layoutSm: {
      leftTop: "20%", leftLeft: "10%", leftWidth: 380, textTop: "600%",
      centerMaxW: 520, centerW: "auto", centerH: "auto",
      centerX: 0, centerY: "5%", centerScale: 1,
      vpTop: 360, vpRight: 24, vpSize: 140,
      rightRight: 10, rightWidth: "20vw",
      rightImgW: "45vw", rightImgTop: 0, rightImgLeft: 0,
    }
  },
  {
    id: "city",
    logo: "/section3Img/cityLogo2.png",
    text: "거대한 임무를 가르고 나아가는 북극 탐사선,<br/>신비한 대자연 속에서 모험이 펼쳐집니다.",
    image: "/section3Img/cityImg.png",
    rightLogo: "/section3Img/harryPotterLogo1.png",
    layout: {
      leftTop: 150, leftLeft: "5%", leftWidth: "24vw", textTop: 160, textLeft: 80,
      centerW: "41vw", centerX: 0, centerY: 30,
      vpTop: 450, vpRight: 580, vpSize: 200,
      rightBottom: 130, rightRight: -20, rightWidth: "30vw",
      rightImgW: "23vw", rightImgTop: 260, rightImgLeft: -10,
      disneyTop: 10, dLogoTop: 320, dLogoLeft: 50, dLogoSize: 131,
    },
    layoutSm: {
      leftTop: "16%", leftLeft: "10%", leftWidth: 380, textTop: "400%", textLeft: 40,
      centerMaxW: 600, centerMaxH: 600, centerX: "3%", centerY: "-12%", centerW: "auto", centerH: "auto",
      vpTop: 340, vpRight: 24, vpSize: 140,
      rightRight: 12, rightWidth: 280,
      rightImgW: 240, rightImgTop: 60, rightImgLeft: 40,
    }
  },
  {
    id: "harry",
    logo: "/section3Img/harryPotterLogo2.png",
    text: "수많은 마법사의 꿈이 머물렀던 곳, 호그와트.<br/>신비로운 마법의 세계로 모험을 떠나보세요.",
    image: "/section3Img/harryPotterImg.png",
    layout: {
      leftTop: 180, leftLeft: "5%", leftWidth: "23vw", textTop: 140, textLeft: "17%",
      centerW: "40vw", centerX: 0, centerY: 0,
      vpTop: 402, vpRight: -125, vpSize: 200,
      rightBottom: 120, rightRight: 80,
    },
    layoutSm: {
      leftTop: "16%", leftLeft: "10%", leftWidth: 380, textTop: "530%", textLeft: 40,
      centerMaxW: 520, centerW: "auto", centerH: "auto", centerX: 0, centerY: "-20%",
      vpTop: 320, vpRight: 20, vpSize: 130,
      rightRight: 16,
    }
  },
];

export const slides: SlideData[] = baseSlides.map((s, i, arr) => ({
  ...s,
  rightGhost: i < arr.length - 1 ? arr[i + 1].image : undefined,
}));

/* ================== 슬라이드 뷰 ================== */
type GhostClick = (imgEl: HTMLImageElement, index: number) => void;

export function Section3Slide({
  id, logo, text, image, rightLogo, rightGhost, layout, layoutSm,
  onGhostClick, index,
}: SlideData & { onGhostClick?: GhostClick; index?: number }) {
  const meddleRef = useRef<HTMLUListElement>(null);
  const centralImgRef = useRef<HTMLImageElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  const isMobile = useIsMobile(768);
  const effectiveLayout = isMobile ? mergeLayout(layout, layoutSm) : (layout || {});

  const onMove: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const wrap = meddleRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const rootCls = ["s3-slide", id ? `s3-${id}` : ""].filter(Boolean).join(" ");

  return (
    <div className={rootCls} style={toVars(effectiveLayout)}>
      {/* 좌측 */}
      <ul className="section3Left">
        <img
          className={`marvelLogo ${(effectiveLayout?.logoTop !== undefined || effectiveLayout?.logoLeft !== undefined) ? "abs" : ""}`}
          src={logo}
          alt="브랜드 로고"
        />
        <p
          className={`leftText ${(effectiveLayout?.textTop !== undefined || effectiveLayout?.textLeft !== undefined) ? "abs" : ""}`}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </ul>

      {/* 가운데 */}
      <ul
        ref={meddleRef}
        className={`section3Meddle ${active ? "cursor-mode" : ""}`}
        style={{ ["--cursor-x"]: `${cursor.x}px`, ["--cursor-y"]: `${cursor.y}px` } as CSSVarStyle}
        onMouseEnter={() => { setActive(true); setHovering(true); }}
        onMouseLeave={() => { setActive(false); setHovering(false); }}
        onMouseMove={onMove}
      >
        <img ref={centralImgRef} className="marvelImg" src={image} alt="메인 이미지" />
        <li className={`viewPoint ${hovering ? "show" : ""}`}><p>VIEW MORE</p></li>
      </ul>

      {/* 우측 프리뷰 */}
      <div className="section3Right">
        {(rightLogo || rightGhost) && (
          <ul className="disneyPoint">
            {rightLogo && <li className="disneyLogo1"><img src={rightLogo} alt="우측 로고" /></li>}
            {rightGhost && (
              <li className="disneyBlock">
                {isMobile ? (
                  // 모바일: 클릭 이벤트 제거
                  <img src={rightGhost} alt="다음 장 프리뷰(표시용)" />
                ) : (
                  // 데스크톱: 클릭 전환
                  <img
                    src={rightGhost}
                    alt="다음 장 프리뷰(표시용)"
                    onClick={(e) => onGhostClick?.(e.currentTarget as HTMLImageElement, index ?? 0)}
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

  // 공용 훅(조건문 밖에서 선언)
  const [mIndex, setMIndex] = useState(0);             // 모바일 현재 인덱스
  const mobStageRef = useRef<HTMLDivElement>(null);    // 모바일 슬라이드 래퍼
  const rootRef = useRef<HTMLElement>(null);           // 데스크톱 섹션 루트
  const stackRef = useRef<HTMLDivElement>(null);       // 데스크톱 스택 컨테이너
  const clickingLockRef = useRef(false);               // 데스크톱 클릭 전환 락
  const count = slides.length;

  // 실제 스크롤 컨테이너 탐지(데스크톱)
  function getScrollParent(el: HTMLElement | null): HTMLElement | null {
    let cur = el?.parentElement || null;
    while (cur) {
      const s = getComputedStyle(cur);
      const canScrollY = /(auto|scroll|overlay)/.test(s.overflowY) && cur.scrollHeight > cur.clientHeight;
      if (canScrollY) return cur;
      cur = cur.parentElement;
    }
    return null; // 없으면 window
  }

  // 전환 임계값: 앞 구간 빠르게, 마지막(해리) 길게
  function makeThresholds(count: number, opts: { earlyBias?: number; tailBoost?: number } = {}): number[] {
    const { earlyBias = 0.85, tailBoost = 0.18 } = opts;
    if (count <= 1) return [0];
    const base = 1 / count;
    const head = Array.from({ length: count - 1 }, () => base * earlyBias);
    const used = head.reduce((a, b) => a + b, 0);
    const last = Math.max(0, 1 - used) + tailBoost;
    const sum = used + last;
    const normHead = head.map(v => v / sum);
    const normLast = last / sum;
    const thresholds: number[] = [];
    let acc = 0;
    for (let i = 0; i < count; i++) {
      thresholds.push(acc);
      acc += i < count - 1 ? normHead[i] : normLast;
    }
    return thresholds;
  }

  // thresholds → 각 슬라이드 구간의 '중앙' 배열
  function makeCentersFromThresholds(thresholds: number[]): number[] {
    const centers: number[] = [];
    for (let i = 0; i < thresholds.length; i++) {
      const start = thresholds[i];
      const end = i < thresholds.length - 1 ? thresholds[i + 1] : 1;
      centers.push(start + (end - start) / 2);
    }
    centers[centers.length - 1] = Math.min(centers[centers.length - 1], 0.995);
    return centers;
  }

  /* ------------------------- 데스크톱: 스크롤 전환 ------------------------- */
  useEffect(() => {
    const root = rootRef.current;
    const stack = stackRef.current;
    if (!root || !stack) return;
    if (isMobile) return; // 모바일은 스크롤 전환 비활성

    const items = Array.from(stack.querySelectorAll<HTMLElement>(".s3-slide"));
    items.forEach((el, i) => el.classList.toggle("is-active", i === 0));

    const scrollerEl = getScrollParent(root);

    const ctx = gsap.context(() => {
      const total = count * window.innerHeight;

      gsap.to({}, {
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + total,
          scrub: 0.2,
          invalidateOnRefresh: true,
          ...(scrollerEl ? { scroller: scrollerEl } : {}),
          onUpdate: (self) => {
            if (clickingLockRef.current) return; // 클릭 전환 중에는 스킵
            const idx = Math.round(self.progress * (count - 1));
            items.forEach((el, i) => el.classList.toggle("is-active", i === idx));
            resetSlideAlpha(items[idx]); // 활성 슬라이드 α 복구
          },
        }
      });
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    (scrollerEl ?? window).addEventListener("scroll", onResize, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);

    return () => {
      (scrollerEl ?? window).removeEventListener("scroll", onResize);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      ctx.revert();
    };
  }, [isMobile, count]);

  /* ------------------------- 데스크톱: 우측 프리뷰 클릭 전환 ------------------------- */
  const handleGhostClick: GhostClick = (imgEl, index) => {
    const root = rootRef.current!;
    const stack = stackRef.current!;
    const scrollerEl = getScrollParent(root);
    const scroller = (scrollerEl as any) ?? document.scrollingElement ?? document.documentElement;

    const nextIndex = Math.min(index + 1, count - 1);

    // 마지막(해리)에서 클릭하면 바로 Section4로 핸드오프
    if (nextIndex === index) {
      const s4 = document.querySelector<HTMLElement>("#section4");
      if (s4) {
        const top = getOffsetTopWithinScroller(scrollerEl, s4);
        gsap.to(scroller, { scrollTop: top, duration: 0.8, ease: "power2.inOut" });
      }
      return;
    }

    const slideEl = imgEl.closest(".s3-slide") as HTMLElement | null;
    if (!slideEl) return;

    const centerImg = slideEl.querySelector<HTMLElement>(".section3Meddle .marvelImg");
    const leftGroup = slideEl.querySelector<HTMLElement>(".section3Left");
    const rightLogo = slideEl.querySelector<HTMLElement>(".disneyLogo1");

    if (clickingLockRef.current) return;
    clickingLockRef.current = true;

    // img 자체를 고정 포지셔닝으로 띄워 이동 (복제 X, 스케일 X)
    const rect = imgEl.getBoundingClientRect();
    gsap.set(imgEl, {
      position: "fixed", left: rect.left, top: rect.top,
      width: rect.width, height: rect.height, zIndex: 9999, pointerEvents: "none",
      willChange: "transform, opacity",
    });

    // 목표: 화면 중앙 좌표
    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight / 2;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = targetX - cx;
    const dy = targetY - cy;

    const slidesEls = Array.from(stack.querySelectorAll<HTMLElement>(".s3-slide"));
    const total = count * window.innerHeight;
    const thresholds = makeThresholds(count, { earlyBias: 0.85, tailBoost: 0.20 });
    const centers = makeCentersFromThresholds(thresholds);
    const sectionTop = getOffsetTopWithinScroller(scrollerEl, root);
    const targetScroll = sectionTop + centers[nextIndex] * total; // 구간 '중앙'으로 이동

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(imgEl, { clearProps: "all" }); // 인라인 스타일 완전 초기화
        // 스크롤을 중앙 위치로 → ScrollTrigger 동기화 정확
        gsap.to(scroller, {
          scrollTop: targetScroll,
          duration: 0.75,
          ease: "power2.inOut",
          onUpdate: () => ScrollTrigger.update(),
          onComplete: () => { clickingLockRef.current = false; }
        });
      },
    });

    // 현재 슬라이드 요소를 살짝 어둡게(완전 0으로 안 내림 → 복구 안전)
    tl.to([centerImg, leftGroup, rightLogo].filter(Boolean), { autoAlpha: 0.25, duration: 0.3 }, 0);
    // 우측 프리뷰: 가운데로 이동 + 서서히 사라짐 (스케일 X)
    tl.to(imgEl, { x: dx, y: dy, autoAlpha: 0, duration: 1.05 }, 0);
    // 중간 타이밍에 다음 슬라이드 활성화 + α 복구
    tl.add(() => {
      slidesEls.forEach((el, i) => el.classList.toggle("is-active", i === nextIndex));
      resetSlideAlpha(slidesEls[nextIndex]);
    }, 0.35);
  };

  /* ------------------------- 모바일 전용 분기 ------------------------- */
  if (isMobile) {
    // 모바일 점프(점 네비) 전환
    const mobileJump = (to: number) => {
      if (to === mIndex) return;
      const slideEl = mobStageRef.current?.querySelector(".s3-slide") as HTMLElement | null;
      const centerImg = slideEl?.querySelector(".section3Meddle .marvelImg");
      const leftGroup = slideEl?.querySelector(".section3Left");
      const rightLogo = slideEl?.querySelector(".disneyLogo1");

      gsap.timeline()
        .to([centerImg, leftGroup, rightLogo].filter(Boolean), { autoAlpha: 0, duration: 0.25, ease: "power2.out" })
        .add(() => setMIndex(to))
        .add(() => {
          const next = mobStageRef.current?.querySelector(".s3-slide") as HTMLElement | null;
          const nCenter = next?.querySelector(".section3Meddle .marvelImg");
          const nLeft = next?.querySelector(".section3Left");
          const nRight = next?.querySelector(".disneyLogo1");
          gsap.fromTo([nCenter, nLeft, nRight].filter(Boolean),
            { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
        });
    };

    // 현재 활성 슬라이드 렌더 + 모바일 점 네비 (모바일에선 onGhostClick 전달 안 함)
    return (
      <section id="section3" className="s3-sticky-host">
        <div className="s3-viewport">
          <div className="s3-stage" ref={mobStageRef}>
            <Section3Slide
              {...slides[mIndex]}
              index={mIndex}
            />
          </div>

          {/* 모바일 점 네비 */}
          <nav className="MobbleCheek" aria-label="Slides">
            {Array.from({ length: count }).map((_, i) => {
              const active = i === mIndex;
              return (
                <button
                  key={i}
                  type="button"
                  className={`mc-dot ${active ? "is-active" : ""}`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "page" : undefined}
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

  /* ------------------------- 데스크톱(기존) ------------------------- */
  return (
    <section
      id="section3"
      className="s3-sticky-host"
      ref={rootRef}
      style={{ ["--s3-steps" as any]: count }}
    >
      <div className="s3-viewport">
        <div className="s3-stage">
          <div className="s3-stack" ref={stackRef}>
            {slides.map((s, i) => (
              <Section3Slide
                key={s.id ?? i}
                {...s}
                index={i}
                onGhostClick={handleGhostClick}  // 데스크톱만 클릭 전환
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
