// section3.tsx (Wheel 전용 전환 버전)
import React, { useRef, useState, useCallback, useEffect } from "react";
import "./section3.css";

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
  const unit = (n?: number | string) =>
    n === undefined ? undefined : (typeof n === "number" ? `${n}px` : n);
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
    layout: { leftTop: 220, centerY: -6, textTop: 160, rightImgW: 340, rightImgH: 484, rightImgTop: 70, rightImgLeft: 0 },
  },
  {
    id: "disney",
    logo: "/section3Img/disneyLogo2.png",
    text: `수십 년의 감성이 모여 완성되는 디즈니의 상징,<br/>정교한 디테일 속에 담긴 이야기를 <span class="br-m"></span>직접 만나보세요.`,
    image: "/section3Img/disneyImg.png",
    rightLogo: "/section3Img/ninjagoLogo1.png",
    layout: {
      leftTop: "14%", leftLeft: "13%", leftWidth: "24vw",
      leftGap: 20, textTop: 220, centerW: "28.7vw", centerH: "81.1vh",
      centerX: -30, centerY: 0, vpTop: 620, vpRight: 440, vpSize: 200,
      rightBottom: 80, rightRight: 0, rightWidth: "21.6vw", rightImgW: "21.6vw",
      rightImgH: "43.3vh", rightImgTop: 130, rightImgRight: "6%", disneyTop: 110,
      dLogoTop: 220, dLogoLeft: -50, dLogoSize: 120,
    },
    layoutSm: {
      leftTop: "8%", leftLeft: "9%", leftWidth: "40vw", textTop: "150%",
      centerMaxW: 520, centerMaxH: 520,  centerW: "100%", centerH: "81.1vh",
       centerX: "38%", centerY: "-15%",
      vpTop: 360, vpRight: 24, vpSize: 140,
      rightRight: "-18%", rightWidth: "33vw",rightBottom: "16%",
      rightImgW: "31vw", rightImgTop: 65, rightImgLeft: 10,
    }
  },
  {
    id: "ninjago",
    logo: "/section3Img/ninjagoLogo2.png",
    text: `수많은 이야기와 닌자가 오가는 <span class="br-m"></span> 닌자고 시티의 중심,<br/>모험은 이곳에서 시작됩니다.`,
    image: "/section3Img/ninjagoImg.png",
    rightLogo: "/section3Img/starwarsLogo1.png",
    layout: {
      leftTop: 230, leftLeft: 190, leftWidth: 460, textTop: 120,
      centerW: 700, centerH: 700, centerX: -100, centerY: 20, vpTop: 200,
      vpRight: 0, vpSize: 200, rightBottom: 80, rightRight: 40, rightWidth: 500,
      rightImgW: 442, rightImgH: 372, rightImgTop: 210, rightImgLeft: 0,
      disneyTop: 160, dLogoTop: 120, dLogoLeft: -10, dLogoSize: 120,
    },
    layoutSm: { leftTop: "18%", leftLeft: "6%", leftWidth: "40vw", textTop: "820%", 
      centerMaxW: 520, centerMaxH: 520, centerW: "100%", centerH: "auto",  centerX: "13%", centerY: "-20%", vpTop: 330, 
      vpRight: 20, vpSize: 130, rightRight: "-33%", rightWidth: "50vw",rightImgH: "auto", rightImgW: "34vw", 
      rightImgTop: 150, rightImgLeft: 10, }
  },
  {
    id: "starwars",
    logo: "/section3Img/starwarsLogo2.png",
    text: `세월을 넘어 사랑받아온 은하계 밀레니엄 팔콘,<br/>최고의 세팅과 압도적 디테일을<span class="br-m"></span> 지금 만나보세요.`,
    image: "/section3Img/starwarsImg.png",
    rightLogo: "/section3Img/cityLogo1.png",
    layout: {
      leftTop: 180, leftLeft: 200, leftWidth: 460, textTop: 160,
      centerW: 813, centerH: 686, centerX: 20, centerY: 170,
      vpTop: 460, vpRight: 85, vpSize: 200,
      rightBottom: 100, rightRight: -20, rightWidth: 500,
      rightImgW: 451, rightImgH: 338, rightImgTop: 260, rightImgLeft: -40,
      disneyTop: 20, dLogoTop: 280, dLogoLeft: -20, dLogoSize: 131,
    },
    layoutSm: {
      leftTop: "20%", leftLeft: "10%", leftWidth: 380, textTop: "600%",
      centerMaxW: 520, centerMaxH: 520, centerW: "auto", centerH: "auto",
      centerX: 0, centerY: "5%", centerScale: 1,
      vpTop: 360, vpRight: 24, vpSize: 140,
      rightRight: 16, rightWidth: "20vw",
      rightImgW: "45vw",rightImgH: "26vh", rightImgTop: 0, rightImgLeft: 0,
    }
  },
  {
    id: "city",
    logo: "/section3Img/cityLogo2.png",
    text: "거대한 임무를 가르고 나아가는 북극 탐사선,<br/>신비한 대자연 속에서 모험이 펼쳐집니다.",
    image: "/section3Img/cityImg.png",
    rightLogo: "/section3Img/harryPotterLogo1.png",
    layout: {
      leftTop: 150, leftLeft: 140, leftWidth: 460, logoLeft: 0, textTop: 160, textLeft: 80,
      centerW: 775, centerH: 582, centerX: 0, centerY: 30,
      vpTop: 450, vpRight: 580, vpSize: 200,
      rightBottom: 130, rightRight: -20, rightWidth: 500,
      rightImgW: 444, rightImgH: 389, rightImgTop: 260, rightImgLeft: -10,
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
      leftTop: 180, leftLeft: 160, leftWidth: 460, logoLeft: -20, textTop: 140, textLeft: 80,
      centerW: 760, centerH: 665, centerX: 0, centerY: 0,
      vpTop: 402, vpRight: -125, vpSize: 200,
      rightBottom: 120, rightRight: 80,
    },
    layoutSm: {
      leftTop: "16%", leftLeft: "10%", leftWidth: 380, textTop: "530%", textLeft: 40,
      centerMaxW: 520, centerMaxH: 520,centerW: "auto", centerH: "auto", centerX: 0, centerY: "-20%",
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
export function Section3Slide({
  id, logo, text, image, rightLogo, rightGhost, layout, layoutSm,
  index, onNext, onPrev, fading,
  total, onJump,
  pulsing,
  onLock,
}: SlideData & {
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onJump: (i: number) => void;
  fading: boolean;
  pulsing?: 'forward' | 'back' | null;
  onLock?: (ms?: number) => void;
}) {
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

  const onGhostClick = (imgEl: HTMLImageElement) => {
    if (!imgEl || !meddleRef.current) return;
    onLock?.(750); // 클릭 애니 동안 입력 무시

    const target = meddleRef.current.getBoundingClientRect();
    const imgRect = imgEl.getBoundingClientRect();
    const dx = target.left + target.width / 2 - (imgRect.left + imgRect.width / 2);
    const dy = target.top + target.height / 2 - (imgRect.top + imgRect.height / 2);
    const scale = Math.min(target.width / imgRect.width, target.height / imgRect.height) * 0.9;

    imgEl.style.setProperty("--fly-x", `${Math.round(dx)}px`);
    imgEl.style.setProperty("--fly-y", `${Math.round(dy)}px`);
    imgEl.style.setProperty("--fly-scale", `${scale.toFixed(3)}`);
    imgEl.classList.add("is-flying");

    const centralImg = centralImgRef.current;
    if (centralImg) centralImg.style.opacity = "0";

    const flightMs = 500;
    const done = () => {
      (imgEl as HTMLImageElement).style.opacity = "1";
      onNext();
      setTimeout(() => imgEl.classList.remove("is-flying"), 50);
      setTimeout(() => { if (centralImg) centralImg.style.opacity = "1"; (imgEl as HTMLImageElement).style.opacity = "0.5"; }, 400);
    };
    imgEl.addEventListener("transitionend", done, { once: true });
    setTimeout(() => { try { imgEl.dispatchEvent(new Event("transitionend")); } catch { } }, flightMs + 60);
  };

  const rootCls = [
    "s3-slide",
    fading ? "is-fading" : "",
    id ? `s3-${id}` : "",
    pulsing === "forward" ? "is-pulse-forward" : "",
    pulsing === "back" ? "is-pulse-back" : "",
  ].filter(Boolean).join(" ");

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
        {index === 0 && (
          <ul className="scroll-hint">
            <li><span className="mouse" /></li>
            <li><span className="label">SCROLL TO MOVE</span></li>
          </ul>
        )}

        {(rightLogo || rightGhost) && (
          <ul className="disneyPoint">
            {rightLogo && <li className="disneyLogo1"><img src={rightLogo} alt="우측 로고" /></li>}
            {rightGhost && (
              <li className="disneyBlock">
                <img src={rightGhost} alt="다음 장 프리뷰" onClick={(e) => onGhostClick(e.currentTarget)} />
              </li>
            )}
          </ul>
        )}
        </div>
          <div>
            
        {/* 모바일 점 네비 */}
        <nav className="MobbleCheek" aria-label="Slides">
          {Array.from({ length: total }).map((_, i) => {
            const active = i === index;
            return (
              <button
              key={i}
              type="button"
              className={`mc-dot ${active ? "is-active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={active ? "page" : undefined}
              onClick={() => onJump(i)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <circle cx="7" cy="7" r="5.5" className="mc-fg" />
                </svg>
              </button>
            );
          })}
        </nav>
            </div>
    </div>
  );
}

/* ================== 컨트롤러 ================== */
export default function Section3() {
  const hostRef = useRef<HTMLElement | null>(null);

  const isMobile = useIsMobile(768);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [pulsing, setPulsing] = useState<'forward' | 'back' | null>(null);

  const animatingRef = useRef(false);
  const indexRef = useRef(index);
  useEffect(() => { indexRef.current = index; }, [index]);

  // 혹시 남아 있던 잠금 해제
  useEffect(() => {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }, []);

  const max = slides.length - 1;
  const clamp = (n: number) => Math.max(0, Math.min(max, n));

  // 인덱스 변경(휠/클릭/점네비 공용)
  const goTo = useCallback((i: number) => {
    setIndex(clamp(i));
  }, []);

  const handoffTo = useCallback((selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const next = useCallback(() => {
    const curr = indexRef.current;
    if (curr >= max) {
      // 마지막에서 아래 휠 → section4로 핸드오프
      handoffTo("#section4");
      return;
    }
    setFading(true);
    setPulsing("forward");
    animatingRef.current = true;
    const ni = clamp(curr + 1);
    window.setTimeout(() => {
      goTo(ni);
      window.setTimeout(() => { setFading(false); setPulsing(null); animatingRef.current = false; }, 300);
    }, 220);
  }, [goTo, handoffTo, max]);

  const prev = useCallback(() => {
    const curr = indexRef.current;
    if (curr <= 0) {
      // 첫 슬라이드에서 위 휠 → section2로 핸드오프
      handoffTo("#section2");
      return;
    }
    setFading(true);
    setPulsing("back");
    animatingRef.current = true;
    const ni = clamp(curr - 1);
    window.setTimeout(() => {
      goTo(ni);
      window.setTimeout(() => { setFading(false); setPulsing(null); animatingRef.current = false; }, 300);
    }, 220);
  }, [goTo, handoffTo]);

  const lockFor = useCallback((ms = 700) => {
    animatingRef.current = true;
    setPulsing(null);
    window.setTimeout(() => { animatingRef.current = false; }, ms);
  }, []);

  const s = slides[index];

  return (
    <section
      id="section3"
      ref={hostRef as any}
      className="s3-sticky-host"
      /* wheel-only라서 굳이 섹션 높이를 slides*100vh로 둘 필요 없음 */
      style={{ ["--slides"]: slides.length } as React.CSSProperties}
    >
      <div
        className="s3-viewport"
        onWheel={(e) => {
          if (animatingRef.current) return;
          // 작은 떨림 무시
          if (Math.abs(e.deltaY) < 15) return;
          if (e.deltaY > 0) next(); else prev();
        }}
      >
        <div className="s3-stage">
          <Section3Slide
            key={s.id}                 // 강제 리마운트로 전환 체감 확실
            {...s}
            index={index}
            total={slides.length}
            onNext={next}
            onPrev={prev}
            onJump={(i) => { lockFor(450); goTo(i); }}
            fading={fading}
            pulsing={pulsing}
            onLock={lockFor}
          />
        </div>
      </div>
    </section>
  );
}
