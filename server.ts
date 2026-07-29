import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow JSON parsing
app.use(express.json());

// Mock/Default Worksheets in case GAS is not configured
const defaultWorksheets = [
  // Grade 1
  {
    id: "00000001",
    grade: 1,
    chapter: "01. Numbers 1 to 10 (Bilangan 1 sampai 10)",
    topic: "01.1 Counting Objects (Membilang Banyak Benda)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade1_number_count_pdf"
  },
  {
    id: "00000002",
    grade: 1,
    chapter: "01. Numbers 1 to 10 (Bilangan 1 sampai 10)",
    topic: "01.2 Comparing Numbers (Membandingkan Bilangan)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=10293847"
  },
  {
    id: "00000003",
    grade: 1,
    chapter: "02. Addition & Subtraction (Penjumlahan & Pengurangan)",
    topic: "02.1 Basic Addition up to 10 (Penjumlahan Dasar sampai 10)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade1_addition_pdf"
  },
  {
    id: "00000004",
    grade: 1,
    chapter: "02. Addition & Subtraction (Penjumlahan & Pengurangan)",
    topic: "02.2 Basic Subtraction within 10 (Pengurangan Dasar di bawah 10)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=11223344"
  },

  // Grade 2
  {
    id: "00000005",
    grade: 2,
    chapter: "13. Time (Waktu)",
    topic: "13.4.1 Time - Word problems (Soal cerita terkait waktu)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=56076905&source=liveDashboard"
  },
  {
    id: "00000006",
    grade: 2,
    chapter: "13. Time (Waktu)",
    topic: "13.4.1 Time - Word problems (Soal cerita terkait waktu)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1M4WGpze7yNa4FoKV9pULsp8PexVGLDJ&usp=drive_fs"
  },
  {
    id: "00000007",
    grade: 2,
    chapter: "03. Multiplication (Perkalian)",
    topic: "03.1 Multiplication Tables of 2, 5, and 10 (Tabel Perkalian 2, 5, dan 10)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade2_mult_pdf"
  },
  {
    id: "00000008",
    grade: 2,
    chapter: "03. Multiplication (Perkalian)",
    topic: "03.2 Basic Division Concept (Konsep Pembagian Dasar)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=22334455"
  },

  // Grade 3
  {
    id: "00000009",
    grade: 3,
    chapter: "04. Fractions (Pecahan)",
    topic: "04.1 Introduction to Fractions (Mengenal Pecahan Sederhana)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade3_fractions_intro"
  },
  {
    id: "00000010",
    grade: 3,
    chapter: "04. Fractions (Pecahan)",
    topic: "04.2 Comparing Fractions (Membandingkan Pecahan)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=33445566"
  },
  {
    id: "00000011",
    grade: 3,
    chapter: "05. Measurement of Length & Mass (Pengukuran Panjang & Massa)",
    topic: "05.1 Meters, Centimeters, and Kilograms (Meter, Sentimeter, dan Kilogram)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade3_measure_pdf"
  },

  // Grade 4
  {
    id: "00000012",
    grade: 4,
    chapter: "06. Decimals (Desimal)",
    topic: "06.1 Decimal Fractions & Place Value (Pecahan Desimal & Nilai Tempat)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade4_decimals_pdf"
  },
  {
    id: "00000013",
    grade: 4,
    chapter: "07. Angles (Sudut)",
    topic: "07.1 Measuring Angles with Protractor (Mengukur Sudut dengan Busur)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=44556677"
  },
  {
    id: "00000014",
    grade: 4,
    chapter: "07. Angles (Sudut)",
    topic: "07.2 Types of Angles: Acute, Obtuse, Right (Jenis-jenis Sudut)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade4_angles_types"
  },

  // Grade 5
  {
    id: "00000015",
    grade: 5,
    chapter: "08. Volume of Solids (Volume Bangun Ruang)",
    topic: "08.1 Cube and Cuboid Volume (Volume Kubus dan Balok)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade5_volume_pdf"
  },
  {
    id: "00000016",
    grade: 5,
    chapter: "08. Volume of Solids (Volume Bangun Ruang)",
    topic: "08.2 Word Problems on Volume (Soal Cerita Volume)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=55667788"
  },
  {
    id: "00000017",
    grade: 5,
    chapter: "09. Ratio & Proportion (Rasio & Perbandingan)",
    topic: "09.1 Calculating Ratios (Menghitung Rasio)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade5_ratios_pdf"
  },

  // Grade 6
  {
    id: "00000018",
    grade: 6,
    chapter: "10. Negative Numbers (Bilangan Bulat Negatif)",
    topic: "10.1 Concept of Negative Numbers (Konsep Bilangan Bulat Negatif)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade6_negative_pdf"
  },
  {
    id: "00000019",
    grade: 6,
    chapter: "11. Data Representation (Penyajian Data)",
    topic: "11.1 Mean, Median, and Mode (Rata-rata, Median, dan Modus)",
    type: "Quizizz (Kuis Digital)",
    link: "https://wayground.com/join?gc=66778899"
  },
  {
    id: "00000020",
    grade: 6,
    chapter: "11. Data Representation (Penyajian Data)",
    topic: "11.2 Bar Graphs & Pie Charts (Diagram Batang & Lingkaran)",
    type: "Pdf",
    link: "https://drive.google.com/open?id=1mock_grade6_data_rep"
  }
];

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Fetch Worksheets API Proxy
app.get("/api/worksheets", async (req, res) => {
  const gasUrl = (req.query.url as string) || process.env.APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyHRwueA4MLHrCQVtHE1At1n1Jv9EG6AumtC3X4pxl2RDuzgBP_UPvzjjtVifg_QaoL/exec";

  if (!gasUrl) {
    return res.json({
      success: true,
      source: "local",
      data: defaultWorksheets
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 seconds timeout

    const response = await fetch(gasUrl, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Apps Script returned HTTP ${response.status}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (gasUrl.trim().endsWith("/dev")) {
        throw new Error(
          "Your Google Apps Script URL ends with '/dev'. This URL requires developer authentication and cannot be accessed by the server. " +
          "Please deploy your script as a Web App (Deploy > New deployment), set 'Who has access' to 'Anyone', and use the URL ending in '/exec'."
        );
      }
      if (text.trim().toLowerCase().startsWith("<!doctype html") || text.trim().toLowerCase().startsWith("<html")) {
        throw new Error(
          "Google Apps Script returned an HTML page (likely a login or permission prompt) instead of JSON data. " +
          "Please verify that you have deployed the script as a Web App, set 'Who has access' to 'Anyone', and that you are using the '/exec' URL."
        );
      }
      throw new Error("Invalid JSON response from Google Apps Script web app.");
    }

    // Standardize GAS responses
    if (!Array.isArray(data)) {
      throw new Error("Response from Google Apps Script is not an array of worksheets.");
    }

    // Map properties to lowercase to standard formats if GAS properties are uppercase
    const standardizedData = data.map((item: any, idx: number) => {
      // Find keys ignoring case
      const findVal = (keys: string[], defaultVal = "") => {
        for (const k of Object.keys(item)) {
          if (keys.some(x => k.toLowerCase() === x.toLowerCase() || k.toLowerCase().includes(x.toLowerCase()))) {
            return item[k];
          }
        }
        return defaultVal;
      };

      const rawGrade = item.grade || item.Grade || item.Kelas || item.MQ || findVal(["grade", "kelas", "mq"]) || 1;
      let parsedGrade = rawGrade;
      if (typeof rawGrade === "string") {
        const match = rawGrade.match(/\d+/);
        if (match) {
          parsedGrade = parseInt(match[0], 10);
        }
      }

      return {
        id: item.id || item.ID || findVal(["id"]) || `gas_${idx + 1}`,
        grade: parsedGrade || 1,
        chapter: item.chapter || item.Chapter || item.Bab || findVal(["chapter", "bab"]) || "Umum",
        topic: item.topic || item.Topic || item.Topik || findVal(["topic", "topik"]) || "Topik Umum",
        type: item.type || item.Type || item.Tipe || findVal(["type", "tipe"]) || "Pdf",
        link: item.link || item.Link || findVal(["link"]) || "#"
      };
    });

    return res.json({
      success: true,
      source: "gas",
      data: standardizedData
    });
  } catch (error: any) {
    console.warn("Error fetching worksheets from Apps Script (expected fallback to local database):", error.message);
    return res.json({
      success: false,
      error: error.message || "Failed to fetch from GAS. Please ensure deployment is active and permissions are set to 'Anyone'.",
      source: "fallback",
      data: defaultWorksheets
    });
  }
});

async function run() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  run();
}

export default app;
