"use client";

import { useEffect, useRef, useState } from "react";
import { IDLE_MS } from "@/lib/supabase/env";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "click",
  "keydown",
  "scroll",
  "touchstart",
  "touchmove",
] as const;

const WARN_MS = 30_000;

export function IdleTimeout() {
  const lastActivity = useRef<number>(Date.now());
  const [remaining, setRemaining] = useState<number>(IDLE_MS);

  useEffect(() => {
    const touch = () => {
      lastActivity.current = Date.now();
      document.cookie = `last_activity=${lastActivity.current}; path=/; max-age=86400; samesite=lax`;
    };

    touch();

    let lastWrite = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastWrite < 2_000) return;
      lastWrite = now;
      touch();
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, onActivity, { passive: true })
    );

    const timer = window.setInterval(() => {
      const left = IDLE_MS - (Date.now() - lastActivity.current);
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(timer);
        window.location.href = "/api/idle-logout";
      }
    }, 1_000);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, onActivity)
      );
      window.clearInterval(timer);
    };
  }, []);

  function extend() {
    lastActivity.current = Date.now();
    document.cookie = `last_activity=${lastActivity.current}; path=/; max-age=86400; samesite=lax`;
    setRemaining(IDLE_MS);
  }

  if (remaining > WARN_MS || remaining <= 0) return null;

  const seconds = Math.ceil(remaining / 1000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
          ⏳
        </span>
        <h2 className="text-lg font-bold text-slate-900">الجلسة هتتقفل قريب</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          هنسجّل خروجك تلقائيًا خلال{" "}
          <span className="font-bold text-amber-600">{seconds}</span> ثانية بسبب
          عدم النشاط. لو لسه بتشتغل اضغط الزر تحت.
        </p>
        <button
          type="button"
          onClick={extend}
          className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          مدد الجلسة
        </button>
      </div>
    </div>
  );
}
