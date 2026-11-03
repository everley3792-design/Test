# OC Shimeji — Android 專案

## 需求
- JDK 17 以上（已在 JDK 21 驗證）
- Android SDK：platform `android-35`、build-tools `35.0.0`
- 不需要另外複製網頁檔：`app/build.gradle.kts` 直接把 `../web` 設為 assets 來源

## 建置 APK
```bash
cd android
echo "sdk.dir=/path/to/Android/sdk" > local.properties   # Android Studio 會自動產生
./gradlew assembleDebug          # 除錯版 → app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleRelease        # 目前以 debug key 簽署，方便測試安裝
./gradlew testDebugUnitTest      # PetBrain 行為/物理單元測試
```
正式上架前請建立自己的 keystore，並在 `app/build.gradle.kts` 的 `signingConfigs` 改用它。

## 架構
| 檔案 | 職責 |
|---|---|
| `MainActivity.kt` | 全螢幕 WebView（`WebViewAssetLoader` 提供 `https://appassets.androidplatform.net/assets/`），安全區域 insets、返回鍵、檔案選擇器、生命週期 → `OCApp.onPause/onResume` |
| `Web.kt` | WebView 安全設定（禁止 file 存取、禁止外部網址在 App 內開啟） |
| `NativeBridge.kt` | 唯一暴露給網頁的 `window.OCNative`：懸浮權限、啟停桌寵、同步角色快照、設定、讀取桌面互動事件、存檔下載 |
| `PetStore.kt` | 遊戲與懸浮服務共用的檔案儲存（原子寫入）：`pets.json`、`overlay_settings.json`、`pet_events.json`、位置 |
| `overlay/OverlayService.kt` | 前景服務（`specialUse`），管理所有桌寵視窗、通知操作、螢幕關閉/旋轉/權限撤銷、多角色互動 |
| `overlay/PetWindow.kt` | 單一桌寵：緊貼角色的 `TYPE_APPLICATION_OVERLAY` 視窗 + 透明 WebView（`overlay.html`）、觸控（點擊/長按/拖曳拋擲）、對話氣泡視窗 |
| `overlay/PetBrain.kt` | Shimeji 式行為與物理：走、跑、坐、睡、看、跳、攀爬螢幕邊緣、懸掛、重力落下、拖曳與拋擲；受性格與精力影響 |

### 資料一致性
遊戲是唯一的模擬來源。桌寵只「顯示」遊戲推送的快照（外觀、台詞、性格、需求、心情），
桌面上的互動（摸摸、搬動、桌寵相遇）寫入事件佇列，遊戲回到前景時一次套用到親密度、
需求、回憶與關係，避免主 App 與桌寵重複模擬或互相覆蓋。

### 觸控穿透
每隻桌寵是一個緊貼角色大小的小視窗（`FLAG_NOT_TOUCH_MODAL`），視窗外的觸控直接交給下方 App。
對話氣泡是 `FLAG_NOT_TOUCHABLE` 且 alpha 0.8 的獨立視窗（Android 12+ 的不受信任觸控規則要求 ≤ 0.8 才能穿透）。

## 驗證狀態
- ✅ `assembleDebug` 建置成功；`testDebugUnitTest` 5/5 通過
- ✅ 網頁端以模擬 `OCNative` 測試：選擇桌寵、推送快照、套用桌面事件
- ⚠️ **尚未在實機或模擬器上測試**（建置環境沒有 KVM，無法執行 Android 模擬器）。
  首次安裝後請依 `docs/DEVLOG.md` 的「實機驗證清單」逐項確認。
