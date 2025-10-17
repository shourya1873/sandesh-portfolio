'use client';
import React, { useEffect, useRef } from 'react';

type CursorProps = {
    dotSize?: number;
    ringSize?: number;
    hoverRingSize?: number;
    ringColor?: string;
    ringBorder?: string;
    speed?: number;
    hideNative?: boolean;
    enabledOnMobile?: boolean;
};

export default function CursorFollower({
                                           dotSize = 8,
                                           ringSize = 40,
                                           hoverRingSize = 80,
                                           ringColor = 'rgba(255,255,255,0.12)', // darker by default
                                           ringBorder = '1px solid rgba(255,255,255,0.3)',
                                           speed = 0.16,
                                           hideNative = false,
                                           enabledOnMobile = false,
                                       }: CursorProps) {
    const ringRef = useRef<HTMLDivElement | null>(null);
    const dotRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const posRef = useRef({ x: -9999, y: -9999 });
    const targetRef = useRef({ x: -9999, y: -9999 });

    const stateRef = useRef({
        ringDiameter: ringSize,
        targetDiameter: ringSize,
        ringOpacity: 0,
        targetOpacity: 0,
        ringBg: 'transparent',
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch && !enabledOnMobile) return;

        const ring = ringRef.current;
        const dot = dotRef.current;
        if (!ring || !dot) return;

        const initX = window.innerWidth / 2;
        const initY = window.innerHeight / 2;
        posRef.current = { x: initX, y: initY };
        targetRef.current = { x: initX, y: initY };
        dot.style.transform = `translate3d(${initX - dotSize / 2}px, ${initY - dotSize / 2}px, 0)`;
        ring.style.opacity = '0';
        ring.style.background = 'transparent';

        if (hideNative) {
            try { document.documentElement.style.cursor = 'none'; } catch {}
        }

        function onMove(e: MouseEvent) {
            targetRef.current.x = e.clientX;
            targetRef.current.y = e.clientY;
            dot.style.transform = `translate3d(${e.clientX - dotSize / 2}px, ${e.clientY - dotSize / 2}px, 0)`;
            stateRef.current.targetOpacity = 1;
        }
        function onTouch(e: TouchEvent) {
            const t = e.touches[0];
            if (!t) return;
            targetRef.current.x = t.clientX;
            targetRef.current.y = t.clientY;
            dot.style.transform = `translate3d(${t.clientX - dotSize / 2}px, ${t.clientY - dotSize / 2}px, 0)`;
            stateRef.current.targetOpacity = 1;
        }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onTouch, { passive: true });

        // --- Delegated hover detection (more reliable than per-element mouseenter) ---
        const interactiveSelector = 'a, button, input, textarea, select, [role="button"], [data-cursor]';
        let hoveredInteractive: Element | null = null;

        function onDocOver(e: MouseEvent) {
            const target = (e.target as Element | null);
            const found = target?.closest ? target.closest(interactiveSelector) : null;
            if (found && hoveredInteractive !== found) {
                hoveredInteractive = found;
                // console.log('cursor: hover on', found); // <-- uncomment to debug
                stateRef.current.targetDiameter = hoverRingSize;
                stateRef.current.targetOpacity = 0.98;
                stateRef.current.ringBg = ringColor;
            }
        }

        function onDocOut(e: MouseEvent) {
            // relatedTarget is where the pointer moved to
            const related = (e as any).relatedTarget as Element | null;
            // if we moved to another interactive inside the selector, do nothing
            if (related && related.closest && related.closest(interactiveSelector)) {
                return;
            }
            // otherwise clear hover
            if (hoveredInteractive) {
                // console.log('cursor: hover off', hoveredInteractive); // <-- debug
                hoveredInteractive = null;
                stateRef.current.targetDiameter = ringSize;
                stateRef.current.targetOpacity = 1;
                stateRef.current.ringBg = 'transparent';
            }
        }

        document.addEventListener('mouseover', onDocOver);
        document.addEventListener('mouseout', onDocOut);

        // animation loop (same as before)
        function loop() {
            const cur = posRef.current;
            const tgt = targetRef.current;
            cur.x += (tgt.x - cur.x) * speed;
            cur.y += (tgt.y - cur.y) * speed;

            const s = stateRef.current;
            s.ringDiameter += (s.targetDiameter - s.ringDiameter) * 0.18;
            s.ringOpacity += (s.targetOpacity - s.ringOpacity) * 0.12;

            const d = s.ringDiameter;
            ring.style.width = `${d}px`;
            ring.style.height = `${d}px`;
            ring.style.border = ringBorder;
            ring.style.background = s.ringBg;
            ring.style.opacity = String(s.ringOpacity);
            ring.style.transform = `translate3d(${cur.x - d / 2}px, ${cur.y - d / 2}px, 0)`;

            rafRef.current = requestAnimationFrame(loop);
        }
        rafRef.current = requestAnimationFrame(loop);

        // cleanup
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onTouch);
            document.removeEventListener('mouseover', onDocOver);
            document.removeEventListener('mouseout', onDocOut);
            if (hideNative) {
                try { document.documentElement.style.cursor = ''; } catch {}
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dotSize,
        ringSize,
        hoverRingSize,
        ringColor,
        ringBorder,
        speed,
        hideNative,
        enabledOnMobile,
    ]);

    const dotStyle: React.CSSProperties = {
        position: 'fixed', top: 0, left: 0,
        width: dotSize, height: dotSize,
        borderRadius: 9999, pointerEvents: 'none',
        transform: `translate3d(-50%, -50%, 0)`, zIndex: 9999,
        background: 'rgba(255,255,255,0.95)', boxShadow: '0 1px 4px rgba(0,0,0,0.25)', transition: 'opacity 120ms linear',
    };

    const ringStyle: React.CSSProperties = {
        position: 'fixed', top: 0, left: 0,
        width: ringSize, height: ringSize,
        borderRadius: 9999, pointerEvents: 'none',
        transform: `translate3d(-50%, -50%, 0)`, zIndex: 9998,
        background: 'transparent', border: ringBorder, transition: 'background 160ms linear, width 160ms linear, height 160ms linear, opacity 160ms linear',
        opacity: 0,
    };

    return (
        <>
            <div ref={ringRef} style={ringStyle} aria-hidden="true" />
            <div ref={dotRef} style={dotStyle} aria-hidden="true" />
        </>
    );
}
