import React, { useRef, useState, useCallback, useEffect } from "react";
import "./section3.css";

/** ----- 타입 & 데이터는 그대로 사용 ----- */
export type LayoutVars = {
  leftTop?: number; leftLeft?: number; leftWidth?: number; leftGap?: number;
  centerW?: number; centerH?: number;
  vpTop?: number; vpRight?: number; vpSize?: number;
  rightBottom?: number; rightRight?: number; rightWidth?: number;
  disneyTop?: number; dLogoTop?: number; dLogoLeft?: number; dLogoSize?: number;
  logoW?: number; textFS?: number; textLH?: number; textMaxW?: number;
  logoTop?: number; logoLeft?: number; textTop?: number; textLeft?: number;
  centerMaxW?: number; centerMaxH?: number; centerX?: number; centerY?: number; centerScale?: number;
  rightImgW?: number; rightImgH?: number; rightImgTop?: number; rightImgLeft?: number;
  ghostOpacity?: number; ghostGray?: number;
};

export type SlideData = {
  logo: string;
  text: string;
  image: string;
  rightLogo?: string;
  rightGhost?: string;
  layout?: LayoutVars;
};

export const baseSlides = [
  {
    logo: "/section3Img/marvelLogo.png",
    text: "마블 팬이라면 누구나 마음 속에 자신만의 영웅 이야기가 있기 마련이죠.<br/>자신만의 세계를 만들고 마음 속의 이야기를 한껏 펼쳐보세요!",
    image: "/section3Img/marvelImg.png",
    rightLogo: "/section3Img/disneyLogo1.png",
    layout: { leftTop: 220, centerY: -6, textTop: 160, rightImgW: 340, rightImgH: 484, rightImgTop: 70, rightImgLeft: 0 },
  },
  {
    logo: "/section3Img/disneyLogo2.png",
    text: "수십 년의 감성이 모여 완성되는 디즈니의 상징,<br/>정교한 디테일 속에 담긴 이야기를 직접 만나보세요.",
    image: "/section3Img/disneyImg.png",
    rightLogo: "/section3Img/ninjagoLogo1.png",
    layout: {
      leftTop: 160, leftLeft: 200, leftWidth: 460, leftGap: 20, textTop: 220,
      centerW: 548, centerH: 780, centerX: -30, centerY: 0,
      vpTop: 620, vpRight: 440, vpSize: 200,
      rightBottom: 80, rightRight: 120, rightWidth: 413,
      rightImgW: 413, rightImgH: 413, rightImgTop: 130, rightImgLeft: 0,
      disneyTop: 110, dLogoTop: 220, dLogoLeft: -50, dLogoSize: 120,
    },
  },
  {
    logo: "/section3Img/ninjagoLogo2.png",
    text: "수많은 이야기와 닌자가 오가는 닌자고 시티의 중심,<br/>모험은 이곳에서 시작됩니다.",
    image: "/section3Img/ninjagoImg.png",
    rightLogo: "/section3Img/starwarsLogo1.png",
    layout: {
      leftTop: 230, leftLeft: 190, leftWidth: 460, textTop: 120,
      centerW: 700, centerH: 700, centerX: -100, centerY: 20,
      vpTop: 200, vpRight: 0, vpSize: 200,
      rightBottom: 80, rightRight: 40, rightWidth: 500,
      rightImgW: 442, rightImgH: 372, rightImgTop: 210, rightImgLeft: 0,
      disneyTop: 160, dLogoTop: 120, dLogoLeft: -10, dLogoSize: 120,
    },
  },
  {
    logo: "/section3Img/starwarsLogo2.png",
    text: "세월을 넘어 사랑받아온 은하계 밀레니엄 팔콘,<br/>최고의 세팅과 압도적 디테일을 지금 만나보세요.",
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
  },
  {
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
  },
  {
    logo: "/section3Img/harryPotterLogo2.png",
    text: "수많은 마법사의 꿈이 머물렀던 곳, 호그와트.<br/>신비로운 마법의 세계로 모험을 떠나보세요.",
    image: "/section3Img/harryPotterImg.png",
    layout: {
      leftTop: 180, leftLeft: 160, leftWidth: 460, logoLeft: -20, textTop: 140, textLeft: 80,
      centerW: 760, centerH: 665, centerX: 0, centerY: 0,
      vpTop: 402, vpRight: -125, vpSize: 200,
      rightBottom: 120, rightRight: 80,
    },
  },
] as const;

export const slides: SlideData[] = baseSlides.map((s, i, arr) => ({
  ...s,
  rightGhost: i < arr.length - 1 ? arr[i + 1].image : undefined,
}));

export type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>;
export const toVars = (v?: LayoutVars): CSSVarStyle => {
  const px = (n?: number) => (n === undefined ? undefined : `${n}px`);
  return {
    ...(v?.leftTop !== undefined && { ["--left-top"]: px(v.leftTop) }),
    ...(v?.leftLeft !== undefined && { ["--left-left"]: px(v.leftLeft) }),
    ...(v?.leftWidth !== undefined && { ["--left-width"]: px(v.leftWidth) }),
    ...(v?.leftGap !== undefined && { ["--left-gap"]: px(v.leftGap) }),
    ...(v?.centerMaxW !== undefined && { ["--center-max-w"]: px(v.centerMaxW) }),
    ...(v?.centerMaxH !== undefined && { ["--center-max-h"]: px(v.centerMaxH) }),
    ...(v?.centerW !== undefined && { ["--center-w"]: px(v.centerW) }),
    ...(v?.centerH !== undefined && { ["--center-h"]: px(v.centerH) }),
    ...(v?.centerX !== undefined && { ["--center-x"]: px(v.centerX) }),
    ...(v?.centerY !== undefined && { ["--center-y"]: px(v.centerY) }),
    ...(v?.centerScale !== undefined && { ["--center-scale"]: v.centerScale }),
    ...(v?.vpTop !== undefined && { ["--vp-top"]: px(v.vpTop) }),
    ...(v?.vpRight !== undefined && { ["--vp-right"]: px(v.vpRight) }),
    ...(v?.vpSize !== undefined && { ["--vp-size"]: px(v.vpSize) }),
    ...(v?.rightBottom !== undefined && { ["--right-bottom"]: px(v.rightBottom) }),
    ...(v?.rightRight !== undefined && { ["--right-right"]: px(v.rightRight) }),
    ...(v?.rightWidth !== undefined && { ["--right-width"]: px(v.rightWidth) }),
    ...(v?.disneyTop !== undefined && { ["--disney-top"]: px(v.disneyTop) }),
    ...(v?.dLogoTop !== undefined && { ["--dlogo-top"]: px(v.dLogoTop) }),
    ...(v?.dLogoLeft !== undefined && { ["--dlogo-left"]: px(v.dLogoLeft) }),
    ...(v?.dLogoSize !== undefined && { ["--dlogo-size"]: px(v.dLogoSize) }),
    ...(v?.logoTop !== undefined && { ["--left-logo-top"]: px(v.logoTop) }),
    ...(v?.logoLeft !== undefined && { ["--left-logo-left"]: px(v.logoLeft) }),
    ...(v?.logoW !== undefined && { ["--logo-w"]: px(v.logoW) }),
    ...(v?.textTop !== undefined && { ["--left-text-top"]: px(v.textTop) }),
    ...(v?.textLeft !== undefined && { ["--left-text-left"]: px(v.textLeft) }),
    ...(v?.textFS !== undefined && { ["--text-fs"]: px(v.textFS) }),
    ...(v?.textLH !== undefined && { ["--text-lh"]: px(v.textLH) }),
    ...(v?.textMaxW !== undefined && { ["--text-mw"]: px(v.textMaxW) }),
    ...(v?.rightImgW !== undefined && { ["--right-img-w"]: px(v.rightImgW) }),
    ...(v?.rightImgH !== undefined && { ["--right-img-h"]: px(v.rightImgH) }),
    ...(v?.rightImgTop !== undefined && { ["--right-img-top"]: px(v.rightImgTop) }),
    ...(v?.rightImgLeft !== undefined && { ["--right-img-left"]: px(v.rightImgLeft) }),
    ...(v?.ghostOpacity !== undefined && { ["--ghost-opacity"]: v.ghostOpacity }),
    ...(v?.ghostGray !== undefined && { ["--ghost-gray"]: `${v.ghostGray}%` }),
  };
};

/** ----- 프레젠테이션 슬라이드 (swiper 제거) ----- */
export function Section3Slide({
  logo, text, image, rightLogo, rightGhost, layout,
  index, onNext, onPrev, fading,
}: SlideData & {
  index: number;
  onNext: () => void;
  onPrev: () => void;
  fading: boolean;
}) {
  const meddleRef = useRef<HTMLUListElement>(null);
  const centralImgRef = useRef<HTMLImageElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  const onMove: React.MouseEventHandler<HTMLUListElement> = (e) => {
    const wrap = meddleRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // 우측 흑백 프리뷰 클릭 → 중앙으로 비행 → 다음 콘텐츠로 스왑
  const onGhostClick = (imgEl: HTMLImageElement) => {
    if (!imgEl || !meddleRef.current) return;

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
      imgEl.style.opacity = "1";
      onNext();
      setTimeout(() => imgEl.classList.remove("is-flying"), 50);
      setTimeout(() => {
        if (centralImg) centralImg.style.opacity = "1";
        imgEl.style.opacity = "0.5";
      }, 400);
    };
    imgEl.addEventListener("transitionend", done, { once: true });
    setTimeout(() => {
      try { imgEl.dispatchEvent(new Event("transitionend")); } catch { }
    }, flightMs + 60);
  };

  return (
    <div className={`s3-slide ${fading ? "is-fading" : ""}`} style={toVars(layout)}>
      {/* 좌측 */}
      <ul className="section3Left" style={toVars(layout)}>
        <img
          className={`marvelLogo ${(layout?.logoTop !== undefined || layout?.logoLeft !== undefined) ? "abs" : ""}`}
          src={logo}
          alt="브랜드 로고"
        />
        <p
          className={`leftText ${(layout?.textTop !== undefined || layout?.textLeft !== undefined) ? "abs" : ""}`}
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
        <li className={`viewPoint ${hovering ? 'show' : ''}`}><p>VIEW MORE</p></li>
      </ul>

      {/* 우측(프리뷰) */}
      <div className="section3Right">
        <ul className="scroll-hint">
          <li><span className="mouse" /></li>
          <li><span className="label">SCROLL TO MOVE</span></li>
        </ul>

        {(rightLogo || rightGhost) && (
          <ul className="disneyPoint" style={toVars(layout)}>
            {rightLogo && (
              <li className="disneyLogo1"><img src={rightLogo} alt="우측 로고" /></li>
            )}
            {rightGhost && (
              <li className="disneyBlock">
                <img
                  src={rightGhost}
                  alt="다음 장 프리뷰"
                  onClick={(e) => onGhostClick(e.currentTarget)}
                />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

/** ----- 컨트롤러: 인덱스/휠/페이드 관리 ----- */
export default function Section3() {
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);      // 스크롤 연타 방지
  const [fading, setFading] = useState(false);  // 교체 시 페이드

  const max = slides.length - 1;
  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(max, i));
    setIndex(next);
  }, [max]);

  const next = useCallback(() => {
    if (index >= max) return;
    setFading(true);
    setTimeout(() => {
      goTo(index + 1);
      setTimeout(() => setFading(false), 300);
    }, 220);
  }, [index, max, goTo]);

  const prev = useCallback(() => {
    if (index <= 0) return;
    setFading(true);
    setTimeout(() => {
      goTo(index - 1);
      setTimeout(() => setFading(false), 300);
    }, 220);
  }, [index, goTo]);

  // 섹션 내부 휠로만 콘텐츠 전환 (페이지 스크롤 방지)
  const onWheel: React.WheelEventHandler<HTMLElement> = (e) => {
    // 트랙패드 작은 움직임 필터링
    const dy = e.deltaY;
    if (Math.abs(dy) < 10) return;
    if (lock) return;

    // 이 섹션 안에서만 스크롤 소비
    e.preventDefault();
    setLock(true);
    if (dy > 0) next(); else prev();

    // 전환 속도와 맞춰 해제
    setTimeout(() => setLock(false), 750);
  };

  const s = slides[index];

  return (
    <section id="section3" className="s3-stage" onWheel={onWheel}>
      <Section3Slide
        {...s}
        index={index}
        onNext={next}
        onPrev={prev}
        fading={fading}
      />
    </section>
  );
}
