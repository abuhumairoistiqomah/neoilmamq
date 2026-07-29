import React, { useState, useMemo } from "react";
import { Worksheet } from "../types";
import { 
  Search, 
  ExternalLink, 
  FileText, 
  Gamepad, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X, 
  BookOpen,
  FolderOpen,
  Sparkles
} from "lucide-react";

interface WorksheetListProps {
  worksheets: Worksheet[];
  selectedGrade?: number; // if undefined, shows all
  onGradeChange?: (grade: number) => void;
}

export default function WorksheetList({ worksheets, selectedGrade, onGradeChange }: WorksheetListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedChapter, setSelectedChapter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("All");

  // Filter worksheets for the current view (specific grade if selectedGrade is defined)
  const gradeWorksheets = useMemo(() => {
    if (selectedGrade) {
      return worksheets.filter((w) => Number(w.grade) === Number(selectedGrade));
    }
    // Dashboard page: respect the user's selectedGradeFilter
    if (selectedGradeFilter !== "All") {
      return worksheets.filter((w) => Number(w.grade) === Number(selectedGradeFilter));
    }
    return worksheets;
  }, [worksheets, selectedGrade, selectedGradeFilter]);

  // Extract all unique Chapters for the filter dropdown
  const uniqueChapters = useMemo(() => {
    const chapters = gradeWorksheets.map((w) => w.chapter.trim());
    return ["All", ...Array.from(new Set(chapters))].sort();
  }, [gradeWorksheets]);

  // Extract unique Types for filter
  const uniqueTypes = useMemo(() => {
    const types = gradeWorksheets.map((w) => {
      const t = w.type?.toLowerCase() || "";
      if (t.includes("quiz") || t.includes("kuis") || t.includes("digital")) {
        return "Kuis Digital (Quiziss)";
      }
      if (t.includes("pdf")) {
        return "Worksheets PDF";
      }
      if (t.includes("learning material") || t.includes("materi") || t.includes("modul") || t.includes("bahan ajar")) {
        return "Modul/Bahan Ajar";
      }
      return w.type?.trim() || "Lainnya";
    });
    const options = ["All", "Worksheets PDF", "Kuis Digital (Quiziss)", "Modul/Bahan Ajar"];
    const remaining = Array.from(new Set(types)).filter((t): t is string => typeof t === "string" && !options.includes(t));
    return [...options, ...remaining];
  }, [gradeWorksheets]);

  // Filter and Search Logic
  const filteredWorksheets = useMemo(() => {
    return gradeWorksheets.filter((w) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const matchSearch = 
         w.chapter.toLowerCase().includes(query) ||
         w.topic.toLowerCase().includes(query) ||
         w.id.toString().includes(query) ||
         (w.grade && `${w.grade} mq`.includes(query)) ||
         (w.grade && `kelas ${w.grade}`.includes(query));

      // 2. Type Filter
      let matchType = true;
      if (selectedType !== "All") {
        const typeLower = w.type?.toLowerCase() || "";
        if (selectedType === "Kuis Digital (Quiziss)") {
          matchType = typeLower.includes("quiz") || typeLower.includes("kuis") || typeLower.includes("digital");
        } else if (selectedType === "Worksheets PDF") {
          matchType = typeLower.includes("pdf");
        } else if (selectedType === "Modul/Bahan Ajar") {
          matchType = typeLower.includes("learning material") || typeLower.includes("materi") || typeLower.includes("modul") || typeLower.includes("bahan ajar");
        } else {
          matchType = !typeLower.includes("pdf") && 
                      !typeLower.includes("quiz") && 
                      !typeLower.includes("kuis") && 
                      !typeLower.includes("digital") && 
                      !typeLower.includes("learning material") && 
                      !typeLower.includes("materi") &&
                      !typeLower.includes("modul") &&
                      !typeLower.includes("bahan ajar");
        }
      }

      // 3. Chapter Filter
      const matchChapter = selectedChapter === "All" || w.chapter.trim() === selectedChapter;

      return matchSearch && matchType && matchChapter;
    });
  }, [gradeWorksheets, searchQuery, selectedType, selectedChapter]);

  // Strictly sort alphabetically (A-Z) by Chapter first, then alphabetically (A-Z) by Topic
  const sortedWorksheets = useMemo(() => {
    return [...filteredWorksheets].sort((a, b) => {
      const chapterCompare = a.chapter.localeCompare(b.chapter, "id", { numeric: true });
      if (chapterCompare !== 0) return chapterCompare;
      return a.topic.localeCompare(b.topic, "id", { numeric: true });
    });
  }, [filteredWorksheets]);

  // Clear all filters
  const handleResetFilters = () => {
    setSelectedType("All");
    setSelectedChapter("All");
    setSelectedGradeFilter("All");
  };

  const activeFiltersCount = 
    (selectedType !== "All" ? 1 : 0) + 
    (selectedChapter !== "All" ? 1 : 0) +
    (!selectedGrade && selectedGradeFilter !== "All" ? 1 : 0);

  // Render format badge
  const renderFormatBadge = (typeString: string) => {
    const lowerType = typeString?.toLowerCase() || "";
    const isQuiz = lowerType.includes("quiz") || lowerType.includes("kuis") || lowerType.includes("digital");
    const isPdf = lowerType.includes("pdf");
    const isLearningMaterial = lowerType.includes("learning material") || lowerType.includes("materi") || lowerType.includes("modul") || lowerType.includes("bahan ajar");

    if (isQuiz) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-3xs">
          <Gamepad className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          Kuis Digital (Quiziss)
        </span>
      );
    } else if (isPdf) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-3xs">
          <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          Worksheets PDF
        </span>
      );
    } else if (isLearningMaterial) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-3xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          Modul/Bahan Ajar
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-3xs">
          <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {typeString || "Worksheets"}
        </span>
      );
    }
  };

  return (
    <div id="worksheet-list-section" className="space-y-4">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg flex items-center gap-2">
            {selectedGrade ? `Worksheets ${selectedGrade} MQ` : "Semua Worksheets"}
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">
              {sortedWorksheets.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold tracking-wide">
            {selectedGrade 
              ? `Diurutkan secara otomatis dari A-Z berdasarkan Bab, kemudian A-Z berdasarkan Topik.`
              : "Menampilkan seluruh Worksheets, Modul/Bahan Ajar, dan Kuis Digital."}
          </p>
        </div>

        {/* Quick Grade Quick Selector */}
        {!selectedGrade && onGradeChange && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Kelas:</span>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <button
                key={g}
                onClick={() => onGradeChange(g)}
                className="h-8 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 font-bold text-xs text-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-3xs"
              >
                {g} MQ
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Control Panel: Search is ALWAYS visible */}
      <div id="control-bar" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs space-y-3">
        
        {/* Search Input Row - Always Visible */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan bab, topik, format, kelas..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Toggle Filters Button */}
          <button
            type="button"
            id="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              showFilters || activeFiltersCount > 0
                ? "border-blue-200 bg-blue-50 text-blue-700 shadow-blue-50/50"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white">
                {activeFiltersCount}
              </span>
            )}
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Class Filter - Always Visible on Dashboard */}
        {!selectedGrade && (
          <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center gap-2.5 animate-in fade-in duration-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Pilih Kelas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["All", "1", "2", "3", "4", "5", "6"].map((g) => {
                const isSelected = selectedGradeFilter === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGradeFilter(g)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {g === "All" ? "Semua Kelas" : `${g} MQ`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsible Filters Row */}
        {showFilters && (
          <div 
            id="collapsible-filters"
            className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 animate-in fade-in duration-200"
          >
            {/* Filter 1: Format Tipe */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format File</label>
              <select
                id="filter-type-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "Semua Format (PDF, Kuis Digital, Modul/Bahan Ajar)" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Chapter (Bab) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Bab</label>
              <select
                id="filter-chapter-select"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="All">Semua Bab</option>
                {uniqueChapters.filter(c => c !== "All").map((ch) => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters indicator */}
            {activeFiltersCount > 0 && (
              <div className="md:col-span-2 flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-500">
                  Menampilkan {sortedWorksheets.length} dari {gradeWorksheets.length} file
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Data Display Area */}
      <div id="worksheets-display-container">
        {sortedWorksheets.length === 0 ? (
          <div id="empty-state" className="flex flex-col items-center justify-center text-center py-16 px-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-800">Tidak ada Worksheets yang ditemukan</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Coba kurangi filter atau gunakan kata kunci pencarian yang berbeda untuk menemukan Worksheets.
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {sortedWorksheets.map((worksheet) => {
              return (
                <div
                  key={worksheet.id}
                  id={`worksheet-item-${worksheet.id}`}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Info, Chapter & Topic */}
                  <div className="space-y-2 flex-1">
                    {/* Top Row: Meta Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {!selectedGrade && (
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {worksheet.grade} MQ
                        </span>
                      )}

                      {renderFormatBadge(worksheet.type)}
                    </div>

                    {/* Chapter & Topic text */}
                    <div className="space-y-1">
                      {/* Chapter name */}
                      <div className="flex items-start gap-1.5 text-slate-900 font-display text-xs font-extrabold sm:text-sm">
                        <BookOpen className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{worksheet.chapter}</span>
                      </div>
                      {/* Topic name */}
                      <div className="flex items-start gap-1.5 text-slate-500 font-semibold text-xs sm:text-xs">
                        <FolderOpen className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{worksheet.topic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Open Button */}
                  <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t border-slate-100 md:border-t-0">
                    {(() => {
                      const lowerType = worksheet.type?.toLowerCase() || "";
                      const isLearningMaterial = lowerType.includes("learning material") || lowerType.includes("materi") || lowerType.includes("modul") || lowerType.includes("bahan ajar");
                      const buttonText = isLearningMaterial ? "Buka Modul/Bahan Ajar" : "Buka Worksheets";
                      return (
                        <a
                          href={worksheet.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 hover:shadow-lg active:scale-98"
                        >
                          <span>{buttonText}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      );
                    })()}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
