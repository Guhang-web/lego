// src/section3_fp.tsx
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
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
  const [swiper, setSwiper] = useState<any>(null);

  // 상위(FullPageNav)에 제어 API 전달
  useEffect(() => {
    if (!swiper) return;
    exposeApi?.({
      slideNext: () => swiper.slideNext?.(700),
      slidePrev: () => swiper.slidePrev?.(700),
      isBeginning: () => !!swiper.isBeginning,
      isEnd: () => !!swiper.isEnd,
    });
  }, [swiper, exposeApi]);

  return (
    <section
      id="section3"
      ref={(el) => {
        rootRef.current = el;
        refEl?.(el);
      }}
    >
      <Swiper
        className="s3-swiper"
        onSwiper={setSwiper}
        slidesPerView={1}
        spaceBetween={0}
        loop={false}
        speed={700}
        allowTouchMove={false}   // 전역 휠만 쓰기
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <Section3Slide {...s} index={i} swiper={swiper} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
