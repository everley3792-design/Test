# OC Shimeji｜我的夥伴小世界

以 Android 手機為主要平台的原創角色（OC）桌寵 × 生活模擬遊戲。

| 路徑 | 內容 |
|---|---|
| `web/` | 遊戲本體（HTML/CSS/JS，可直接用瀏覽器開啟 `web/index.html` 遊玩） |
| `web/js/legacy/`, `web/css/legacy/` | 3.2 版單檔拆分出的既有系統（依原順序載入，行為不變） |
| `web/js/modules/`, `web/css/modules/` | 3.3 起的新模組：原生橋接、效能模式、開場與新手引導、世界地圖 |
| `web/overlay.html` | Android 系統懸浮桌寵的角色渲染頁 |
| `android/` | Android Studio 專案（Kotlin、WebView、系統懸浮桌寵前景服務） |
| `tools/` | `build.py`（打包成單一 HTML）、`smoke.js` + `scenarios.js`（無頭瀏覽器流程測試） |
| `backup/` | 使用者提供的 3.2 原始單檔備份 |
| `docs/DEVLOG.md` | 開發紀錄、架構說明、已完成／未完成事項（後續 Session 請先讀） |

快速指令：

```bash
python3 tools/build.py                       # → dist/oc-shimeji.html（單檔版）
NODE_PATH=$(npm root -g) node tools/smoke.js # 所有流程測試
cd android && ./gradlew assembleDebug        # → android/app/build/outputs/apk/debug/app-debug.apk
cd android && ./gradlew testDebugUnitTest    # 桌寵行為單元測試
```
