import { useRef, useEffect } from 'react'
import './section2.css'

export default function Section2() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const floatImgRef = useRef<HTMLImageElement | null>(null)
  const rafId = useRef<number | null>(null)

  // 🔧 속도/여백 조절
  const START_OFFSET = 0;
  const END_MARGIN = 0;
  const TRACK_OFFSET = 120;

  useEffect(() => {
    const tick = () => {
      const sec = sectionRef.current
      const img = floatImgRef.current
      if (!sec || !img) {
        rafId.current = requestAnimationFrame(tick)
        return
      }

      const secRect = sec.getBoundingClientRect()
      const secH = secRect.height
      const imgH = img.getBoundingClientRect().height

      // 섹션 진행도 0~1 (섹션 상단이 뷰포트 상단에 닿는 순간 0)
      const scrolled = Math.min(Math.max(-secRect.top, 0), secH)

      // 0 → (섹션높이 - 이미지높이 - END_MARGIN) 까지
      const maxY = Math.max(secH - imgH - END_MARGIN, 0)
      const yRaw = START_OFFSET + scrolled + TRACK_OFFSET
      const y = Math.min(Math.max(yRaw, START_OFFSET), START_OFFSET + maxY)

      img.style.setProperty('--ty', `${y}px`);
      rafId.current = requestAnimationFrame(tick)
    }
    const onResize = () => {
      // 리사이즈 시 한 프레임 재계산 트리거
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="section2" ref={sectionRef} style={{ backgroundColor: '#EDEDED' }}>
      <img
        ref={floatImgRef}
        src="/section2Img/legoBlock.png"
        alt="lego"
        className="legoFloat"
      />

      <div id="section2Meddle">
        <ul>
          <li className="legoBlock">
            <h1>LEGO</h1>
          </li>

          <li className="section2Footer">
            <p>
              아이들이 레고로 세상을 만들 때<br />
              우리는 더 나은 미래를 함께 만들어갑니다.
            </p>
            <p className="section2FooterBox">더 알아보기</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
