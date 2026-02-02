import bg from "./assets/section1/image108.png";
import heroVideo from "./assets/section1/hero.mp4"; 
import { useEffect, useMemo, useRef, useState } from "react";
import "./section1.css";

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}
type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | (string & {});
};

type NavigatorExtended = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

/** ---------------------------
 *  자동재생 가능 환경 체크
 *  --------------------------- */
function shouldAutoplayVideo() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  // 1) 사용자/OS 설정 (모션 줄이기) 존중
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // 2) 데이터 절약 모드 / 느린망
  const nav = navigator as NavigatorExtended;
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const saveData = !!conn?.saveData;
  const effectiveType = conn?.effectiveType ?? "";
  const slowNet = ["slow-2g", "2g", "3g"].includes(effectiveType);

  // 3) 저사양 힌트
  const deviceMemory = nav.deviceMemory ?? 8; 
  const cores = navigator.hardwareConcurrency ?? 8;
  const lowSpec = deviceMemory <= 4 || cores <= 4;

  return !(reduceMotion || saveData || slowNet || lowSpec);
}

export default function Section1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLImageElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // options 객체가 매 렌더마다 새로 만들어져 observer가 재설치되는 것 방지
  const ioOptions = useMemo<IntersectionObserverInit>(
    () => ({ root: null, threshold: 0.15 }),
    []
  );

  // 섹션이 보일 때만 영상 로드
  const { ref: sectionRef, inView } = useInView<HTMLElement>(ioOptions);

  // 환경이 괜찮을 때만 자동재생
  const canAutoplay = useMemo(() => shouldAutoplayVideo(), []);

  // “한 번이라도 inView가 되면” video를 붙여서 재방문 시 재로딩 최소화
  const [mountVideo, setMountVideo] = useState(false);
  useEffect(() => {
    if (inView && canAutoplay) setMountVideo(true);
  }, [inView, canAutoplay]);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  return (
    <section ref={sectionRef} id="section1" style={{ backgroundImage: `url(${bg})` }}>
      {mountVideo && (
        <div className="bg-video" aria-hidden="true">
          <video
            className="bg-video__el"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="bg-overlay" />
        </div>
      )}
      {!canAutoplay && <div className="bg-overlay" aria-hidden="true" />}

      <header id="header">
        <ul className="legoLogo">
          <img src="/logo/lego-logo 1.png" alt="lego logo" />
        </ul>

        <div id="headerNav">
          <ul className="menu1">
            <a href="#">제품구매</a>
            <li>시리즈별 세트</li>
            <li>연령별</li>
            <li>가격별</li>
            <li>특별한 날을 위한 세트</li>
            <li>레고&reg; 상품</li>
            <li>레고&reg; 데코</li>
          </ul>

          <ul className="menu1">
            <a href="#">브랜드소개</a>
            <li>기업 가치</li>
            <li>레고 앱</li>
            <li>레고 매거진</li>
            <li>블프 라이브쇼핑</li>
            <li>레고 전 제품</li>
          </ul>

          <ul className="menu1">
            <a href="#">고객지원</a>
            <li>주문 현황 확인</li>
            <li>배송 및 반품</li>
            <li>스토어 검색</li>
          </ul>

          <ul className="icon">
            <li>
              <img className="heartIcon" src="/section1Img/heart.png" alt="하트 아이콘" />
            </li>
            <li>
              <img className="shoppingBagIcon" src="/section1Img/shoppingBag.png" alt="쇼핑 아이콘" />
            </li>
            <li>
              <img
                ref={btnRef}
                className={`meunListIcon ${menuOpen ? "active" : ""}`}
                src="/section1Img/meunList.png"
                alt="메뉴 아이콘"
                onClick={() => setMenuOpen((v) => !v)}
                role="button"
                tabIndex={0}
                aria-expanded={menuOpen}
                aria-controls="s2Menu"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setMenuOpen((v) => !v);
                  }
                }}
              />
            </li>
          </ul>
        </div>
      </header>

      <div id="s2Menu" ref={menuRef} className={menuOpen ? "open" : ""}>
        <ul className="s2Menu1">
          <a href="#">1. 제품구매</a>
          <li>*시리즈별 세트</li>
          <li>*연령별</li>
          <li>*가격별</li>
          <li>*특별한 날을 위한 세트</li>
          <li>*레고&reg; 상품</li>
          <li>*레고&reg; 데코</li>
        </ul>

        <ul className="s2Menu1">
          <a href="#">2. 브랜드소개</a>
          <li>*기업 가치</li>
          <li>*레고 앱</li>
          <li>*레고 매거진</li>
          <li>*블프 라이브쇼핑</li>
          <li>*레고 전 제품</li>
        </ul>

        <ul className="s2Menu1">
          <a href="#">3. 고객지원</a>
          <li>*주문 현황 확인</li>
          <li>*배송 및 반품</li>
          <li>*스토어 검색</li>
        </ul>
      </div>

      <div id="section1Meddle">
        <h1>
          상상 속 세상을<span className="line"></span>현실로{" "}
        </h1>
        <p className="p1">상상으로만 그리던 세상, 이제는 눈앞에 펼쳐집니다.</p>
        <p className="p2">
          레고는 상상의 한계를 넘어서{" "}
          <span className="p3">당신만의 세계를 현실로 만들어줍니다.</span>
        </p>
      </div>
    </section>
  );
}
