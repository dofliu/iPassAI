# iPassAI - iPAS 智慧學習平台與題庫工坊

> 專為 **經濟部 iPAS 產業人才能力鑑定**（AI 應用規劃師 初級／中級）以及 **國際英語檢定（CEFR B2 / Cambridge B2 First）** 打造的跨平台智慧學習與全真模擬測驗系統。

[![Build Android Debug APK](https://github.com/dofliu/iPassAI/actions/workflows/build-apk.yml/badge.svg)](https://github.com/dofliu/iPassAI/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📚 專案文件索引 (Documentation)

- 📘 [**使用者操作指南 (User Guide)**](docs/USER_GUIDE.md)：詳細介紹五大模組、全真標準模考、答題卡標記跳題、推播設定與備份還原操作。
- 📐 [**專案規劃與架構設計書 (Project Plan)**](docs/PROJECT_PLAN.md)：深入說明系統架構設計、各考科標準規格矩陣、資料儲存協議與未來路線圖。

---

## 📖 專案簡介 (Overview)

**iPassAI（靛藍題庫工坊）** 結合了 **Swiss 資訊秩序設計哲學** 與 **紙本研讀批註質感**，落實「**100% 離線優先與隱私保護**」，提供考生深度個人化的題庫練習體驗。

### 🌟 核心特色

- **🔒 隱私與離線優先**：所有練習紀錄、模擬測驗成績、題目收藏與個人筆記皆儲存在使用者的瀏覽器／裝置本機（`localStorage`），不需登入即可使用，且不會未授權上傳個人資料。
- **🏆 全科目「全真標準模擬考 (Full Official Exam)」**：
  - **iPAS 初級**：人工智慧基礎概論（50 題 / 60 分鐘 / 70 分及格）、生成式 AI 應用與規劃（50 題 / 60 分鐘 / 70 分及格）。
  - **iPAS 中級**：人工智慧技術應用與規劃（50 題 / 60 分鐘）、大數據處理分析與應用（50 題 / 60 分鐘）、機器學習技術與應用（50 題 / 60 分鐘）。
  - **CEFR B2 綜合模考**：50 題 / 60 分鐘（60% 通過門檻）。
  - **Cambridge B2 First**：Reading & Use of English 全卷（52 題 / 75 分鐘）、Listening 全卷（30 題 / 40 分鐘，含原創音訊播放）。
- **📝 CEFR B2 多元題型擴充**：
  - 篇章克漏字與銜接詞 (Cloze & Discourse Markers)
  - 高頻搭配詞與核心片語 (Collocations & Phrasal Verbs)
  - 文法句型置換與倒裝結構 (Sentence Transformations & Inversion)
  - 職場與學術情境應用語用 (Applied Situational Pragmatics)
- **🛠️ 考場專屬工具與能力診斷**：
  - **題目標記 (Flag for Review)**：隨時標記不確定題目，答題卡即時亮起星號。
  - **答題卡矩陣導覽**：清楚標示已答、未答與標記題數，支援任意題號一鍵跳轉。
  - **倒數 5 分鐘警示 & 漏答確認防呆**。
  - **正式能力診斷成績單**：及格狀態判定 (PASS/FAIL)、分項主題得分率進度條 (👑/⚡/⚠️)、一鍵錯題重測。
- **⚡ 隨堂快問快答與手機推播抽考 (Android 原生支援)**：
  - 支援手機定時發送抽考推播通知（1小時、2小時、4小時或每日精選 3 題），支援「錯題優先」模式。
  - 點擊通知或「隨堂抽考」按鈕即可快速作答一題，作答結果自動同步至本機統計與錯題庫。
- **📊 錯題複盤與弱點診斷**：
  - 自動統計最近 14 天錯答主題排行，一鍵開啟「錯題專屬測驗」。
- **🔖 個人化學習工具**：
  - 逐題筆記、星號收藏、全文檢索、倒數考期讀書計畫與私密 JSON 備份/安全合併。
- **📱 跨平台支援**：Web 響應式介面 + **Capacitor** Android 原生 App。

---

## 🛠️ 技術架構 (Tech Stack)

| 領域 | 使用技術 |
| :--- | :--- |
| **前端核心** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 7](https://vitejs.dev/) |
| **樣式與 UI** | [TailwindCSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **路由管理** | [Wouter](https://github.com/molefrog/wouter) |
| **行動端與推播** | [Capacitor 7/8](https://capacitorjs.com/), `@capacitor/local-notifications` |
| **自動化 CI/CD** | [GitHub Actions](https://github.com/features/actions) (自動編譯 Android Debug APK) |
| **測試框架** | [Vitest](https://vitest.dev/) |

---

## 🚀 快速開始 (Quick Start)

### 1. 環境需求
- **Node.js**: `>= 22.0.0`
- **npm** 或 **pnpm**

### 2. 安裝依賴
```bash
npm install --legacy-peer-deps
```

### 3. 啟動本機開發伺服器
```bash
npm run dev
```
啟動完成後，在瀏覽器開啟 `http://localhost:5173/` 即可開始使用。

### 4. 常用指令
```bash
# 執行單元測試
npm run test

# 執行 TypeScript 型別檢查
npm run check

# 正式環境打包建置 (產出 dist/)
npm run build
```

---

## 📱 Android App 建置與下載 (Android APK Build)

本專案已整合 **GitHub Actions 自動化工作流程**，每次推送到 `main` 分支時會自動編譯出最新的 Android APK 安裝檔。

### 📥 方法一：直接從 GitHub 下載 APK
1. 前往 GitHub 倉庫的 [**Actions** 頁籤](https://github.com/dofliu/iPassAI/actions)。
2. 點選最新的 **Build Android Debug APK** 執行紀錄。
3. 滾動至頁面下方的 **Artifacts** 區塊。
4. 點擊 **`iPassAI-debug-apk`** 即可下載壓縮檔，解壓縮後取得 `app-debug.apk` 並直接安裝於 Android 裝置。

---

### 💻 方法二：本機手動建置 Android 專案
若您本機已安裝 Android Studio 與 Android SDK：

1. **編譯前端靜態檔案**：
   ```bash
   npm run build
   ```
2. **同步資源至 Android 專案**：
   ```bash
   npx cap sync android
   ```
3. **在 Android Studio 中開啟**：
   ```bash
   npx cap open android
   ```
4. 或直接使用 Gradle 指令打包：
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   產出的 APK 位於 `android/app/build/outputs/apk/debug/app-debug.apk`。

---

## 📂 專案結構說明 (Project Structure)

```text
iPassAI/
├── .github/
│   └── workflows/
│       └── build-apk.yml       # GitHub Actions APK 自動打包工作流程
├── android/                    # Capacitor Android 原生專案
│   ├── app/
│   └── build.gradle
├── docs/                       # 專案詳細文件
│   ├── USER_GUIDE.md           # 使用者完整操作指南
│   └── PROJECT_PLAN.md         # 專案規劃與技術架構設計書
├── src/
│   ├── components/             # UI 元件 (Button, PopQuizModal, NotificationSettingsModal 等)
│   ├── contexts/               # Theme 主題 Context
│   ├── data/                   # 題庫與模考規格模組 (examSpecs.ts 等)
│   ├── services/               # 推播排程與背景通知服務 (notificationService.ts 等)
│   └── pages/                  # 頁面元件 (Home, NotFound)
├── App.tsx                     # 應用程式主入口與路由設定
├── Home.tsx                    # 靛藍題庫工坊主工作台 (學習軌道、全真模考、複盤)
├── questions.ts                # iPAS AI 應用規劃師核心題庫
├── questionExpansion.ts        # 擴充主題題庫
├── englishQuestions.ts         # CEFR B2 英文題庫 (含克漏字、搭配詞、句型置換、情境語用)
├── cambridgeB2FirstQuestions.ts# Cambridge B2 First 專屬題型題庫 (含聽力語音稿)
├── index.html                  # 網頁入口 HTML
├── index.css                   # 全域樣式與 Swiss 資訊風格設計
├── vite.config.ts              # Vite 與路徑別名配置
├── tsconfig.json               # TypeScript 編譯設定
├── capacitor.config.json       # Capacitor 跨平台設定檔
└── package.json                # 專案依賴與執行腳本
```

---

## 📄 授權條款 (License)

本專案採用 [MIT License](LICENSE) 授權。
