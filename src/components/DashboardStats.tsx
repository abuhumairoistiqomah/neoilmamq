import React from "react";
import { Worksheet, GradeStat } from "../types";
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Layers, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";

interface DashboardStatsProps {
  worksheets: Worksheet[];
  onGradeClick: (grade: number) => void;
}

export default function DashboardStats({ worksheets, onGradeClick }: DashboardStatsProps) {
  // Compute Grade Stats (1 to 6)
  const computeStats = (): GradeStat[] => {
    const stats: GradeStat[] = [];
    for (let g = 1; g <= 6; g++) {
      const gradeWorksheets = worksheets.filter((w) => Number(w.grade) === g);
      const uniqueChapters = new Set(gradeWorksheets.map((w) => w.chapter.trim())).size;
      const uniqueTopics = new Set(gradeWorksheets.map((w) => w.topic.trim())).size;
      
      const gradeLearningMaterials = gradeWorksheets.filter((w) => {
        const typeLower = w.type?.toLowerCase() || "";
        return typeLower.includes("learning material") || typeLower.includes("materi") || typeLower.includes("modul") || typeLower.includes("bahan ajar");
      }).length;

      stats.push({
        grade: g,
        count: gradeWorksheets.length - gradeLearningMaterials,
        chaptersCount: uniqueChapters,
        topicsCount: uniqueTopics,
        learningMaterialsCount: gradeLearningMaterials,
      });
    }
    return stats;
  };

  const gradeStats = computeStats();

  // Aggregate stats
  const totalCount = worksheets.length;
  
  const pdfCount = worksheets.filter(
    (w) => w.type?.toLowerCase().includes("pdf") || w.type?.toLowerCase() === "pdf"
  ).length;

  const quizizzCount = worksheets.filter(
    (w) => w.type?.toLowerCase().includes("quiz") || w.type?.toLowerCase().includes("kuis") || w.type?.toLowerCase().includes("digital")
  ).length;

  const learningMaterialsCount = worksheets.filter((w) => {
    const typeLower = w.type?.toLowerCase() || "";
    return typeLower.includes("learning material") || typeLower.includes("materi") || typeLower.includes("modul") || typeLower.includes("bahan ajar");
  }).length;

  // Grade Card Color Configs
  const gradeColors = [
    {
      // 1 MQ - Blue
      bg: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800",
      iconBg: "bg-blue-600 text-white shadow-blue-100",
      badge: "bg-blue-50 text-blue-700 border border-blue-100",
      accentLine: "bg-blue-500",
      progressBg: "bg-blue-500",
    },
    {
      // 2 MQ - Emerald
      bg: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800",
      iconBg: "bg-emerald-600 text-white shadow-emerald-100",
      badge: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      accentLine: "bg-emerald-500",
      progressBg: "bg-emerald-500",
    },
    {
      // 3 MQ - Indigo
      bg: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800",
      iconBg: "bg-indigo-600 text-white shadow-indigo-100",
      badge: "bg-indigo-50 text-indigo-700 border border-indigo-100",
      accentLine: "bg-indigo-500",
      progressBg: "bg-indigo-500",
    },
    {
      // 4 MQ - Orange
      bg: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800",
      iconBg: "bg-orange-500 text-white shadow-orange-100",
      badge: "bg-orange-50 text-orange-700 border border-orange-100",
      accentLine: "bg-orange-500",
      progressBg: "bg-orange-500",
    },
    {
      // 5 MQ - Rose
      bg: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800",
      iconBg: "bg-rose-500 text-white shadow-rose-100",
      badge: "bg-rose-50 text-rose-700 border border-rose-100",
      accentLine: "bg-rose-500",
      progressBg: "bg-rose-500",
    },
    {
      // 6 MQ - Amber
      bg: "bg-white hover:bg-slate-50 border-slate-200 text-slate-800",
      iconBg: "bg-amber-500 text-white shadow-amber-100",
      badge: "bg-amber-50 text-amber-700 border border-amber-100",
      accentLine: "bg-amber-500",
      progressBg: "bg-amber-500",
    },
  ];

  return (
    <div id="dashboard-stats-container" className="space-y-8">
      {/* Visual Banner */}
      <div 
        id="dashboard-hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 z-10">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-blue-200 border border-white/5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              ILMA: Inspiring Little Mathematicians
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang di <span className="text-blue-400">Neo ILMA - MQ Version</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Portal bank soal matematika interaktif, Worksheets, Modul/Bahan Ajar, dan Kuis Digital (Quiziss) untuk SD/MQ.
            </p>
          </div>

          {/* Quick counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full md:w-auto shrink-0">
            <div className="flex flex-col rounded-2xl bg-white/5 border border-white/10 px-4 py-3 min-w-[100px] backdrop-blur-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total File</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                {totalCount}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-white/5 border border-white/10 px-4 py-3 min-w-[100px] backdrop-blur-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Modul/Bahan Ajar</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                {learningMaterialsCount}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-white/5 border border-white/10 px-4 py-3 min-w-[100px] backdrop-blur-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Worksheets PDF</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                {pdfCount}
              </span>
            </div>
            <div className="flex flex-col rounded-2xl bg-white/5 border border-white/10 px-4 py-3 min-w-[100px] backdrop-blur-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Kuis Digital (Quiziss)</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-blue-400 mt-1">
                {quizizzCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Statistics Grid */}
      <div id="stats-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg tracking-tight">
            Statistik Worksheets per Kelas (MQ)
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Klik kartu untuk memilih kelas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gradeStats.map((stat, index) => {
            const config = gradeColors[index % gradeColors.length];
            const gradeTotal = stat.count + (stat.learningMaterialsCount || 0);
            const percent = totalCount > 0 ? Math.min(100, Math.round((gradeTotal / totalCount) * 100)) : 0;
            return (
              <div
                key={stat.grade}
                id={`grade-card-${stat.grade}`}
                onClick={() => onGradeClick(stat.grade)}
                className={`relative overflow-hidden cursor-pointer rounded-2xl border p-5 transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1 flex flex-col justify-between ${config.bg}`}
              >
                {/* Accent indicator line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentLine}`} />

                <div className="pl-1 space-y-4">
                  {/* Top Header Card */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-md ${config.iconBg}`}>
                        {stat.grade}
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">
                          {stat.grade} MQ
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                          Kelas {stat.grade} MQ
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${config.badge}`}>
                        {stat.count} Worksheets
                      </span>
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        {stat.learningMaterialsCount || 0} Modul/Bahan Ajar
                      </span>
                    </div>
                  </div>

                  {/* Body Content Info */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-600">
                        <strong className="text-slate-800 font-semibold">{stat.chaptersCount}</strong> Bab
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-600">
                        <strong className="text-slate-800 font-semibold">{stat.topicsCount}</strong> Topik
                      </span>
                    </div>
                  </div>

                  {/* Micro-progress bar */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1">
                      <span>Rasio Kontribusi</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${config.progressBg}`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Link Button */}
                <div className="mt-4 pl-1 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors">
                  <span>Lihat Worksheets</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
