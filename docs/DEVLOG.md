# OC Shimeji 開發紀錄（給後續 Claude Code Session 接手用）

> 最後更新：2026-11-02・版本 3.3.0（Android versionCode 33）
> 原始輸入：`backup/oc-shimeji-3_2-smooth.original.html`（3.2「smooth」單檔，1.4 MB，約 30 層疊加的 script/style 補丁）

---

## 0. 接手前必讀

1. **遊戲本體在 `web/`**，Android 直接把 `web/` 當 assets，**不要複製檔案**。
2. `web/js/legacy/*` 與 `web/css/legacy/*` 是 3.2 單檔「機械式拆分」的結果（保持原載入順序，行為完全相同，已用截圖比對）。
   - 檔名前綴數字 = 原本在單檔中的順序，**不要重新排序**。
   - 這些檔案之間共用全域 `const`（classic script 的全域詞法環境），新模組也可以直接使用 `Cfg`、`Chars`、`Home`、`Stage`、`Nav`、`Ov`、`openSheet`、`toast`、`ic`、`esc`、`el` 等。
3. **新功能請寫成 `web/js/modules/*.js` + `web/css/modules/*.css`，並在 `web/index.html` 最後的 modules 區段載入。** 不要再往 legacy 檔疊加補丁。
4. 每次修改後執行：
   ```bash
   NODE_PATH=$(npm root -g) node tools/smoke.js          # 7 個流程測試，全部要 ok
   cd android && ./gradlew assembleDebug testDebugUnitTest
   ```
   截圖會輸出在 `tools/out/`（已 gitignore）。

## 1. 架構總覽

### 1.1 既有系統（legacy，3.2 以前）——重要的全域物件
| 物件 | 所在檔案 | 用途 |
|---|---|---|
| `Cfg` (`Cfg.v` → localStorage `ocs.v1`) | 10-block | 主設定與大多數存檔（`save()` 防抖、`flush()` 立即寫入） |
| `Chars` + `DB`(IndexedDB `oc-shimeji`) | 10-block | 角色清單；示範角色的修改存在 `Cfg.v.overrides`，自創角色存在 IndexedDB |
| `Persona`, `SLIDERS`, `TRAITS`, `TONES` | 10-block | 性格滑桿、特質、說話方式 |
| `Stage`, `Ticker`, `Home`, `Nav`, `Ov`, `Settings`, `Backup`, `NewSheet`, `Ed` | 10-block | 舞台引擎、主迴圈、首頁、導覽、疊層堆疊、設定、備份、新增角色、編輯器 |
| `Eco` (`ocs.eco.v1`), `Econ`, `Wallet`, `Inv`, `Cat`, `Shop` | 10/21/31 | 星幣、交易收據去重 `Econ.pay(rid,...)`、扣款 `Wallet.spend(n)` |
| `OCSCommunity` (`Cfg.v.community`) | 35 | 多角色共同生活：`nodes`、`pair(a,b)` 關係、`state().selected` 在島上的角色 |
| `IsleWorld` / `IsleLife` (`Cfg.v.l29`) | 55 / 61 | 島嶼行為、需求 `needs(n)`、情緒、記憶 `memo(n,type,o)`、特質 `traitIds`、性格類型 `ptype` |
| `L30` | 63 | 目標、任務、技能 `gain(n,k,amt)`、收藏圖鑑 `SPEC` / `discover(cat,id,n)` / `found` |
| `L31` | 65 | 角色檔案卡、`setIsland(id,on)`、`control(id)`、快速狀態 |

### 1.2 3.3 新增模組
| 檔案 | 內容 | 存檔欄位 |
|---|---|---|
| `js/modules/perf.js` + `css/modules/perf.css` | 效能模式（高畫質/平衡/省電/自訂）：全域 rAF 排程器做真正的 FPS 上限、閒置降頻、渲染品質、陰影、天氣、粒子、環境動畫、角色 LOD、桌寵更新率、FPS 顯示；Ticker 改為分段步進，低 FPS 時模擬仍是即時速度 | `Cfg.v.perf` |
| `js/modules/native-bridge.js` + `css/modules/native.css` | `window.OCSNative`：桌寵選擇（角色卡「桌寵」按鈕、設定 → 桌面夥伴）、推送角色快照、套用桌面互動事件 | `Cfg.v.desk` |
| `js/modules/overlay-pet.js` + `overlay.html` + `css/modules/overlay.css` | Android 懸浮桌寵渲染頁（沿用遊戲的角色 SVG 與 CSS 動畫狀態） | — |
| `js/modules/onboarding.js` + `css/modules/onboarding.css` | 開場、新遊戲、創角、登場、互動式新手引導；設定中可重播 | `Cfg.v.ob` |
| `js/modules/world.js` + `css/modules/world.css` | 世界地圖與地點系統（`OCSWorld.LOC` 可擴充）：海灘、森林、咖啡館、圖書館 | `Cfg.v.world` |

`index.html` 的 `<head>` 內有一行在任何存檔寫入前記錄 `window.OCS_FIRST_RUN`（沒有 `ocs.v1` 也沒有 `ocs.eco.v1` = 新玩家）。

### 1.3 Android（詳見 `android/README.md`）
MainActivity(WebView) ⇄ `OCNative`(NativeBridge) ⇄ PetStore(檔案) ⇄ OverlayService ⇄ PetWindow×N(overlay.html) + PetBrain。

## 2. 本次 Session 完成事項（3.3）

### 第一階段：盤點與穩定性
- 完整盤點 3.2 單檔：67 個 script/style 區塊、資料鍵（`ocs.v1`、`ocs.eco.v1`、`ocs.items.v1`、`ocs.catalog.v1`、`ocs.room.v1`…、IndexedDB `oc-shimeji`、`oc-shimeji-art`）。原版無 console 錯誤。
- 拆分為可維護的 web/ 結構（`tools/split_legacy.py`，一次性），原檔備份於 `backup/`；`tools/build.py` 可重新打包單檔版到 `dist/`。
- 修正：3.2 的「桌面懸浮窗」開關永遠顯示關閉且無作用 → 換成真正的桌面夥伴管理；「探索」頁的「規劃中」夥伴生活分類（無功能）→ 換成可進入的世界地圖；「懸浮窗桌寵」標籤改為可使用。
- 發現的效能問題：`57-isle-271-talk-js` 有一個每格都在跑的 rAF 迴圈（每格 querySelectorAll）。現在被全域 FPS 排程器限制；**尚未重寫**（見待辦）。

### 第三階段：開場、新遊戲、創角、新手引導 ✅
流程：歡迎 → 約 20 秒開場動畫（Web Animations，可暫停/跳過/靜音，程序生成音樂）→ 選擇方式（示範夥伴／從零捏 OC／兩者／匯入）→ 示範夥伴多選或 OC 創角（外觀＋色輪即時預覽、名字/暱稱/代稱/生日、6 個性格滑桿＋最多 3 個特質＋即時性格描述、自稱/口頭禪/語氣、可測試開心/跳/走/睡）→ 依性格產生不同登場台詞的電影式登場（黑邊＋逐字對話）→ 12 步互動式引導（真的摸角色才前進、點狀態膠囊…）→ +100 星幣新生活禮物。
- 舊存檔：不顯示、標記 `ob.legacy`，不改變任何資料。
- 中途關閉：下次啟動從中斷階段繼續。
- 設定 →「開場與教學」可重播開場或教學（不改變角色名單）。

### 第四階段：Android 系統懸浮桌寵核心 ✅（建置與單元測試通過，未實機驗證）
- TYPE_APPLICATION_OVERLAY、前景服務 `specialUse`（Android 14+）、通知（暫停/隱藏/關閉）、POST_NOTIFICATIONS 請求、權限撤銷時自動停止。
- 最多 3 隻、各自獨立視窗、記住位置、螢幕關閉暫停、旋轉時依比例重新放置、在遊戲中自動隱藏（可關）。
- 行為：待機、走、跑、坐、睡、東張西望、跳、攀爬左右邊緣、懸掛、重力落下（重摔會暈）、拖曳拋擲；眨眼與呼吸疊加；多隻相遇會面對面打招呼。
- 互動：點擊＝摸摸（愛心＋台詞）、睡著時點擊＝叫醒、長按＝選單（狀態、摸摸、睡覺/叫醒、跳、集合、暫停、隱藏、開啟遊戲、關閉）。
- 資料：遊戲推送快照（外觀含匯入圖片轉 data URL、台詞、性格、需求、心情）；桌面事件回到遊戲時套用（親密度、每日任務撫摸數、社交需求、回憶、關係）。

### 第六階段（部分）：世界地圖與多地點 ✅ 4 個可進入地點
- 探索頁 → 插畫世界地圖，地點顯示「喜歡這裡的夥伴」、造訪次數、解鎖條件；地點詳情顯示活動、今日次數、收藏進度。
- 同行夥伴依性格特質＋滑桿＋過去在該地點的回憶自動選擇（`affinity()`）。
- 星砂海灘：釣魚（時機小遊戲，判定區隨海洋技能變大）、撿貝殼、看海發呆。
- 微光森林（造訪 1 次後解鎖）：採集、觀察生物（會飛走）、樹下休息。
- 雲朵咖啡館：點飲品（扣星幣、補水、心情）、兩位夥伴聊天（關係＋3）。
- 風鈴圖書館（造訪 3 次後解鎖）：閱讀（閱讀技能）、借書（藏書圖鑑）。
- 新增圖鑑分類：森林採集、生物觀察、圖書館藏書、咖啡館菜單；新增地點收藏。
- 每日次數上限＋`Econ.pay` 收據去重，避免無限刷錢；造訪/收藏/回憶全部存檔。

### 第八階段（部分）：效能模式 ✅
實測（無頭 Chromium）：高畫質 61 FPS、省電 31 FPS；自訂設定重新整理後保留；切換無需重啟。

## 3. 驗證結果
| 測試 | 結果 |
|---|---|
| `tools/smoke.js` boot / native / overlay / perf / firstrun / legacy / world | 7/7 ok，無 console 錯誤 |
| 驗收 1（新玩家完整流程）| ✅ firstrun：開場→暫停驗證→創角→選鄰居→登場→教學（真的摸）→重新整理不再出現 |
| 驗收 4（地圖→地點→活動→獎勵→保存）| ✅ world |
| 驗收 7（主 App ⇄ 桌寵）| ⚠️ 網頁端以模擬 bridge 驗證；原生端僅建置＋單元測試 |
| 驗收 8（效能模式）| ✅ perf |
| 驗收 10（舊存檔）| ✅ legacy |
| Android `assembleDebug` | ✅ app-debug.apk（約 2.8 MB） |
| Android `testDebugUnitTest` | ✅ PetBrainTest 5/5 |

### 實機驗證清單（需要 Android 手機，本環境無法執行）
1. 安裝 APK → 首次開啟顯示開場；完成創角後重開不再顯示。
2. 角色頁點「桌寵」→ 設定 → 桌面夥伴 →「讓夥伴到桌面」→ 系統要求「顯示在其他應用程式上層」→ 允許 → 返回後自動啟動。
3. 回到桌面：角色出現、會走/爬/睡；點擊有愛心與台詞；長按出現選單；拖曳拋出會落地。
4. 開啟其他 App：角色仍在上方；角色視窗以外的區域可以正常操作。
5. 通知列：暫停/隱藏/關閉都有效；關閉螢幕再開啟後恢復。
6. 旋轉螢幕：角色落到新的地面。
7. 回到遊戲：桌寵隱藏（預設）；摸過的次數出現在 toast、角色回憶與親密度。
8. 在系統設定撤銷懸浮權限 → 服務自行停止，不會崩潰。
9. Android 13+：通知權限要求；Android 14+：前景服務類型正確。

## 4. 尚未完成（依優先順序，請誠實延續）
**第二階段（資訊架構）**——3.1 已完成大部分（角色檔案卡、檔案/編輯分工、快速狀態）；仍需：
- 確認飲食喜好編輯是否已完全移到編輯器（3.1 有 `removeDupTaste`，需再檢查）、時間天氣元件去重的最終確認、底部導覽是否還有獨立背包入口。

**第四階段**
- 實機驗證（上方清單）。
- 桌寵：多幀 Sprite Sheet 匯入角色的逐格動畫（目前用主圖）、桌寵之間的追逐/一起睡、通知小工具（Widget）。
- 原生端讀取遊戲中「勿擾時段」。

**第五階段（性格與成長）**——2.9/3.0 已有特質庫、小怪癖、需求、情緒、願望、技能、後天習慣提議（`IsleLife.discList/accept/decline/later`）。待做：審視提議 UI 是否有「鎖定特質」「關閉建議」選項並補齊；離線模擬的長時間合理化。

**第六階段**
- 地點：中央廣場（市集/節慶）、商店街（把現有商店搬到地點）、住宅區（拜訪朋友家）、活動中心（迷你遊戲）、旅行地點。
- 角色「自主前往」地點：目前是玩家帶隊＋依性格選同行者；尚未做角色離開小島獨自去別的地點的行程系統。
- 地點的天氣/晝夜差異、季節收藏。

**第七階段**：節慶與活動日曆、戀愛關係的玩家確認流程檢查、更多迷你遊戲、商店每日精選與工坊作品上架流程的端對端測試（驗收 5、6）。

**第八階段**
- 重寫 `57-isle-271-talk-js` 的常駐 rAF 迴圈（改為事件驅動）。
- 檢查並整併 legacy 中重複的 CSS 覆寫層（`01-block` 與 `isle-26/27` 有大量 `!important` 覆寫）。
- 音效系統、深色模式下新畫面的細節調整（基本已使用設計 token）。
- 天氣使用 open-meteo + 地理定位：Android 版未授權定位，會自動退回本機模擬天氣（不需 INTERNET 權限）。

## 5. 擴充指南
- **新增地點**：在 `world.js` 的 `LOC` 加一筆（座標、偏好特質 `tr`、技能、活動 id 列表、解鎖條件），在 `SCENE` 加場景 SVG、`LINES` 加台詞，活動寫在 `ACT` + `runAct()`。收藏可加到 `installCodex()`。
- **新增效能選項**：`perf.js` 的 `PRESET` 加鍵 → 套用到 `applyCss()` 的 `data-*` → 在 `perf.css` 寫規則。
- **桌寵新動作**：`PetBrain.S` 加狀態與 `pose()` 名稱 → `overlay-pet.js` 的 `STATE/BEH` 對應 → `overlay.css` 加動畫；並在 `PetBrainTest` 加測試。

---

# 3.4 更新（2026-11-03）：WebGL 3D 首頁、全新角色與生活模擬

## 為什麼重寫首頁
3.2 的首頁是約 30 層疊加的 DOM 補丁：7,000+ 節點、約 350 個同時執行的 CSS 動畫，多個模組每格互相改寫 style
（雲 `.cd`、陰影、角色深度、鏡頭平面）。量測：主執行緒 5 秒內任務 4.86 秒（幾乎滿載）→ 閃爍、破圖、掉幀的根本原因。
因此首頁改用 WebGL（Three.js r158，`web/vendor/three-r158.min.js`，本地檔，離線與 Android 可用）。
舊版 DOM 舞台與舊共同生活模擬已停用（`main.js` 覆寫 `Home.visible`、`OCSCommunity.active/sync`），但資料層全部沿用。

## 新檔案（`web/js/isle/*`、`web/css/isle/isle.css`）
| 檔案 | 內容 |
|---|---|
| `engine.js` | `window.Isle3D`：渲染器、天空漸層著色器、日夜（依現實時間或自訂）、陽光/半球光、快取陰影（只在需要時更新）、水面著色器（淺深漸層、浪花、反光）、雲、遠方島嶼、雨雪粒子、鏡頭（拖曳旋轉、雙指縮放平移、跟隨）、FPS 上限、POI/障礙物 |
| `props.js` | 低多邊形樹、灌木、岩石、instanced 花海與草叢、步道石、柵欄、碼頭、小船、路燈（夜晚發光）、長椅、營火、信箱、花圃、蓮葉、蘆葦；風吹搖擺 |
| `cat.js` | 3D 貓角色：多面切割頭部 + 臉部貼圖（眼/眉/嘴/腮紅/花紋依捏臉資料繪製、表情切換、眨眼）、耳朵、分段尾巴、服飾（星夢/葉風/暖眠 + 編輯器飾品）、骨架動畫（idle/walk/run/sit/sleep/eat/talk/happy/wave/sad/angry/sick/dance/fish/read/garden/hug/petted/held…）平滑混合、轉彎傾斜、加減速慣性；匯入圖片角色以 billboard 呈現 |
| `life.js` | `window.Isle3DLife`：效用 AI 生活模擬（需求×性格×特質×時間×天氣×地點回憶），社交成功/失敗、緊張度、吵架、絕交、道歉與和好、勸和；生病（淋雨感冒、吃太撐肚子痛、過勞）、傳染、照顧、康復；嫉妒；島嶼日誌；與舊資料相容（`IsleLife.X().needs`、`memo`、`OCSCommunity.pair`、`L30.gain`、L31 檔案卡讀到的 `nodes`） |
| `house.js` | `window.Isle3DHouse`：三款房子（綠屋頂小屋、蘑菇小屋、雙層木屋）、擺放模式（拖曳、旋轉、合法位置檢查）、室內場景（床/餐桌/沙發/書櫃/廚房/燈/盆栽）與家具使用 |
| `ui.js` | `window.Isle3DUI`：參考圖版面 HUD、6 格導覽、滑動摸摸、點選切換操控 + 環形互動選單、角色間互動（聊天/擁抱/玩/勸和/吵架）、點地移動、背包（沿用舊口味系統）、任務、時間天氣面板、拍照模式、日誌、佈置、室內 HUD |
| `preview.js` | 創角/選夥伴/選房子用的小型 3D 預覽（可拖曳旋轉） |
| `main.js` | 掛載 3D 首頁、停用舊舞台、舊存檔自動配置預設房子 |

## 修正的問題
- 任務無法領取：任務卡呼叫舊 `Eco.claim`（只加星幣、不標記 `Econ` 委託），導致委託永遠「可領取」。現在 `Eco.ready/claim/prog` 都改走 `Econ.claimJob`，任務卡開啟統一任務面板。
- 舊版 emoji 轉圖示的 MutationObserver 會改寫新 UI → 新元件加上 `data-emoji-keep`。
- 餵食：舊口味系統要求舞台節點在文件中，替身舞台改為隱藏但掛載的容器；吃下/婉拒依實際結果顯示。

## 開場流程（3.4）
歡迎 → 3D 空拍運鏡開場（可暫停/跳過/靜音）→ 選擇方式 → 3D 創角（可「直接完成」）→ 選鄰居（3D 預覽）→ 選房子（3D 預覽）→ 在島上擺放 → 角色從家門走出、依性格打招呼 → 12 步實作教學（滑動摸摸、點選、點地移動…）→ +100 星幣。

## 驗證（3.4）
- `isle`：點選切換操控、環形選單、滑動摸摸（親密度上升）、點地移動、委託領取（星幣增加）、餵食、進屋使用床、吵架與感冒寫入日誌、天氣切換、重新整理後保留
- `firstrun`：完整新玩家流程（含房屋擺放與教學實作步驟）
- 其他：boot / native / overlay / perf / legacy / world

## 尚待處理（3.4 之後）
- 探索地點（world.js）仍是 2D 場景，可改用 3D 引擎製作室外地點。
- 3D 角色尚未支援逐格動畫素材；匯入圖片角色以看板呈現。
- 角色檔案頁/工坊/商店等次頁仍是舊 UI 風格（已可用，尚未全面重新設計）。
- 戀愛關係的玩家確認流程尚未接到新模擬。
- 實機效能：無頭瀏覽器（軟體 GPU）單幀約 8 ms；仍需 Android 實機量測。
