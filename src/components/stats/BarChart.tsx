"use client";
import { useState } from "react";
import type { DailyStat } from "@/hooks/useStats";

interface BarChartProps {
  data: DailyStat[];
  title: string;
  subtitle?: string;
}

export function BarChart({ data, title, subtitle }: BarChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mb-6">{subtitle}</p>}
        <div className="h-40 flex items-center justify-center text-sm text-slate-300">
          데이터가 없어요
        </div>
      </div>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const width = 100;
  const barWidth = width / data.length;
  const isMonthly = data.length > 14;

  const avgRate = Math.round(data.reduce((sum, d) => sum + d.rate, 0) / data.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <div className="text-right">
          <p className="text-xs text-slate-400">평균 완료율</p>
          <p className="text-lg font-bold text-blue-500">{avgRate}%</p>
        </div>
      </div>
      {subtitle && <p className="text-xs text-slate-400 mb-5">{subtitle}</p>}

      <div className="relative">
        {/* Y-axis grid (4 lines) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25, 0].map((y) => (
            <div key={y} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300 w-7 text-right">{y}%</span>
              <div className="flex-1 border-t border-dashed border-slate-100" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="relative h-40 ml-9 flex items-end gap-1">
          {data.map((d, i) => {
            const barH = d.total > 0 ? (d.rate / 100) * 100 : 0;
            const isHover = hoverIdx === i;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end relative group cursor-pointer"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {isHover && (
                  <div className="absolute bottom-full mb-1.5 z-10 bg-slate-800 text-white text-[11px] px-2 py-1 rounded-md whitespace-nowrap pointer-events-none">
                    {d.label} · {d.completed}/{d.total} ({d.rate}%)
                  </div>
                )}
                <div
                  className={`w-full rounded-t-md transition-all duration-150 ${
                    d.total === 0 ? "bg-slate-100" : isHover ? "bg-blue-600" : "bg-blue-400"
                  }`}
                  style={{ height: `${d.total > 0 ? Math.max(barH, 2) : 2}%`, minHeight: d.total > 0 ? 2 : 2 }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="ml-9 mt-2 flex gap-1">
          {data.map((d, i) => {
            // 월간은 5일마다, 주간은 모두 표시
            const show = isMonthly ? i % 5 === 0 || i === data.length - 1 : true;
            return (
              <div key={i} className="flex-1 text-center">
                {show && <span className="text-[10px] text-slate-400">{d.label}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
