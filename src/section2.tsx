// src/components/Section2.tsx  (네 위치에 맞게)
import { useRef, useEffect } from 'react'
import './section2.css'
import StarfieldCanvas from './starfieldCanvas';

export default function Section2() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const imgRef   = useRef<HTMLImageElement | null>(null)

  // 현재 각도/목표 각도 (리렌더 발생 X)
  const current = useRef({ x: 0, y: 0 })
  const target  = useRef({ x: 0, y: 0 })
  const rafId   = useRef<number | null>(null)

  // 애니메이션 루프 (빠르면서도 너무 튀지 않게 보간)
  const tick = () => {
    // lerp(보간): 현재 → 목표로 20%씩 다가감 (빠르게 느껴짐)
    const ease = 0.2
    current.current.x += (target.current.x - current.current.x) * ease
    current.current.y += (target.current.y - current.current.y) * ease

    if (imgRef.current) {
      imgRef.current.style.transform =
        `rotateX(${current.current.x}deg) rotateY(${current.current.y}deg)`
    }
    rafId.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    // 각도 스케일 (세게/덜 세게 원하면 45를 조절)
    const max = 180
    target.current = {
      x: -(dy / rect.height) * max,
      y:  (dx / rect.width)  * max,
    }
  }

  const handleMouseLeave = () => {
    // 마우스 나가면 자연스럽게 원위치
    target.current = { x: 0, y: 0 }
  }

  return (
    <section id="section2" style={{backgroundColor:'#EDEDED'}}>
 {/* ⭐ 배경 레이어 */}
      <StarfieldCanvas
        density={0.00025}   // 별 개수
        speed={60}          // 하강 속도(px/s)
        direction="down"    // 'down' | 'down-right' | 'down-left'
        twinkle              // 반짝임 on
      />


      <div
        id="section2Meddle"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ul>
          <li className="legoBlock">
            {/* ✅ 이미지는 public/section2Img/legoBlock.png 에 두고 이렇게 참조 */}
            <img
              ref={imgRef}
              src="/section2Img/legoBlock.png"
              alt="lego"
              className="legoImg"
            />
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
