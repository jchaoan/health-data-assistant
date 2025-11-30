# 健康數據助理

AI 智慧營養追蹤與健康數據管理系統

## 功能特色

- **智慧食物辨識與營養分析** - 採用 YOLOv8 深度學習模型進行食物偵測，結合 Google Gemini 多模態 AI 進行深度分析，不僅能辨識食物種類，更能智慧估算份量、計算熱量及營養成分，提供完整的飲食建議
- **智慧營養諮詢** - RAG 知識檢索系統搭配專業營養知識庫，隨時解答健康與飲食問題
- **飲食記錄追蹤** - 自動記錄每日飲食，生成營養攝取報表與趨勢分析
- **運動建議** - 根據飲食攝取與個人目標，提供個人化運動建議
- **多人分析模式** - 支援單人與多人分餐計算，適合家庭或聚餐場景

## 系統架構

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (PWA)                          │
│                      Vercel 部署 / HTTPS                        │
├─────────────────────────────────────────────────────────────────┤
│  welcome │ login │ register │ dashboard │ food-detect │ chat   │
│  diet_records │ statistics │ exercise │ settings │ profile     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Flask)                          │
│                   Google Cloud Run 部署                         │
├─────────────────────────────────────────────────────────────────┤
│  Services:                                                      │
│  ├── FirebaseService      (認證與資料存取)                      │
│  ├── LocalRAGService      (本地知識檢索)                        │
│  ├── PersonalizedRAGService (個人化 RAG)                        │
│  ├── UserContextService   (用戶上下文管理)                      │
│  ├── NutritionLookupService (營養資料查詢)                      │
│  └── ExerciseService      (運動建議生成)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │   YOLOv8    │ │   Gemini    │ │  Firebase   │
        │  食物偵測   │ │  多模態 AI  │ │  Firestore  │
        └─────────────┘ └─────────────┘ └─────────────┘
```

## 技術架構

| 層級 | 技術 |
|------|------|
| **前端** | HTML / CSS / JavaScript / PWA |
| **後端** | Flask / Python |
| **AI 模型** | YOLOv8 / Google Gemini 1.5 Flash |
| **知識檢索** | RAG (Retrieval-Augmented Generation) |
| **資料庫** | Firebase Firestore |
| **認證** | Firebase Authentication |
| **部署** | Vercel (前端) / Google Cloud Run (後端) |

## 核心 AI 流程

```
拍照/上傳圖片
    ↓
YOLOv8 食物偵測（定位與分類）
    ↓
Firebase 營養資料庫查詢
    ↓
Google Gemini 多模態分析（份量估算、營養計算、辨識補漏）
    ↓
RAG 知識檢索（營養知識比對）
    ↓
生成完整營養報告與飲食建議
```

## API 端點

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/analyze` | POST | 食物辨識與營養分析 |
| `/api/chat` | POST | AI 營養諮詢對話 |
| `/api/diet-records` | GET/POST | 飲食記錄 CRUD |
| `/api/statistics` | GET | 營養統計資料 |
| `/api/exercise/recommendation` | GET | 個人化運動建議 |
| `/api/exercise/history` | GET | 運動建議歷史 |
| `/api/exercise/feedback` | POST | 運動建議回饋 |
| `/api/user/profile` | GET | 用戶個人資料 |
| `/verify-token` | POST | Firebase Token 驗證 |
| `/health` | GET | 服務健康檢查 |

## 資料庫結構 (Firestore)

```
Firestore
├── users/                    # 用戶基本資料
│   └── {userId}/
│       └── food_diary/       # 飲食日記子集合
├── member/                   # 用戶健康數據
│   └── {userId}/
│       ├── exercise_records/ # 運動記錄
│       ├── exercise_goals/   # 運動目標
│       └── meal_records/     # 餐點記錄
├── predictions/              # AI 辨識記錄
├── chatHistory/              # 聊天記錄
├── exercise_history/         # 運動建議歷史
├── food_data/                # 食物營養資料庫
└── nutritionKnowledge/       # 營養知識庫
```

## 頁面結構

| 路徑 | 頁面 | 說明 |
|------|------|------|
| `/welcome` | 歡迎頁 | 首頁導覽 |
| `/login` | 登入 | Email/Google 登入 |
| `/register` | 註冊 | 新用戶註冊 |
| `/verify-email` | 信箱驗證 | Email 驗證流程 |
| `/forgot-password` | 忘記密碼 | 密碼重置 |
| `/profile-setup` | 資料設定 | 初次登入設定 |
| `/dashboard` | 儀表板 | 今日營養總覽 |
| `/food-detect` | 食物辨識 | AI 拍照分析 |
| `/diet-records` | 飲食記錄 | 歷史記錄管理 |
| `/chat` | AI 諮詢 | 營養師對話 |
| `/statistics` | 統計分析 | 營養趨勢圖表 |
| `/exercise` | 運動建議 | 個人化運動計畫 |
| `/settings` | 設定 | 帳號與偏好設定 |

## 安全性

### Firebase Security Rules

- 所有資料存取需要身份驗證
- 用戶只能存取自己的資料
- 營養資料庫為唯讀
- 預設拒絕所有未定義的存取

### 認證機制

- Firebase Authentication
- Email/Password 登入
- Google OAuth 2.0 登入
- JWT Token 驗證

## 安裝與部署

### 本地開發

```bash
# 進入專案目錄
cd frontend

# 啟動本地伺服器
python -m http.server 8080

# 開啟瀏覽器訪問
http://localhost:8080/welcome.html
```

### Vercel 部署

1. Fork 或 Clone 此專案到你的 GitHub
2. 到 [Vercel](https://vercel.com) 連結 GitHub
3. Import 專案並點擊 Deploy
4. 到 Firebase Console 新增授權網域

### 後端部署 (Cloud Run)

```bash
# 部署到 Google Cloud Run
gcloud run deploy bentoai-api --source . --region asia-east1 --allow-unauthenticated
```

## Firebase 設定

1. **Authentication** - 啟用 Email/Password 和 Google 登入
2. **Authorized domains** - 新增部署網域
3. **Firestore** - 設定安全規則
4. **Storage** - 設定檔案上傳規則

## PWA 功能

- 可安裝到手機主畫面
- 支援離線瀏覽
- 推播通知（用餐提醒）
- 全螢幕體驗
- 響應式設計

## UML 設計文件

本專案包含完整的 UML 設計文件：

| 圖表類型 | 數量 | 說明 |
|----------|------|------|
| Use Case Diagram | 1 | 系統使用案例 |
| Class Diagram | 1 | 類別結構 |
| Sequence Diagram | 15 | 互動流程 |
| Activity Diagram | 13 | 活動流程 |
| Communication Diagram | 15 | 物件協作 |
| Component Diagram | 2 | 系統架構 |
| ER Diagram | 1 | 資料庫結構 |

## 專案結構

```
health-data-assistant/
├── frontend/
│   ├── welcome.html          # 首頁
│   ├── login.html            # 登入頁
│   ├── register.html         # 註冊頁
│   ├── dashboard.html        # 儀表板
│   ├── food-detect.html      # 食物辨識
│   ├── diet_records.html     # 飲食記錄
│   ├── chat.html             # AI 諮詢
│   ├── statistics.html       # 統計頁
│   ├── exercise.html         # 運動建議
│   ├── settings.html         # 設定頁
│   ├── css/                  # 樣式檔
│   ├── js/                   # JavaScript
│   └── images/               # 圖片資源
├── backend/
│   ├── app.py                # Flask 主程式
│   ├── services/             # 服務模組
│   └── utils/                # 工具函數
└── uml_diagrams/             # UML 設計圖
```

## 授權

此專案為靜宜大學資訊管理學系畢業專題作品

---

Made with ❤️ by 健康數據助理團隊
