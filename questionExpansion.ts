import type { Level, Question } from "./questions";

type QuestionSeed = {
  topic: string;
  term: string;
  definition: string;
  scenario: string;
  value: string;
  practice: string;
  misconception: string;
};

type SourceInfo = { level: Level; subject: string; prefix: string; source: string; sourceUrl: string };

const guideUrls = {
  l1ai: "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/bf93f438f7be48d295c1b40a34d79f3d/AI應用規劃師(初級)-學習指引-科目1_人工智慧基礎概論1141203_20251222172144.pdf",
  l1gen: "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/bf93f438f7be48d295c1b40a34d79f3d/AI應用規劃師(初級)-學習指引-科目2_生成式AI應用與規劃114123_20251222172159.pdf",
  l2ai: "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/bf93f438f7be48d295c1b40a34d79f3d/AI應用規劃師(中級)-學習指引-科目1人工智慧技術應用規劃_20251222101833.pdf",
  l2data: "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/bf93f438f7be48d295c1b40a34d79f3d/AI應用規劃師(中級)-學習指引-科目2大數據處理分析與應用_20251222101850.pdf",
  l2ml: "https://www.ipas.org.tw/api/proxy/uploads/certification_resource/bf93f438f7be48d295c1b40a34d79f3d/AI應用規劃師(中級)-學習指引-科目3機器學習技術與應用_20251222101907.pdf",
};

function asOptions(correct: string, distractors: string[], offset: number) {
  const base = [correct, ...distractors.slice(0, 3)];
  const options = base.map((_, index) => base[(index + offset) % base.length]) as [string, string, string, string];
  return { options, answer: options.indexOf(correct) };
}

function makeQuestions(info: SourceInfo, seeds: QuestionSeed[]): Question[] {
  return seeds.flatMap((seed, index) => {
    const near = [seeds[(index + 1) % seeds.length], seeds[(index + 5) % seeds.length], seeds[(index + 11) % seeds.length]];
    const number = String(index + 1).padStart(2, "0");
    const source = `官方 iPAS 學習指引〈${info.subject}〉評鑑範圍；本站依範圍自編`;
    const definition = asOptions(seed.definition, near.map((item) => item.definition), index % 4);
    const term = asOptions(seed.term, near.map((item) => item.term), (index + 1) % 4);
    const application = asOptions(seed.practice, near.map((item) => item.practice), (index + 2) % 4);
    const value = asOptions(seed.value, near.map((item) => item.value), (index + 3) % 4);
    const misconception = asOptions(seed.misconception, [seed.definition, seed.value, seed.practice], index % 4);

    return [
      {
        id: `${info.prefix}-${number}-01`, level: info.level, subject: info.subject, topic: seed.topic, difficulty: "基礎",
        stem: `關於「${seed.term}」的敘述，下列何者最正確？`, ...definition,
        explanation: seed.definition,
        trap: `請不要將「${seed.term}」和「${near[0].term}」混為一談；兩者處理的問題與使用時機不同。`, source, sourceUrl: info.sourceUrl,
      },
      {
        id: `${info.prefix}-${number}-02`, level: info.level, subject: info.subject, topic: seed.topic, difficulty: "情境",
        stem: `某團隊${seed.scenario}。此時最應優先掌握或運用下列哪一項概念？`, ...term,
        explanation: `此情境的關鍵是「${seed.term}」：${seed.value}`,
        trap: `先從資料型態、決策目標與限制判斷，而非只依關鍵字挑選看似相近的技術名詞。`, source, sourceUrl: info.sourceUrl,
      },
      {
        id: `${info.prefix}-${number}-03`, level: info.level, subject: info.subject, topic: seed.topic, difficulty: "進階",
        stem: `若要在專案中適當落實「${seed.term}」，下列哪一項作法最恰當？`, ...application,
        explanation: `建議作法是：${seed.practice}`,
        trap: `技術或治理概念都需放回實際工作流程；單純追求速度、忽略驗證或只做一次性處理通常不夠。`, source, sourceUrl: info.sourceUrl,
      },
      {
        id: `${info.prefix}-${number}-04`, level: info.level, subject: info.subject, topic: seed.topic, difficulty: "情境",
        stem: `團隊正在評估「${seed.term}」是否適合納入方案。下列哪一項最能說明其價值或目的？`, ...value,
        explanation: `「${seed.term}」的重點在於：${seed.value}`,
        trap: `不要把工具名稱、實作手段與業務價值混為同一層次；考題常考察它能解決什麼問題。`, source, sourceUrl: info.sourceUrl,
      },
      {
        id: `${info.prefix}-${number}-05`, level: info.level, subject: info.subject, topic: seed.topic, difficulty: "進階",
        stem: `下列關於「${seed.term}」的說法，何者是錯誤的？`, ...misconception,
        explanation: `錯誤說法是「${seed.misconception}」。正確理解為：${seed.definition}`,
        trap: `面對「何者錯誤」題型，逐一檢查定義、目的與應用限制，避免只因選項語氣肯定就誤判。`, source, sourceUrl: info.sourceUrl,
      },
    ];
  });
}

const elementaryAi: QuestionSeed[] = [
  { topic: "AI 的定義與分類", term: "人工智慧", definition: "使機器透過資料、規則或模型執行感知、推理、學習或決策等原本需要人類智慧的任務。", scenario: "要向主管說明 AI 專案不等於單一演算法，而是從資料到部署的整體能力", value: "協助辨識 AI 的能力邊界與應用目的，而非把所有自動化都誤稱為 AI", practice: "先釐清任務是否涉及學習、推理、感知或決策，再選擇相應的技術方案", misconception: "人工智慧只等同於深度學習模型" },
  { topic: "AI 的定義與分類", term: "分析型 AI", definition: "從既有資料中找出模式、關聯或洞察，協助理解目前或過去狀態的 AI 應用。", scenario: "要從會員交易紀錄找出高流失風險客群的共同特徵", value: "將資料轉為可用洞察，支援人員理解現況與發現問題", practice: "先定義欲理解的指標與資料範圍，再以適當圖表或模型探索關聯", misconception: "分析型 AI 的唯一用途是直接生成新的內容" },
  { topic: "AI 的定義與分類", term: "預測型 AI", definition: "根據歷史資料與特徵推估未來數值、事件或類別結果的 AI 應用。", scenario: "要估計下個月需求量並安排庫存", value: "協助提前規劃資源與降低不確定性，但須持續檢驗預測誤差", practice: "使用在預測時點可取得的歷史資料，並以保留資料評估預測效能", misconception: "預測型 AI 可以不經驗證就保證未來結果正確" },
  { topic: "AI 的定義與分類", term: "生成型 AI", definition: "學習資料中的模式後，依提示或條件產生文字、圖像、語音、程式碼或其他新內容的 AI。", scenario: "要協助客服人員依知識庫快速草擬回覆", value: "加速內容草擬與創意工作，但輸出仍需驗證其正確性、適切性與權利風險", practice: "提供明確任務、受眾與格式限制，並建立人工審核與來源查核流程", misconception: "生成型 AI 的輸出只要語句流暢就必然正確" },
  { topic: "AI 治理概念", term: "透明性", definition: "讓利害關係人能在適當範圍理解 AI 的用途、資料類型、限制、決策流程與人類介入方式。", scenario: "公司要對使用 AI 初篩履歷的流程建立可說明機制", value: "提升可理解性與信任，並讓受影響者知道如何提出疑問或尋求覆核", practice: "以易懂文件說明使用目的、資料來源類型、主要限制與申訴或人工覆核窗口", misconception: "透明性等於必須公開所有模型原始碼與商業機密" },
  { topic: "AI 治理概念", term: "可問責性", definition: "為 AI 的設計、部署、使用與結果指定可追溯的責任角色、決策紀錄與處理機制。", scenario: "系統錯誤地把客戶申請標記為高風險，需要追查決策流程", value: "確保問題出現時能找到負責單位、釐清原因並修正流程", practice: "建立角色分工、版本紀錄、事件通報與定期檢視機制", misconception: "只要系統由供應商提供，使用組織就不需承擔責任" },
  { topic: "AI 治理概念", term: "人類監督", definition: "在 AI 生命週期中由合格人員檢視輸入、輸出與高風險決策，必要時介入、覆核或停止系統。", scenario: "醫療影像輔助系統提出疑似病灶結果供臨床人員判讀", value: "在高影響情境保留專業判斷與例外處理，避免把模型結果視為唯一依據", practice: "依風險設定人工覆核門檻、升級流程與停止使用條件", misconception: "人類監督只是上線前一次性按下核准按鈕" },
  { topic: "資料基本概念與來源", term: "結構化資料", definition: "遵循固定欄位與資料型態、通常以行列或關聯式資料表儲存且易於查詢的資料。", scenario: "要彙整訂單編號、日期、金額與商品類別的交易明細", value: "便於一致管理、查詢與統計分析，適合作為多數商業報表與模型特徵來源", practice: "定義欄位意義、型態、主鍵與資料驗證規則，維持紀錄一致性", misconception: "任何含有文字欄位的資料都必然是非結構化資料" },
  { topic: "資料基本概念與來源", term: "半結構化資料", definition: "具有標籤、鍵值或層級等部分結構，但欄位可彈性變動的資料，例如 JSON 或 XML。", scenario: "要處理不同來源 API 回傳的巢狀 JSON 紀錄", value: "兼顧資料表達彈性與可解析性，適合格式可能演進的資料交換", practice: "保留 schema 說明並對重要欄位做格式驗證與版本管理", misconception: "半結構化資料完全沒有可供解析的欄位或標籤" },
  { topic: "資料基本概念與來源", term: "非結構化資料", definition: "沒有固定行列結構、需經解析或特徵化後才能分析的文字、影像、音訊或影片等資料。", scenario: "要從客服語音與照片回報中擷取可分析資訊", value: "可承載豐富情境訊號，但通常需要額外的前處理與標註或模型技術", practice: "先確認資料權利、品質與標註需求，再選擇文字、語音或影像處理方法", misconception: "非結構化資料因為難處理，所以不可能用於 AI 專案" },
  { topic: "資料基本概念與來源", term: "第一方資料", definition: "組織直接向自身客戶、產品、流程或調查取得，並由組織掌握蒐集目的與使用條件的資料。", scenario: "要分析自家 App 的使用行為並改善產品流程", value: "通常與自身業務情境貼近，且較能掌握資料品質、同意與治理責任", practice: "清楚告知蒐集目的、保存期間與使用方式，並依權限管理存取", misconception: "第一方資料不需要考慮個資、同意或資料安全" },
  { topic: "資料基本概念與來源", term: "資料品質", definition: "資料在正確性、完整性、一致性、及時性與適用性等面向符合特定使用目的的程度。", scenario: "模型結果不穩定，發現不同系統對同一產品類別使用不一致名稱", value: "降低錯誤輸入對分析與模型的連鎖影響，提高結果可解釋性與可用性", practice: "建立資料定義、品質指標、異常檢查與修正紀錄，並定期追蹤", misconception: "資料量只要足夠大，資料品質問題就自然會消失" },
  { topic: "資料整理與分析流程", term: "缺失值處理", definition: "針對資料欄位未記錄有效值的情況，依缺失原因與分析目的選擇填補、保留標記或排除的處理。", scenario: "問卷中的收入欄有大量未填答，需要決定是否可用於分析", value: "避免在不理解缺失機制下任意補值，降低樣本偏差與不當推論", practice: "先分析缺失比例與原因，再以業務合理的規則進行填補、標記或排除", misconception: "所有缺失值都應一律以平均數填補" },
  { topic: "資料整理與分析流程", term: "重複值處理", definition: "辨識多次寫入或相同實體被重複記錄的資料，並依業務規則去除、合併或保留有效版本。", scenario: "客戶匯入名單後，發現同一會員在不同批次重複出現", value: "避免統計量與模型權重受到重複紀錄扭曲，也能降低不必要的儲存與處理成本", practice: "以主鍵、時間戳或關鍵欄位比對，確認重複原因後保留正確紀錄與處理軌跡", misconception: "只要資料列完全相同，就不需要確認是否有合法的業務原因" },
  { topic: "資料整理與分析流程", term: "離群值", definition: "明顯偏離多數資料分佈的觀測值，可能是輸入錯誤、特殊事件或具有重要業務意義的紀錄。", scenario: "銷售資料中有一筆金額遠高於其他訂單，需決定是否納入模型", value: "協助發現資料錯誤、欺詐、特殊客戶或分佈特性，不能僅因少見就直接刪除", practice: "先追查來源與業務背景，再以明確規則決定修正、保留、轉換或分開分析", misconception: "所有離群值必定是無用錯誤，應直接刪除" },
  { topic: "資料整理與分析流程", term: "標準化", definition: "將數值特徵轉換到可比較的尺度，使不同單位或範圍的變數較適合共同用於分析或模型訓練。", scenario: "同時使用年收入與網頁停留秒數建立距離式分群模型", value: "避免量級較大的特徵主導距離或梯度計算，提升某些模型的穩定性", practice: "依模型需求在訓練資料擬合轉換參數，再一致套用至驗證與測試資料", misconception: "標準化等同於刪除所有極端值" },
  { topic: "資料整理與分析流程", term: "特徵工程", definition: "依領域問題將原始資料轉換、組合或選擇為更能表達任務訊號的輸入特徵的過程。", scenario: "要由訂單明細推估客戶流失風險，並將最近購買時間與購買頻率轉成模型欄位", value: "讓模型接觸到更有意義的訊號，但需避免使用預測時點之後才知道的資訊", practice: "把特徵定義與產生時間點文件化，並以驗證資料檢查它是否真正改善泛化能力", misconception: "特徵工程可以任意使用結果發生後才知道的欄位" },
  { topic: "機器學習基本原理", term: "監督式學習", definition: "以帶有正確標籤或目標值的資料訓練模型，學習輸入特徵與輸出之間關係的方法。", scenario: "要以已標記的垃圾信與正常信訓練郵件分類器", value: "可處理分類與迴歸任務，但標籤品質與資料代表性會直接影響模型結果", practice: "分開訓練、驗證與測試資料，並確認標籤定義一致且可反映實際任務", misconception: "監督式學習不需要任何已知答案或目標值" },
  { topic: "機器學習基本原理", term: "非監督式學習", definition: "在沒有既定標籤的資料中探索群組、結構、關聯或低維表示的學習方法。", scenario: "要依顧客瀏覽與購買模式找出可能不同的客群輪廓", value: "協助資料探索與分群，但群組意義仍需透過領域知識與後續驗證解讀", practice: "先確認特徵尺度與距離定義，並以業務可解釋性檢視分群結果", misconception: "非監督式學習產生的群組一定就是事先定義好的真實類別" },
  { topic: "機器學習基本原理", term: "強化學習", definition: "讓代理人透過與環境互動、依獎勵訊號調整策略，以追求長期累積回報的學習方法。", scenario: "要讓自動排程系統在不同決策下逐步學習降低整體等待時間", value: "適合連續決策與試誤回饋問題，但需要審慎設計獎勵、模擬環境與安全邊界", practice: "明確定義狀態、可行行動、獎勵與限制，先在可控環境測試再逐步擴大", misconception: "強化學習只要看一次正確答案就能完成訓練" },
  { topic: "鑑別式與生成式 AI 概念", term: "鑑別式 AI", definition: "著重學習輸入與標籤或目標間的關係，用於分類、判別或預測既定輸出的模型或方法。", scenario: "要判斷一筆交易是否可能為詐欺", value: "用可觀察特徵產生類別或數值判斷，常見於風險評分、辨識與預測任務", practice: "根據任務設計明確標籤與評估指標，並在未見資料上檢驗泛化能力", misconception: "鑑別式 AI 的主要目標是憑空產出長篇新內容" },
];

const elementaryGen: QuestionSeed[] = [
  { topic: "No Code / Low Code 概念", term: "No Code", definition: "透過視覺化介面、模板與拖放元件，讓非技術使用者可在極少或不寫程式下建立簡易應用與流程的方式。", scenario: "業務人員要快速建立內部活動報名表與通知流程", value: "降低基本開發門檻並加速原型或標準流程落地", practice: "選擇符合資料權限與流程複雜度的平台，並先界定可用範圍", misconception: "No Code 工具在所有情境都能取代專業軟體工程與治理" },
  { topic: "No Code / Low Code 概念", term: "Low Code", definition: "以視覺化開發為主並容許加入少量程式碼、API 或客製邏輯，以支援較複雜整合需求的方式。", scenario: "要快速建置流程系統，且未來需串接人資與身分驗證服務", value: "在開發速度與客製整合彈性間取得平衡", practice: "評估平台的擴充介面、版本管理、權限與維運責任，再決定採用範圍", misconception: "Low Code 完全不允許撰寫程式或串接外部系統" },
  { topic: "No Code / Low Code 概念", term: "市民開發者", definition: "以業務知識為主、運用受治理的低程式或無程式工具建立解決方案的非傳統開發人員。", scenario: "行銷人員想自行建立核准後才發送的活動通知流程", value: "讓最理解業務流程的人更快參與改善，但需納入 IT 治理與資安規範", practice: "提供核准工具、範本、資料存取界線與需要升級給專業團隊的條件", misconception: "市民開發者可不受資料、資安或架構標準約束" },
  { topic: "No Code / Low Code 的優勢與限制", term: "快速原型", definition: "以較低成本與較短時間做出可展示、測試或收集回饋的初步方案，而非直接視為完成的正式產品。", scenario: "團隊要在兩週內驗證 AI 摘要功能是否真的節省客服處理時間", value: "及早檢驗需求假設、使用流程與效益，減少在錯誤方向上大量投入", practice: "設定可量測的驗證目標、受控資料範圍與回饋機制，再決定是否擴大", misconception: "快速原型完成後不必考慮資安、整合與正式維運" },
  { topic: "No Code / Low Code 的優勢與限制", term: "系統整合能力", definition: "工具或平台能以 API、連接器、資料交換或工作流程方式與既有系統安全交換資料並協調作業的能力。", scenario: "新建立的 AI 表單要讀取 CRM 客戶資料並回寫處理結果", value: "避免人工搬運資料與資訊孤島，讓改善的流程能融入既有作業", practice: "事前檢查認證方式、資料格式、錯誤處理、權限與資料流向", misconception: "只要兩套系統的畫面看起來相似，就代表一定可以整合" },
  { topic: "No Code / Low Code 的優勢與限制", term: "總擁有成本（TCO）", definition: "除了初始採購外，將維護、授權、整合、訓練、資安、資料與人力等全生命週期成本納入的成本觀點。", scenario: "部門比較兩個 AI 平台，其中一個月費低但需要大量客製維護", value: "協助以長期使用成本而非單一報價作出較完整的選擇", practice: "列出導入、使用、維運、擴充與退出成本，搭配預期效益比較", misconception: "TCO 只需要比較第一年的軟體授權費" },
  { topic: "No Code / Low Code 的優勢與限制", term: "投資報酬率（ROI）", definition: "將導入方案帶來的可量化效益與投入成本進行比較，以評估投資是否具經濟價值的指標或分析。", scenario: "要判斷導入生成式 AI 草擬客服回覆能否回收授權與訓練成本", value: "把效率、品質或營收改善與成本連結，支援資源配置決策", practice: "在導入前定義基準值、效益指標、計算期間與成本範圍，持續追蹤", misconception: "ROI 只看收入增加，不需納入風險、維運或人員成本" },
  { topic: "生成式 AI 應用領域與工具使用", term: "提示工程", definition: "以明確角色、目標、脈絡、限制、輸出格式與驗證要求設計輸入指令，提升生成式 AI 輸出可用性的做法。", scenario: "要讓模型固定以表格整理會議重點，且標出待確認資訊", value: "減少模糊輸入造成的歧義，使輸出更貼近任務、受眾與品質標準", practice: "提供必要背景、格式與判斷條件，先以小樣本迭代測試並保留有效版本", misconception: "提示詞越長越好，不需要界定目標或驗證需求" },
  { topic: "生成式 AI 應用領域與工具使用", term: "提示詞迭代", definition: "根據輸出品質、錯誤模式與使用者回饋，持續調整提示內容、範例、限制與評估方式的過程。", scenario: "模型產出的產品文案常遺漏必要規格，需要改善結果", value: "以可觀察的失敗原因逐步提高穩定性，而非期待一次指令就完全正確", practice: "記錄輸入、輸出與失敗案例，針對單一問題調整並比較前後效果", misconception: "提示第一次沒有成功時，只能更換模型而不能改善指令" },
  { topic: "生成式 AI 應用領域與工具使用", term: "溫度參數", definition: "控制文字生成隨機性與多樣性的參數；通常較低值傾向較保守一致，較高值傾向較多樣創意。", scenario: "要用模型產出格式固定、事實需嚴謹的內部摘要", value: "依任務在穩定性與多樣性間調整生成行為", practice: "對需要一致的任務使用較保守設定，並以測試樣本確認品質與重現性", misconception: "把溫度調高就能保證內容更正確" },
  { topic: "生成式 AI 應用領域與工具使用", term: "多模態生成", definition: "模型可理解或產生兩種以上資料型態，例如結合文字、影像、語音或影片的輸入與輸出能力。", scenario: "客服上傳商品照片並以文字描述問題，系統需整合理解後提出處理建議", value: "讓系統可利用不同訊號理解較完整的情境與需求", practice: "確認各模態資料的品質、授權、隱私與對齊方式，再評估實際效益", misconception: "只要資料筆數很多，就可稱為多模態生成" },
  { topic: "生成式 AI 應用領域與工具使用", term: "檢索增強生成（RAG）", definition: "先從外部知識庫檢索與問題相關的內容，再提供給模型作為生成脈絡的架構。", scenario: "要讓內部問答系統可依最新產品手冊回答，且能指出參考內容", value: "提升領域知識的相關性與更新彈性，降低只靠模型既有知識回答的風險", practice: "建立受治理的知識庫、檢索品質測試與引用驗證，再監控無法回答的問題", misconception: "RAG 會把所有文件永久重新訓練進模型參數" },
  { topic: "生成式 AI 導入評估", term: "問題定義", definition: "在導入前清楚描述要解決的業務痛點、使用者、輸入輸出、限制與成功標準的工作。", scenario: "主管只說想『導入 AI』，但尚未說明哪個流程需要改善", value: "避免工具導向的盲目採購，讓技術選擇回到具體且可驗證的業務需求", practice: "用使用情境與衡量指標描述問題，並確認現有流程、資料與責任人", misconception: "先買到最熱門的 AI 工具，再找可能使用的問題即可" },
  { topic: "生成式 AI 導入評估", term: "成功指標（KPI）", definition: "用來衡量導入方案是否達成預期目標的可觀察、可追蹤指標，例如處理時間、品質或採用率。", scenario: "要驗證 AI 摘要是否改善客服工作，而非只看使用次數", value: "讓試行與擴大決策有客觀依據，能比較導入前後的實際影響", practice: "在試行前設定基準、目標值、資料蒐集方法與檢視週期", misconception: "KPI 只要設定為模型產生內容的字數即可" },
  { topic: "生成式 AI 導入評估", term: "資料敏感度分級", definition: "依資料的機密性、個資性、商業影響與法規要求分類，決定可否及如何輸入或處理的管理方式。", scenario: "員工想將尚未上市的產品規格貼到外部生成式 AI 服務", value: "協助在利用工具與保護敏感資訊間建立可執行的使用界線", practice: "定義可用資料類型、核准工具、遮罩規則與例外申請流程", misconception: "只要把機密資料翻譯成外語，就不需要敏感度控管" },
  { topic: "生成式 AI 導入規劃", term: "試行（Pilot）", definition: "在受控範圍內以有限使用者、資料與時間測試方案效益、風險與可行性的導入階段。", scenario: "要先讓一小組客服使用 AI 草擬回覆，再評估是否擴至全公司", value: "及早暴露流程、資料、品質與採用問題，降低全面上線失敗成本", practice: "設定試行範圍、終止條件、回饋收集與擴大或停止的決策門檻", misconception: "試行階段因使用者少，所以可以忽略資安與法規" },
  { topic: "生成式 AI 導入規劃", term: "人在迴路（Human-in-the-loop）", definition: "將人員審核、修正、核准或升級處理嵌入 AI 工作流程，特別用於高風險或品質敏感任務的設計。", scenario: "要以 AI 協助產出對外公告，但不能讓未核准內容直接發布", value: "保留專業判斷與責任承擔，也能把修正回饋轉化為持續改善素材", practice: "定義需人工覆核的條件、責任角色、可修改範圍與異常升級機制", misconception: "人在迴路代表使用者每次都必須從頭手寫全部內容" },
  { topic: "生成式 AI 風險管理", term: "AI 幻覺", definition: "模型生成看似合理但不正確、無來源或不存在的資訊的現象。", scenario: "系統自信地引用不存在的產品保固條款作為客服答案", value: "提醒使用者流暢文字不等於事實正確，必須依風險建立查核與限制", practice: "要求可查證來源、設計拒答或升級規則，並由人員覆核高影響內容", misconception: "只要模型版本更新，AI 幻覺就會完全消失" },
  { topic: "生成式 AI 風險管理", term: "著作權與授權風險", definition: "生成或使用內容時可能涉及原始素材權利、授權條件、相似性與商業使用限制的風險。", scenario: "行銷團隊要將 AI 產生的圖像直接用於大型商業廣告", value: "保護組織與創作者權益，降低侵權、誤用或無法追溯素材來源的風險", practice: "確認工具條款、素材來源與使用範圍，必要時進行權利審查與保留紀錄", misconception: "由 AI 產生的內容就一定不會涉及任何權利問題" },
  { topic: "生成式 AI 風險管理", term: "偏見與歧視風險", definition: "模型或流程因訓練資料、設計假設或使用方式而對特定群體產生不公平結果或刻板呈現的風險。", scenario: "招聘文案工具反覆使用特定性別刻板描述，影響招募訊息", value: "降低技術放大既有不平等的機會，維持服務與決策的公平性", practice: "以多樣測試案例檢視輸出，建立回報、修正與高風險使用限制", misconception: "模型是自動化系統，所以輸出必然客觀且不會有偏見" },
  { topic: "生成式 AI 風險管理", term: "輸出驗證", definition: "依任務重要性檢查 AI 輸出的事實、來源、完整性、語氣、安全性與是否符合使用規範的流程。", scenario: "要把模型生成的市場摘要提供給決策會議參考", value: "在內容被採用前發現錯誤、遺漏與不當表述，防止風險擴散", practice: "建立可重複的檢核清單、引用要求與必要的人工覆核層級", misconception: "只要輸出看起來專業流暢，就不需要進一步驗證" },
];

const intermediateAi: QuestionSeed[] = [
  { topic: "自然語言處理技術與應用", term: "自然語言處理（NLP）", definition: "讓電腦理解、處理、分析或生成自然語言文字與語音的一系列技術與方法。", scenario: "要從大量客服對話中整理常見問題並產生回覆草稿", value: "將人類語言轉為可分析與互動的訊號，支援分類、搜尋、對話與生成任務", practice: "先確認任務是理解、擷取、分類或生成，並盤點語料品質與隱私限制", misconception: "NLP 只能用來把文字翻譯成另一種語言" },
  { topic: "自然語言處理技術與應用", term: "自然語言理解（NLU）", definition: "著重辨識文字或語音的意圖、語意、情緒、實體與結構，使系統能理解使用者表達內容的能力。", scenario: "客服機器人需要判斷客戶是在詢問退款、帳務還是帳號登入", value: "讓系統可將自由文字轉為可執行的意圖與結構化資訊", practice: "定義意圖與實體標籤、蒐集具代表性語料，並檢查容易混淆的表達方式", misconception: "NLU 的主要任務是在沒有輸入內容時自動寫出文章" },
  { topic: "自然語言處理技術與應用", term: "自然語言生成（NLG）", definition: "依資料、規則、脈絡或模型預測結果，自動產生人類可讀的文字或語音內容的技術。", scenario: "要把銷售數據的異常變化轉成管理者易讀的週報摘要", value: "把結構化結果轉為可溝通的敘述，提升資訊傳遞與互動效率", practice: "限定輸出格式、事實來源與語氣，並對對外或高影響內容安排審核", misconception: "NLG 只能辨識使用者情緒，不能產生內容" },
  { topic: "自然語言處理技術與應用", term: "斷詞／標記化", definition: "將文字拆分成詞、子詞、字元或其他可供模型處理的基本單位的前處理步驟。", scenario: "要把中文客服文字轉為模型可學習的序列表示", value: "建立後續統計、向量化、搜尋與模型運算的基本輸入單位", practice: "依語言、模型與任務選擇合適切分方式，並檢查專有名詞是否被錯誤切開", misconception: "中文因為沒有空白，所以完全無法進行斷詞或標記化" },
  { topic: "自然語言處理技術與應用", term: "命名實體辨識（NER）", definition: "從文本中找出並標記人名、組織、地點、日期、產品或領域特定實體的任務。", scenario: "要從合約與客服信件中擷取客戶名稱、日期和產品型號", value: "將自由文字中的關鍵項目結構化，支援搜尋、摘要、流程自動化與風險檢查", practice: "明確定義實體類別與標註規範，並用真實書寫變體驗證辨識結果", misconception: "NER 只會判斷一整段文字是正面或負面情緒" },
  { topic: "自然語言處理技術與應用", term: "情感分析", definition: "判斷文字或語音所表達的情緒、態度或正負向傾向的 NLP 任務。", scenario: "要從產品評論中監控客戶對新版功能的滿意度變化", value: "協助快速彙整大量回饋的態度趨勢，但需留意反諷、語境與資料偏差", practice: "以符合領域的標註資料測試，並把結果視為輔助訊號而非絕對事實", misconception: "情感分析可以直接證明客戶一定會購買產品" },
  { topic: "自然語言處理技術與應用", term: "詞嵌入", definition: "將詞、句子或文件轉換為數值向量，使語意相近內容在向量空間中具有可比較關係的表示方法。", scenario: "要建立可找出語意相似客服問題的知識庫搜尋功能", value: "讓機器能以數值方式比較語意關聯，支援檢索、分類、分群與推薦", practice: "評估向量模型是否符合語言與領域，並以代表性查詢驗證檢索結果", misconception: "詞嵌入等於把每個詞轉成唯一且固定的人工編號" },
  { topic: "自然語言處理技術與應用", term: "Transformer", definition: "以注意力機制處理序列資料、能有效建模長距關係並高度平行化的深度學習架構。", scenario: "要處理長篇文件中的跨段落語意關聯與問答", value: "提升對上下文與長距依賴的建模能力，是多種現代語言與多模態模型的重要基礎", practice: "依任務規模與資源選擇模型，並評估輸入長度、推論成本與資料治理", misconception: "Transformer 只能逐字線性讀取，不能同時關注不同位置資訊" },
  { topic: "電腦視覺技術與應用", term: "影像分類", definition: "為整張影像或主要畫面判定一個或多個類別標籤的電腦視覺任務。", scenario: "要判斷商品照片屬於服飾、家電或食品哪一個大類", value: "可快速對大量影像進行類別整理與初步判定", practice: "確認標籤定義、影像品質與類別平衡，並以未見資料測試模型表現", misconception: "影像分類一定能標出每一個物件的精確位置" },
  { topic: "電腦視覺技術與應用", term: "物件偵測", definition: "在影像中辨識一個或多個目標類別，並以邊界框等方式標示其位置的任務。", scenario: "要在倉儲照片中找出安全帽並標出每一個未配戴人員的位置", value: "同時回答影像中有什麼與位於何處，適合多物件與定位需求", practice: "準備含位置標註的代表性影像，並評估漏檢與誤檢在業務上的成本", misconception: "物件偵測只能對整張影像輸出單一分類結果" },
  { topic: "電腦視覺技術與應用", term: "影像分割", definition: "將影像像素分配到物件、區域或類別，以取得比邊界框更精細輪廓的電腦視覺任務。", scenario: "要量測醫療影像中病灶實際範圍而非只標示大致位置", value: "提供精確區域資訊，適合需要面積、形狀或像素層級分析的應用", practice: "使用符合任務的像素標註資料，並由領域專家檢視錯誤區域的風險", misconception: "影像分割只是在圖片檔案切成數個小檔案" },
  { topic: "電腦視覺技術與應用", term: "光學字元辨識（OCR）", definition: "從掃描文件、照片或影像中辨識印刷或手寫文字並轉為可搜尋、可編輯文字的技術。", scenario: "要把紙本發票影像轉成可匯入會計系統的欄位資料", value: "降低人工輸入成本並讓影像文件可供搜尋、擷取與後續流程使用", practice: "針對文件品質、版面、語言與錯誤字元建立抽檢與人工校正流程", misconception: "OCR 只要掃描成功，就保證所有欄位語意與數字都完全正確" },
  { topic: "生成式 AI 技術與應用", term: "大型語言模型（LLM）", definition: "以大量文本與深度學習訓練、能理解與生成自然語言並可執行多種語言任務的大型模型。", scenario: "要建立可草擬摘要、分類信件與回答內部問題的語言助手", value: "提供通用語言能力與任務彈性，但需以脈絡、工具與治理降低錯誤使用風險", practice: "界定可用任務、資料限制、提示模板與高風險內容的驗證機制", misconception: "LLM 的每一句輸出都附帶可證明真實的來源保證" },
  { topic: "生成式 AI 技術與應用", term: "微調（Fine-tuning）", definition: "在既有預訓練模型基礎上，以特定任務或領域資料進一步訓練，使模型更符合目標行為的方式。", scenario: "要讓模型在固定客服分類任務中使用企業專屬標籤與語氣", value: "可提升特定任務的一致性，但需評估資料品質、成本、維護與過度擬合風險", practice: "先比較提示、檢索等較輕量方案，再以可合法使用且品質受控的資料進行評估", misconception: "微調後的模型就永遠不需再監控或更新" },
  { topic: "多模態人工智慧應用", term: "多模態理解", definition: "整合文字、影像、語音、表格或影片等多種訊號，對同一情境做聯合分析或推論的能力。", scenario: "使用者提交產品照片、語音描述與訂單資訊，系統需共同判斷售後處理方式", value: "利用互補訊息降低單一資料型態的盲點，提升複雜情境的理解能力", practice: "確認各模態資料的時間、實體與語意是否正確對齊，並評估隱私與權利風險", misconception: "多模態理解只要把兩個資料夾放在同一台電腦即可完成" },
  { topic: "AI 導入評估", term: "可行性評估", definition: "從業務價值、資料、技術、流程、資源、風險與法規等面向判斷 AI 方案是否值得且能夠執行的分析。", scenario: "要決定是否以 AI 協助審查大量保險申請文件", value: "避免只因技術熱門就投入，讓導入決策建立在可驗證的價值與限制之上", practice: "盤點資料可用性、錯誤成本、使用者流程、預期指標與必要治理後再排序方案", misconception: "可行性評估只要確認模型在展示資料上看起來厲害即可" },
  { topic: "AI 導入規劃", term: "需求規格", definition: "將業務需求轉化為可驗收的使用情境、輸入輸出、品質門檻、責任與例外處理的明確描述。", scenario: "業務單位說希望客服 AI『更聰明』，技術團隊需要將需求落地", value: "建立跨部門共同語言，降低開發結果與實際作業不符的風險", practice: "共同定義使用者、任務、不可接受錯誤、驗收案例與升級處理流程", misconception: "需求規格只需要列出想使用的模型品牌即可" },
  { topic: "AI 風險管理", term: "模型風險監控", definition: "在部署後持續觀察模型輸入、輸出、效能、偏差與異常事件，並依門檻採取調整或停止措施的機制。", scenario: "貸款風險模型上線半年後，市場環境與申請人特徵已出現明顯改變", value: "及早發現模型失效、資料漂移、偏見或濫用，維持系統在可接受風險內運作", practice: "設定資料與效能基準、告警門檻、定期檢視與再訓練或回退流程", misconception: "模型只要通過上線前測試，之後就不需再監控" },
  { topic: "數據準備與模型選擇", term: "任務對齊", definition: "讓資料、模型輸出、評估指標與實際業務決策目標彼此一致的規劃原則。", scenario: "團隊要預測高風險案件，但只以整體準確率作為唯一成功指標", value: "避免模型在技術分數上看似良好，卻無法支援真實決策或忽略關鍵錯誤成本", practice: "先定義決策行動與錯誤代價，再選擇標籤、模型與相對應的評估指標", misconception: "只要任一模型的訓練準確率最高，就代表最適合業務任務" },
  { topic: "AI 技術系統集成與部署", term: "資料漂移", definition: "部署後輸入資料的分佈、特徵或取得方式與訓練期間不同，可能使模型效能下降的現象。", scenario: "原本的需求預測模型在新產品上市與促銷方式改變後誤差逐漸變大", value: "提醒團隊監控真實環境資料變化，及早評估模型是否仍適用", practice: "比較部署期與訓練期的資料分佈，設定警示並依需要重新校正、訓練或回退", misconception: "資料漂移只會在程式碼版本更新時發生" },
  { topic: "AI 技術系統集成與部署", term: "MLOps", definition: "將機器學習的資料、實驗、版本、部署、監控與治理流程系統化與自動化的實務方法。", scenario: "團隊需要讓不同版本模型可追溯，並能穩定發布、監控與回復", value: "提升模型生命週期的可重現性、協作效率與營運可靠性", practice: "建立資料與模型版本、測試、部署管線、監控儀表與事件處理流程", misconception: "MLOps 只是在上線時把模型檔案複製到伺服器" },
];

const intermediateData: QuestionSeed[] = [
  { topic: "敘述性統計與資料摘要技術", term: "平均數", definition: "將所有數值加總後除以觀測數量的集中趨勢指標，容易受到極端值影響。", scenario: "要初步摘要某產品每日銷售額的整體水準，且資料沒有明顯極端值", value: "提供直覺的整體平均水準，適合搭配分散程度與分佈形狀一起解讀", practice: "同時檢查中位數、標準差與離群值，確認平均數是否能代表典型情況", misconception: "平均數永遠不受少數極端數值影響" },
  { topic: "敘述性統計與資料摘要技術", term: "中位數", definition: "將資料排序後位於中間位置的值，對極端值通常比平均數更不敏感的集中趨勢指標。", scenario: "要描述高度右偏的房價資料的典型水準", value: "在收入、房價等可能有少數極大值的資料中提供較穩健的中心參考", practice: "先排序資料並依樣本數奇偶正確計算，且搭配分佈圖說明資料特性", misconception: "中位數是所有資料值加總再除以資料筆數" },
  { topic: "敘述性統計與資料摘要技術", term: "標準差", definition: "衡量資料相對於平均數分散程度的指標，數值較大通常代表資料波動較大。", scenario: "要比較兩條產線的產品重量穩定性", value: "量化波動與一致性，協助發現品質不穩或特徵尺度差異", practice: "搭配平均數、分佈形狀與離群值解讀，避免只看單一分散指標", misconception: "標準差越大表示資料一定越準確" },
  { topic: "敘述性統計與資料摘要技術", term: "四分位距（IQR）", definition: "第三四分位數與第一四分位數的差，描述資料中間百分之五十範圍的離散程度。", scenario: "要在含有少數極端值的交貨天數資料中衡量典型波動", value: "比全距更不受極端值左右，適合搭配箱型圖檢視分散與離群點", practice: "先正確取得 Q1 與 Q3，並結合領域規則確認離群值是否有業務意義", misconception: "IQR 等於資料最大值減去最小值" },
  { topic: "敘述性統計與資料摘要技術", term: "直方圖", definition: "將連續數值依區間分組並以柱高表示頻數或密度，用來觀察資料分佈形狀的圖表。", scenario: "要快速查看客服等待時間是否偏態、是否有多個高峰或異常區間", value: "協助理解集中、分散、偏態與可能的多峰結構", practice: "選擇合理的分組區間，並比較不同分組設定是否改變主要解讀", misconception: "直方圖最適合用來精確顯示每一筆個別資料的名稱" },
  { topic: "敘述性統計與資料摘要技術", term: "散佈圖", definition: "以平面上的點呈現兩個數值變數配對關係，用於探索趨勢、群組、離群點與可能相關性。", scenario: "要觀察廣告支出與網站轉換率是否有可能的關聯", value: "提供變數關係的直觀探索，但不能單獨證明因果關係", practice: "檢查點的分佈、離群與可能非線性模式，必要時搭配分層或統計檢定", misconception: "散佈圖只要看到上升趨勢，就已經證明其中一個變數造成另一個變數" },
  { topic: "機率分佈與資料分佈模型", term: "離散型隨機變數", definition: "可能取值為有限或可數集合的隨機變數，例如每日訂單數或骰子點數。", scenario: "要描述一小時內客服來電的次數", value: "協助選擇適合計數或類別結果的機率模型與統計方法", practice: "先確認數值是否為可數的計數結果，再檢查事件獨立性與發生率等假設", misconception: "離散型隨機變數可以在任兩個整數間取任何無限多小數值" },
  { topic: "機率分佈與資料分佈模型", term: "伯努利分佈", definition: "描述單次試驗只有兩種結果的離散型分佈，常以 1 表示成功、0 表示失敗。", scenario: "要表示單一使用者是否點擊某個推播通知", value: "提供二元結果的基本機率模型，是二項分佈與多種分類模型的重要基礎", practice: "明確定義成功事件與觀測時點，確認每筆紀錄只代表一次二元試驗", misconception: "伯努利分佈用來描述固定時間內大量事件發生的次數" },
  { topic: "機率分佈與資料分佈模型", term: "二項分佈", definition: "描述固定次數的獨立試驗中，成功事件發生次數的離散型機率分佈。", scenario: "要估計 100 封行銷信在成功率固定下有多少封會被開啟", value: "可建模多次二元試驗的成功次數，但需符合固定試驗次數、獨立性與成功率假設", practice: "確認每次試驗定義一致且成功機率沒有因試驗順序或條件明顯改變", misconception: "二項分佈不需要固定試驗次數或成功機率的假設" },
  { topic: "機率分佈與資料分佈模型", term: "泊松分佈", definition: "描述固定時間或空間區間內事件發生次數的分佈，常假設事件獨立且平均發生率固定。", scenario: "要估計客服中心每小時收到幾通來電", value: "適合分析稀少或到達型事件的次數，並可作為排班與容量規劃參考", practice: "檢查發生率是否近似穩定，若受時段或活動強烈影響則應分段或選用其他模型", misconception: "泊松分佈主要用來描述兩次事件之間的等待時間" },
  { topic: "機率分佈與資料分佈模型", term: "常態分佈", definition: "以平均數為中心、左右對稱的連續型鐘形分佈，由平均數與標準差決定位置與尺度。", scenario: "要初步檢視製程中產品重量是否接近對稱穩定分佈", value: "是許多統計推論與誤差模型的常見參考，但應以資料檢查而非主觀假定", practice: "利用圖表與適當檢定檢查偏態、極端值與常態假設是否合理", misconception: "所有連續數值資料都一定符合常態分佈" },
  { topic: "假設檢定與統計推論", term: "虛無假設（H0）", definition: "假設檢定中作為基準的主張，通常表示沒有差異、效果或關聯，需要由資料決定是否拒絕。", scenario: "要檢驗新網頁設計是否改變轉換率，先設定兩版本沒有差異", value: "提供明確的比較基準，讓研究者能以可重複程序評估證據強度", practice: "在查看資料結果前定義 H0、對立假設、檢定方法與顯著水準", misconception: "無法拒絕虛無假設就代表已經證明虛無假設絕對為真" },
  { topic: "假設檢定與統計推論", term: "p 值", definition: "在虛無假設成立前提下，觀察到目前結果或更極端結果的機率，用於衡量資料與 H0 的相容程度。", scenario: "A/B 測試得到 p 值 0.03，且事前顯著水準設定為 0.05", value: "協助依事前門檻評估是否有足夠證據拒絕 H0，但不代表效果大小或假設為真的機率", practice: "同時報告效果量、信賴區間、樣本設計與商業意義，而非只看 p 值", misconception: "p 值 0.03 表示對立假設有百分之九十七機率為真" },
  { topic: "假設檢定與統計推論", term: "顯著水準（α）", definition: "在檢定前設定的型一錯誤容忍上限，用來作為拒絕虛無假設的決策門檻。", scenario: "醫療安全相關分析需要比一般行銷實驗更嚴格的錯誤控制", value: "把決策風險事前明確化，使統計結論能對應錯誤代價與應用情境", practice: "依問題風險與多重比較需求，在分析前設定並記錄合理的 α 值", misconception: "顯著水準是看到 p 值後才隨意挑選的數字" },
  { topic: "數據收集與清理", term: "ETL", definition: "將資料從來源擷取（Extract）、轉換（Transform）並載入（Load）目標系統的資料處理流程。", scenario: "要每日把訂單、庫存與客服系統資料整理到分析平台", value: "建立可重複的資料管線，減少人工處理並提高分析資料的一致性與可追溯性", practice: "定義來源、轉換規則、排程、錯誤處理與品質檢查，並保留執行紀錄", misconception: "ETL 只是在電腦中手動複製貼上檔案，不需要轉換或品質管理" },
  { topic: "數據儲存與管理", term: "資料倉儲", definition: "為報表與分析整合多個來源的結構化、清理後資料，通常具明確模型與治理規則的儲存環境。", scenario: "管理階層要跨部門檢視一致的營收、客戶與產品指標", value: "提供受治理、可查詢且口徑一致的分析基礎", practice: "建立資料模型、血緣、更新頻率與指標定義，讓使用者理解資料適用範圍", misconception: "資料倉儲的用途是完全不整理地保存所有原始檔案" },
  { topic: "數據儲存與管理", term: "資料湖", definition: "可保存原始或多型態資料的集中式儲存環境，通常在讀取或分析時再套用結構與處理規則。", scenario: "組織要集中保留日誌、影像、JSON 與資料表，供不同 AI 與分析需求後續使用", value: "提高多型態資料的保存彈性，但仍需目錄、權限、品質與生命週期治理", practice: "建立資料目錄、擁有者、存取權限與資料品質標記，避免形成無法使用的資料沼澤", misconception: "資料湖因為可保存原始資料，所以不需要管理或治理" },
  { topic: "數據處理技術與工具", term: "批次處理", definition: "依固定時間或累積一定量資料後，以一批資料集中執行處理、轉換或分析的方式。", scenario: "要在每日凌晨彙整前一天全部交易後產出營運報表", value: "適合不需即時反應且可集中運算的工作，通常容易控制成本與流程", practice: "設定合理排程、資料截止點、重跑機制與完成檢查，避免漏資料或重複計算", misconception: "批次處理一定會在資料產生的當下立即完成分析" },
  { topic: "數據處理技術與工具", term: "串流處理", definition: "對持續流入的事件資料以近即時方式進行擷取、轉換、分析或觸發動作的處理模式。", scenario: "要在刷卡交易發生後數秒內偵測異常並通知風控人員", value: "縮短資料到行動的延遲，適合詐欺偵測、監控與即時推薦等情境", practice: "設計事件順序、延遲、重複處理、可用性與監控機制，並定義即時性的必要程度", misconception: "串流處理不需要處理延遲、重複事件或資料順序問題" },
  { topic: "大數據在人工智慧之應用", term: "資料最小化", definition: "僅蒐集、使用與保存完成特定目的所必要資料的隱私與治理原則。", scenario: "團隊要訓練客服分類模型，但原始資料中含有與任務無關的身分資訊", value: "降低不必要的隱私、資安與合規風險，也能減少資料管理負擔", practice: "回扣任務目的檢查每個欄位必要性，移除或遮罩無關敏感資料並設定保存期限", misconception: "為了讓模型更強，應無限制蒐集所有可能取得的個人資料" },
];

const intermediateMl: QuestionSeed[] = [
  { topic: "機率／統計之機器學習基礎應用", term: "條件機率", definition: "在已知某事件或特徵條件下，另一事件發生可能性的機率表示，例如 P(Y｜X)。", scenario: "要在已知客戶近期行為特徵後估計其可能流失的機率", value: "是分類、風險預測與貝氏推論等機器學習任務的重要數學表達", practice: "確認條件特徵在實際預測時可取得，並檢查機率輸出是否經過適當校準", misconception: "條件機率完全不受已知條件或特徵影響" },
  { topic: "機率／統計之機器學習基礎應用", term: "貝氏定理", definition: "利用先驗機率與觀察到的證據，更新事件後驗機率的機率推論公式。", scenario: "要根據新的檢驗結果更新病患具有某種狀況的可能性", value: "將既有知識與新觀察結合，適合面對不確定性與持續更新的推論問題", practice: "清楚區分先驗、似然、邊際與後驗機率，並檢查假設是否符合資料情境", misconception: "貝氏定理只要取得新資料就不需要任何先驗或條件資訊" },
  { topic: "線性代數之機器學習基礎應用", term: "向量", definition: "由有序數值組成、可表示單一樣本特徵、方向或模型參數的數學物件。", scenario: "要將一位客戶的年齡、消費額與瀏覽次數表達成模型輸入", value: "提供機器學習資料與參數的基本表示單位，便於計算相似性與線性運算", practice: "維持特徵順序、尺度與缺失值處理一致，確保訓練與推論使用相同定義", misconception: "向量只能表示二維平面上的箭頭，不能表示機器學習特徵" },
  { topic: "線性代數之機器學習基礎應用", term: "矩陣", definition: "由列與欄排列的數值集合，可表示多筆樣本、多個特徵、轉換或模型權重。", scenario: "要把一萬筆客戶資料與二十個特徵送入同一個模型運算", value: "支援批次運算與線性轉換，是多數機器學習與深度學習計算的核心結構", practice: "確認矩陣維度、列欄意義與運算相容性，避免資料與權重對應錯誤", misconception: "矩陣只能存放文字，不能用於數值運算" },
  { topic: "線性代數之機器學習基礎應用", term: "點積", definition: "將兩個同維向量逐元素相乘後加總的運算，常用於衡量對應關係或計算線性模型輸出。", scenario: "線性分類器要以特徵向量與權重向量計算預測分數", value: "把多個特徵依權重整合成單一分數，是線性模型與注意力運算的重要基礎", practice: "確認向量維度與特徵對齊，並理解特徵尺度會影響點積結果", misconception: "點積的結果一定是一個與原向量同維度的新向量" },
  { topic: "線性代數之機器學習基礎應用", term: "主成分分析（PCA）", definition: "以線性轉換將高維資料投影到保留主要變異方向的較低維空間的降維方法。", scenario: "要將上百個高度相關的感測器特徵壓縮後用於視覺化與建模", value: "降低維度、去除部分冗餘並提升運算效率，但主成分的可解釋性可能下降", practice: "先處理特徵尺度並在訓練資料上擬合轉換，再評估保留維度與資訊損失", misconception: "PCA 的目的只是隨機刪除欄位，與資料變異結構無關" },
  { topic: "數值優化技術與方法", term: "損失函數", definition: "量化模型預測與目標之間差距的目標函數，用來引導訓練過程調整參數。", scenario: "團隊要讓迴歸模型的預測數值盡可能接近實際銷售額", value: "定義模型認定『錯誤』的方式，直接影響學習方向與最終行為", practice: "依任務與錯誤成本選擇損失函數，並確認其與業務評估指標不互相衝突", misconception: "損失函數越大代表模型預測越準確" },
  { topic: "數值優化技術與方法", term: "均方誤差（MSE）", definition: "將預測值與真實值差距平方後取平均的迴歸損失，會較重地懲罰大誤差。", scenario: "要評估預測電力需求的模型，且重大偏差的代價特別高", value: "強調降低較大預測誤差，常用於連續數值預測任務", practice: "檢查目標值離群點與誤差成本，必要時比較 MAE 或 Huber 損失等替代方案", misconception: "MSE 最適合直接作為所有分類問題的唯一評估方式" },
  { topic: "數值優化技術與方法", term: "交叉熵損失", definition: "衡量分類模型預測機率分佈與真實類別分佈差異的常用損失函數。", scenario: "要訓練模型將影像分為多個產品瑕疵類別", value: "鼓勵模型對正確類別給予較高機率，適合二元或多類別分類任務", practice: "確認標籤編碼與輸出層設定相符，並處理類別不平衡與機率校準問題", misconception: "交叉熵損失只能用於預測連續數值的迴歸問題" },
  { topic: "數值優化技術與方法", term: "梯度下降", definition: "依損失函數對參數的梯度方向逐步更新參數，以降低目標函數值的最佳化方法。", scenario: "要讓神經網路從訓練資料中逐步調整權重減少預測誤差", value: "提供可擴展的數值方式求解多數模型參數，即使沒有封閉解也能逐步改善", practice: "監控損失、梯度與驗證效能，適當設定學習率、批次大小與停止條件", misconception: "梯度下降每一步都必然直接跳到全域最佳解" },
  { topic: "數值優化技術與方法", term: "學習率", definition: "控制每次參數更新步長大小的超參數，影響訓練速度、穩定性與是否能收斂。", scenario: "訓練損失反覆劇烈震盪甚至越來越大", value: "在更新太慢與跨越最佳點而不穩之間取得平衡", practice: "以實驗與曲線監控調整初始值，必要時使用學習率排程或自適應優化器", misconception: "學習率設得越大，模型一定越快且越準確" },
  { topic: "數值優化技術與方法", term: "正則化", definition: "在訓練目標加入對模型複雜度或參數大小的限制，以降低過度擬合並提升泛化能力的方法。", scenario: "模型在訓練資料幾乎滿分，但在新資料上表現明顯變差", value: "抑制模型過度記憶訓練雜訊，使其更能處理未見資料", practice: "搭配資料切分與驗證曲線調整正則化強度，避免限制過強造成欠擬合", misconception: "正則化的目的就是讓模型在訓練資料上的分數無限提高" },
  { topic: "常見機器學習演算法", term: "決策樹", definition: "以一連串特徵條件分割資料並形成樹狀判斷規則的監督式學習模型。", scenario: "要讓業務人員理解模型如何依年齡、消費頻率與合約狀態判斷流失風險", value: "具可解釋的規則結構，能處理非線性關係，但深樹可能過度擬合", practice: "限制樹深度、最小樣本數並以驗證資料檢查泛化能力", misconception: "決策樹只能處理完全線性的數值關係" },
  { topic: "常見機器學習演算法", term: "隨機森林", definition: "以多棵隨機化決策樹集成投票或平均結果的模型，通常比單一樹更穩定。", scenario: "要提高風險分類模型的穩健性並降低單一決策樹過度擬合", value: "透過集成降低單一模型變異，常能取得不錯表現與特徵重要性參考", practice: "調整樹數、深度與特徵抽樣，並以獨立資料驗證效果與公平性", misconception: "隨機森林只有一棵完全固定的決策樹" },
  { topic: "深度學習原理與框架", term: "卷積神經網路（CNN）", definition: "利用卷積、池化與多層表示擷取局部空間特徵的神經網路架構，常用於影像任務。", scenario: "要從產品照片辨識表面瑕疵與零件類型", value: "能逐層學習影像的邊緣、紋理到高階物件特徵，適合空間結構資料", practice: "確保影像標註品質、資料增強與訓練測試分離，並檢視不同情境的偏誤", misconception: "CNN 只能處理文字序列，完全不能用於影像" },
  { topic: "深度學習原理與框架", term: "循環神經網路（RNN）", definition: "透過循環狀態處理序列資料、使目前輸出可參考先前時間步資訊的神經網路架構。", scenario: "要依過去數天的感測器序列預測下一時段設備狀態", value: "可建模時間順序與序列相依性，但長序列訓練可能面臨梯度問題", practice: "依序列長度與任務比較 RNN、LSTM、GRU 或 Transformer，並監控訓練穩定性", misconception: "RNN 完全不會利用任何先前時間步的資訊" },
  { topic: "模型訓練、評估與驗證", term: "交叉驗證", definition: "將資料分成多個子集輪流作為驗證集，以較穩健估計模型在未見資料上表現的方法。", scenario: "可用標註資料量有限，且團隊要比較多個模型設定", value: "減少單一資料切分偶然性對評估的影響，提升模型選擇的可靠性", practice: "確保切分方式符合資料結構，例如時間序列不可隨意打散未來資料到訓練集", misconception: "交叉驗證等於把測試集的答案反覆拿來調整模型" },
  { topic: "模型訓練、評估與驗證", term: "早期停止（Early Stopping）", definition: "當驗證集效能在一段時間內不再改善時提前停止訓練，以節省資源並降低過度擬合的方法。", scenario: "深度模型的訓練損失下降，但驗證損失連續多輪開始上升", value: "依泛化效能而非只依訓練結果決定停止時機", practice: "設定監控指標、耐心輪數與最佳權重回復方式，並保留訓練紀錄", misconception: "早期停止表示模型第一次看到資料就立刻停止訓練" },
  { topic: "模型調整與優化", term: "資料洩漏", definition: "訓練或評估過程意外使用了在實際預測時不可能取得的資訊，導致分數虛高的問題。", scenario: "模型用『是否已付款』欄位來預測『是否會付款』", value: "避免模型在離線評估中偷看到答案，確保部署後的效能預期可信", practice: "依真實決策時點檢查每個特徵來源、資料切分與前處理是否污染驗證或測試資料", misconception: "資料洩漏只要把資料檔案加密就能避免" },
  { topic: "機器學習治理", term: "演算法公平性", definition: "檢視模型對不同群體是否產生不合理差異，並依情境採取資料、模型、流程與治理改善的原則。", scenario: "招募模型對不同群體的推薦比例出現明顯落差，需要評估原因", value: "降低模型延續或放大既有偏差的風險，提升高影響應用的正當性與信任", practice: "檢查資料代表性、標籤、特徵、門檻與公平性指標，並與利害關係人共同檢視", misconception: "只要模型整體準確率很高，就必然對所有群體公平" },
];

export const EXPANDED_QUESTIONS: Question[] = [
  ...makeQuestions({ level: "初級", subject: "人工智慧基礎概論", prefix: "L1-AI-X", source: "初級科目一", sourceUrl: guideUrls.l1ai }, elementaryAi),
  ...makeQuestions({ level: "初級", subject: "生成式 AI 應用與規劃", prefix: "L1-GEN-X", source: "初級科目二", sourceUrl: guideUrls.l1gen }, elementaryGen),
  ...makeQuestions({ level: "中級", subject: "人工智慧技術應用與規劃", prefix: "L2-AI-X", source: "中級科目一", sourceUrl: guideUrls.l2ai }, intermediateAi),
  ...makeQuestions({ level: "中級", subject: "大數據處理分析與應用", prefix: "L2-DATA-X", source: "中級科目二", sourceUrl: guideUrls.l2data }, intermediateData),
  ...makeQuestions({ level: "中級", subject: "機器學習技術與應用", prefix: "L2-ML-X", source: "中級科目三", sourceUrl: guideUrls.l2ml }, intermediateMl),
];
