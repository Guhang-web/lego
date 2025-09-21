import React, { useEffect, useRef, useState, useCallback } from "react";
import { slides, Section3Slide } from "./section3";
import "./section3.css";

export type Section3Handle = {
  slideNext: () => void;
  slidePrev: () => void;
  isBeginning: () => boolean;
  isEnd: () => boolean;
};

export default function Section3FP({
  refEl,
  exposeApi,
}: {
  refEl?: (el: HTMLElement | null) => void;
  exposeApi?: (api: Section3Handle) => void;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);
  const [fading, setFading] = useState(false);
  const max = slides.length - 1;

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(max, i));
    setIndex(next);
  }, [max]);

  const slideNext = useCallback(() => {
    if (index >= max) return;
    setFading(true);
    setTimeout(() => {
      goTo(index + 1);
      setTimeout(() => setFading(false), 300);
    }, 220);
  }, [index, max, goTo]);

  const slidePrev = useCallback(() => {
    if (index <= 0) return;
    setFading(true);
    setTimeout(() => {
      goTo(index - 1);
      setTimeout(() => setFading(false), 300);
    }, 220);
  }, [index, goTo]);

  // 상위에 제어 API 노출
  useEffect(() => {
    exposeApi?.({
      slideNext,
      slidePrev,
      isBeginning: () => index === 0,
      isEnd: () => index === max,
    });
  }, [exposeApi, slideNext, slidePrev, index, max]);

  // 섹션 내부 휠만 소비
  const onWheel: React.WheelEventHandler<HTMLElement> = (e) => {
    const dy = e.deltaY;
    if (Math.abs(dy) < 10) return;
    if (lock) return;
    e.preventDefault();
    setLock(true);
    if (dy > 0) slideNext(); else slidePrev();
    setTimeout(() => setLock(false), 750);
  };

  const s = slides[index];

  return (
    <section
      id="section3"
      ref={(el) => {
        rootRef.current = el;
        refEl?.(el);
      }}
      className="s3-stage"
      onWheel={onWheel}
    >
      <Section3Slide
        {...s}
        index={index}
        onNext={slideNext}
        onPrev={slidePrev}
        fading={fading}
      />
    </section>
  );
}
