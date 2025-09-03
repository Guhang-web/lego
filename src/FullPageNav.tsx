// FullPageNav.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3, { type Section3Handle } from "./section3_fp";
import Section4 from "./section4";
import Section5 from "./section5";
import Footer from "./footer";

const TRANSITION_MS = 700;

// ✅ 고정 footer 높이(px)
const FOOTER_PX = 446;

// s1~s5(=5개) + footer(1개) = 6
const SECTION_COUNT = 6;
const LAST_INDEX = SECTION_COUNT - 1;

export default function FullPageNav() {
    const [active, setActive] = useState(0);
    const [lock, setLock] = useState(false);

    const trackRef = useRef<HTMLDivElement>(null);
    const s3Ref = useRef<HTMLElement | null>(null);
    const s3Api = useRef<Section3Handle | null>(null);
    const s3Cooldown = useRef(false);

    const s4El = useRef<HTMLElement | null>(null);
    const s5El = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!trackRef.current) return;
        s4El.current = trackRef.current.querySelector("#section4");
        s5El.current = trackRef.current.querySelector("#section5");
    }, []);

    const clamp = (n: number) => Math.max(0, Math.min(LAST_INDEX, n));
    const slideTo = (n: number) => {
        if (lock) return;
        const next = clamp(n);
        if (next === active) return;
        setLock(true);
        setActive(next);
        setTimeout(() => setLock(false), TRANSITION_MS + 40);
    };

    const within = (root: HTMLElement | null, target: EventTarget | null) =>
        !!(root && target instanceof Node && root.contains(target));

    // ✅ offsetFor: 양수 오프셋(위에서부터 거리)
    const offsetFor = (i: number) =>
        i < LAST_INDEX
            ? `${i * 100}vh`
            : `calc(${(SECTION_COUNT - 2) * 100}vh + ${FOOTER_PX}px)`;
    // ✅ 음수 오프셋(translateY에 바로 쓸 값) — calc 중첩 없이 문자열 생성
    const negOffsetFor = (i: number) =>
        i < LAST_INDEX
            ? `-${i * 100}vh`
            : `calc(-${(SECTION_COUNT - 2) * 100}vh - ${FOOTER_PX}px)`;


    const trackStyle: React.CSSProperties = {
        transform: `translate3d(0, ${negOffsetFor(active)}, 0)`, // ⬅️ 여기!
        transition: `transform ${TRANSITION_MS}ms ease`,
        willChange: "transform",
        height: `calc(${(SECTION_COUNT - 1) * 100}vh + ${FOOTER_PX}px)`,
        width: "100%",
        position: "relative",
    };

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            if (lock) return;

            const dy = e.deltaY;
            const dir = dy > 0 ? "down" : dy < 0 ? "up" : "none";
            if (dir === "none") return;

            // section3: 가로 슬라이드 우선
            if (active === 2 && within(s3Ref.current, e.target)) {
                e.preventDefault();
                const api = s3Api.current;
                if (!api) return;
                if (s3Cooldown.current) return;
                s3Cooldown.current = true;
                setTimeout(() => (s3Cooldown.current = false), 520);

                const atFirst = api.isBeginning();
                const atLast = api.isEnd();

                if (dir === "down") {
                    if (!atLast) api.slideNext();
                    else slideTo(active + 1);
                } else {
                    if (!atFirst) api.slidePrev();
                    else slideTo(active - 1);
                }
                return;
            }

            // section4/5: 내부 스크롤 우선
            if (active === 3 || active === 4) {
                const box = active === 3 ? s4El.current : s5El.current;
                if (box && within(box, e.target)) {
                    const { scrollTop, scrollHeight, clientHeight } = box;
                    const atTop = scrollTop <= 0;
                    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

                    if (dir === "down" && atBottom) {
                        e.preventDefault();
                        slideTo(active + 1);
                    } else if (dir === "up" && atTop) {
                        e.preventDefault();
                        slideTo(active - 1);
                    }
                    return; // 중간이면 내부 스크롤만
                }
            }

            // 일반 섹션
            e.preventDefault();
            slideTo(active + (dir === "down" ? 1 : -1));
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => window.removeEventListener("wheel", onWheel);
    }, [active, lock]);

    return (
        <div className="fp-root">
            <div className="fp-track" ref={trackRef} style={trackStyle}>
                <div className="fp-section"><Section1 /></div>
                <div className="fp-section"><Section2 /></div>
                <div className="fp-section">
                    <Section3 refEl={(el) => (s3Ref.current = el)} exposeApi={(api) => (s3Api.current = api)} />
                </div>
                <div className="fp-section"><Section4 /></div>
                <div className="fp-section"><Section5 /></div>

                {/* ✅ 마지막 섹션은 height:auto로 */}
                <div className="fp-section fp-last">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
