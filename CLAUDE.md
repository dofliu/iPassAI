# CLAUDE.md

給在此專案工作的 Claude Code 的專案脈絡。文件索引：[README](README.md)（專案入口）、[docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md)（技術架構）、[docs/USER_GUIDE.md](docs/USER_GUIDE.md)（使用操作）、[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)（視覺與互動規範）、[docs/RESEARCH_SOURCES.md](docs/RESEARCH_SOURCES.md)（題庫來源政策）。

## 專案是什麼

**iPassAI（靛藍題庫工坊）** — 離線優先的考照題庫與全真模考平台，Web + Capacitor Android APK。三條考試軌道：iPAS AI 應用規劃師（初級／中級）、國際英語檢定（CEFR B2 / Cambridge B2 First）、Anthropic Claude 認證（CCAR-F）。

所有使用者資料只存在裝置端 `localStorage`，無後端、無登入、不上傳。

## 目錄結構的關鍵怪異之處

**題庫與頁面元件放在專案根目錄，`src/` 下只有 re-export 轉接檔。** 這是既有結構，修改時請沿用，不要「順手整理」成單一層級：

```
questions.ts              ← 真正的內容在這裡
src/data/questions.ts     ← 只有一行 export * from "../../questions"
Home.tsx                  ← 1180+ 行的主工作台，真正的內容
src/pages/Home.tsx        ← 只有 re-export
```

程式碼一律用 `@/` 別名（指向 `src/`）匯入，例如 `import { QUESTIONS } from "@/data/questions"`。新增題庫模組時，同時建立根目錄實檔與 `src/data/` 的 re-export 轉接檔。

## 題庫資料模型

`Question` 型別定義在 `questions.ts`。關鍵欄位：

| 欄位 | 說明 |
| --- | --- |
| `level` | `"初級" \| "中級" \| "專業認證"` |
| `subject` | 考科名稱，同時是 `SUBJECTS` 的值 |
| `topic` | 分項主題；**模考的分項診斷與領域配額都靠這個欄位** |
| `options` | 固定四個選項的 tuple |
| `answer` | 正解索引 0–3 |
| `explanation` / `trap` | 解析與易錯提醒，兩者都必填 |

`QUESTIONS` 是所有題庫模組串接後的單一陣列；`SUBJECTS` 是 `Record<Level, string[]>`。

### 新增考科的步驟

1. 建立 `<name>Questions.ts`（根目錄）＋ `src/data/<name>Questions.ts` re-export。
2. 在 `questions.ts` 匯入並加進 `SUBJECTS` 與 `QUESTIONS`。
3. 新增級別時改 `Level` 型別與 `LEVELS` 常數 — **UI 的級別下拉選單全部由 `LEVELS` 推導，不要在 `Home.tsx` 硬編碼級別字串**。
4. 在 `src/data/examSpecs.ts` 加入 `ExamSpec`。
5. 需要時在 `notificationService.ts` 的 `NotificationScope` 加入抽考範圍。

## 題目撰寫的既有慣例

- **全部原創**，`source` 標示依官方考綱自編，不複製任何官方或第三方付費題庫的題目。政策見 `docs/RESEARCH_SOURCES.md`。
- 每題必須有 `explanation`（為何是這個答案）與 `trap`（最容易誤選的干擾項為何錯）。
- **正解必須平均分布在 A–D。** `claudeCertQuestions.ts` 用 `rotateOptions()` 依題序做確定性輪轉解決這件事 — 初版曾有 77 題中 58 題答案都在 B，「一律選 B」就能過關。撰寫新題庫時沿用此模式，並確認沒有選項引用自身位置（如「以上皆是」），否則輪轉會破壞題意。

## 模考組題

`buildOfficialExamQuestionSet()`（`src/data/examSpecs.ts`）依 `ExamSpec` 組卷。一般考科是洗牌後截取；**CCAR-F 例外**，改用 `buildDomainQuota()` 依官方五大領域權重（27/20/20/18/15）配額抽題，無條件捨去的餘額優先補給權重最高的領域。

## 常用指令

```bash
npm install --legacy-peer-deps   # 安裝（peer deps 有衝突，必須加旗標）
npm run dev                      # 開發伺服器 :5173
npm run check                    # tsc --noEmit 型別檢查
npm test                         # vitest run
npm run build                    # 產出 dist/
npx cap sync android             # 同步到 Android 專案
```

推送到 `main` 會觸發 GitHub Actions 自動編譯 Debug APK，產出在 Actions 的 `iPassAI-debug-apk` artifact。

## 測試現況與品質保證

27 個測試，5 個檔案。題庫測試不只檢查結構，還包含幾條刻意設計的品質保證：

- 答案不得集中於單一選項位置（`claudeCertQuestions.test.ts`）
- 題庫規模至少 120 題，且各領域題池 ≥ 模考配額的 1.5 倍 — 保證重複做模考會抽到不同考卷
- 題幹不重複、題目 id 全域唯一

修改題庫後請跑 `npm run check && npm test`。

## 踩過的坑

- **Tailwind 必須經 `@tailwindcss/vite` plugin 編譯。** 專案初期 `vite.config.ts` 漏掛這個 plugin，`index.css` 的 `@import "tailwindcss"` 只被當成一般 CSS 內嵌，導致打包後**完全沒有任何 Tailwind utility class**。舊頁面用 `index.css` 自訂 class 所以看似正常，但 `sr-only`、`fixed inset-0 z-50` 失效讓隱藏的檔案輸入框跑出來、彈窗掉到頁面底部。若再出現「class 沒作用」，先確認這個 plugin 還在。
- **`index.css` 的按鈕樣式與 shadcn Button 的 utility class 會疊加。** `.solid-button` 等類別明確固定了 `border-radius: 0` 等值來壓過 `rounded-md`，維持方角紙本設計。改動按鈕樣式時留意這層覆蓋關係。
- 版面以手機優先驗證：斷點在 `index.css` 的 `@media (max-width: 760px)`，`.mobile-nav` 只在此斷點顯示。

## 驗證 UI 變更的方式

環境內建 Chromium 與 Playwright（`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`，勿執行 `playwright install`）。驗證手機版面的慣用作法是 `npm run build` 後以 `python3 -m http.server` 服務 `dist/`，再用 Playwright 以 390×844 視窗操作並截圖，同時檢查 `document.documentElement.scrollWidth === window.innerWidth` 確認沒有水平溢出。

## 開發分支

本專案的 Claude Code 工作一律在 `claude/apk-mobile-layout-issues-6absgf` 分支開發後開 PR。**該分支的 PR 合併後，下次要從最新的 `main` 重開同名分支**（`git checkout -B <branch> origin/main`），不要在已合併的歷史上疊加新 commit。
