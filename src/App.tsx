import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import WorksheetList from "./components/WorksheetList";
import SettingsPanel from "./components/SettingsPanel";
import { Worksheet } from "./types";
import { 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Calculator,
  GraduationCap
} from "lucide-react";

export default function App() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load gasUrl from localStorage on init, default to the requested URL
  const [gasUrl, setGasUrl] = useState<string>(() => {
    const saved = localStorage.getItem("neo_ilma_gas_url");
    const oldDefault1 = "https://script.google.com/macros/s/AKfycbwBTRmtT5LGquctbs_o2VxvGclxGrcul6-OmOnsx_21LaUeYhVeGNXTsWVVL2bCt1I/exec";
    const oldDefault2 = "https://script.google.com/macros/s/AKfycbzd4NPDov5GY-0UPZTpllomC6KbMnyD23pOUQk9hV4/dev";
    const oldDefault3 = "https://script.google.com/macros/s/AKfycbzRozJ8E2jXBulDutaeql8J2zwDBCzFaZiY2_qy5L0lgNWAjZ4L0r0OPji7N0RZjv2T/exec";
    const newDefault = "https://script.google.com/macros/s/AKfycbyHRwueA4MLHrCQVtHE1At1n1Jv9EG6AumtC3X4pxl2RDuzgBP_UPvzjjtVifg_QaoL/exec";
    if (!saved || saved === oldDefault1 || saved === oldDefault2 || saved === oldDefault3) {
      localStorage.setItem("neo_ilma_gas_url", newDefault);
      return newDefault;
    }
    return saved;
  });

  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch worksheets from Express proxy API
  const fetchWorksheets = async (urlToFetch: string) => {
    setLoading(true);
    setError(null);
    try {
      const queryParam = urlToFetch ? `?url=${encodeURIComponent(urlToFetch)}` : "";
      const res = await fetch(`/api/worksheets${queryParam}`);
      
      if (!res.ok) {
        throw new Error(`Failed to load data from server: HTTP ${res.status}`);
      }
      
      const responseData = await res.json();
      
      if (responseData.success) {
        setWorksheets(responseData.data || []);
      } else {
        // Returned success=false but provided fallback data
        if (responseData.data) {
          setWorksheets(responseData.data);
          setError(responseData.error || "Failed to load Google Sheets data. Showing default worksheets as fallback.");
        } else {
          throw new Error(responseData.error || "Failed to load data from API.");
        }
      }
    } catch (err: any) {
      console.warn("Error fetching worksheets:", err);
      setError(err.message || "An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and set up 5-minute auto-refresh interval
  useEffect(() => {
    fetchWorksheets(gasUrl);

    const intervalId = setInterval(() => {
      console.log("Auto-refreshing worksheets database...");
      fetchWorksheets(gasUrl);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [gasUrl]);

  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    localStorage.setItem("neo_ilma_gas_url", url);
    // Fetch newly updated worksheets
    fetchWorksheets(url);
    // Reset any old test results
    setTestResult(null);
  };

  const handleTestConnection = async (): Promise<boolean> => {
    setTesting(true);
    setTestResult(null);
    try {
      const queryParam = gasUrl ? `?url=${encodeURIComponent(gasUrl)}` : "";
      const res = await fetch(`/api/worksheets${queryParam}`);
      
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}`);
      }

      const responseData = await res.json();
      
      if (responseData.success && responseData.source === "gas") {
        setTestResult({
          success: true,
          message: `Connected successfully! Loaded ${responseData.data.length} worksheets live from your Google Sheet.`
        });
        return true;
      } else {
        throw new Error(responseData.error || "Apps Script did not respond with valid data.");
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Connection failed. Please make sure your Web App URL is correct and permission is set to 'Anyone'."
      });
      return false;
    } finally {
      setTesting(false);
    }
  };

  const handleGradeClick = (grade: number) => {
    setActiveView(`grade-${grade}`);
  };

  const getSelectedGradeNumber = (): number | undefined => {
    if (activeView.startsWith("grade-")) {
      return parseInt(activeView.split("-")[1]);
    }
    return undefined;
  };

  return (
    <div id="neo-ilma-root" className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header bar */}
      <Header 
        activeView={activeView} 
        onViewChange={setActiveView} 
        gasConfigured={!!gasUrl} 
        onRefresh={() => fetchWorksheets(gasUrl)}
        isRefreshing={loading}
      />

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* API Alerts or connection warnings */}
        {error && (
          <div 
            id="error-banner"
            className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:text-sm text-amber-900 backdrop-blur-xs shadow-2xs"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Notice</p>
                <p className="leading-relaxed font-medium text-amber-800">{error}</p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => fetchWorksheets(gasUrl)}
                    className="text-xs font-extrabold text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global loading skeleton */}
        {loading ? (
          <div id="loading-state" className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold text-blue-600">
                Ω
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider animate-pulse">
              Loading math worksheets...
            </p>
          </div>
        ) : (
          <div id="view-renderer" className="space-y-8">
            
            {/* View 1: Dashboard View */}
            {activeView === "dashboard" && (
              <div className="space-y-8">
                {/* Statistics Panels */}
                <DashboardStats 
                  worksheets={worksheets} 
                  onGradeClick={handleGradeClick} 
                />

                {/* All Worksheets Explorer (For easy access across school) */}
                <div className="border-t border-slate-200/60 pt-6">
                  <WorksheetList 
                    worksheets={worksheets} 
                    onGradeChange={handleGradeClick}
                  />
                </div>
              </div>
            )}

            {/* View 2: Grade View (Grade 1 - 6) */}
            {activeView.startsWith("grade-") && (
              <div className="space-y-6">
                {/* Back button or nav indicator */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                  <span className="cursor-pointer hover:text-slate-900 transition-colors" onClick={() => setActiveView("dashboard")}>
                    Dashboard
                  </span>
                  <span>/</span>
                  <span className="font-bold text-slate-800">
                    Kelas {getSelectedGradeNumber()} MQ
                  </span>
                </div>

                <WorksheetList 
                  worksheets={worksheets} 
                  selectedGrade={getSelectedGradeNumber()}
                  onGradeChange={handleGradeClick}
                />
              </div>
            )}

            {/* View 3: Settings Panel */}
            {activeView === "settings" && (
              <SettingsPanel
                gasUrl={gasUrl}
                onSaveGasUrl={handleSaveGasUrl}
                onTestConnection={handleTestConnection}
                testing={testing}
                testResult={testResult}
              />
            )}

          </div>
        )}

      </main>

      {/* Modern, Simple and Clean Footer */}
      <footer id="app-footer" className="mt-20 border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="font-display font-bold text-slate-700">
            Neo ILMA - MQ Version &bull; Inspiring Little Mathematicians
          </p>
          <p className="text-[11px] leading-relaxed max-w-md mx-auto">
            Dibuat untuk memudahkan guru, siswa, dan orang tua dalam mengakses Worksheets, Modul/Bahan Ajar, dan Kuis Digital kapan saja dan di mana saja.
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            &copy; 2026 Tifa as part of House of Harmony Team x AL-WILDAN ISLAMIC SCHOOL 10 JAKARTA. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
