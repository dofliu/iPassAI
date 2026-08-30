# iPassAI - iPAS 智慧學習平台與題庫工坊

> 專為 **經濟部 iPAS 產業人才能力鑑定**（AI 應用規劃師 初級／中級）以及 **CEFR B2 英文／Cambridge B2 First** 打造的跨平台智慧學習與模擬測驗系統。

[![Build Android Debug APK](https://github.com/dofliu/iPassAI/actions/workflows/build-apk.yml/badge.svg)](https://github.com/dofliu/iPassAI/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 專案簡介 (Overview)

**iPassAI（靛藍題庫工坊）** 結合了 Swiss 資訊秩序設計哲學與紙本批註質感，提供深度個人化的題庫練習體驗。

### 🌟 核心特色
- **🔒 隱私與離線優先**：所有練習紀錄、模擬測驗成績、題目收藏與個人筆記皆儲存在使用者的瀏覽器／裝置本機（`localStorage`），不需登入即可使用，且不會未授權上傳個人資料。
- **📚 豐富題庫涵蓋**：
  - **iPAS AI 應用規劃師 初級**：人工智慧基礎概論、生成式 AI 應用與規劃。
  - **iPAS AI 應用規劃師 中級**：人工智慧技術應用與規劃、大數據處理分析與應用、機器學習技術與應用。
  - **國際英語檢定**：通用 CEFR B2 題庫、Cambridge B2 First 專屬仿真練習（Reading & Use of English、Listening 音訊題目）。
- **🎯 智慧複盤與弱點診斷**：
  - **⚡ 隨堂快問快答與推播抽考**：支援手機本機定時發送測驗推播通知，點擊通知或點選隨堂抽考即可迅速作答一題，作答結果自動無縫同步至本機統計與錯題庫。
  - **即時練習**：作答立即反饋正確解答、深度核心解析與易錯盲點提醒。
  - **全真模擬測驗**：倒數計時、題號導覽、即時作答狀態標記與交卷評量報告。
  - **錯題複盤與弱點推薦**：自動歸納錯誤主題排行，一鍵開啟錯題專屬測驗。
  - **個人化學習工具**：逐題筆記、星號收藏、倒數考期讀書計畫與每週學習追蹤。
  - **備份與還原**：支援收藏與筆記的 JSON 匯出備份、匯入驗證與安全合併機制。
- **📱 跨平台支援**：支援 Web 響應式網頁操作，並透過 **Capacitor** 封裝支援 **Android 原生 App**（含本機推播通知）。


---

## 🛠️ 技術架構 (Tech Stack)

| 領域 | 使用技術 |
| :--- | :--- |
| **前端核心** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 7](https://vitejs.dev/) |
| **樣式與 UI** | [TailwindCSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) |
| **路由管理** | [Wouter](https://github.com/molefrog/wouter) |
| **行動端封裝** | [Capacitor 7](https://capacitorjs.com/) (Android 原生專案) |
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
├── src/
│   ├── components/             # 共用 UI 元件 (Button, Tooltip, Sonner 等)
│   ├── contexts/               # Theme 主題 Context
│   ├── data/                   # 題庫資料轉發模組
│   └── pages/                  # 頁面元件 (Home, NotFound)
├── App.tsx                     # 應用程式主入口與路由設定
├── Home.tsx                    # 靛藍題庫工坊主工作台 (學習軌道、測驗、複盤)
├── questions.ts                # iPAS AI 應用規劃師核心題庫
├── questionExpansion.ts        # 擴充主題題庫
├── englishQuestions.ts         # CEFR B2 英文題庫
├── cambridgeB2FirstQuestions.ts# Cambridge B2 First 專屬題型題庫
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
