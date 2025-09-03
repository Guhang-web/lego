// src/StarfieldCanvas.tsx
import { useEffect, useRef } from 'react';

type Props = {
    /** 별 밀도(화면 1px당 별 개수). 0.00018 ~ 0.00035 권장 */
    density?: number;
    /** 기본 하강 속도(px/초). 40~90 권장 */
    speed?: number;
    /** true면 반짝임 */
    twinkle?: boolean;
    /** 'down' | 'down-right' | 'down-left' */
    direction?: 'down' | 'down-right' | 'down-left';
    /** 애니 정지 */
    paused?: boolean;
    /** 추가 클래스 (레이어 배치 제어용) */
    className?: string;
    /** style zIndex 등 바꾸고 싶을 때 */
    style?: React.CSSProperties;
    //   색 변화
    color?: string
};

type Star = {
    x: number;
    y: number;
    z: number;       // 0(가까움)~1(먼 곳) → 속도/크기 결정
    size: number;    // px
    baseAlpha: number;
    amp: number;     // twinkle amplitude
    phase: number;
};

export default function StarfieldCanvas({
    density = 0.00025,
    speed = 60,
    twinkle = true,
    direction = 'down',
    paused = false,
    className,
    style,
    color = '#d6b600ff',
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const starsRef = useRef<Star[]>([]);
    const rafRef = useRef<number | null>(null);
    const running = useRef(false);
    const lastTs = useRef<number>(0);
    const inView = useRef(true); // 인터섹션 옵저버로 관리

    const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 크기/해상도 조정 + 별 수 산정
    const resize = () => {
        const canvas = canvasRef.current!;
        const parent = canvas.parentElement!;
        const dpr = Math.max(1, window.devicePixelRatio || 1);

        const w = parent.clientWidth;
        const h = parent.clientHeight;

        // CSS 픽셀 기준으로 그릴 거라서 컨텍스트를 dpr로 스케일
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        const ctx = canvas.getContext('2d')!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 이제부터는 CSS px 단위로 그려짐
        ctx.imageSmoothingEnabled = false;

        // 별 개수 재산정 (면적 * density)
        const targetCount = Math.max(
            30,
            Math.floor(w * h * density * (prefersReduced ? 0.4 : 1))
        );

        const arr = starsRef.current;
        // 부족하면 채움, 많으면 줄임
        if (arr.length < targetCount) {
            for (let i = arr.length; i < targetCount; i++) {
                arr.push(makeStar(w, h));
            }
        } else if (arr.length > targetCount) {
            arr.length = targetCount;
        }
    };

    const makeStar = (w: number, h: number): Star => {
        const z = Math.random(); // 0~1, 멀수록 작고 느림
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            z,
            size: lerp(0.6, 1.8, 1 - z), // 가까울수록 큼
            baseAlpha: lerp(0.45, 0.95, 1 - z),
            amp: Math.random() * 0.35,   // 반짝임 세기
            phase: Math.random() * Math.PI * 2,
        };
    };

    const step = (ts: number) => {
        if (!running.current) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const parent = canvas.parentElement!;
        const w = parent.clientWidth;
        const h = parent.clientHeight;

        // dt (초)
        const dt = Math.min(0.05, (ts - (lastTs.current || ts)) / 1000);
        lastTs.current = ts;

        ctx.clearRect(0, 0, w, h);

        const dirX =
            direction === 'down-right' ? 0.25 :
                direction === 'down-left' ? -0.25 : 0;

        for (const s of starsRef.current) {
            // 깊이에 따른 속도(먼 곳일수록 느리게)
            const v = speed * (0.35 + (1 - s.z) * 0.85); // 0.35~1.2 배

            s.y += v * dt;
            s.x += v * dirX * dt;

            // 아래로 벗어나면 위로 재스폰
            if (s.y - s.size > h) {
                s.y = -s.size - Math.random() * 20;
                s.x = Math.random() * w;
            }
            // 좌우 래핑
            if (s.x < -5) s.x = w + 5;
            if (s.x > w + 5) s.x = -5;

            // 알파(반짝임)
            const alpha = twinkle
                ? clamp(
                    s.baseAlpha + Math.sin(ts * 0.002 + s.phase) * s.amp,
                    0.1,
                    1
                )
                : s.baseAlpha;

            ctx.globalAlpha = alpha;
            // 점 그리기(빠른 원)
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        rafRef.current = requestAnimationFrame(step);
    };

    const start = () => {
        if (running.current) return;
        running.current = true;
        lastTs.current = 0;
        rafRef.current = requestAnimationFrame(step);
    };

    const stop = () => {
        running.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement!);

        // 보일 때만 애니
        const io = new IntersectionObserver(
            ([entry]) => {
                inView.current = entry.isIntersecting && entry.intersectionRatio > 0.05;
                updateRunState();
            },
            { threshold: [0, 0.05, 0.2, 0.5, 1] }
        );
        io.observe(canvas);

        // 탭 숨김 대응
        const onVis = () => updateRunState();
        document.addEventListener('visibilitychange', onVis);

        // 초기화
        resize();
        updateRunState();

        return () => {
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
            stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 외부 상태 변화로 런/스톱 재평가
    useEffect(() => {
        updateRunState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused, speed, density, twinkle, direction]);

    const updateRunState = () => {
        const shouldRun =
            !paused &&
            !prefersReduced &&
            inView.current &&
            document.visibilityState !== 'hidden';
        if (shouldRun) start();
        else stop();
    };

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                ...style,
            }}
            aria-hidden="true"
        />
    );
}

// ---------- utils ----------
function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}
function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}
