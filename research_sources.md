# iPAS AI 應用規劃師題庫研究依據

> 建檔日期：2026-08-28（GMT+8）。本平台的自編練習題依循下列官方公開範圍設計，並與官方歷屆試題清楚區隔。

## 官方來源與採用方式

| 來源 | 已確認內容 | 平台採用方式 |
| --- | --- | --- |
| [iPAS AI 應用規劃師考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) | 初級兩科：人工智慧基礎概論、生成式 AI 應用與規劃；中級三科：人工智慧技術應用與規劃、大數據處理分析與應用、機器學習技術與應用。 | 對應平台級別與科目篩選器。 |
| [iPAS AI 應用規劃師學習資源](https://ipd.nat.gov.tw/ipas/certification/AIAP/learning-resources) | 官方提供初級／中級學習指引，並公開多梯次初級與中級公告試題 PDF。 | 平台提供官方資源連結，考古題保留在官方來源，不直接重製 PDF 內容。 |
| 初級學習指引：人工智慧基礎概論 | 四大主題：人工智慧概念、資料處理與分析概念、機器學習概念、鑑別式 AI 與生成式 AI 概念。 | 自編初級科目一題組。 |
| 初級學習指引：生成式 AI 應用與規劃 | 三大主題：No Code／Low Code 概念、生成式 AI 應用領域與工具使用、生成式 AI 導入評估規劃。 | 自編初級科目二題組。 |
| 中級學習指引：人工智慧技術應用與規劃 | AI 相關技術應用（NLP、電腦視覺、生成式 AI、多模態）、導入評估規劃、系統整合與部署。 | 自編中級科目一題組。 |
| 中級學習指引：大數據處理分析與應用 | 機率統計基礎、大數據處理技術、分析方法與工具、大數據在 AI 的應用。 | 自編中級科目二題組。 |
| 中級學習指引：機器學習技術與應用 | 機率／統計、線性代數、數值優化、機器學習／深度學習、建模調校、機器學習治理。 | 自編中級科目三題組。 |

## 題庫內容政策

本網站的互動題庫使用**原創練習題**，每題標示級別、科目、主題、難度、正解、解析與易錯提醒。網站另提供官方學習資源頁連結，讓使用者可取得公開的歷屆公告試題。如此可以保留官方題目來源與版本脈絡，也避免將官方 PDF 逐字複製後誤標示為本站內容。

## 目前題庫資料模型

| 欄位 | 說明 |
| --- | --- |
| `id` | 不重複的題目代碼。 |
| `level` | 初級或中級。 |
| `subject` | 對應官方科目名稱。 |
| `topic` | 對應官方評鑑主題。 |
| `difficulty` | 基礎、進階或情境。 |
| `stem`、`options`、`answer` | 題幹、四個選項與正確選項索引。 |
| `explanation` | 作答後立即顯示的核心理由。 |
| `trap` | 常見混淆或錯誤判斷原因。 |
| `source` | 題目性質；目前均為「依官方範圍自編」。 |

## 公開題材狀態

官方學習資源頁可查得初級 114 年第四梯次、115 年第一／二次，以及中級 114 年第二梯次、115 年第一次等公告試題。此狀態隨 iPAS 更新而變動，使用者應以官方學習資源頁的最新公告為準。

## CEFR B2 英文科擴充研究（2026-08-28）

本次英文科先採通用 CEFR B2 原創練習，不複製任何正式考試試題。能力面向依 Council of Europe 的 CEFR descriptors 與 Companion Volume：B2 屬獨立使用者階段，題庫規劃涵蓋複雜文本主旨與細節、流暢互動、觀點論證、正式與非正式寫作、詞彙與文法在語境中的精準使用，以及線上互動與中介表達。

主要來源：
- Council of Europe, CEFR descriptors: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors
- Council of Europe, CEFR level descriptions: https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions
- Europass, Common European Framework of Reference for Language Skills: https://europass.europa.eu/en/common-european-framework-reference-language-skills
- Cambridge English, B2 First exam format（僅作為可選正式考試題型參考，不直接複製內容）: https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/

題庫設計：Reading / Use of English、Vocabulary & Grammar、Functional Language、Writing & Mediation 四類；每題附 CEFR B2 能力面向與「本站依公開能力描述自編」來源標記。若未來指定 Cambridge B2 First、IELTS 或其他考試，須再建立該測驗的專屬題型、計時與配分規格。

### 已核實網頁重點

Council of Europe 說明 CEFR 共同參照等級以結構化的 illustrative “can-do” descriptors 定義，且 2020 Companion volume 更新與擴充描述，包含 mediation 等相關能力。來源：https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors

Cambridge English 官方 B2 First 格式頁列出 Reading and Use of English（7 parts／52 questions／75 分鐘）、Writing（2 parts／80 分鐘）、Listening（4 parts／30 questions／約 40 分鐘）及 Speaking（4 parts；雙人約 14 分鐘）四個 component。這些資料只用於規劃可選的 B2 First 模式，不複製其正式試題。來源：https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/

## Cambridge B2 First 專屬模式實作紀錄（2026-08-28）

平台新增 Cambridge B2 First 模式，依官方格式頁建立 Reading & Use of English 的 Part 1–7 與 Listening 的 Part 1–4 仿真分類。互動內容均為本站原創，不複製 Cambridge 正式試卷、答案或錄音；每題的來源欄連結至 Cambridge English 官方格式頁。Listening 題目以原創 speech script 搭配瀏覽器 `speechSynthesis` 播放，支援一般與慢速重播，答題後才可展開逐字稿。

| 元件 | 平台呈現 | 題庫原則 |
| --- | --- | --- |
| Reading & Use of English | Part 1–7 篩選、閱讀材料、題型標籤、答後解析 | 原創 cloze、word formation、key word transformation、reading 與 gapped-text 練習 |
| Listening | Part 1–4 篩選、播放／慢速播放、答後逐字稿 | 原創情境與語音稿；不使用正式考試錄音 |

來源：Cambridge English, [B2 First exam format](https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/format/)。
