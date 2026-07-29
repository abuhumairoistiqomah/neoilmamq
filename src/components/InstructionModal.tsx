import React, { useState } from "react";
import { Check, Copy, HelpCircle, Code, FileText } from "lucide-react";

export default function InstructionModal() {
  const [copied, setCopied] = useState(false);

  const appsScriptCode = `function doGet(e) {
  // Masukkan SPREADSHEET_ID dari URL Google Sheets Anda (jika ada),
  // atau biarkan kosong jika skrip menyatu di dalam Google Sheet (Extensions > Apps Script).
  var sheetId = ""; 
  var sheetName = "Sheet1"; // Sesuaikan dengan nama sheet/tab Anda (default: Sheet1)
  
  var ss;
  try {
    if (sheetId && sheetId !== "") {
      ss = SpreadsheetApp.openById(sheetId);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Tidak dapat membuka Spreadsheet: " + err.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = ss.getSheetByName(sheetName) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var jsonArray = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    var hasData = false;
    
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j].toString().trim();
      var value = row[j];
      
      // Normalisasi nama kolom (Mendukung bahasa Inggris & Indonesia)
      if (key.match(/^ID$/i)) {
        obj["id"] = value.toString().trim();
        hasData = true;
      } else if (key.match(/Grade|Kelas|MQ/i)) {
        var strVal = value.toString().trim();
        var matchNum = strVal.match(/\\d+/);
        obj["grade"] = matchNum ? parseInt(matchNum[0]) : strVal;
        hasData = true;
      } else if (key.match(/Chapter|Bab/i)) {
        obj["chapter"] = value.toString().trim();
      } else if (key.match(/Topic|Topik/i)) {
        obj["topic"] = value.toString().trim();
      } else if (key.match(/Type|Tipe|Format/i)) {
        obj["type"] = value.toString().trim();
      } else if (key.match(/Link|URL/i)) {
        obj["link"] = value.toString().trim();
      } else if (key !== "") {
        obj[key.toLowerCase()] = value;
      }
    }
    
    if (hasData && obj.link) {
      jsonArray.push(obj);
    }
  }
  
  // Mengembalikan data JSON
  return ContentService.createTextOutput(JSON.stringify(jsonArray))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="instruction-card" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-slate-900 sm:text-lg">
            Petunjuk Penyambungan Google Sheets (Database Baru)
          </h3>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Ikuti 6 langkah mudah berikut untuk menghubungkan database Google Sheets baru Anda ke website ini:
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
            1
          </div>
          <div className="text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Buat Spreadsheet Baru di Google Sheets</p>
            <p className="mt-0.5 text-slate-500">
              Buat tabel Google Sheet baru dan tuliskan nama kolom ini tepat pada baris pertama (Row 1):
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
               {["ID", "Grade", "Chapter", "Topic", "Type", "Link"].map((col) => (
                <span key={col} className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1 font-mono text-[10px] text-slate-700 font-semibold shadow-2xs">
                  {col}
                </span>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              *Catatan: Kolom "Grade" bisa diisi angka (misal: 1, 2, 3) atau string (misal: "1 MQ", "2 MQ").
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
            2
          </div>
          <div className="text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Buka Google Apps Script</p>
            <p className="mt-0.5 text-slate-500">
              Pada menu bagian atas Google Sheet Anda, klik <span className="font-semibold text-blue-600">Ekstensi (Extensions)</span> &gt; <span className="font-semibold text-blue-600">Apps Script</span>.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
            3
          </div>
          <div className="flex-1 text-xs sm:text-sm text-slate-600">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-900">Salin & Tempel Kode Apps Script (GAS)</p>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                  copied 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Berhasil Disalin!" : "Salin Kode GAS"}
              </button>
            </div>
            <p className="mt-1 text-slate-500">
              Hapus semua kode bawaan di dalam editor Apps Script, lalu tempelkan kode berikut:
            </p>

            <div className="relative mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-[11px] text-slate-300 leading-relaxed shadow-inner">
              <pre>{appsScriptCode}</pre>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
            4
          </div>
          <div className="text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Publikasikan / Deploy sebagai Aplikasi Web (Web App)</p>
            <p className="mt-0.5 text-slate-500">
              Klik tombol <span className="font-semibold text-slate-900">Penerapan (Deploy)</span> &gt; <span className="font-semibold text-slate-900">Penerapan Baru (New Deployment)</span> di sudut kanan atas.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
            5
          </div>
          <div className="text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Atur Izin Akses ke "Siapa Saja" (Anyone)</p>
            <p className="mt-0.5 text-slate-500">
              Atur konfigurasi deployment dengan nilai berikut (<strong className="text-amber-700">SANGAT PENTING!</strong>):
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-600">
              <li>Pilih jenis (Select type): <span className="font-semibold text-slate-800">Aplikasi Web (Web App)</span></li>
              <li>Jalankan sebagai (Execute as): <span className="font-semibold text-slate-800">Saya / Me (alamat email Anda)</span></li>
              <li>Yang memiliki akses (Who has access): <span className="font-semibold text-emerald-600">Siapa saja (Anyone)</span></li>
            </ul>
            <p className="mt-2 text-slate-400 text-[11px]">
              *Catatan: Saat deployment pertama kali, Google akan meminta izin akses (Authorize access). Pilih akun Google Anda dan berikan izin.
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
            6
          </div>
          <div className="text-xs sm:text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Tempelkan URL Web App ke Form Pengaturan</p>
            <p className="mt-0.5 text-slate-500">
              Setelah sukses di-deploy, salin <span className="font-semibold text-blue-600">URL Web App</span> yang berakhiran <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/exec</code>, tempelkan ke kolom input di atas, lalu klik "Simpan URL Database".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
