"use client";
import { useEffect } from "react";

const getScrollableAncestor = (node: EventTarget | null, deltaY: number): HTMLElement | null => {
  let el = node instanceof HTMLElement ? node : null;
  while (el && el !== document.documentElement && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      const canScrollDown = deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      const canScrollUp = deltaY < 0 && el.scrollTop > 1;
      if (canScrollDown || canScrollUp) return el;
    }
    el = el.parentElement;
  }
  return null;
};

/**
 * Provides desktop wheel-inertia and hash-link smooth scrolling using
 * frame-rate-independent exponential damping while preserving native touch,
 * scrollbar dragging, keyboard navigation, and reduced-motion preferences.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    let lastTime = 0;
    let currentY = window.scrollY;
    let prevY = window.scrollY;
    let targetY = window.scrollY;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const stopAnimation = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      lastTime = 0;
    };

    const syncToWindow = () => {
      stopAnimation();
      currentY = window.scrollY;
      prevY = currentY;
      targetY = currentY;
    };

    const tick = (now: number) => {
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;

      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.4) {
        prevY = currentY;
        currentY = targetY;
        window.scrollTo(0, currentY);
        stopAnimation();
        return;
      }

      // Exponential smoothing independent of display refresh rate (60Hz / 120Hz / 144Hz)
      const factor = 1 - Math.exp(-8.5 * dt);
      prevY = currentY;
      currentY += diff * factor;
      window.scrollTo(0, currentY);
      raf = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (!raf) {
        lastTime = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerHeight;

      if (Math.abs(delta) < 0.1) return;
      if (getScrollableAncestor(e.target, delta)) return;

      e.preventDefault();
      if (!raf) {
        currentY = window.scrollY;
        prevY = currentY;
        targetY = currentY;
      }
      targetY = Math.min(getMaxScroll(), Math.max(0, targetY + delta));
      startAnimation();
    };

    const onScroll = () => {
      if (!raf) {
        syncToWindow();
        return;
      }
      // Allow async browser scroll delivery between prevY and currentY; cancel on external jumps
      const minExpected = Math.min(prevY, currentY) - 4;
      const maxExpected = Math.max(prevY, currentY) + 4;
      if (window.scrollY < minExpected || window.scrollY > maxExpected) {
        syncToWindow();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) {
        syncToWindow();
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const targetEl = document.getElementById(id);
      if (!targetEl) return;

      e.preventDefault();
      currentY = window.scrollY;
      prevY = currentY;
      const top = targetEl.getBoundingClientRect().top + window.scrollY;
      targetY = Math.min(getMaxScroll(), Math.max(0, top));
      startAnimation();
    };

    const onResize = () => {
      const max = getMaxScroll();
      targetY = Math.min(targetY, max);
      currentY = Math.min(currentY, max);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", syncToWindow, { passive: true });
    window.addEventListener("pointerdown", syncToWindow, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });
    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      stopAnimation();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", syncToWindow);
      window.removeEventListener("pointerdown", syncToWindow);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
