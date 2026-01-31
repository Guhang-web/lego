// App.tsx
import { useEffect, useLayoutEffect, useRef } from "react";
import "./App.css";
import FullPageNav from "./FullPageNav";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function App() {
  //  실제로 transform 될 컨텐츠
  const contentRef = useRef<HTMLDivElement | null>(null);

  //  가상 스크롤 상태
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const maxYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  //  wheel 잠금(Section3 같은 “내부 전환 구간”에서 App이 wheel을 먹지 않게)
  const wheelLockRef = useRef(false);

  // 측정 + maxY 갱신
  const measure = () => {
    const el = contentRef.current;
    if (!el) return;
    const contentH = el.getBoundingClientRect().height;
    const maxY = Math.max(0, contentH - window.innerHeight);
    maxYRef.current = maxY;
    targetYRef.current = clamp(targetYRef.current, 0, maxY);
    currentYRef.current = clamp(currentYRef.current, 0, maxY);
  };

  // rAF 루프: transform + vscroll 이벤트 송출
  const startRAF = () => {
    const tick = () => {
      const el = contentRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // 부드러운 보간
      const t = targetYRef.current;
      const c = currentYRef.current;
      const next = c + (t - c) * 0.12;

      // 거의 도달하면 스냅
      currentYRef.current = Math.abs(next - t) < 0.1 ? t : next;

      //  실제 이동
      el.style.transform = `translate3d(0, ${-currentYRef.current}px, 0)`;

      //  section3가 기다리는 이벤트
      window.dispatchEvent(new CustomEvent("vscroll", { detail: { y: currentYRef.current } }));

      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  useLayoutEffect(() => {
    // 페이지 진입 시 최상단
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      //  Section3 등이 wheel 잠금 걸면 App은 y를 업데이트하지 않음
      if (wheelLockRef.current) return;

      const delta = e.deltaY;
      targetYRef.current = clamp(targetYRef.current + delta, 0, maxYRef.current);
    };

    const onResize = () => {
      measure();
    };

    const onVscrollTo = (e: Event) => {
      const ce = e as CustomEvent<{ y: number }>;
      const y = ce?.detail?.y ?? 0;
      targetYRef.current = clamp(y, 0, maxYRef.current);
    };

    //  외부(Section3)에서 App wheel 제어
    const onLock = () => {
      wheelLockRef.current = true;
    };
    const onUnlock = () => {
      wheelLockRef.current = false;
    };

    // 초기 측정/시작
    measure();
    startRAF();

    requestAnimationFrame(() => measure());
    setTimeout(() => measure(), 0);

    // 이벤트 바인딩
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    window.addEventListener("vscroll:to", onVscrollTo as EventListener);
    window.addEventListener("vscroll:lock", onLock);
    window.addEventListener("vscroll:unlock", onUnlock);

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("vscroll:to", onVscrollTo as EventListener);
      window.removeEventListener("vscroll:lock", onLock);
      window.removeEventListener("vscroll:unlock", onUnlock);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="vs">
      {/*  이 안이 가상 스크롤로 움직이는 실제 컨텐츠 */}
      <div className="vs__content" ref={contentRef}>
        <FullPageNav />
      </div>
    </div>
  );
}
