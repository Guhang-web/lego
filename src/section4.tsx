import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './section4.css';

type Rect = { left: number; top: number; width: number; height: number };
type Spot = { src: string; alt: string; rect: Rect };

const Section4 = () => {
    const [spot, setSpot] = useState<Spot | null>(null);
    const spotImgRef = useRef<HTMLImageElement>(null);

    // ▼ 추가: 가시성 감지 + (확실한 재생) 키
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    const [fallTick, setFallTick] = useState(0); // 낙하 이미지 재마운트용 키

    // 섹션 보이면 s4-in 토글 + 키 증가(항상 재생 보장)
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        let active = false;
        let leaveTimer: number | null = null;
        const ENTER = 0.35; // 들어올 때
        const EXIT = 0.15;  // 나갈 때

        const io = new IntersectionObserver(
            ([entry]) => {
                const ratio = entry.intersectionRatio;
                if (!active && ratio >= ENTER) {
                    active = true;
                    setInView(true);          // s4-in 클래스 ON
                    setFallTick(t => t + 1);  // 낙하 이미지 key 변경 → 재시작 보장
                } else if (active && ratio <= EXIT) {
                    if (leaveTimer) clearTimeout(leaveTimer);
                    leaveTimer = window.setTimeout(() => {
                        active = false;
                        setInView(false);       // s4-in 클래스 OFF(리셋)
                    }, 120);
                }
            },
            {
                threshold: Array.from({ length: 101 }, (_, i) => i / 100),
                rootMargin: '-10% 0px -10% 0px',
            }
        );

        io.observe(el);
        return () => { if (leaveTimer) clearTimeout(leaveTimer); io.disconnect(); };
    }, []);

    // ESC로 닫기
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSpot(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // 클릭한 썸네일 위치/크기 기록
    const openSpot = (el: HTMLImageElement) => {
        const r = el.getBoundingClientRect();
        setSpot({
            src: el.src,
            alt: el.alt,
            rect: { left: r.left, top: r.top, width: r.width, height: r.height },
        });
    };

    // FLIP 애니메이션: 썸네일 → 중앙 이미지
    useLayoutEffect(() => {
        if (!spot) return;
        const img = spotImgRef.current;
        if (!img) return;

        const run = () => {
            img.style.animation = 'none'; // 잔여 애니 방지
            const last = img.getBoundingClientRect();
            const dx = spot.rect.left - last.left;
            const dy = spot.rect.top - last.top;
            const sx = spot.rect.width / last.width;
            const sy = spot.rect.height / last.height;

            img.style.transition = 'none';
            img.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

            requestAnimationFrame(() => {
                void img.offsetWidth;
                img.style.transition = 'transform 240ms cubic-bezier(.22,1,.36,1)';
                img.style.transform = 'translate(0,0) scale(1,1)';
            });
        };

        if (img.complete) run();
        else img.onload = run;

        return () => { if (img) img.onload = null; };
    }, [spot]);


    return (
        <>
            <section id='section4' ref={sectionRef} className={inView ? 's4-in' : ''}>
                <div id='section4Head'>
                    <img src="/section4Img/Rectangle.png" alt="블록머리" />
                    <img src="/section4Img/Rectangle.png" alt="블록머리" />
                    <img src="/section4Img/Rectangle.png" alt="블록머리" />
                </div>
                <div id="section4Main">
                    <div className="section4Up">
                        <div className="col col-left">
                            <img key={`fall-${fallTick}-1`} className="fall piece-1" src="/section4Img/lego1.png" alt="레고 세트 1" />
                            <img key={`fall-${fallTick}-2`} className="fall piece-2" src="/section4Img/lego2.png" alt="레고 세트 2" />
                        </div>

                        <div className="col col-center">
                            <p className="eyebrow">연령별 레고</p>
                            <h2>나이에 딱 맞는 LEGO</h2>
                            <p>
                                나이에 따라 달라지는 관심과 호기심, 레고는 그 모든 순간에 함께합니다.<br />
                                즐겁게 놀고, 배우고, 성장하는 완벽한 선택!
                            </p>
                        </div>

                        <div className="col col-right">
                            <img key={`fall-${fallTick}-3`} className="fall piece-3" src="/section4Img/lego3.png" alt="레고 세트 3" />
                            <img key={`fall-${fallTick}-4`} className="fall piece-4" src="/section4Img/lego4.png" alt="레고 세트 4" />
                        </div>
                    </div>

                    <div className='section4Meddle'>
                        <div className='greenBox section4Box'>
                            <img className='boxHead' src="/section4Img/greenLego1.png" alt="초록레고 머리" />
                            <img className='boxBody' src="/section4Img/greenLego2.png" alt="초록레고 몸통" />
                            <ul className='overBox'>
                                <li><img className='darkEffet' src="/section4Img/darkEffet.png" alt="그림자효과" /></li>
                                <li><img className='boxImg greenImg' src="/section4Img/greenImg.png" alt="초록레고 이미지"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => openSpot(e.currentTarget)}                 // ★ 캐스팅 불필요
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openSpot(e.currentTarget)}
                                /></li>
                                <li className='boxPage'><h3>유아</h3>
                                    <p>브릭을 처음 만나는 유아들을 위한<br />안전하고 즐거운 조립</p></li>
                            </ul>

                        </div>
                        <div className='blueBox section4Box'>
                            <img className='boxHead' src="/section4Img/blueLego1.png" alt="블루레고 머리" />
                            <img className='boxBody' src="/section4Img/blueLego2.png" alt="블루레고 몸통" />
                            <ul className='overBox'>
                                <li><img className='darkEffet' src="/section4Img/darkEffet.png" alt="그림자효과" /></li>
                                <li><img className='boxImg blueImg' src="/section4Img/blueImg.png" alt="블루레고 이미지"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => openSpot(e.currentTarget)}                 // ★ 캐스팅 불필요
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openSpot(e.currentTarget)}
                                /></li>
                                <li className='boxPage'><h3>어린이</h3>
                                    <p>창의력과 몰입을 키우는<br />테마 중심놀이</p></li>
                            </ul>
                        </div>
                        <div className='redBox section4Box'>
                            <img className='boxHead' src="/section4Img/redLego1.png" alt="레드레고 머리" />
                            <img className='boxBody' src="/section4Img/redLego2.png" alt="레드레고 몸통" />
                            <ul className='overBox'>
                                <li><img className='darkEffet' src="/section4Img/darkEffet.png" alt="그림자효과" /></li>
                                <li><img className='boxImg redImg' src="/section4Img/redImg.png" alt="레드레고 이미지"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => openSpot(e.currentTarget)}                 // ★ 캐스팅 불필요
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openSpot(e.currentTarget)}
                                /></li>
                                <li className='boxPage'><h3>청소년</h3>
                                    <p>구조와 기능을 탐구하며<br />성장하는 조립 경험</p></li>
                            </ul>
                        </div>
                        <div className='yellowBox section4Box'>
                            <img className='boxHead' src="/section4Img/yellowLego1.png" alt="옐로우레고 머리" />
                            <img className='boxBody' src="/section4Img/yellowLego2.png" alt="옐로우레고 몸통" />
                            <ul className='overBox'>
                                <li><img className='darkEffet' src="/section4Img/darkEffet.png" alt="그림자효과" /></li>
                                <li><img className='boxImg yellowImg' src="/section4Img/yellowImg.png" alt="옐로우레고 이미지"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => openSpot(e.currentTarget)}                 // ★ 캐스팅 불필요
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openSpot(e.currentTarget)}
                                /></li>
                                <li className='boxPage'><h3>성인</h3>
                                    <p>고급 모델과 감성적인<br />수집용 시리즈</p></li>
                            </ul>
                        </div>
                        {spot && (
                            <div className="spotlight" onClick={() => setSpot(null)}>
                                <div className="spotlightInner" onClick={(e) => e.stopPropagation()}>
                                    <img ref={spotImgRef} className="spotlightImg" src={spot.src} alt={spot.alt} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='section4Down'>
                        <div className='section4LeftDown'>
                            <img key={`fall-${fallTick}-5`} className="fall piece-5" src="/section4Img/lego5.png" alt="레고 세트 5" />
                            <img key={`fall-${fallTick}-6`} className="fall piece-6" src="/section4Img/lego6.png" alt="레고 세트 6" />
                            <img key={`fall-${fallTick}-7`} className="fall piece-7" src="/section4Img/lego7.png" alt="레고 세트 7" />
                            <img key={`fall-${fallTick}-8`} className="fall piece-8" src="/section4Img/lego8.png" alt="레고 세트 8" />
                        </div>
                        <div className='section4RightDown'>
                            <img key={`fall-${fallTick}-9`} className="fall piece-9" src="/section4Img/lego9.png" alt="레고 세트 9" />
                            <img key={`fall-${fallTick}-10`} className="fall piece-10" src="/section4Img/lego10.png" alt="레고 세트 10" />
                            <img key={`fall-${fallTick}-11`} className="fall piece-11" src="/section4Img/lego11.png" alt="레고 세트 11" />
                            <img key={`fall-${fallTick}-12`} className="fall piece-12" src="/section4Img/lego12.png" alt="레고 세트 12" />
                            <img key={`fall-${fallTick}-13`} className="fall piece-13" src="/section4Img/lego13.png" alt="레고 세트 13" />
                            <img key={`fall-${fallTick}-14`} className="fall piece-14" src="/section4Img/lego14.png" alt="레고 세트 14" />
                            <img key={`fall-${fallTick}-15`} className="fall piece-15" src="/section4Img/lego15.png" alt="레고 세트 15" />

                        </div>
                    </div>
                </div>

            </section >
        </>
    )
}

export default Section4