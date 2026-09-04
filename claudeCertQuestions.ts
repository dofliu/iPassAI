/**
 * Claude Certified Architect – Foundations (CCAR-F) 原創仿真題庫
 *
 * 題目依 Anthropic 官方認證考綱的五大領域與權重自行編撰，技術事實對齊 Anthropic
 * 官方文件（Messages API、Claude Agent SDK、Claude Code、MCP）。本檔不含任何
 * 第三方付費課程的題目內容。
 */
import type { Level, Question } from "./questions";

export const CLAUDE_CERT_SUBJECT = "Claude 認證｜CCAR-F 架構師";
export const CLAUDE_CERT_LEVEL: Level = "專業認證";
export const CLAUDE_CERT_SOURCE_URL = "https://www.pearsonvue.com/us/en/anthropic.html";
const CERT_SOURCE = "CCAR-F 官方考綱領域架構；依 Anthropic 官方文件自編原創題";

/** 五大考試領域與官方權重 */
export const CCAR_F_DOMAINS = [
  { id: "agentic", name: "代理架構與協作編排", weight: 27, en: "Agentic Architecture & Orchestration" },
  { id: "claude-code", name: "Claude Code 設定與工作流", weight: 20, en: "Claude Code Configuration & Workflows" },
  { id: "prompting", name: "提示工程與結構化輸出", weight: 20, en: "Prompt Engineering & Structured Output" },
  { id: "tools-mcp", name: "工具設計與 MCP 整合", weight: 18, en: "Tool Design & MCP Integration" },
  { id: "context", name: "情境管理與可靠性", weight: 15, en: "Context Management & Reliability" },
] as const;

const D1 = CCAR_F_DOMAINS[0].name;
const D2 = CCAR_F_DOMAINS[1].name;
const D3 = CCAR_F_DOMAINS[2].name;
const D4 = CCAR_F_DOMAINS[3].name;
const D5 = CCAR_F_DOMAINS[4].name;

type CertSeed = {
  topic: string;
  difficulty: Question["difficulty"];
  stem: string;
  options: [string, string, string, string];
  answer: number;
  explanation: string;
  trap: string;
};

/**
 * 以題目序號做確定性的選項輪轉，讓正解平均分布在 A–D 四個位置，
 * 避免作答者靠「一律選同一個選項」矇混過關。所有選項皆不引用自身位置，
 * 因此輪轉不會改變題意。
 */
function rotateOptions(seed: CertSeed, index: number): Pick<CertSeed, "options" | "answer"> {
  const offset = index % 4;
  const options = seed.options.map((_, position) => seed.options[(position + offset) % 4]) as CertSeed["options"];
  return { options, answer: (seed.answer - offset + 4) % 4 };
}

function makeQuestions(prefix: string, seeds: CertSeed[]): Question[] {
  return seeds.map((seed, index) => ({
    ...seed,
    ...rotateOptions(seed, index),
    id: `CCARF-${prefix}-${String(index + 1).padStart(3, "0")}`,
    level: CLAUDE_CERT_LEVEL,
    subject: CLAUDE_CERT_SUBJECT,
    source: CERT_SOURCE,
    sourceUrl: CLAUDE_CERT_SOURCE_URL,
  }));
}

/* ── 領域 1：代理架構與協作編排 (27%) ────────────────────────────── */
const AGENTIC_SEEDS: CertSeed[] = [
  {
    topic: D1, difficulty: "情境",
    stem: "團隊想讓 Claude 自動呼叫他們自己定義的幾個函式並持續迭代到任務完成，但不想自己手寫 while 迴圈，也不需要 Anthropic 代管執行環境。最適合的做法是？",
    options: [
      "使用 Anthropic SDK 的 Tool Runner（client.beta.messages.tool_runner）",
      "改用 Managed Agents，由 Anthropic 代管迴圈與沙箱",
      "改用 Claude Agent SDK，取得內建的檔案與 Bash 工具",
      "手動撰寫 stop_reason === \"tool_use\" 的迴圈",
    ],
    answer: 0,
    explanation: "Tool Runner 是一般 Anthropic API SDK 的輔助器，替你驅動「請求 → 執行工具 → 回送結果」的迴圈，但只跑你自己定義的工具，運算仍由你自行託管，完全符合需求。",
    trap: "Managed Agents 會連執行沙箱一起代管（超出需求）；Claude Agent SDK 是另一個產品，附帶內建工具；手寫迴圈則多做了 Tool Runner 已經處理的事。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "關於「誰提供 harness（代理迴圈）」與「誰提供 deployment（執行基礎設施）」，下列敘述何者正確？",
    options: [
      "Tool Runner 與 Claude Agent SDK 都只提供 harness，部署仍由你負責",
      "Tool Runner 與 Claude Agent SDK 都同時提供 harness 與代管部署",
      "只有手寫迴圈需要自行部署，其餘三種都由 Anthropic 代管",
      "Managed Agents 只提供 harness，沙箱需自行架設",
    ],
    answer: 0,
    explanation: "Tool Runner 與 Claude Agent SDK 都是 harness-only：它們提供迴圈與情境管理，但你仍要自行託管與部署。只有 Managed Agents 同時提供 harness 與代管的每階段沙箱。",
    trap: "兩者名稱相近容易混淆，但差別不在「是否代管」（都不代管），而在 harness 的範圍：Tool Runner 只跑你定義的工具，Agent SDK 附帶完整的內建工具組。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "架構師評估是否要為某任務建置代理（agent）。下列哪一種情況最應「退回較簡單的層級」（單次呼叫或工作流）？",
    options: [
      "任務多步驟且難以事先完整描述",
      "任務是從固定格式的 PDF 中擷取標題欄位",
      "錯誤可透過測試與版本回滾被攔截修正",
      "任務結果的商業價值足以支撐較高的成本與延遲",
    ],
    answer: 1,
    explanation: "「從固定格式 PDF 擷取標題」可以被完整規格化，屬於單次呼叫就能完成的工作，不具備代理所需的開放式探索特性。",
    trap: "複雜度、價值、可行性、錯誤成本四項評估只要有一項答案為「否」，就應停留在較簡單的層級，而非一律建置代理。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "採用 orchestrator–subagent（協調者–子代理）模式時，最主要的架構效益是什麼？",
    options: [
      "可完全免除對工具輸出的驗證",
      "保證每個子代理的回應都完全一致且可重現",
      "情境隔離：各子代理有界定的範圍與明確交接，避免單一情境被讀取內容淹沒",
      "自動降低每百萬 token 的計價費率",
    ],
    answer: 2,
    explanation: "協調者–子代理模式的核心價值在情境隔離：把讀取量大的子任務下放給各自獨立情境的子代理，只回傳精煉結論，讓主情境保持乾淨、可稽核且可擴展。",
    trap: "此模式不會改變計價費率，也不保證輸出決定性；驗證與防護仍需照常設計。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "某代理需要在一次回應中平行呼叫三個工具。回送工具結果時，正確的做法是？",
    options: [
      "把三個 tool_result 分成三則 user 訊息依序送出",
      "把三個 tool_result 放在同一則 user 訊息中一次送回",
      "只回送成功的工具結果，失敗的直接省略",
      "先送一則 assistant 訊息說明結果，再送 tool_result",
    ],
    answer: 1,
    explanation: "平行工具呼叫的所有 tool_result 必須放在「單一則」user 訊息中回送。拆成多則訊息會靜默地訓練模型不再做平行呼叫。",
    trap: "失敗的工具也必須回送對應的 tool_result 並標記 is_error: true，絕不能直接省略，否則會出現懸空的 tool_use。",
  },
  {
    topic: D1, difficulty: "基礎",
    stem: "在 Managed Agents 中，model、system 與 tools 這些設定應該定義在哪一層？",
    options: [
      "定義在 Agent（代理設定）上，Session 只負責每次執行",
      "定義在 Session 上，每次執行都重新指定",
      "兩層都要重複定義才會生效",
      "定義在 Environment（環境）上",
    ],
    answer: 0,
    explanation: "Managed Agents 的流程是「Agent 建立一次 → Session 每次執行」。model／system／tools 屬於 Agent 設定，Session 只引用已儲存的 agent ID。",
    trap: "絕不可在請求路徑中呼叫 agents.create()；Agent 是持久化且有版本的物件，應建立一次後以 ID 重複引用。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "團隊要讓代理每天凌晨自動執行一份報表，且不想自己維護排程器。最合適的 Managed Agents 功能是？",
    options: [
      "Session budgets（工作階段預算）",
      "Scheduled deployments（排程部署）",
      "Task budgets（任務預算）",
      "Memory stores（記憶體儲存）",
    ],
    answer: 1,
    explanation: "Scheduled deployments 讓部署依 cron 節奏自動觸發 session，並保留每次觸發的執行紀錄與生命週期控制，不需要客戶端排程器。",
    trap: "Session budgets 與 Task budgets 都是控制花費／步調的機制，與「何時觸發」無關。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "關於 task_budget（任務預算）與 max_tokens 的差異，何者正確？",
    options: [
      "兩者都是模型無法感知的硬性上限",
      "task_budget 是硬性上限，max_tokens 只是建議值",
      "task_budget 是模型可感知的建議額度讓它自行調配步調；max_tokens 是模型無法感知的硬性單次回應上限",
      "兩者都以美元計價",
    ],
    answer: 2,
    explanation: "task_budget 會由伺服器注入模型看得見的倒數標記，讓它自行調配步調並優雅收尾；max_tokens 則是模型無感知的強制截斷上限，超過就中途被切斷。",
    trap: "Managed Agents 的 session budget 才是以美元計價的平台強制上限，與以 token 計價、屬建議性質的 task_budget 是不同機制。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "代理要對 20 個來源做調查後彙整，若由單一迴圈完成會讓情境被閱讀內容塞滿。最適合的多代理設計起點是？",
    options: [
      "把 max_tokens 調到最大並繼續使用單一迴圈",
      "在 roster 中先放入 self，讓代理委派給自己的副本，再把讀取量大的子任務移到較便宜的工作代理",
      "關閉 thinking 以節省情境空間",
      "改用 Batch API 平行送出 20 個獨立請求",
    ],
    answer: 1,
    explanation: "建議的起點是 roster 只放 {\"type\": \"self\"} 讓代理委派給自身副本，之後再把讀取量大的子任務改交給較便宜的工作代理（如 Claude Haiku 4.5 或 Claude Sonnet 5）。",
    trap: "加大 max_tokens 無法解決情境被塞滿的問題；Batch API 沒有代理的協調與彙整能力。",
  },
  {
    topic: D1, difficulty: "基礎",
    stem: "在 Claude Code 中定義子代理時，allowedTools（可用工具清單）的主要作用是？",
    options: [
      "提升子代理的回應速度",
      "限定該子代理能使用的工具範圍，落實最小權限與界定範圍",
      "決定子代理使用哪一個模型",
      "指定子代理的輸出格式",
    ],
    answer: 1,
    explanation: "allowedTools 界定子代理可觸及的工具集合，是實現最小權限與範圍界定的關鍵，能避免子代理做出超出委派範圍的動作。",
    trap: "模型選擇與輸出格式是各自獨立的設定；工具白名單只管「能做什麼」，不管「怎麼做」。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "代理回傳的 stop_reason 為 pause_turn 時，正確的處理方式是？",
    options: [
      "視為錯誤並重試整個請求",
      "視為模型拒絕，改走 fallback 模型",
      "視為可續行的暫停，把回應內容接回 messages 後續行",
      "直接把目前內容當作最終答案回傳給使用者",
    ],
    answer: 2,
    explanation: "pause_turn 表示模型在長時間的代理流程中暫停，可以被續行。應把回應內容接回對話後再次請求，讓它接著完成。",
    trap: "只有 stop_reason 為 refusal 才代表安全性拒絕；把 pause_turn 當成完成或錯誤都會截斷代理流程。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "Managed Agents 的代理需要呼叫需 API 金鑰的外部服務。目前建議的首選憑證機制是？",
    options: [
      "把金鑰寫進代理的 system prompt",
      "使用 vault 的 environment_variable 憑證，由 Anthropic 保管並在出口替換",
      "把金鑰以純文字存進 session 的檔案掛載",
      "把金鑰放在工具的 description 欄位",
    ],
    answer: 1,
    explanation: "Vault 的 environment_variable 憑證由 Anthropic 保管、於出口（egress）替換，金鑰從不進入沙箱，是目前的第一類機制。",
    trap: "自行以主機端自訂工具保管憑證仍是備援方案（例如自架沙箱），但把金鑰放進提示詞、檔案或工具描述都會直接外洩給模型情境。",
  },
  {
    topic: D1, difficulty: "基礎",
    stem: "Claude Agent SDK 與 Anthropic API 的 Tool Runner，最關鍵的差異是什麼？",
    options: [
      "Agent SDK 附帶檔案讀寫、Bash、搜尋等內建工具；Tool Runner 只跑你自行定義的工具",
      "Agent SDK 只能用於 Python；Tool Runner 只能用於 TypeScript",
      "Tool Runner 會代管沙箱；Agent SDK 不會",
      "兩者其實是同一個套件的不同名稱",
    ],
    answer: 0,
    explanation: "Claude Agent SDK 是把 Claude Code 打包成函式庫，內含 Read/Write/Edit/Bash/Glob/Grep 等內建工具、hooks、子代理與權限；Tool Runner 只是 API SDK 中驅動自訂工具迴圈的輔助器，沒有任何內建工具。",
    trap: "兩者都不代管沙箱，也都支援多種語言；差別在 harness 的範圍，不在語言或代管與否。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "設計多代理拓撲時，「Pipeline（管線）」模式最適合下列哪一種工作型態？",
    options: [
      "多個獨立子任務需同時展開並各自回報",
      "任務有明確的階段順序，每一階段的輸出是下一階段的輸入",
      "代理之間需彼此平等協商且無固定順序",
      "單一任務只需一次模型呼叫即可完成",
    ],
    answer: 1,
    explanation: "Pipeline 適用於階段有明確先後順序、前一階段輸出即後一階段輸入的工作，如「擷取 → 轉換 → 驗證 → 產出」。",
    trap: "需要同時展開的扇出型工作屬於 hub-and-spoke；無固定順序的協商屬於 peer-to-peer。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "在 Claude Code 中，若要在每次工具執行「之後」自動跑格式化與型別檢查，應使用哪一類機制？",
    options: [
      "在 CLAUDE.md 中寫下「請記得執行格式化」",
      "設定 PostToolUse hook",
      "把格式化指令加進工具的 description",
      "改用較高的 effort 等級",
    ],
    answer: 1,
    explanation: "自動化行為（每次某事發生後就執行某動作）需由 harness 執行，這正是 hooks 的用途；PostToolUse 會在工具執行後觸發設定好的指令。",
    trap: "寫在 CLAUDE.md 只是「請求模型記得」，不保證每次都執行；只有 hooks 由 harness 強制執行。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "為了控制成本，團隊想讓子代理使用較便宜的模型。下列做法何者最符合建議？",
    options: [
      "把主代理與所有子代理一律降級為 Haiku",
      "維持主代理為高階模型，把讀取量大、判斷單純的子任務指派給 Sonnet 或 Haiku",
      "把所有代理都改用最高階模型並開到 max effort",
      "移除子代理，全部改由單一代理完成",
    ],
    answer: 1,
    explanation: "常見且有效的成本策略是「主代理維持高能力模型負責判斷與彙整，讀取量大但判斷單純的子任務下放給較便宜的工作模型」。",
    trap: "全面降級會傷及協調品質；但要注意快取是綁模型的，多模型串接會失去跨模型的快取重用，導入前應實測。",
  },
  {
    topic: D1, difficulty: "基礎",
    stem: "代理迴圈中，模型表示要呼叫工具時，回應的 stop_reason 值為何？",
    options: ["end_turn", "tool_use", "max_tokens", "pause_turn"],
    answer: 1,
    explanation: "stop_reason 為 tool_use 代表模型要求呼叫工具，應執行該工具並把 tool_result 回送，迴圈才會繼續。",
    trap: "end_turn 表示自然結束；max_tokens 表示被上限截斷，需要調高上限或改用串流。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "Managed Agents 的 session 已進入 idle，但客戶端仍在等待結果。最穩健的客戶端寫法是？",
    options: [
      "以固定秒數 sleep 後直接讀取最終狀態",
      "採 stream-first 排序並以正確的 idle／terminated 條件作為跳出判斷，注意 post-idle 的狀態競態",
      "只要收到任一事件就立刻結束迴圈",
      "重新建立一個新 session 重跑整個任務",
    ],
    answer: 1,
    explanation: "官方建議的客戶端模式是 stream-first 排序、以正確的 idle／terminated 條件跳出，並處理 post-idle 的狀態競態，才不會漏讀事件或提早結束。",
    trap: "以固定 sleep 或收到單一事件就結束，都會在事件延遲時漏掉結果；重建 session 則會重複花費。",
  },
  {
    topic: D1, difficulty: "進階",
    stem: "代理系統要求「每個外部寫入動作都需人工核可後才執行」。在使用 Tool Runner 的情況下，最合適的實作點是？",
    options: [
      "在 system prompt 中要求模型先詢問使用者",
      "利用 Tool Runner 的每輪 hooks 加入核可閘門，於工具實際執行前攔截",
      "把寫入工具從 tools 清單移除",
      "改用 tool_choice: none",
    ],
    answer: 1,
    explanation: "Tool Runner 的每輪 hooks 正是為了核可閘門、記錄、錯誤攔截與條件式執行而設計，可在工具實際執行前攔截並要求人工核可。",
    trap: "僅靠提示詞要求模型自我約束不具強制力；移除工具或 tool_choice: none 則會讓功能完全無法使用。",
  },
  {
    topic: D1, difficulty: "情境",
    stem: "某代理任務在正式環境偶爾會超出預期輪數而空轉。除了設定 task_budget，最能提早發現問題的觀測做法是？",
    options: [
      "只記錄最終回應的文字內容",
      "逐輪累加 response.usage.output_tokens 與工具結果的 token 量以顯示進度",
      "把 thinking 設為 disabled 以減少變因",
      "只在任務失敗時才記錄日誌",
    ],
    answer: 1,
    explanation: "要觀測代理花費，應逐輪累加 response.usage.output_tokens 以及附加的 tool_result 區塊 token 量，即可即時顯示進度與異常膨脹。",
    trap: "正常迴圈中不要自行傳入 remaining（伺服器會自行倒數）；只有在你壓縮或改寫歷史、伺服器無法推導既有花費時才需要傳。",
  },
  {
    topic: D1, difficulty: "基礎",
    stem: "下列哪一項最適合作為「代理」而非「工作流」來實作？",
    options: [
      "把客服信件分類成五個既定類別",
      "將設計文件轉成一個可通過測試的 Pull Request，過程中需自行探索程式庫",
      "把一段文字翻譯成英文",
      "從發票影像擷取金額欄位",
    ],
    answer: 1,
    explanation: "「把設計文件轉成 PR」屬於多步驟、無法事先完整規格化、需要模型自行探索的開放式任務，正是代理的適用場景。",
    trap: "分類、翻譯、欄位擷取都能以單次呼叫或固定工作流完成，導入代理只會增加成本、延遲與不確定性。",
  },
];

/* ── 領域 2：Claude Code 設定與工作流 (20%) ──────────────────────── */
const CLAUDE_CODE_SEEDS: CertSeed[] = [
  {
    topic: D2, difficulty: "情境",
    stem: "專案根目錄與子目錄 apps/web/ 下各有一份 CLAUDE.md，兩者指示衝突。在 apps/web/ 內工作時，合理的預期是？",
    options: [
      "只有根目錄的 CLAUDE.md 生效",
      "兩份都會載入，較接近工作檔案的子目錄指示具較高的針對性",
      "兩份都會被忽略，必須改用 settings.json",
      "系統會隨機挑選一份載入",
    ],
    answer: 1,
    explanation: "CLAUDE.md 採階層式載入，根目錄與子目錄的記憶檔會一起提供，而較靠近實際工作檔案的目錄範圍指示針對性更高。",
    trap: "階層是「疊加」而非「取代」；要避免衝突，應把通則放在根目錄、把子專案專屬規則放在對應子目錄。",
  },
  {
    topic: D2, difficulty: "基礎",
    stem: "要為專案新增一個團隊共用的自訂斜線指令 /deploy，檔案應放在哪裡？",
    options: [
      "專案的 .claude/commands/deploy.md",
      "專案根目錄的 deploy.json",
      "使用者家目錄的 ~/.bashrc",
      "專案的 package.json scripts 區段",
    ],
    answer: 0,
    explanation: "專案層級的自訂斜線指令定義在 .claude/commands/ 下的 Markdown 檔，檔名即指令名稱，可隨版本控制分享給整個團隊。",
    trap: "package.json 的 scripts 是 npm 指令，不是 Claude Code 斜線指令；放在家目錄則只有你個人可用，無法團隊共享。",
  },
  {
    topic: D2, difficulty: "進階",
    stem: "使用者希望「每次編輯完 .ts 檔就自動執行 prettier」。為什麼把這句話寫進 CLAUDE.md 並不足夠？",
    options: [
      "CLAUDE.md 有字數上限，寫不下這類規則",
      "自動化行為需由 harness 執行，必須設定 hooks；CLAUDE.md 只是給模型的指示，不具強制性",
      "CLAUDE.md 只在第一次啟動時載入，之後就失效",
      "prettier 無法在 Claude Code 中執行",
    ],
    answer: 1,
    explanation: "「每次 X 就做 Y」這類自動化必須由 harness 保證執行，也就是在 settings.json 中設定 hooks；寫在 CLAUDE.md 只是請模型記得，可能被遺漏。",
    trap: "偏好與慣例適合寫 CLAUDE.md，但「保證每次都發生」的行為一定要用 hooks。",
  },
  {
    topic: D2, difficulty: "情境",
    stem: "團隊想讓所有成員在此專案中都免去 npm test 的權限詢問，但不影響各自其他專案。設定應寫在哪裡？",
    options: [
      "專案的 .claude/settings.json（納入版本控制）",
      "使用者層級的 ~/.claude/settings.json",
      "專案的 .claude/settings.local.json",
      "CLAUDE.md 的權限章節",
    ],
    answer: 0,
    explanation: "專案層級且要團隊共享的權限規則應寫在 .claude/settings.json 並納入版本控制，範圍限於此專案。",
    trap: "settings.local.json 是個人本機覆寫、不進版控；使用者層級設定會套用到所有專案，範圍過大。",
  },
  {
    topic: D2, difficulty: "基礎",
    stem: "在 Claude Code 中，專案範圍的 MCP 伺服器設定慣例上放在哪個檔案？",
    options: [".mcp.json", "mcp.config.ts", ".claude/mcp.yaml", "package.json 的 mcp 欄位"],
    answer: 0,
    explanation: "專案範圍的 MCP 伺服器設定放在專案根目錄的 .mcp.json，可隨版本控制分享給團隊。",
    trap: "MCP 設定有使用者、專案與本機等不同範圍，選錯範圍會導致隊友載入不到或個人設定被意外提交。",
  },
  {
    topic: D2, difficulty: "進階",
    stem: "要在 CI 流程中以非互動方式執行 Claude Code，最需要注意的設定是？",
    options: [
      "必須開啟互動式權限提示以確保安全",
      "需採無頭（headless）執行模式並事先明確定義權限與可用工具範圍",
      "CI 中無法使用 CLAUDE.md",
      "必須停用所有 hooks",
    ],
    answer: 1,
    explanation: "CI 沒有人可以回應提示，因此要採無頭模式，並事先以設定明確界定允許的工具與權限範圍，讓流程既能自動完成又不至於過度授權。",
    trap: "在 CI 中保留互動式提示會讓流程無限期卡住；但也不應為了跑得動就全面放行權限。",
  },
  {
    topic: D2, difficulty: "情境",
    stem: "關於 Skill（SKILL.md）與 CLAUDE.md 的職責分工，何者最恰當？",
    options: [
      "兩者完全等價，可任意互換",
      "CLAUDE.md 放專案的常駐慣例與背景；Skill 放特定任務才需載入的作業程序",
      "Skill 用於權限設定；CLAUDE.md 用於工具定義",
      "Skill 只能由 Anthropic 官方提供，團隊不能自訂",
    ],
    answer: 1,
    explanation: "CLAUDE.md 承載每次都需要的專案常駐背景與慣例；Skill 則是打包特定任務的作業程序，在任務相關時才載入，可避免長期占用情境。",
    trap: "把所有作業程序都塞進 CLAUDE.md 會讓每次對話都背負大量無關內容；Skill 也完全可以由團隊自訂。",
  },
  {
    topic: D2, difficulty: "進階",
    stem: "使用 git worktree 隔離模式執行代理任務的主要好處是？",
    options: [
      "可減少 token 用量",
      "代理在獨立的工作副本中作業，不會干擾你目前的工作目錄狀態",
      "可自動通過所有 CI 檢查",
      "能讓代理繞過權限設定",
    ],
    answer: 1,
    explanation: "worktree 隔離讓代理在儲存庫的獨立副本中作業，你的工作目錄與未提交變更不受影響，任務結束後未變更的 worktree 會被自動清除。",
    trap: "隔離只影響檔案系統範圍，不會改變權限模型，也與 token 用量無關。",
  },
  {
    topic: D2, difficulty: "基礎",
    stem: "自訂子代理（subagent）在 Claude Code 專案中的定義位置與格式為何？",
    options: [
      ".claude/agents/ 下的 Markdown 檔，以 frontmatter 描述模型、工具與用途",
      "settings.json 中的 agents 陣列",
      "CLAUDE.md 的子代理章節",
      "必須以 TypeScript 程式碼註冊",
    ],
    answer: 0,
    explanation: "自訂子代理定義為 .claude/agents/ 下的 Markdown 檔，frontmatter 指定模型、可用工具與說明，內文則是該子代理的系統指示。",
    trap: "子代理的 description 決定何時會被自動選用，寫得含糊會導致該用時沒被叫到。",
  },
  {
    topic: D2, difficulty: "情境",
    stem: "工程師想接續昨天中斷的 Claude Code 工作階段，保留完整脈絡。最合適的做法是？",
    options: [
      "把昨天的對話複製貼上到新的工作階段",
      "使用工作階段的 resume（續行）功能",
      "重新執行 /init 重建專案文件",
      "把脈絡全部寫進 CLAUDE.md",
    ],
    answer: 1,
    explanation: "工作階段的 resume 會帶著原本的對話脈絡續行，是保留完整上下文最直接的方式；若要從某個節點分支探索則使用 fork。",
    trap: "複製貼上會遺失工具呼叫與檔案狀態的結構化紀錄；把一次性脈絡塞進 CLAUDE.md 會污染之後所有工作階段。",
  },
  {
    topic: D2, difficulty: "進階",
    stem: "團隊發現 Claude Code 在此專案中頻繁詢問同一批唯讀指令的權限。最恰當的改善方式是？",
    options: [
      "一律改用 bypassPermissions 模式",
      "把這批已確認安全的唯讀指令加入專案 settings.json 的允許清單",
      "要求成員每次手動核可，維持最高安全性",
      "把這些指令改寫成別的名稱以規避檢查",
    ],
    answer: 1,
    explanation: "針對已確認安全的唯讀指令建立精確的允許清單，是在減少干擾與維持控管之間的正確平衡。",
    trap: "全面 bypass 會連破壞性指令一併放行；規避檢查更是直接繞過安全機制，兩者都不可取。",
  },
  {
    topic: D2, difficulty: "情境",
    stem: "在多套件的 monorepo 中，apps/web 與 services/api 需要不同的測試指令與慣例。最佳實務是？",
    options: [
      "在根目錄 CLAUDE.md 用大量條件句描述所有情況",
      "在各子目錄放置各自的 CLAUDE.md，根目錄只留跨專案通則",
      "為每個套件建立獨立的 git 儲存庫",
      "把兩套指令都寫在同一份 settings.json 的同一個鍵",
    ],
    answer: 1,
    explanation: "階層式 CLAUDE.md 正是為此設計：根目錄放跨專案通則，各子目錄放該範圍專屬的指令與慣例，模型在該範圍工作時自然取得最相關的規則。",
    trap: "把所有條件塞進單一檔案會讓內容膨脹且互相干擾；拆分儲存庫則是為了設定問題付出過高的架構代價。",
  },
  {
    topic: D2, difficulty: "基礎",
    stem: "關於 Claude Code 的權限模式，下列敘述何者正確？",
    options: [
      "權限模式一旦設定就無法在工作階段中變更",
      "plan 模式會讓代理先提出計畫並等待人工核可，不適合無人看管的自動化流程",
      "acceptEdits 等同於停用所有安全檢查",
      "所有模式都會對每個工具呼叫逐一詢問",
    ],
    answer: 1,
    explanation: "plan 模式會讓代理提出計畫後停下等待核可，非常適合互動場景，但用在無人看管的自動化流程會導致無限期停滯。",
    trap: "為子工作階段選擇權限模式時，務必考慮是否有人在看；自動化流程選了 plan 模式會直接卡死。",
  },
  {
    topic: D2, difficulty: "進階",
    stem: "在 CI 中執行 Claude Code 前，要確保專案能順利跑測試與 linter，官方建議的機制是？",
    options: [
      "在 CLAUDE.md 開頭寫「請先安裝相依套件」",
      "設定 SessionStart hook，於工作階段啟動時完成環境準備",
      "把安裝指令加入每個斜線指令",
      "要求開發者手動預先安裝",
    ],
    answer: 1,
    explanation: "SessionStart hook 會在工作階段啟動時執行，適合用來安裝相依套件、準備環境，確保測試與 linter 在遠端或 CI 環境中可直接運作。",
    trap: "寫在 CLAUDE.md 只是提示模型，無法保證每次都執行；遠端工作階段的容器是全新的，需要可靠的自動準備機制。",
  },
  {
    topic: D2, difficulty: "情境",
    stem: "團隊希望把一組常用的斜線指令、子代理與 hooks 打包分享給其他專案使用。最合適的機制是？",
    options: [
      "以 Plugin（外掛）形式打包並透過 marketplace 安裝",
      "把 .claude 目錄壓縮後以郵件傳送",
      "要求每個專案自行複製貼上",
      "全部改寫進單一份 CLAUDE.md",
    ],
    answer: 0,
    explanation: "Plugin 可將斜線指令、子代理、hooks 與 skills 打包成可安裝的單位，透過 marketplace 分發，是跨專案重用的正式機制。",
    trap: "複製貼上會造成版本分歧且難以更新；把可執行的 hooks 與指令壓成 CLAUDE.md 文字更會失去其自動化能力。",
  },
];

/* ── 領域 3：提示工程與結構化輸出 (20%) ───────────────────────────── */
const PROMPTING_SEEDS: CertSeed[] = [
  {
    topic: D3, difficulty: "情境",
    stem: "應用需要模型回傳可直接解析的 JSON。在目前的 Messages API 中，正確的做法是？",
    options: [
      "使用已棄用的頂層 output_format 參數",
      "使用 output_config: { format: {...} }，或以 messages.parse() 依 schema 驗證",
      "在 assistant 訊息中預填 { 字元引導模型",
      "在 system prompt 中要求「只回 JSON」即為唯一可靠方法",
    ],
    answer: 1,
    explanation: "結構化輸出應使用 output_config.format；SDK 的 messages.parse() 還會自動依 schema 驗證回應，是建議做法。",
    trap: "頂層 output_format 已棄用；assistant 預填（prefill）在 Fable 5、Opus 5、Sonnet 5 與 4.6 以後的模型上會直接回 400。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "要保證工具呼叫的 input 一定符合 schema，strict: true 應設定在哪裡？",
    options: [
      "設在 tool_choice 物件上",
      "設在工具定義的頂層欄位，與 name／description／input_schema 並列",
      "設在 output_config 內",
      "設在 messages 陣列的每則訊息上",
    ],
    answer: 1,
    explanation: "strict: true 是工具定義的頂層欄位，與 name、description、input_schema 並列；同時 schema 需要 additionalProperties: false 與 required。",
    trap: "把 strict 設在 tool_choice 上是常見錯誤；此外 strict 與 programmatic tool calling、強制 tool_choice 等功能不相容。",
  },
  {
    topic: D3, difficulty: "基礎",
    stem: "在 Claude Opus 5、Opus 4.8 等新世代模型上啟用延伸思考，正確的參數是？",
    options: [
      "thinking: { type: \"enabled\", budget_tokens: 8000 }",
      "thinking: { type: \"adaptive\" }",
      "extended_thinking: true",
      "output_config: { thinking: true }",
    ],
    answer: 1,
    explanation: "新世代模型使用自適應思考 thinking: { type: \"adaptive\" }，由模型自行決定何時思考與思考多深，並以 output_config.effort 控制深度。",
    trap: "budget_tokens 在 Fable 5／Opus 5／4.8／4.7 與 Sonnet 5 上已移除，送出會直接回 400；僅 Haiku 4.5 等較舊模型仍使用它。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "output_config.effort 的正確用途與位置為何？",
    options: [
      "頂層參數，數值型 0–100",
      "位於 output_config 內，可設 low／medium／high／xhigh／max，控制思考深度與整體 token 花費",
      "位於 thinking 物件內，只有 on／off 兩種值",
      "只能在 Batch API 中使用",
    ],
    answer: 1,
    explanation: "effort 位於 output_config 內（非頂層），可設 low、medium、high、xhigh、max，用來控制思考深度與整體 token 花費，預設為 high。",
    trap: "effort 是繼快取之後的第一個「以品質換成本」的調節桿，應依工作型態逐路由調校，而非全域一次調高。",
  },
  {
    topic: D3, difficulty: "情境",
    stem: "應用把模型的推理過程串流顯示給使用者，但升級到新模型後前端只看到長時間空白後才出現答案。最可能的原因與修正是？",
    options: [
      "模型不再進行思考，需改回舊模型",
      "thinking 的 display 預設為 omitted，需明確設定 display: \"summarized\"",
      "串流功能已被移除，需改用非串流請求",
      "max_tokens 設得太低，需調高",
    ],
    answer: 1,
    explanation: "在 Fable 5、Opus 5／4.8／4.7 與 Sonnet 5 上，thinking 的 display 預設為 omitted（思考文字為空字串），要顯示摘要需明確設定 display: \"summarized\"。",
    trap: "display 只影響「可見性」，思考仍照常進行並照常計費；原始思考鏈在任何模型上都不會被揭露。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "對話進行到一半需要注入操作者指示（例如切換為簡潔模式），且不希望讓已快取的前綴失效。最佳做法是？",
    options: [
      "修改頂層 system 欄位的內容",
      "在 messages 陣列中附加 { role: \"system\", content: ... } 訊息",
      "在最後一則 user 訊息前面插入說明文字",
      "重新建立一個新的對話",
    ],
    answer: 1,
    explanation: "在 messages 中附加 role: \"system\" 的訊息可保留已快取的歷史前綴，同時具備操作者權限，也是較能抵禦提示注入的通道。",
    trap: "修改頂層 system 會讓其後所有內容的快取全部失效；另注意此功能有模型限制，且該訊息不能是 messages[0]。",
  },
  {
    topic: D3, difficulty: "基礎",
    stem: "要讓模型回答時附上引用來源，citations 應如何啟用？",
    options: [
      "在頂層請求設定 citations: true",
      "在每個 document 內容區塊上設定 citations: { enabled: true }（全部設或全部不設）",
      "在 system prompt 中要求模型列出來源",
      "在 output_config 中設定 citations 格式",
    ],
    answer: 1,
    explanation: "引用功能需在每個 document 內容區塊上設定 citations: { enabled: true }，且必須全部設定或全部不設定，回應會拆成多個 text 區塊並附帶 citations 陣列。",
    trap: "citations 與 output_config.format 不相容，同時使用會回 400；只靠提示詞要求列來源則無法取得結構化的字元／頁碼定位。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "在 Claude Fable 5.1 上，原本以 tool_choice: { type: \"tool\", name: \"extract\" } 強制取得 JSON 的程式碼會發生什麼事？該如何調整？",
    options: [
      "正常運作，無需調整",
      "回傳 400；改用 tool_choice: auto 搭配明確指示，或直接改用結構化輸出",
      "自動降級為 auto，僅產生警告",
      "需要加上 beta 標頭即可繼續使用",
    ],
    answer: 1,
    explanation: "Claude Fable 5.1／Mythos 5.1 已移除強制工具使用，tool_choice 的 any 與 tool 都會回 400。若原本只是為了拿到 JSON，最直接的替代是改用結構化輸出。",
    trap: "tool_choice: none 不受影響；若仍需要工具，改用 auto 加上明確指示，並以 strict: true 確保參數符合 schema。",
  },
  {
    topic: D3, difficulty: "情境",
    stem: "分類任務要求輸出必須是五個固定標籤之一，且下游程式直接以字串比對。最穩健的設計是？",
    options: [
      "在提示詞中反覆強調「只能回這五個字」",
      "以 output_config.format 定義 enum schema 約束輸出",
      "設定較小的 max_tokens 讓模型無法多寫",
      "在回應後以正則表達式硬性截取",
    ],
    answer: 1,
    explanation: "以結構化輸出定義 enum schema，可從 API 層面保證回應落在允許的集合內，比任何提示詞技巧都可靠。",
    trap: "壓低 max_tokens 只會造成截斷而非約束格式；事後正則截取則是把驗證責任推給下游，錯誤更難追查。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "在 Claude Opus 5 上把 thinking 設為 disabled，可能出現哪一種難以察覺的故障？",
    options: [
      "請求一律回傳 400 錯誤",
      "模型偶爾把工具呼叫寫進可見文字而非 tool_use 區塊，該輪成功但工具從未執行且不報錯",
      "回應內容會被自動截斷至一半",
      "快取命中率會歸零",
    ],
    answer: 1,
    explanation: "在 Opus 5 上停用思考時，模型偶爾會把工具呼叫寫進可見文字而不是 tool_use 區塊：該輪看似成功、不報錯，但工具從未執行，在代理迴圈中還會污染後續輪次。",
    trap: "建議改為「開啟思考並調低 effort」，同樣能省成本又能避免此問題；此外 disabled 在 effort 為 xhigh／max 時會直接回 400。",
  },
  {
    topic: D3, difficulty: "基礎",
    stem: "撰寫工具的 description 時，下列哪一項最重要？",
    options: [
      "盡可能簡短以節省 token",
      "清楚說明用途、適用時機與參數語意，讓模型能正確判斷何時該呼叫",
      "使用大量驚嘆號強調重要性",
      "把實作細節與程式碼一併寫入",
    ],
    answer: 1,
    explanation: "工具描述是模型判斷「何時該用這個工具」的唯一依據，應清楚交代用途、適用時機與參數語意，這對工具選擇正確率的影響最大。",
    trap: "過度精簡會讓模型在多個相似工具間誤選；塞入實作細節則佔用情境卻無助於選擇判斷。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "把針對舊模型撰寫的提示詞直接沿用到新世代模型，常見的問題是什麼？",
    options: [
      "新模型無法理解舊格式，一律報錯",
      "為舊模型撰寫的過度規範性指示可能反而降低新模型的輸出品質",
      "提示詞會自動被改寫，不需處理",
      "舊提示詞的 token 用量必定翻倍",
    ],
    answer: 1,
    explanation: "為舊模型撰寫的提示往往過度規範、逐步限制模型行為，用在新世代模型上反而會壓抑其能力並降低輸出品質；模型遷移應同時檢視提示詞。",
    trap: "提示詞問題不會自己顯現：請求照樣成功、不報錯，只是品質默默下降，因此遷移時的提示詞稽核容易被忽略。",
  },
  {
    topic: D3, difficulty: "情境",
    stem: "長篇報告生成需要 max_tokens 設到 64000。若使用非串流請求，最可能遇到的問題是？",
    options: [
      "回應內容會被自動摘要",
      "容易觸發 HTTP 逾時，SDK 因此要求大額 max_tokens 使用串流",
      "費用會以雙倍計價",
      "模型會拒絕生成",
    ],
    answer: 1,
    explanation: "大額 max_tokens 的非串流請求容易撞上 HTTP 逾時，因此 SDK 要求以串流處理，並可用 get_final_message()／finalMessage() 取得完整回應。",
    trap: "串流不影響計價，也不會改變內容；它解決的是連線逾時問題。",
  },
  {
    topic: D3, difficulty: "基礎",
    stem: "關於 system prompt 與 user 訊息的職責，何者最恰當？",
    options: [
      "system 放角色、規則與輸出慣例；user 放本次的具體任務與資料",
      "兩者可任意互換，模型一視同仁",
      "system 只能放一句話",
      "所有內容都應放進 system 以提高權重",
    ],
    answer: 0,
    explanation: "system 承載穩定的角色、規則與輸出慣例；user 放本次的具體任務與資料。這樣的分工同時有利於快取（穩定內容在前，變動內容在後）。",
    trap: "把每次都變動的內容塞進 system 會讓快取前綴反覆失效，是常見的效能陷阱。",
  },
  {
    topic: D3, difficulty: "進階",
    stem: "團隊想降低 API 成本但不願犧牲品質。依建議的調節桿順序，應該先做什麼？",
    options: [
      "先把模型降級到較小的模型",
      "先做免費的優化：提示快取、輸入輸出 token 衛生、迴圈整理、批次處理",
      "先把 effort 一律降到 low",
      "先縮短所有提示詞至一半長度",
    ],
    answer: 1,
    explanation: "成本優化應先做不犧牲品質的「免費優化」——提示快取、輸入與輸出 token 衛生、迴圈整理、批次處理——之後才進入需要取捨的調節桿（effort、模型選擇）。",
    trap: "一開始就降級模型或壓低 effort 是以品質換成本；且應以「每個完成任務的成本」而非「每次請求的成本」評估，否則多輪重試反而更貴。",
  },
];

/* ── 領域 4：工具設計與 MCP 整合 (18%) ────────────────────────────── */
const TOOLS_MCP_SEEDS: CertSeed[] = [
  {
    topic: D4, difficulty: "基礎",
    stem: "在 MCP 中，Resources、Prompts 與 Tools 的角色差異為何？",
    options: [
      "三者功能相同，只是命名不同",
      "Resources 是資料橋接、Prompts 是可重用範本、Tools 是可執行的動作",
      "Resources 是可執行動作、Tools 是資料來源",
      "只有 Tools 會被模型使用，其餘兩者僅供人類閱讀",
    ],
    answer: 1,
    explanation: "MCP 的三種原語各司其職：Resources 提供資料橋接、Prompts 提供可重用的提示範本、Tools 提供可執行的動作。",
    trap: "把唯讀資料設計成 Tool 會讓模型誤以為有副作用；把動作設計成 Resource 則無法被正確呼叫。",
  },
  {
    topic: D4, difficulty: "進階",
    stem: "透過 API 使用 MCP 連接器時，只在請求中提供 mcp_servers 會發生什麼事？",
    options: [
      "正常運作，工具會自動載入",
      "被視為驗證錯誤而遭拒；還必須加上對應的 mcp_toolset 工具項目",
      "僅產生警告，工具仍可使用",
      "會自動改用本機 MCP 設定",
    ],
    answer: 1,
    explanation: "只提供 mcp_servers 會被拒為驗證錯誤，必須同時在 tools 中加上 { type: \"mcp_toolset\", mcp_server_name: <相同名稱> }，並帶上對應的 beta 標頭。",
    trap: "兩個半邊的 name 必須完全一致，否則同樣無法對應成功。",
  },
  {
    topic: D4, difficulty: "情境",
    stem: "自訂工具在執行時擲出例外。回送給模型的正確做法是？",
    options: [
      "不回送任何內容，讓模型自行判斷",
      "回送 tool_result 並標記 is_error: true，附上可理解的錯誤說明",
      "直接中止整個對話",
      "回送一個假的成功結果避免中斷流程",
    ],
    answer: 1,
    explanation: "工具失敗時仍必須回送對應的 tool_result 並設定 is_error: true，讓模型知道發生什麼事並自行決定重試或改採其他路徑。",
    trap: "省略失敗工具的 tool_result 會造成懸空的 tool_use；回送假成功則會讓模型基於錯誤前提繼續推理，後果更嚴重。",
  },
  {
    topic: D4, difficulty: "進階",
    stem: "使用工具搜尋（tool search）搭配 defer_loading 時，下列哪一項限制必須遵守？",
    options: [
      "所有工具都必須設為 defer_loading: true 才有效",
      "搜尋工具本身不可 defer_loading，且 tools 中至少要有一個非延遲載入的工具",
      "defer_loading 只能用於 MCP 工具",
      "延遲載入的工具數量上限為 5 個",
    ],
    answer: 1,
    explanation: "搜尋工具本身不能設 defer_loading: true，且 tools 中至少要有一個非延遲載入的工具，否則 API 會回 400「All tools have defer_loading set」。",
    trap: "「全部延遲載入」看似最省情境，卻會讓模型連搜尋的入口都沒有，直接被 API 拒絕。",
  },
  {
    topic: D4, difficulty: "情境",
    stem: "使用網頁搜尋伺服器端工具時，程式以 try/catch 包住請求卻從未捕捉到任何錯誤，但結果明顯有問題。原因最可能是？",
    options: [
      "伺服器端工具的錯誤以 HTTP 200 回傳，錯誤資訊在結果區塊內而非擲出例外",
      "搜尋工具永遠不會出錯",
      "錯誤被 SDK 自動重試掩蓋",
      "必須改用非串流請求才會擲出例外",
    ],
    answer: 0,
    explanation: "伺服器端工具的錯誤以 HTTP 200 回傳，錯誤資訊放在 web_search_tool_result 等結果區塊的 content 中（例如 max_uses_exceeded），不會擲出例外。",
    trap: "成功時 web_search 的 content 是「陣列」、錯誤時是「物件」，取索引前必須先分辨型別，否則會拿到非預期的值。",
  },
  {
    topic: D4, difficulty: "基礎",
    stem: "宣告 Anthropic 定義的 bash 或文字編輯器工具時，正確的做法是？",
    options: [
      "必須提供完整的 input_schema",
      "只需指定 type 與 name，不需要 input_schema",
      "必須設定 strict: true",
      "需要額外的 beta 標頭與自訂 schema",
    ],
    answer: 1,
    explanation: "bash 與文字編輯器屬於 Anthropic 定義的工具，宣告時只需 type 與 name（例如 { type: \"bash_20250124\", name: \"bash\" }），沒有 input_schema。",
    trap: "若自行定義一個名為 \"bash\" 且附帶 schema 的工具，那是完全不同的自訂工具，不會取得內建行為。",
  },
  {
    topic: D4, difficulty: "進階",
    stem: "要讓 Claude 從程式碼執行環境內部呼叫你的自訂工具（programmatic tool calling），需要哪些設定？",
    options: [
      "只要宣告 code_execution 工具即可",
      "宣告 code_execution 工具，並在自訂工具上設定 allowed_callers 指向該執行環境",
      "在 output_config 中啟用 programmatic 模式",
      "把自訂工具改寫成 MCP 伺服器",
    ],
    answer: 1,
    explanation: "程式化工具呼叫需同時宣告 code_execution 工具，並在自訂工具上設定 allowed_callers 指向該執行環境型別。",
    trap: "此功能與 strict: true、disable_parallel_tool_use、強制 tool_choice 及 MCP 工具都不相容；回應待處理的程式化呼叫時，user 訊息中只能有 tool_result 區塊，不可夾帶文字。",
  },
  {
    topic: D4, difficulty: "情境",
    stem: "網頁擷取（web fetch）工具在某次請求中未能取得使用者口頭描述的網址內容。最可能的原因是？",
    options: [
      "該工具只能擷取已存在於對話中的網址",
      "該工具每日有固定次數上限",
      "必須先呼叫網頁搜尋才能啟用",
      "該工具不支援 HTTPS",
    ],
    answer: 0,
    explanation: "web fetch 只會擷取「已經出現在對話中」的網址，這是刻意的安全設計，可避免模型憑空造出網址去存取。",
    trap: "若希望模型能探索新來源，應搭配網頁搜尋工具；單靠 web fetch 無法主動發現尚未出現在對話中的網址。",
  },
  {
    topic: D4, difficulty: "進階",
    stem: "在 Managed Agents 中限制代理只能存取特定網域，正確的設定位置是？",
    options: [
      "環境的 networking 設定即可涵蓋網頁工具",
      "在工具集 configs 項目上以 allowed_domains 或 blocked_domains 設定（兩者擇一）",
      "在 system prompt 中要求模型只造訪指定網域",
      "在 vault 憑證中設定網域白名單",
    ],
    answer: 1,
    explanation: "Managed Agents 的網頁工具在 Anthropic 伺服器上執行，不受環境 networking 設定影響，必須在工具集 configs 上以 allowed_domains 或 blocked_domains 限制（兩者不可並用）。",
    trap: "誤以為環境的網路設定能管住網頁工具是常見盲點；此外主控台的組織層級網頁設定只適用於 Messages API。",
  },
  {
    topic: D4, difficulty: "基礎",
    stem: "程式碼執行工具（code_execution_20260521）的執行結果應在哪一種內容區塊中讀取？",
    options: [
      "bash_code_execution_tool_result，內含 stdout／stderr／return_code",
      "純 text 區塊",
      "code_execution_tool_result（無前綴的舊型別）",
      "tool_use 區塊的 input 欄位",
    ],
    answer: 0,
    explanation: "code_execution_20260521 回傳的是 bash_code_execution_tool_result 區塊，內含 content.stdout、stderr 與 return_code。",
    trap: "沿用舊的 code_execution_tool_result 型別做比對會完全比對不到，導致程式誤判為沒有輸出。",
  },
  {
    topic: D4, difficulty: "情境",
    stem: "團隊要把內部訂單系統開放給 Claude 查詢與建立訂單。從工具設計角度，最恰當的切分是？",
    options: [
      "設計一個萬用工具，以 action 參數字串決定行為",
      "查詢與建立各自設計為語意明確、參數受約束的獨立工具",
      "只提供一個 SQL 執行工具讓模型自由下指令",
      "把所有操作都包成 Bash 指令",
    ],
    answer: 1,
    explanation: "語意明確、範圍受限的獨立工具能讓模型正確判斷何時該用、參數該給什麼，也讓權限控管與稽核更清晰。",
    trap: "萬用 action 參數會讓工具描述含糊、模型選擇困難；開放任意 SQL 或 Bash 則等於把資料庫的完整權限交出去。",
  },
  {
    topic: D4, difficulty: "進階",
    stem: "記憶體工具（memory tool）的正確宣告型別為何？",
    options: [
      "{ type: \"memory_20250818\", name: \"memory\" }",
      "{ type: \"memory\", name: \"memory_store\" }",
      "在 output_config 中設定 memory: true",
      "以 MCP Resource 形式提供",
    ],
    answer: 0,
    explanation: "記憶體工具宣告為 { type: \"memory_20250818\", name: \"memory\" }；Python 與 TypeScript 另提供 BetaAbstractMemoryTool／betaMemoryTool 輔助類別協助實作後端。",
    trap: "記憶體工具需要你自行實作儲存後端，宣告型別只是介面，不會自動提供持久化儲存。",
  },
  {
    topic: D4, difficulty: "情境",
    stem: "MCP 伺服器提供了 30 個工具，導致每次請求的情境負擔明顯上升。最合適的優化方向是？",
    options: [
      "把所有工具描述縮短到一句話",
      "採用工具搜尋搭配 defer_loading，讓模型按需載入工具定義",
      "刪除一半的工具",
      "把 30 個工具合併成 1 個萬用工具",
    ],
    answer: 1,
    explanation: "工具搜尋搭配 defer_loading 可讓大量工具的定義按需載入，兼顧功能完整性與情境效率。",
    trap: "過度縮短描述會傷及工具選擇正確率；合併成萬用工具則會讓語意更模糊，兩者都是以正確率換情境。",
  },
  {
    topic: D4, difficulty: "基礎",
    stem: "使用網頁搜尋工具時，若模型支援較新的動態過濾版本，應注意什麼？",
    options: [
      "需要另外宣告 code_execution 工具搭配使用",
      "動態過濾版本內部已使用程式碼執行，不應再另外宣告 code_execution",
      "必須改用非串流請求",
      "只能在 Batch API 中使用",
    ],
    answer: 1,
    explanation: "較新的網頁搜尋／擷取版本內建動態過濾，內部已使用程式碼執行，因此不應在 tools 中另外宣告 code_execution，否則兩套執行環境會讓模型混淆。",
    trap: "較舊的模型只支援基本版本；平台可用性也不同（例如 Vertex AI 只有基本版網頁搜尋），設計前應確認目標平台。",
  },
];

/* ── 領域 5：情境管理與可靠性 (15%) ──────────────────────────────── */
const CONTEXT_SEEDS: CertSeed[] = [
  {
    topic: D5, difficulty: "進階",
    stem: "提示快取是前綴比對。請求內容的渲染順序為何？",
    options: [
      "messages → system → tools",
      "tools → system → messages",
      "system → tools → messages",
      "順序不影響快取結果",
    ],
    answer: 1,
    explanation: "渲染順序為 tools → system → messages。應把穩定內容放在前面（固定的系統提示、決定性的工具清單），變動內容放在最後一個快取斷點之後。",
    trap: "前綴中任何一個位元組改變，都會讓其後所有內容的快取失效，因此工具清單的順序也必須是決定性的。",
  },
  {
    topic: D5, difficulty: "情境",
    stem: "團隊發現重複請求的 cache_read_input_tokens 始終為 0。最可能的原因是？",
    options: [
      "快取功能需要另外申請開通",
      "前綴中含有每次都變動的內容，例如時間戳記或未排序的 JSON",
      "模型不支援快取，需更換模型",
      "必須使用串流才能命中快取",
    ],
    answer: 1,
    explanation: "cache_read_input_tokens 持續為 0 代表有「靜默失效因子」：系統提示中的 datetime.now()、每次請求的 UUID、未排序的 JSON 鍵、變動的工具清單都會讓前綴不一致。",
    trap: "另一個容易忽略的原因是可快取前綴太短（依模型為 512–4096 tokens），未達門檻會靜默地不快取，也不會報錯。",
  },
  {
    topic: D5, difficulty: "基礎",
    stem: "單一請求中，快取斷點（cache_control 標記）的數量上限是多少？",
    options: ["1 個", "4 個", "10 個", "無上限"],
    answer: 1,
    explanation: "每個請求最多 4 個快取斷點。若只需要簡單處理，使用頂層的自動快取讓系統快取最後一個可快取區塊即可。",
    trap: "斷點不是越多越好；關鍵在於把穩定與變動內容正確切分，而不是把斷點用滿。",
  },
  {
    topic: D5, difficulty: "進階",
    stem: "情境編輯（context editing）與壓縮（compaction）最關鍵的差異是？",
    options: [
      "情境編輯會「清除」舊的工具結果或思考區塊；壓縮則會「摘要」既有內容",
      "兩者完全相同，只是 beta 名稱不同",
      "情境編輯會摘要；壓縮會直接刪除最舊的訊息",
      "情境編輯僅適用於串流請求",
    ],
    answer: 0,
    explanation: "情境編輯是「清除」（例如 clear_tool_uses_20250919 清除舊工具結果、clear_thinking_20251015 清除思考區塊）；壓縮則是伺服器端「摘要」既有情境，兩者是不同功能。",
    trap: "兩者的策略型別與 beta 標頭不可混用：compact_20260112 與 compact-2026-01-12 屬於壓縮，不能放進情境編輯的 edits 中。",
  },
  {
    topic: D5, difficulty: "情境",
    stem: "啟用伺服器端壓縮後，長對話在幾輪後開始出現脈絡遺失。檢查程式碼發現每輪只把回應的文字附加回 messages。問題出在哪？",
    options: [
      "應該附加完整的 response.content，壓縮區塊必須被保留並回送",
      "應該改用更大的 max_tokens",
      "應該關閉壓縮改用情境編輯",
      "應該每輪都重新建立客戶端",
    ],
    answer: 0,
    explanation: "必須把完整的 response.content 附加回 messages，而非只取文字。壓縮區塊要保留並回送，API 才能在下次請求時據此替換被壓縮的歷史。",
    trap: "只抽取文字字串附加，會靜默地遺失壓縮狀態：請求照樣成功，但脈絡默默流失，非常難以察覺。",
  },
  {
    topic: D5, difficulty: "進階",
    stem: "使用 Batch API 處理大量非即時請求時，關於結果的正確處理方式是？",
    options: [
      "結果順序與送出順序一致，可依索引對應",
      "結果可能以任意順序回傳，必須以 custom_id 對應",
      "結果只會回傳成功的項目",
      "必須逐一以單獨請求重新查詢每個結果",
    ],
    answer: 1,
    explanation: "批次結果可能以任意順序回傳，必須以 custom_id 建立索引對應，絕不可依位置對應。每筆結果的 result.type 可能是 succeeded／errored／canceled／expired。",
    trap: "依位置對應在小批量測試時常常「剛好正確」，上線後才在大批量出現錯亂，是典型的潛伏性錯誤。",
  },
  {
    topic: D5, difficulty: "情境",
    stem: "錯誤處理只以單一個廣泛的 APIStatusError 捕捉所有例外，會有什麼問題？",
    options: [
      "程式無法編譯",
      "無法區分可重試（429、5xx、連線錯誤）與不可重試（400、404）的失敗",
      "會導致 API 金鑰外洩",
      "會讓所有請求都被自動重試",
    ],
    answer: 1,
    explanation: "單一廣泛捕捉會失去「可重試 vs 不可重試」的區分。應由最精確到最一般依序建立捕捉鏈：NotFoundError → RateLimitError → APIStatusError → APIConnectionError。",
    trap: "對 400／404 盲目重試只會浪費配額與時間，而且會掩蓋真正的程式錯誤。",
  },
  {
    topic: D5, difficulty: "基礎",
    stem: "要計算一段內容送進 Claude 會用掉多少 token，正確的做法是？",
    options: [
      "使用 tiktoken 函式庫估算",
      "使用 messages.count_tokens 端點",
      "以字元數除以 4 估算",
      "送出請求後看 usage 欄位是唯一方法",
    ],
    answer: 1,
    explanation: "應使用 Anthropic 的 messages.count_tokens 端點，它使用 Claude 實際的分詞器。tiktoken 是其他供應商的分詞器，結果並不適用。",
    trap: "不同世代的 Claude 模型分詞器也可能不同，跨模型遷移時應重新以 count_tokens 建立基準。",
  },
  {
    topic: D5, difficulty: "進階",
    stem: "程式讀取 response.stop_details 時偶爾發生空值錯誤。正確的認知是？",
    options: [
      "stop_details 一定存在，錯誤來自其他地方",
      "stop_details 只有在 stop_reason 為 refusal 時才有值，其餘情況為 null，讀取前必須防護",
      "stop_details 只在串流模式下存在",
      "應改用 stop_sequence 欄位替代",
    ],
    answer: 1,
    explanation: "stop_details 只有在 stop_reason 為 refusal 時才被填入（含 category 與 explanation），其他 stop_reason（end_turn、max_tokens、tool_use、pause_turn）一律為 null，讀取前必須先判斷。",
    trap: "正常流程幾乎都不是 refusal，因此此錯誤在開發階段不易出現，往往到正式環境才偶發。",
  },
  {
    topic: D5, difficulty: "情境",
    stem: "應用在流量高峰時頻繁收到 429。最恰當的處理策略是？",
    options: [
      "立即以相同頻率無限重試",
      "依 retry-after 指示退避重試，並評估批次化或分散流量",
      "把 max_retries 設為 0 直接回報失敗",
      "改用更大的 max_tokens 減少請求數",
    ],
    answer: 1,
    explanation: "429 應依 retry-after 指示退避重試；SDK 預設也會重試 408／409／429／5xx 與連線錯誤。長期則可評估以 Batch API 或流量分散降低尖峰壓力。",
    trap: "注意逾時本身也會被重試，實際牆鐘時間最長可達 timeout × (max_retries + 1)，設定時要一併考量。",
  },
  {
    topic: D5, difficulty: "進階",
    stem: "為了降低成本，團隊考慮建立「便宜模型先跑、必要時再升級」的多模型串接。導入前最該先驗證什麼？",
    options: [
      "先確認多模型串接一定比較便宜",
      "先量測「同一個最強模型改用較低 effort」的表現，因為快取是綁模型的，串接會失去跨模型的快取重用",
      "先把所有提示詞改寫成英文",
      "先關閉思考功能",
    ],
    answer: 1,
    explanation: "建立多模型串接前，應先量測更簡單的替代方案：同一個最強模型改用較低 effort。新世代模型的低 effort 往往已能匹敵前代的高 effort，且單一模型代表單一快取命名空間。",
    trap: "快取是綁模型的，多模型串接會失去跨模型的快取重用；此外評估應以「每個完成任務的成本」為準，較便宜卻需更多輪次或重試的請求並沒有比較省。",
  },
  {
    topic: D5, difficulty: "情境",
    stem: "代理系統要求可稽核性：需要能回溯每次決策所依據的資料。在情境管理上最該避免的做法是？",
    options: [
      "以子代理隔離情境並回傳精煉結論",
      "無條件清除所有舊工具結果而不留下任何摘要或外部紀錄",
      "使用壓縮並保留壓縮區塊",
      "把關鍵決策依據另外寫入外部儲存",
    ],
    answer: 1,
    explanation: "在需要稽核的系統中，若無條件清除舊工具結果又不留任何摘要或外部紀錄，決策依據就永久遺失了。情境瘦身必須搭配可回溯的保存機制。",
    trap: "情境編輯與壓縮解決的是「情境視窗」問題，不等於「稽核紀錄」；兩者需分別設計，關鍵依據應另外持久化。",
  },
];

export const CLAUDE_CERT_QUESTIONS: Question[] = [
  ...makeQuestions("AGT", AGENTIC_SEEDS),
  ...makeQuestions("CC", CLAUDE_CODE_SEEDS),
  ...makeQuestions("PRM", PROMPTING_SEEDS),
  ...makeQuestions("MCP", TOOLS_MCP_SEEDS),
  ...makeQuestions("CTX", CONTEXT_SEEDS),
];
