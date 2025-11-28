# 健康數據助理

AI 智慧營養追蹤與健康數據管理系統

## 功能特色

- **智慧食物辨識** - 採用 YOLOv8 深度學習模型，可辨識超過 25 種台灣常見食物
- **AI 營養分析** - 結合 Google Gemini 多模態 AI，提供詳細的營養成分分析
- **智慧營養諮詢** - RAG 知識檢索系統搭配專業營養知識庫
- **飲食記錄追蹤** - 自動記錄每日飲食，生成營養攝取報表
- **運動建議** - 根據飲食攝取提供個人化運動建議
- **多人分析模式** - 支援單人與多人分餐計算

## 技術架構

| 前端 | 後端 | AI 模型 | 資料庫 |
|------|------|---------|--------|
| HTML/CSS/JS | Flask | YOLOv8 | Firebase |
| PWA | Python | Google Gemini | Firestore |
| Vercel | BentoML | RAG | |

## 頁面結構

```
/                 - 首頁（歡迎頁面）
/login            - 登入
/register         - 註冊
/verify-email     - 信箱驗證
/profile-setup    - 個人資料設定
/dashboard        - 儀表板
/index            - 食物辨識與分析
/chat             - AI 營養師聊天室
/diet-records     - 飲食記錄
/statistics       - 統計分析
/exercise         - 運動建議
/settings         - 帳號設定
/install          - PWA 安裝說明
```

## 安裝與部署

### 本地開發

```bash
# 進入專案目錄
cd frontend

# 啟動本地伺服器
python -m http.server 8080

# 開啟瀏覽器訪問
http://localhost:8080/public/welcome.html
```

### Vercel 部署

1. Fork 或 Clone 此專案到你的 GitHub
2. 到 [Vercel](https://vercel.com) 連結 GitHub
3. Import 專案並點擊 Deploy
4. 到 Firebase Console 新增授權網域

## Firebase 設定

需要在 Firebase Console 設定：

1. **Authentication** - 啟用 Email/Password 和 Google 登入
2. **Authorized domains** - 新增部署網域
3. **Firestore** - 設定安全規則

## PWA 功能

- 可安裝到手機主畫面
- 支援離線瀏覽
- 推播通知（用餐提醒）
- 全螢幕體驗

## 授權

此專案為畢業專題作品

---

Made with ❤️ by 健康數據助理團隊
