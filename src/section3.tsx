// src/section3.tsx
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import './section3.css'

type LayoutVars = {
  // 좌측 묶음
  leftTop?: number; leftLeft?: number; leftWidth?: number; leftGap?: number;
  // 가운데 메인
  centerW?: number; centerH?: number;
  // VIEW MORE 원형
  vpTop?: number; vpRight?: number; vpSize?: number;
  // 우측 프리뷰 묶음
  rightBottom?: number; rightRight?: number; rightWidth?: number;
  disneyTop?: number; dLogoTop?: number; dLogoLeft?: number; dLogoSize?: number;
  logoW?: number;        // 좌측 로고 너비
  textFS?: number;       // 좌측 텍스트 글자 크기
  textLH?: number;       // 좌측 텍스트 줄간격
  textMaxW?: number;     // 좌측 텍스트 최대 너비
  centerX?: number;      // 메인 이미지 X 보정(px)
  centerY?: number;      // 메인 이미지 Y 보정(px)
  logoTop?: number;   // 좌측 로고 top(px)
  logoLeft?: number;  // 좌측 로고 left(px)
  textTop?: number;   // 좌측 문단 top(px)
  textLeft?: number;  // 좌측 문단 left(px)

}

type SlideData = {
  logo: string
  text: string
  image: string
  rightLogo?: string
  rightGhost?: string           // 마지막 슬라이드는 undefined로 두면 우측 흑백 안 나옴
  layout?: LayoutVars           // ← 이 숫자만 바꾸면 슬라이드별 배치가 바뀜
}

/** ✅ 여기 배열만 수정(이미지·텍스트·숫자) */
const baseSlides = [
  {
    logo: '/section3Img/marvelLogo.png',
    text: '마블 팬이라면 누구나 마음 속에 자신만의 영웅 이야기가 있기 마련이죠.<br/>자신만의 세계를 만들고 마음 속의 이야기를 한껏 펼쳐보세요!',
    image: '/section3Img/marvelImg.png',
    rightLogo: '/section3Img/disneyLogo1.png',
    // layout: { leftTop: 220, centerW: 570, vpRight: -20 },
  },
  {
    logo: '/section3Img/disneyLogo2.png',
    text: '수십 년의 감성이 모여 완성되는 디즈니의 상징,<br/>정교한 디테일 속에 담긴 이야기를 직접 만나보세요.',
    image: '/section3Img/disneyImg.png',
    rightLogo: '/section3Img/ninjagoLogo1.png',
    layout: {
      /* 좌측(로고+설명) */
      leftTop: 160,      // 좌측 묶음의 위쪽 위치
      leftLeft: 140,     // 좌측 묶음의 왼쪽 위치
      leftWidth: 460,    // 좌측 묶음의 폭
      leftGap: 20,       // 로고와 문단 사이 간격

      /* 가운데(메인 이미지) */
      centerW: 540,      // 메인 이미지 박스 폭
      centerH: 700,      // 메인 이미지 박스 높이
      /* (아래 두 값은 '미세 위치 보정' – 선택) */
      centerX: -30,      // 왼쪽(-) / 오른쪽(+)으로 n px 이동
      centerY: 0,        // 위(-) / 아래(+)로 n px 이동

      /* VIEW MORE (이벤트 나중이지만 위치는 대략) */
      vpTop: 480,
      vpRight: 330,      // 값이 클수록 원이 왼쪽으로 이동
      vpSize: 180,

      /* 우측(흑백 프리뷰 묶음) */
      rightBottom: 80,
      rightRight: 120,
      rightWidth: 380,

      /* 우측 작은 로고 위치/크기 */
      disneyTop: 110,
      dLogoTop: 220,
      dLogoLeft: -20,
      dLogoSize: 120,
    },
  },
  {
    logo: '/section3Img/ninjagoLogo2.png',
    text: '수많은 이야기와 낭자가 오가는 닌자고 시티의 중심,<br/>모험은 이곳에서 시작됩니다.',
    image: '/section3Img/ninjagoImg.png',
    rightLogo: '/section3Img/starwarsLogo1.png',
    // layout: { vpTop: 280 },
  },
  {
    logo: '/section3Img/starwarsLogo2.png',
    text: '세월을 넘어 사랑받아온 은하계 밀레니엄 팔콘,<br/>최고의 세팅과 압도적 디테일을 지금 만나보세요.',
    image: '/section3Img/starwarsImg.png',
    rightLogo: '/section3Img/cityLogo1.png',
  },
  {
    logo: '/section3Img/cityLogo2.png',
    text: '거대한 임무를 가르고 나아가는 북극 탐사선,<br/>신비한 대자연 속에서 모험이 펼쳐집니다.',
    image: '/section3Img/cityImg.png',
    rightLogo: '/section3Img/harryPotterLogo1.png',
  },
  // ✅ 마지막(우측 흑백/로고 없음)
  {
    logo: '/section3Img/harryPotterLogo2.png',
    text: '수많은 마법사의 꿈이 머물렀던 곳, 호그와트.<br/>신비로운 마법의 세계로 초대합니다.',
    image: '/section3Img/harryPotterImg.png',
    // layout: { rightWidth: 0 } // 필요 시 오른쪽 묶음 자체가 없어도 됨(아래 조건부 렌더링)
  },
] as const

// 다음 장 이미지를 자동으로 우측 흑백 프리뷰에 넣기(마지막은 undefined)
const slides: SlideData[] = baseSlides.map((s, i, arr) => ({
  ...s,
  rightGhost: i < arr.length - 1 ? arr[i + 1].image : undefined,
}))

// CSS 변수 주입 유틸(숫자를 px로 바꿔서 style에 넣어줌)

type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number>;

const toVars = (v?: LayoutVars): CSSVarStyle => {
  const px = (n?: number) => (n === undefined ? undefined : `${n}px`);
  return {
    // === 기존 매핑 ===
    ...(v?.leftTop     !== undefined && { ['--left-top']:      px(v.leftTop) }),
    ...(v?.leftLeft    !== undefined && { ['--left-left']:     px(v.leftLeft) }),
    ...(v?.leftWidth   !== undefined && { ['--left-width']:    px(v.leftWidth) }),
    ...(v?.leftGap     !== undefined && { ['--left-gap']:      px(v.leftGap) }),
    ...(v?.centerW     !== undefined && { ['--center-w']:      px(v.centerW) }),
    ...(v?.centerH     !== undefined && { ['--center-h']:      px(v.centerH) }),
    ...(v?.centerX     !== undefined && { ['--center-x']:      px(v.centerX) }),
    ...(v?.centerY     !== undefined && { ['--center-y']:      px(v.centerY) }),
    ...(v?.vpTop       !== undefined && { ['--vp-top']:        px(v.vpTop) }),
    ...(v?.vpRight     !== undefined && { ['--vp-right']:      px(v.vpRight) }),
    ...(v?.vpSize      !== undefined && { ['--vp-size']:       px(v.vpSize) }),
    ...(v?.rightBottom !== undefined && { ['--right-bottom']:  px(v.rightBottom) }),
    ...(v?.rightRight  !== undefined && { ['--right-right']:   px(v.rightRight) }),
    ...(v?.rightWidth  !== undefined && { ['--right-width']:   px(v.rightWidth) }),
    ...(v?.disneyTop   !== undefined && { ['--disney-top']:    px(v.disneyTop) }),
    ...(v?.dLogoTop    !== undefined && { ['--dlogo-top']:     px(v.dLogoTop) }),
    ...(v?.dLogoLeft   !== undefined && { ['--dlogo-left']:    px(v.dLogoLeft) }),
    ...(v?.dLogoSize   !== undefined && { ['--dlogo-size']:    px(v.dLogoSize) }),

    // === 새로 추가한 개별 위치/타이포 매핑 ===
    ...(v?.logoTop     !== undefined && { ['--left-logo-top']:  px(v.logoTop) }),
    ...(v?.logoLeft    !== undefined && { ['--left-logo-left']: px(v.logoLeft) }),
    ...(v?.logoW       !== undefined && { ['--logo-w']:        px(v.logoW) }),
    ...(v?.textTop     !== undefined && { ['--left-text-top']:  px(v.textTop) }),
    ...(v?.textLeft    !== undefined && { ['--left-text-left']: px(v.textLeft) }),
    ...(v?.textFS      !== undefined && { ['--text-fs']:        px(v.textFS) }),
    ...(v?.textLH      !== undefined && { ['--text-lh']:        px(v.textLH) }),
    ...(v?.textMaxW    !== undefined && { ['--text-mw']:        px(v.textMaxW) }),
  };
};

/* ── 슬라이드 UI ── */
function Section3Slide({ logo, text, image, rightLogo, rightGhost, layout }: SlideData) {
  return (
    <div className="s3-slide" style={toVars(layout)}>
      {/* 좌측 */}
      <ul className="section3Left">
        <img className="marvelLogo" src={logo} alt="브랜드 로고" />
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </ul>

      {/* 가운데 */}
      <ul className="section3Meddle">
        <img className="marvelImg" src={image} alt="메인 이미지" />
        <li className="viewPoint"><p>VIEW MORE</p></li>
      </ul>

      {/* 우측(로고/흑백 둘 중 하나라도 있을 때만 표시) */}
      <div className="section3Right">
        <ul className="scroll-hint">
          <li><span className="mouse"></span></li>
          <li><span className="label">SCROLL TO MOVE</span></li>
        </ul>

        {(rightLogo || rightGhost) && (
          <ul className="disneyPoint">
            {rightLogo && (
              <li className="disneyLogo1"><img src={rightLogo} alt="우측 로고" /></li>
            )}
            {rightGhost && (
              <li className="disneyBlock"><img src={rightGhost} alt="다음 장 프리뷰" /></li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Section3() {
  return (
    <section id="section3">
      <Swiper
        className="s3-swiper"
        modules={[Mousewheel]}
        slidesPerView={1}
        spaceBetween={0}
        loop={false}              // 마지막에서 처음으로 안 돌아감
        speed={700}
        mousewheel={{
          forceToAxis: false,
          releaseOnEdges: true,   // 끝에서 아래 섹션으로 스크롤 이어짐
          sensitivity: 1,
          thresholdDelta: 10,
        }}
        allowTouchMove={false}
        onReachEnd={() =>
          document.getElementById('section4')?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <Section3Slide {...s} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
