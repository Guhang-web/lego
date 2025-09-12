import bg from './assets/section1/image108.png'
import { useEffect, useRef, useState } from 'react'
import './section1.css'

// https://youtu.be/TEnKuXbeEwA 배경 영상 참조.

export default function Section1() {

    const [menuOpen, setMenuOpen] = useState(false);
    const btnRef = useRef<HTMLImageElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // 메뉴 밖 클릭 시 닫기 (선택)
    useEffect(() => {
        if (!menuOpen) return;
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (btnRef.current?.contains(t)) return;  // 버튼은 제외
            if (menuRef.current?.contains(t)) return; // 메뉴 내부는 제외
            setMenuOpen(false);
        };
        window.addEventListener("mousedown", onDown);
        return () => window.removeEventListener("mousedown", onDown);
    }, [menuOpen]);



    return (
        <section
            id="section1"
            style={{ backgroundImage: `url(${bg})` }}>

            <div className="bg-video" aria-hidden="true">
                <iframe
                    title="레고 포트나이트 | 미지의 섬을 탐험해볼까요?"
                    src="https://www.youtube.com/embed/TEnKuXbeEwA?autoplay=1&mute=1&controls=0&loop=1&playlist=TEnKuXbeEwA&modestbranding=1&rel=0&playsinline=1"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                />
                <div className="bg-overlay" />
            </div>


            <header id='header'>
                <ul className='legoLogo'><img src="/logo/lego-logo 1.png" alt="lego logo" /></ul>
                <div id='headerNav'>
                    <ul className='menu1'>
                        <a href="#">제품구매</a>
                        <li>시리즈별 세트</li>
                        <li>연령별</li>
                        <li>가격별</li>
                        <li>특별한 날을 위한 세트</li>
                        <li>레고&reg; 상품</li>
                        <li>레고&reg; 데코</li>
                        <li>관심분야</li>
                        <li>독점 제품</li>
                        <li>신제품</li>
                        <li>베스트셀러</li>
                        <li>할인 및 행사</li>
                        <li>출시 예정</li>
                        <li>단종 예정</li>
                        <li>브릭 액세서리 & 키트</li>
                    </ul>
                    <ul className='menu1'>
                        <a href="#">브랜드소개</a>
                        <li>기업 가치</li>
                        <li>레고 앱</li>
                        <li>레고 매거진</li>
                        <li>블프 라이브쇼핑</li>
                        <li>레고 전 제품</li>
                        <li>레고 전체 관심사별</li>
                        <li>특별한 아이디어</li>
                        <li>어른이 환영</li>
                        <li>가족 놀이</li>
                        <li>레고&reg; 포트나이트&reg;</li>
                        <li>레고&reg; Insiders</li>
                        <li>레고&reg; MOSAIC MAKER </li>
                        <li>레고&reg; 선물 아이디어</li>
                    </ul>
                    <ul className='menu1'>
                        <a href="#">고객지원</a>
                        <li>주문 현황 확인</li>
                        <li>배송 및 반품</li>
                        <li>스토어 검색</li>
                        <li>조립설명서 검색</li>
                        <li>일반적인 질문</li>
                        <li>문의하기</li>
                        <li>부속품 브릭</li>
                    </ul>
                    <ul className='icon'>
                        <li><img className='heartIcon' src="/section1Img/heart.png" alt="하트 아이콘" /></li>
                        <li><img className='shoppingBagIcon' src="/section1Img/shoppingBag.png" alt="쇼핑 아이콘" /></li>
                        <li><img ref={btnRef} className={`meunListIcon ${menuOpen ? 'active' : ''}`} src="/section1Img/meunList.png" alt="메뉴 아이콘"
                            onClick={() => setMenuOpen(v => !v)}
                            role="button"
                            tabIndex={0}
                            aria-expanded={menuOpen}
                            aria-controls="s2Menu"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setMenuOpen(v => !v);
                            }}
                        /></li>
                    </ul>
                </div>
            </header>
                <div id='s2Menu' ref={menuRef} className={menuOpen ? "open" : ""}>
                    <ul className='s2Menu1' >
                        <a href="#">1. 제품구매</a>
                        <li>*시리즈별 세트</li>
                        <li>*연령별</li>
                        <li>*가격별</li>
                        <li>*특별한 날을 위한 세트</li>
                        <li>*레고&reg; 상품</li>
                        <li>*레고&reg; 데코</li>
                        <li>*관심분야</li>
                        <li>*독점 제품</li>
                        <li>*신제품</li>
                        <li>*베스트셀러</li>
                        <li>*할인 및 행사</li>
                        <li>*출시 예정</li>
                        <li>*단종 예정</li>
                        <li>*브릭 액세서리 & 키트</li>
                    </ul>
                    <ul className='s2Menu1'>
                        <a href="#">2. 브랜드소개</a>
                        <li>*기업 가치</li>
                        <li>*레고 앱</li>
                        <li>*레고 매거진</li>
                        <li>*블프 라이브쇼핑</li>
                        <li>*레고 전 제품</li>
                        <li>*레고 전체 관심사별</li>
                        <li>*특별한 아이디어</li>
                        <li>*어른이 환영</li>
                        <li>*가족 놀이</li>
                        <li>*레고&reg; 포트나이트&reg;</li>
                        <li>*레고&reg; Insiders</li>
                        <li>*레고&reg; MOSAIC MAKER </li>
                        <li>*레고&reg; 선물 아이디어</li>
                    </ul>
                    <ul className='s2Menu1'>
                        <a href="#">3. 고객지원</a>
                        <li>*주문 현황 확인</li>
                        <li>*배송 및 반품</li>
                        <li>*스토어 검색</li>
                        <li>*조립설명서 검색</li>
                        <li>*일반적인 질문</li>
                        <li>*문의하기</li>
                        <li>*부속품 브릭</li>
                    </ul>
                </div>
            <div id='section1Meddle'>
                <h1>상상 속 세상을<span className='line'></span>현실로 </h1>
                <p className='p1'>상상으로만 그리던 세상, 이제는 눈앞에 펼쳐집니다.</p>
                <p className='p2'>레고는 상상의 한계를 넘어서 <span className='p3'>당신만의 세계를 현실로 만들어줍니다.</span></p>
            </div>
        </section>
    )
}
