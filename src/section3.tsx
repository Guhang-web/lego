// src/section3.tsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
// CSS 임포트는 section3.css에 @import로 옮겼다면 아래 줄은 생략해도 됨
import './section3.css'

type SlideData = {
  logo: string         // 좌측 로고
  text: string         // 설명(줄바꿈 필요하면 <br/> 포함)
  image: string        // 가운데 컬러 이미지
  rightLogo?: string   // 우측 작은 로고(선택)
  rightGhost: string   // 우측 흑백 프리뷰(다음 장 메인 이미지)
}

/** ✅ 여기 배열만 수정해 */
const baseSlides = [
  {
    logo: '/section3Img/marvelLogo.png',
    text: '마블 팬이라면 누구나 마음 속에 자신만의 영웅 이야기가 있기 마련이죠.<br/>자신만의 세계를 만들고 마음 속의 이야기를 한껏 펼쳐보세요!',
    image: '/section3Img/marvelImg.png',
    rightLogo: '/section3Img/disneyLogo1.png',
  },
  {
    logo: '/section3Img/disneyLogo2.png',
    text: '수십 년의 감성이 모여 완성되는 디즈니의 상징,<br/>정교한 디테일 속에 담긴 이야기를 직접 만나보세요.',
    image: '/section3Img/disneyImg.png',
    rightLogo: '/section3Img/ninjagoLogo1.png',
  },
  {
    logo: '/section3Img/ninjagoLogo2.png',
    text: '수많은 이야기와 낭자가 오가는 닌자고 시티의 중심,<br/>모험은 이곳에서 시작됩니다.',
    image: '/section3Img/ninjagoImg.png',
    rightLogo: '/section3Img/starwarsLogo1.png',
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
    rightLogo: '/section3Img/marvelLogo1.png', // 마지막 → 첫 장으로 루프
  },
] as const

// 다음 장 메인 이미지를 우측 흑백 프리뷰로 자동 주입
const slides: SlideData[] = baseSlides.map((s, i, arr) => ({
  ...s,
  rightGhost: arr[(i + 1) % arr.length].image,
}))

/* ── 이 파일 안에서 슬라이드 UI 컴포넌트 정의 ── */
function Section3Slide({ logo, text, image, rightLogo, rightGhost }: SlideData) {
  return (
    <div className="s3-slide">
      {/* 좌측 */}
      <ul className="section3Left">
        <img className="marvelLogo" src={logo} alt="브랜드 로고" />
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </ul>

      {/* 가운데 */}
      <ul className="section3Meddle">
        <img className="marvelImg" src={image} alt="메인 이미지" />
        <li className="viewPoint"><p>VIEW MORE</p></li>{/* 이벤트는 나중에 */}
      </ul>

      {/* 우측 */}
      <div className="section3Right">
        <ul className="scroll-hint">
          <li><span className="mouse" ></span></li>
          <li><span className="label">SCROLL TO MOVE</span></li>
        </ul>
        <ul className="disneyPoint">
          {rightLogo && (
            <li className="disneyLogo1"><img src={rightLogo} alt="우측 로고" /></li>
          )}
          <li className="disneyBlock"><img src={rightGhost} alt="다음 장 프리뷰" /></li>
        </ul>
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
        loop
        speed={700}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
          sensitivity: 1,
          thresholdDelta: 20,
        }}
        allowTouchMove={false}   // 데스크톱: 휠만; 필요하면 true
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
