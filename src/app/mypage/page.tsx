"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStats } from "@/hooks/useStats";
import { BarChart } from "@/components/stats/BarChart";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";

export default function MyPage() {
  const { user } = useAuth();
  const { stats, loading } = useStats();
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
      </div>
    );
  }

  const data = period === "weekly" ? stats.weekly : stats.monthly;
  const avgRate = data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + d.rate, 0) / data.length)
    : 0;
  const periodCompleted = data.reduce((sum, d) => sum + d.completed, 0);
  const periodTotal = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold">
            {user?.nickname.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {user?.nickname}님의 마이페이지
            </h1>
            <p className="text-sm text-slate-400">주간 · 월간 완료율을 확인해보세요</p>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">완료율 추이</h2>
        <div className="inline-flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              period === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
            }`}
          >
            주간 (7일)
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              period === "monthly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
            }`}
          >
            월간 (30일)
          </button>
        </div>
      </div>

      {/* Summary numbers */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-blue-500 rounded-2xl p-5 text-white">
          <p className="text-xs font-medium text-blue-100 mb-2">평균 완료율</p>
          <p className="text-3xl font-bold tracking-tight">{avgRate}%</p>
          <p className="text-xs text-blue-100 mt-1">
            {period === "weekly" ? "최근 7일" : "최근 30일"} 평균
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-xs font-medium text-slate-400 mb-2">완료한 할일</p>
          <p className="text-3xl font-bold tracking-tight text-slate-800">
            {periodCompleted}<span className="text-base text-slate-300 font-medium"> / {periodTotal}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {period === "weekly" ? "최근 7일" : "최근 30일"} 기준
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <BarChart
        data={data}
        title={period === "weekly" ? "최근 7일 일별 완료율" : "최근 30일 일별 완료율"}
        subtitle="각 날짜에 생성된 할일 중 완료한 비율"
      />

      {/* Notification Settings */}
      <div className="mt-6">
        <NotificationSettings />
      </div>
    </div>
  );
}
