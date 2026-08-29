
## 介面整合初步驗證

- 中級英文科可切換至 Cambridge B2 First。
- 切換後顯示測驗元件（全部元件／Reading & Use of English／Listening）、Part 1–7 與 Listening Part 1–4 的篩選選項。
- 快速練習建立後題目頁顯示 Cambridge 模式、Reading & Use of English、Part 3、Word formation 題型標籤。
- 題目下方顯示 Cambridge English 官方格式頁來源連結，並保留收藏與本機筆記控制。
- 目前 Cambridge 篩選條件可用題數為 34 題，抽題流程可建立 10 題練習。

## Listening Part 1 實測

切換測驗元件至 Listening 並選取 Part 1 後，介面顯示可用 3 題，重新抽題後呈現 Listening Part 1 題目。題目頁包含 `Multiple-choice short extracts` 題型標籤、原創語音稿播放器、一般播放與 0.68× 慢速播放控制，並保留 Cambridge 官方格式來源連結、收藏與本機筆記。

## 播放控制驗證

Listening Part 1 頁面上的「播放」控制可由瀏覽器觸發；同頁的慢速 0.68× 控制也可見。播放後主控台未新增錯誤，音訊採瀏覽器語音合成，無需網路檔案或受版權保護錄音。

## Listening 作答後回饋

Listening Part 1 作答並送出後，畫面保留播放與慢速控制，新增「查看音訊逐字稿與解析提示」展開區；逐字稿、正誤判斷、解釋、易錯提醒與來源連結均正常顯示，且本機複盤紀錄新增一筆作答。

## Reading Part 5 篩選

切換元件至 Reading & Use of English 後，Part 選項正確展開至 Part 1–7；選取 Part 5 後主題選項縮小為 `B2 First · Reading Part 5`，側欄顯示 3 題可用。需按下重新抽題後才會將目前練習內容切換為閱讀題。

## Reading Part 5 實測

Reading & Use of English Part 5 重新抽題後，頁面顯示 `Multiple choice reading` 題型、原創閱讀材料、四個選項、Cambridge 官方格式來源連結與既有收藏／本機筆記控制；目前該 Part 篩選可用 3 題。

## 響應式視覺檢查

桌面版與手機版首頁均完成截圖檢查。學習追蹤、每日複習、考期倒數與快速練習區塊在手機版改為單欄堆疊，底部學習軌道仍保留；桌面版則維持左側學習軌道與索引工作台。Cambridge 題型篩選與題目頁另以瀏覽器實測確認。

## 個人化流程驗證前置

從首頁進入即時練習並切換至中級後，科目篩選器正常更新至中級科目。下一步將選取英文能力｜CEFR B2、Cambridge B2 First，建立一題練習並以錯答方式驗證複盤資料鏈。

## Cambridge 個人化流程條件

即時練習切換至中級後，可選取英文能力｜CEFR B2，再切換至 Cambridge B2 First；模式切換後顯示 34 題可用，並展開 Reading／Listening 元件與全部 Part 篩選。

## 錯題複盤資料鏈

建立 Cambridge B2 First 10 題練習後，選取 Listening Part 1 題目並以錯誤選項送出。送出後畫面顯示已記錄於此裝置的複盤紀錄、判斷正確、解析與易錯提醒；首頁累積作答數由 13 題增加至 14 題，答對率同步更新。

## 錯題複盤與專屬測驗

錯題複盤頁已將本次 Cambridge Listening 題目記入最近作答與待複盤紀錄；啟動「開始錯題專屬測驗」後可建立 7 題計時題組。此實測確認 Cambridge 作答可沿用錯題專測與答後解析的共用資料流程。

## JSON 備份匯出

收藏與筆記頁顯示「已匯出 2 題收藏與 3 則筆記」，瀏覽器下載清單出現最新的 `題策-收藏與筆記-2026-08-28 (1).json`。匯出流程可正常產生可攜式備份檔，且頁面清楚回報匯出數量。

## Cambridge 近期錯答建立

重新進入中級英文能力｜CEFR B2 的 Cambridge B2 First，抽出 Reading & Use of English Part 3 題目，選取錯誤選項 B 後送出。畫面顯示「已記錄於此裝置的複盤紀錄」、正確答案 A、解析與易錯提醒；首頁統計由 14 次作答／50% 更新為 15 次作答／47%。

## 每日複習計畫優先排序

回到學習首頁後，今日複習計畫第一項顯示 `B2 First · Reading Part 3`，理由為「近期答錯 1/1」；其後才是通用 CEFR B2 的 Vocabulary in context 錯題。首頁統計同步顯示待複盤 8 題。這確認近期 Cambridge 錯答會依錯誤率與新鮮度被優先排列。點擊今日複習後，練習頁保留 Cambridge 篩選與原題解析流程。

## Cambridge 收藏按鈕與索引

重新點擊 Cambridge Reading Part 3 題目的收藏控制後，頁首收藏數由 2 題增加至 3 題，控制文字變為「已收藏」。進入收藏與筆記頁後，頁面顯示 3 題已收藏，且 Cambridge 題庫索引中保留該題目；收藏狀態已確認確實寫入本機資料。

## 含 Cambridge bookmark 的備份

收藏與筆記頁匯出後顯示「已匯出 3 題收藏與 3 則筆記」，下載清單新增 `題策-收藏與筆記-2026-08-28 (2).json`。此前讀取的備份已確認含有 `CB2F-LIS-002` 筆記；本次新增收藏題為 Cambridge Reading Part 3，接續將以最新檔案完成匯入還原測試。

## JSON 匯入與安全合併

透過最新 JSON 備份觸發匯入後，平台顯示「已讀取備份：3 題收藏、3 則筆記」，並提供安全合併與完整還原。選擇安全合併後，畫面回報「已安全合併備份；本機同題筆記已優先保留」，收藏數維持 3 題。這確認含 `CB2F-RUE-010` bookmark 與 `CB2F-LIS-002` note 的備份可被解析並成功還原。

## 弱點推薦直接驗證

重啟後重新查看錯題複盤頁，頁面直接顯示 `B2 First · Reading Part 3` 為弱點推薦第 1 名，英文能力｜CEFR B2，答錯率 100%（1/1）；錯題索引也列出 `The new timetable should make the service considerably more ___. (EFFICIENCY)`，標示中級 · B2 First · Reading Part 3。頁面顯示目前 8 題待複盤。此項缺口已由直接畫面證據補足。
