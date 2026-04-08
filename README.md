# CCG - Claude + Codex + Gemini 多模型協作工作流

<div align="center">

<img src="assets/logo/ccg-logo-cropped.png" alt="CCG Workflow" width="400">

[![npm version](https://img.shields.io/npm/v/ccg-workflow.svg)](https://www.npmjs.com/package/ccg-workflow)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-green.svg)](https://claude.ai/code)
[![Tests](https://img.shields.io/badge/Tests-139%20passed-brightgreen.svg)]()
[![Follow on X](https://img.shields.io/badge/X-@CCG__Workflow-black?logo=x&logoColor=white)](https://x.com/CCG_Workflow)
![star](https://atomgit.com/fengshao1227/ccg-workflow/star/badge.svg)

**繁體中文** | [簡體中文](./README.zh-CN.md) | [English](./README.en.md)

</div>

CCG 是一套由 Claude Code 負責編排、並串接 Codex 與 Gemini 的多模型協作開發系統。前端任務自動交給 Gemini，後端任務自動交給 Codex，而 Claude 會負責整體流程控管、結果整合與程式碼審查。

## 為什麼要用 CCG？

- **模型自動分流**：前端工作自動走 Gemini，後端工作自動走 Codex，不需要手動切換模型。
- **安全設計優先**：外部模型沒有直接寫入權限，只能回傳 patch，最後由 Claude 審查後再套用。
- **29+ 個斜線指令**：從規劃、實作、除錯、測試到 Git 工作流，都可以透過 `/ccg:*` 使用。
- **規格驅動開發**：整合 [OPSX](https://github.com/fission-ai/opsx)，把模糊需求轉成可驗證的限制條件，降低 AI 自由發揮造成的偏差。

## 架構概念

```text
Claude Code（總控 / 編排者）
           │
       ┌───┴───┐
       ↓       ↓
    Codex   Gemini
   （後端） （前端）
       │       │
       └───┬───┘
           ↓
      統一 Patch 結果
```

外部模型本身不會直接改你的專案檔案，而是先回傳建議變更，再由 Claude 做最後把關。

> **🎬 [觀看 CCG 實際示範 →](https://x.com/CCG_Workflow/status/2038923720610463876)** — 在 X 上查看真實的多模型協作流程

## 快速開始

### 安裝前你需要準備什麼？

| 需求 | 是否必要 | 說明 |
|------|----------|------|
| **Node.js 20 以上** | 必要 | `ora@9.x` 需要 Node.js 20 以上版本，Node 18 無法正常使用 |
| **Claude Code CLI** | 必要 | 這是 CCG 主要運作環境 |
| **jq** | 必要 | 用於自動授權 Hook |
| **Codex CLI** | 選用 | 安裝後可啟用後端自動分流 |
| **Gemini CLI** | 選用 | 安裝後可啟用前端自動分流 |

### 最快安裝方式

```bash
npx ccg-workflow
```

第一次執行時，CCG 會請你選擇顯示語言，之後會自動記住你的偏好設定。

### 安裝 jq

```bash
# macOS
brew install jq

# Ubuntu / Debian
sudo apt install jq

# RHEL / CentOS
sudo yum install jq

# Windows
choco install jq   # 或改用: scoop install jq
```

### 安裝 Claude Code

```bash
npx ccg-workflow menu
```

然後在選單中選擇 **「安裝 Claude Code」**。  
支援的安裝方式包含：npm、Homebrew、curl、PowerShell、cmd。

## 新手完整教學：從零開始把 CCG 跑起來

如果你是第一次接觸 CCG，建議照下面步驟做；不要跳步，成功率最高。

### 步驟 1：確認 Node.js 版本

在終端機輸入：

```bash
node -v
```

你應該看到 `v20.x` 或更新版本。  
如果版本低於 20，請先到 [Node.js 官方網站](https://nodejs.org/) 安裝 Node.js 20 以上版本，再繼續後面的步驟。

### 步驟 2：安裝 jq

請依照你的作業系統執行上面的 jq 安裝指令。安裝完成後，用下面指令確認：

```bash
jq --version
```

有顯示版本號就代表安裝成功。

### 步驟 3：安裝並登入 Claude Code

先執行：

```bash
npx ccg-workflow menu
```

在選單中選擇 **「安裝 Claude Code」**，完成後再依照 Claude Code 的畫面提示登入帳號。

### 步驟 4：第一次安裝 CCG

在你的專案資料夾中執行：

```bash
npx ccg-workflow
```

第一次執行時通常會看到幾個設定步驟：

1. 選擇語言
2. 選擇是否安裝 MCP 工具
3. 選擇模型路由偏好
4. 寫入 CCG 設定到 `~/.claude/` 相關目錄

如果你是新手，可以先用預設值完成安裝，之後再慢慢調整。

### 步驟 5：先用最簡單的方式開始

如果你還沒有安裝 Codex CLI 或 Gemini CLI，也沒關係。  
你仍然可以先用 CCG 的指令與流程；之後再補裝其他模型工具即可。

建議第一個嘗試的指令：

```text
/ccg:plan 幫我規劃一個使用者登入功能
```

這條指令適合新手，因為它會先幫你整理需求與規劃，不會一開始就大量修改程式。

### 步驟 6：看懂 CCG 做了什麼

當你執行 `/ccg:plan`、`/ccg:workflow` 或 `/ccg:spec-*` 時，可以這樣理解：

1. **你提出需求**
2. **CCG 判斷任務類型**
3. **前端交給 Gemini、後端交給 Codex**
4. **Claude 彙整結果並進行審查**
5. **最後輸出計畫、建議或 patch**

你可以把它想成：**Claude 是專案經理，Codex 與 Gemini 是分工合作的工程師。**

### 步驟 7：你的第一個推薦流程

如果你想穩穩地上手，建議用下面順序：

```text
1. /ccg:plan      先產生計畫
2. 檢查計畫內容是否正確
3. /ccg:execute   依照計畫執行
4. /ccg:review    做程式碼審查
```

這是最容易理解、也最不容易出錯的入門路線。

### 步驟 8：什麼時候該用哪個指令？

| 使用情境 | 建議指令 | 原因 |
|----------|----------|------|
| 我只想先整理需求 | `/ccg:plan` | 風險低，適合先確認方向 |
| 我要直接做完整功能 | `/ccg:workflow` | 一次走完整開發流程 |
| 我只改前端 | `/ccg:frontend` | 直接交給 Gemini |
| 我只改後端 | `/ccg:backend` | 直接交給 Codex |
| 我想更嚴謹，不希望 AI 自由發揮 | `/ccg:spec-*` | 先把需求轉成約束條件 |
| 我有大型任務，要拆多人並行 | `/ccg:team-*` | 適合可拆成多模組的工作 |

### 步驟 9：新手最常遇到的問題

#### 問題 1：指令跑不起來

先檢查：

- Node.js 是否為 20 或更新版本
- `jq` 是否已安裝
- Claude Code 是否已安裝且可正常登入

#### 問題 2：我沒有 Codex CLI / Gemini CLI

不用擔心，可以先用 CCG 的基本流程。等你熟悉後，再補裝其他 CLI 來啟用完整的多模型分流能力。

#### 問題 3：我不知道該下什麼 prompt

先用自然語言描述需求即可，例如：

```text
/ccg:plan 幫我在現有專案加入 email / password 登入、註冊與忘記密碼流程
```

先把需求說清楚，比寫得很花俏更重要。

## 指令總覽

### 開發工作流

| 指令 | 用途 | 使用模型 |
|------|------|----------|
| `/ccg:workflow` | 完整 6 階段開發流程 | Codex + Gemini |
| `/ccg:plan` | 多模型協作規劃（Phase 1-2） | Codex + Gemini |
| `/ccg:execute` | 多模型協作執行（Phase 3-5） | Codex + Gemini + Claude |
| `/ccg:codex-exec` | 由 Codex 主導執行（規劃 → 撰寫程式碼 → 審查） | Codex + 多模型審查 |
| `/ccg:feat` | 智慧型功能開發 | 自動分流 |
| `/ccg:frontend` | 前端任務快速模式 | Gemini |
| `/ccg:backend` | 後端任務快速模式 | Codex |

### 分析與品質

| 指令 | 用途 | 使用模型 |
|------|------|----------|
| `/ccg:analyze` | 技術分析 | Codex + Gemini |
| `/ccg:debug` | 問題診斷與修復 | Codex + Gemini |
| `/ccg:optimize` | 效能最佳化 | Codex + Gemini |
| `/ccg:test` | 產生測試 | 自動分流 |
| `/ccg:review` | 程式碼審查（自動讀取 git diff） | Codex + Gemini |
| `/ccg:enhance` | 強化提示詞 | 內建 |

### OPSX 規格驅動工作流

| 指令 | 用途 |
|------|------|
| `/ccg:spec-init` | 初始化 OPSX 環境 |
| `/ccg:spec-research` | 把需求轉成限制條件 |
| `/ccg:spec-plan` | 把限制條件轉成零決策計畫 |
| `/ccg:spec-impl` | 依照計畫實作並歸檔 |
| `/ccg:spec-review` | 雙模型交叉審查 |

### Agent Teams（v1.7.60+）

| 指令 | 用途 |
|------|------|
| `/ccg:team-research` | 需求分析與限制整理（可平行探索） |
| `/ccg:team-plan` | 產生可平行執行的實作計畫 |
| `/ccg:team-exec` | 啟動多個 Builder 隊友代理同時寫程式 |
| `/ccg:team-review` | 雙模型交叉審查 |

> **前置條件**：請在 `settings.json` 中啟用 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

### Git 工具

| 指令 | 用途 |
|------|------|
| `/ccg:commit` | 智慧提交（Conventional Commit 格式） |
| `/ccg:rollback` | 互動式回復變更 |
| `/ccg:clean-branches` | 清理已合併分支 |
| `/ccg:worktree` | 管理 Git worktree |

### 專案設定

| 指令 | 用途 |
|------|------|
| `/ccg:init` | 初始化專案用的 `CLAUDE.md` |
| `/ccg:context` | 管理專案上下文（初始化、記錄、壓縮、歷史） |

## 常見工作流教學

### 教學 1：先規劃，再執行

這是最推薦給新手的模式。

```bash
# 1. 先產生實作計畫
/ccg:plan 實作使用者登入功能

# 2. 檢查計畫內容
# 計畫通常會存到 .claude/plan/user-auth.md

# 3a. 交給 Claude 主導執行
/ccg:execute .claude/plan/user-auth.md

# 3b. 交給 Codex 主導執行（更省 Claude token）
/ccg:codex-exec .claude/plan/user-auth.md
```

**適合誰？**  
想先確認方向，避免一開始就讓 AI 直接大改專案的人。

### 教學 2：使用 OPSX 做更嚴謹的開發

如果你不想讓 AI 自己猜架構，建議使用這組指令：

```bash
/ccg:spec-init
/ccg:spec-research 實作使用者登入
/ccg:spec-plan
/ccg:spec-impl
/ccg:spec-review
```

這套流程的核心想法是：

1. 先整理需求
2. 再轉成限制條件
3. 再做計畫
4. 最後才實作

> **提示**：`/ccg:spec-*` 內部會呼叫 `/opsx:*`。你可以在每個階段之間使用 `/clear`，因為狀態會保存在 `openspec/` 目錄。

### 教學 3：使用 Agent Teams 處理大型任務

如果你的功能可以拆成多個模組同步進行，可以改用 Team 系列：

```bash
/ccg:team-research 實作即時協作看板 API
# /clear
/ccg:team-plan kanban-api
# /clear
/ccg:team-exec
# /clear
/ccg:team-review
```

這種方式特別適合：

- API、資料庫、前端畫面可以分開做
- 任務很大，單一上下文容易爆掉
- 你希望拆成多個 builder 同步完成

## 設定方式

### 安裝後的目錄結構

```text
~/.claude/
├── commands/ccg/       # 29+ 個斜線指令
├── agents/ccg/         # 子代理
├── skills/ccg/         # 品質關卡與多代理協作能力
├── bin/codeagent-wrapper
└── .ccg/
    ├── config.toml     # CCG 設定檔
    └── prompts/
        ├── codex/      # 6 組 Codex 專家提示詞
        └── gemini/     # 7 組 Gemini 專家提示詞
```

### 環境變數

請在 `~/.claude/settings.json` 的 `"env"` 區塊內設定：

| 變數 | 說明 | 預設值 | 什麼時候需要調整 |
|------|------|--------|------------------|
| `CODEAGENT_POST_MESSAGE_DELAY` | Codex 完成後等待秒數 | `5` | 如果 Codex 程序卡住，可改成 `1` |
| `CODEX_TIMEOUT` | wrapper 執行逾時秒數 | `7200` | 當任務非常大且執行時間很長時 |
| `BASH_DEFAULT_TIMEOUT_MS` | Claude Code Bash 預設逾時（毫秒） | `120000` | 指令常常超時時 |
| `BASH_MAX_TIMEOUT_MS` | Claude Code Bash 最大逾時（毫秒） | `600000` | 建置或測試時間很長時 |

<details>
<summary>settings.json 範例</summary>

```json
{
  "env": {
    "CODEAGENT_POST_MESSAGE_DELAY": "1",
    "CODEX_TIMEOUT": "7200",
    "BASH_DEFAULT_TIMEOUT_MS": "600000",
    "BASH_MAX_TIMEOUT_MS": "3600000"
  }
}
```

</details>

### MCP 設定

```bash
npx ccg-workflow menu
```

然後在選單中選擇 **「Configure MCP」**。

**程式碼檢索工具（擇一）**

- **ace-tool**（推薦）：可透過 `search_context` 搜尋程式碼  
  [官方網站](https://augmentcode.com/) | [第三方中轉](https://acemcp.heroman.wtf/)
- **fast-context**（推薦）：Windsurf Fast Context，不需要完整索引整個專案，但需要 Windsurf 帳號
- **ContextWeaver**（替代方案）：本機混合搜尋，需要 SiliconFlow API Key（免費）

**選用工具**

- **Context7**：取得最新函式庫文件（自動安裝）
- **Playwright**：瀏覽器自動化與測試
- **DeepWiki**：知識庫查詢
- **Exa**：搜尋引擎（需要 API Key）

### 自動授權 Hook

CCG 安裝時會自動寫入 Hook，讓 `codeagent-wrapper` 可以被自動授權執行。  
這個功能需要先安裝 [jq](#安裝-jq)。

<details>
<summary>手動設定方式（v1.7.71 以前版本適用）</summary>

請把以下內容加入 `~/.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' 2>/dev/null | grep -q 'codeagent-wrapper' && echo '{\"hookSpecificOutput\": {\"hookEventName\": \"PreToolUse\", \"permissionDecision\": \"allow\", \"permissionDecisionReason\": \"codeagent-wrapper auto-approved\"}}' || true",
            "timeout": 1
          }
        ]
      }
    ]
  }
}
```

</details>

## 實用工具

```bash
npx ccg-workflow menu
```

在選單中選擇 **「工具」**。

- **ccusage**：分析 Claude Code 使用量
- **CCometixLine**：狀態列工具，可顯示 Git 與使用量資訊

## 更新與解除安裝

```bash
# 更新
npx ccg-workflow@latest
npm install -g ccg-workflow@latest

# 解除安裝
npx ccg-workflow
npm uninstall -g ccg-workflow
```

如果你是用 `npx` 體驗版方式使用，通常直接重新執行最新版即可。  
如果你是全域安裝，記得一併更新或移除全域套件。

## 常見問題

### Codex CLI 0.80.0 結束後程序不會退出

在 `--json` 模式下，Codex 即使已完成輸出，也可能不會自動結束程序。

**解法**：把 `CODEAGENT_POST_MESSAGE_DELAY` 設為 `1`。詳見上方的[環境變數](#環境變數)說明。

## 實戰建議與使用心得

### 哪些情境最適合用 CCG？

| 情境 | 建議 |
|------|------|
| 改一行 CSS、修 typo | 直接用 Claude Code 就夠了 |
| 純前端頁面或元件 | 用 `/ccg:frontend` |
| 純後端 API 或服務 | 用 `/ccg:backend` |
| 需要同時改前後端的完整功能 | 用 `/ccg:workflow` 或 `/ccg:team-*` |
| 對架構要求很高、不希望 AI 自由猜測 | 用 `/ccg:spec-*` |

一個簡單判斷方式：**如果你覺得這次改動會影響 3 個以上檔案，就很值得試 CCG。**

### 沒裝 Codex CLI 或 Gemini CLI，可以先用嗎？

可以。CCG 的重點不只是模型分流，也包含流程紀律、指令封裝與 Claude 的最終審查。你可以先熟悉整個工作方式，再逐步把 Codex CLI 與 Gemini CLI 補上。

### 可以跟原本自己的工作流共存嗎？

可以，通常不會衝突：

- 所有指令都有 `/ccg:` 前綴
- CCG 的 skills 會安裝在 `~/.claude/skills/ccg/`
- 你可以只在大型任務時使用 CCG，日常小修改仍維持原本流程

### OPSX 真正的價值是什麼？

它最大的價值，是讓 AI **先理解限制，再開始實作**。

很多人遇到的問題不是 AI 不會寫程式，而是：

> AI 寫得出來，但不是你真正想要的架構或規格。

OPSX 的流程是：**需求 → 限制條件 → 計畫 → 實作**。  
這樣你可以在真正改程式之前，就先把方向校正好。

### Windows 使用者要注意什麼？

- 若互動式選單在你的終端機不穩定，可考慮改用非互動流程
- `codeagent-wrapper` 需要 `jq`
- 若 MCP 設定異常，可重新執行設定流程檢查

### 怎麼省 Claude token？

- 使用 `/ccg:codex-exec`，讓 Codex 主導執行，Claude 最後再審查
- 使用 Agent Teams 流程時，在階段之間搭配 `/clear`
- 先用 `/ccg:enhance` 把需求整理清楚，再進入規劃或實作

### UI / UX 類指令也很值得用

CCG 不只有核心開發流程，也有 20+ 個偏 UI / UX 精修的指令，例如：

```bash
/ccg:audit
/ccg:polish
/ccg:harden
/ccg:distill
```

這些指令很適合在前端專案的最後階段做整體品質整理。

## 參與貢獻

歡迎一起改進 CCG。詳細方式請參考 [CONTRIBUTING.md](./CONTRIBUTING.md)。

如果你想找容易上手的題目，可以先查看標記為 [`good first issue`](https://github.com/fengshao1227/ccg-workflow/labels/good%20first%20issue) 的議題。

## 貢獻者

<!-- readme: contributors -start -->
<table>
<tr>
    <td align="center"><a href="https://github.com/fengshao1227"><img src="https://avatars.githubusercontent.com/fengshao1227?v=4&s=100" width="100;" alt="fengshao1227"/><br /><sub><b>fengshao1227</b></sub></a></td>
    <td align="center"><a href="https://github.com/SXP-Simon"><img src="https://avatars.githubusercontent.com/SXP-Simon?v=4&s=100" width="100;" alt="SXP-Simon"/><br /><sub><b>SXP-Simon</b></sub></a></td>
    <td align="center"><a href="https://github.com/RebornQ"><img src="https://avatars.githubusercontent.com/RebornQ?v=4&s=100" width="100;" alt="RebornQ"/><br /><sub><b>RebornQ</b></sub></a></td>
    <td align="center"><a href="https://github.com/Sakuranda"><img src="https://avatars.githubusercontent.com/Sakuranda?v=4&s=100" width="100;" alt="Sakuranda"/><br /><sub><b>Sakuranda</b></sub></a></td>
    <td align="center"><a href="https://github.com/Mriris"><img src="https://avatars.githubusercontent.com/Mriris?v=4&s=100" width="100;" alt="Mriris"/><br /><sub><b>Mriris</b></sub></a></td>
    <td align="center"><a href="https://github.com/23q3"><img src="https://avatars.githubusercontent.com/23q3?v=4&s=100" width="100;" alt="23q3"/><br /><sub><b>23q3</b></sub></a></td>
    <td align="center"><a href="https://github.com/MrNine-666"><img src="https://avatars.githubusercontent.com/MrNine-666?v=4&s=100" width="100;" alt="MrNine-666"/><br /><sub><b>MrNine-666</b></sub></a></td>
</tr>
<tr>
    <td align="center"><a href="https://github.com/GGzili"><img src="https://avatars.githubusercontent.com/GGzili?v=4&s=100" width="100;" alt="GGzili"/><br /><sub><b>GGzili</b></sub></a></td>
</tr>
</table>
<!-- readme: contributors -end -->

## 致謝

- [cexll/myclaude](https://github.com/cexll/myclaude) — codeagent-wrapper
- [UfoMiao/zcf](https://github.com/UfoMiao/zcf) — Git 工具
- [GudaStudio/skills](https://github.com/GuDaStudio/skills) — 路由設計
- [ace-tool](https://linux.do/t/topic/1344562) — MCP 工具

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=fengshao1227/ccg-workflow&type=timeline&legend=top-left)](https://www.star-history.com/#fengshao1227/ccg-workflow&type=timeline&legend=top-left)

## 聯絡方式

- **X (Twitter)**：[@CCG_Workflow](https://x.com/CCG_Workflow) — 最新消息、示範與使用技巧
- **Email**：[fengshao1227@gmail.com](mailto:fengshao1227@gmail.com) — 贊助、合作或開發交流
- **Issues**：[GitHub Issues](https://github.com/fengshao1227/ccg-workflow/issues) — 回報 Bug 與提出功能建議
- **Discussions**：[GitHub Discussions](https://github.com/fengshao1227/ccg-workflow/discussions) — 問題討論與社群交流

## 授權

MIT

---

v2.1.11 | [Issues](https://github.com/fengshao1227/ccg-workflow/issues) | [參與貢獻](./CONTRIBUTING.md)
