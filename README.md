# iPassAI — 靛藍題庫工坊

> 離線優先的考照題庫與全真模考平台，涵蓋 **經濟部 iPAS AI 應用規劃師**（初級／中級）、**國際英語檢定**（CEFR B2 / Cambridge B2 First）與 **Anthropic Claude 認證**（CCAR-F 架構師）。Web 響應式介面 + Capacitor Android App。

[![Build Android Debug APK](https://github.com/dofliu/iPassAI/actions/workflows/build-apk.yml/badge.svg)](https://github.com/dofliu/iPassAI/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**884 題**原創題庫 · **9 份**全真模考規格 · **3 條**考試軌道 · 100% 裝置端儲存

---

## 📚 文件索引

| 文件 | 內容 |
| :--- | :--- |
| 📘 [**使用者操作指南**](docs/USER_GUIDE.md) | 五大功能面板、全真模考、推播抽考、備份還原的操作方式 |
| 📐 [**專案規劃與架構設計書**](docs/PROJECT_PLAN.md) | 技術選型、考科規格矩陣、資料模型、里程碑與路線圖 |
| 🎨 [**設計系統**](docs/DESIGN_SYSTEM.md) | 視覺與互動語言：色彩哲學、字體系統、動畫規範、標誌 |
| 🔍 [**題庫研究依據**](docs/RESEARCH_SOURCES.md) | 各考科的官方來源、原創題政策與版權立場 |
| 🤖 [**CLAUDE.md**](CLAUDE.md) | 開發者／AI 助理的專案脈絡：目錄慣例、新增考科流程、踩過的坑 |

---

## 📖 專案簡介

**iPassAI** 結合 **Swiss 資訊秩序設計哲學** 與 **紙本研讀批註質感**，落實 **100% 離線優先與隱私保護**。核心宗旨是讓考生「掌握每個選項背後的原理」，因此每題都同時提供解題依據與易錯盲點提醒，而非只給分數。

### 核心特色

- **🔒 隱私與離線優先** — 所有練習紀錄、模考成績、收藏與筆記皆存於裝置本機（`localStorage`），不需登入、不上傳個資。
- **🏆 全科目全真標準模考** — 依各考科官方題量與時限進行倒數模擬，交卷後產出及格判定與分項主題診斷成績單。Claude 認證更依官方五大領域權重**配額抽題**。
- **🛠️ 考場專屬工具** — 題目標記 (Flag)、答題卡矩陣跳題、倒數 5 分鐘警示、漏答確認防呆。
- **⚡ 隨堂抽考與手機推播** — Android 原生定時推播（每 1／2／4 小時或每日 3 次），支援錯題優先與分考科範圍，點擊通知直接作答。
- **📊 錯題複盤與弱點診斷** — 自動統計最近 14 天錯答主題排行，一鍵啟動「錯題專屬測驗」。
- **🔖 個人化學習工具** — 逐題筆記、星號收藏、全文檢索、考期倒數讀書計畫與私密 JSON 備份／安全合併。
- **📱 跨平台** — Web 響應式介面 + Capacitor Android APK。

---

## 🛠️ 技術架構

| 領域 | 使用技術 |
| :--- | :--- |
| **前端核心** | [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) · [Vite 7](https://vitejs.dev/) |
| **樣式與 UI** | [TailwindCSS 4](https://tailwindcss.com/) · [Radix UI](https://www.radix-ui.com/) · [Lucide React](https://lucide.dev/) · [Sonner](https://sonner.emilkowal.ski/) |
| **路由管理** | [Wouter](https://github.com/molefrog/wouter) |
| **行動端與推播** | [Capacitor 8](https://capacitorjs.com/) · `@capacitor/local-notifications` |
| **測試與 CI** | [Vitest](https://vitest.dev/) · [GitHub Actions](https://github.com/features/actions)（自動編譯 APK） |

詳細的版本與選型考量見[專案規劃書](docs/PROJECT_PLAN.md#-技術選型)。

---

## 🚀 快速開始

**環境需求**：Node.js `>= 22`

```bash
# 安裝依賴（peer deps 有衝突，必須加此旗標）
npm install --legacy-peer-deps

# 啟動開發伺服器 → http://localhost:5173/
npm run dev
```

### 常用指令

```bash
npm test           # 執行單元測試（27 個測試）
npm run check      # TypeScript 型別檢查
npm run build      # 正式打包，產出 dist/
```

---

## 📱 Android APK

### 方法一：下載自動建置的 APK

每次推送到 `main` 分支，GitHub Actions 會自動編譯最新的 Debug APK：

1. 前往 [**Actions** 頁籤](https://github.com/dofliu/iPassAI/actions)。
2. 點選最新一筆 **Build Android Debug APK** 執行紀錄。
3. 於頁面下方 **Artifacts** 區塊下載 **`iPassAI-debug-apk`**。
4. 解壓縮後取得 `app-debug.apk`，直接安裝於 Android 裝置。

### 方法二：本機建置

需已安裝 Android Studio 與 Android SDK：

```bash
npm run build              # 編譯前端靜態檔
npx cap sync android       # 同步資源至 Android 專案
npx cap open android       # 於 Android Studio 開啟

# 或直接用 Gradle 打包
cd android && ./gradlew assembleDebug
# 產出：android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📂 專案結構

> ⚠️ **題庫與主要頁面元件放在專案根目錄**，`src/` 下對應檔案只是 re-export 轉接檔。這是既有結構，請沿用。詳見 [CLAUDE.md](CLAUDE.md#目錄結構的關鍵怪異之處)。

```text
iPassAI/
├── .github/workflows/build-apk.yml   # GitHub Actions APK 自動打包
├── android/                          # Capacitor Android 原生專案
├── docs/
│   ├── USER_GUIDE.md                 # 使用者操作指南
│   ├── PROJECT_PLAN.md               # 專案規劃與技術架構
│   ├── DESIGN_SYSTEM.md              # 視覺與互動設計規範
│   └── RESEARCH_SOURCES.md           # 題庫來源與內容政策
├── src/
│   ├── components/                   # UI 元件 (PopQuizModal, NotificationSettingsModal…)
│   ├── contexts/                     # Theme Context
│   ├── data/                         # examSpecs.ts 與各題庫 re-export
│   ├── services/                     # notificationService.ts 推播排程
│   └── pages/                        # 頁面元件 re-export
├── App.tsx                           # 應用主入口與路由
├── Home.tsx                          # 主工作台（學習軌道、模考、複盤）
├── questions.ts                      # iPAS 核心題庫與 Question 型別定義
├── questionExpansion.ts              # iPAS 擴充主題題庫
├── englishQuestions.ts               # CEFR B2 英文題庫
├── cambridgeB2FirstQuestions.ts      # Cambridge B2 First 題庫（含聽力語音稿）
├── claudeCertQuestions.ts            # Claude 認證 CCAR-F 題庫（123 題）
├── index.css                         # 全域樣式與 Swiss 資訊風格設計
├── vite.config.ts                    # Vite 設定（含 @tailwindcss/vite plugin）
└── capacitor.config.json             # Capacitor 跨平台設定
```

---

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權。題庫內容為原創練習題，非任何考試的官方考古題，詳見[題庫研究依據](docs/RESEARCH_SOURCES.md)。
