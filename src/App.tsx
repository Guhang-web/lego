// App.tsx
import { useEffect, useLayoutEffect, useRef } from "react";
import "./App.css";
import FullPageNav from "./FullPageNav";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function App() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const targetYRef = useRef(0);
  const currentYRef = useRef(0);
  const maxYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const wheelLockRef = useRef(false);

  const measure = () => {
    const el = contentRef.current;
    if (!el) return;
    const contentH = el.getBoundingClientRect().height;
    const maxY = Math.max(0, contentH - window.innerHeight);
    maxYRef.current = maxY;
    targetYRef.current = clamp(targetYRef.current, 0, maxY);
    currentYRef.current = clamp(currentYRef.current, 0, maxY);
  };

  const startRAF = () => {
    const tick = () => {
      const el = contentRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const t = targetYRef.current;
      const c = currentYRef.current;
      const next = c + (t - c) * 0.12;

      currentYRef.current = Math.abs(next - t) < 0.1 ? t : next;

      el.style.transform = `translate3d(0, ${-currentYRef.current}px, 0)`;

      window.dispatchEvent(new CustomEvent("vscroll", { detail: { y: currentYRef.current } }));

      rafRef.current = requestAnimationFrame(tick);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    // ✅ 이벤트 핸들러들을 "정확한 EventListener 타입"으로 선언해두면
    // add/remove에서 캐스팅 필요가 없어짐.

    const onWheel: EventListener = (ev) => {
      const e = ev as WheelEvent;
      e.preventDefault();

      if (wheelLockRef.current) return;

      const delta = e.deltaY;
      targetYRef.current = clamp(targetYRef.current + delta, 0, maxYRef.current);
    };

    const onResize: EventListener = () => {
      measure();
    };

    const onVscrollTo: EventListener = (ev) => {
      const ce = ev as CustomEvent<{ y: number }>;
      const y = ce.detail?.y ?? 0;
      targetYRef.current = clamp(y, 0, maxYRef.current);
    };

    const onLock: EventListener = () => {
      wheelLockRef.current = true;
    };

    const onUnlock: EventListener = () => {
      wheelLockRef.current = false;
    };

    measure();
    startRAF();

    requestAnimationFrame(() => measure());
    setTimeout(() => measure(), 0);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    window.addEventListener("vscroll:to", onVscrollTo);
    window.addEventListener("vscroll:lock", onLock);
    window.addEventListener("vscroll:unlock", onUnlock);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("vscroll:to", onVscrollTo);
      window.removeEventListener("vscroll:lock", onLock);
      window.removeEventListener("vscroll:unlock", onUnlock);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="vs">
      <div className="vs__content" ref={contentRef}>
        <FullPageNav />
      </div>
    </div>
  );
}
