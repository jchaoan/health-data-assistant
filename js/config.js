/**
 * BentoAI 前端配置
 * 統一管理 API 端點和環境設定
 */

// API 基礎 URL - 根據環境自動切換
const API_CONFIG = {
    // 開發環境
    development: {
        baseUrl: 'http://localhost:5000',
        timeout: 30000
    },
    // 生產環境 - Cloud Run URL
    production: {
        baseUrl: 'https://bentoai-api-30594327640.asia-east1.run.app',
        timeout: 60000
    }
};

// 自動檢測環境
const isDevelopment = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';

const ENV = isDevelopment ? 'development' : 'production';
const CONFIG = API_CONFIG[ENV];

// API 端點定義
const API_ENDPOINTS = {
    // 分析
    analyze: `${CONFIG.baseUrl}/api/analyze`,

    // 聊天
    chat: `${CONFIG.baseUrl}/api/chat`,

    // 飲食記錄
    dietRecords: `${CONFIG.baseUrl}/api/diet-records`,

    // 統計
    statistics: `${CONFIG.baseUrl}/api/statistics`,
    fixNutritionData: `${CONFIG.baseUrl}/api/fix-nutrition-data`,

    // 資料管理
    clearAllRecords: `${CONFIG.baseUrl}/api/diet-records/clear-all`,

    // 用戶
    userProfile: `${CONFIG.baseUrl}/api/user/profile`,
    verifyToken: `${CONFIG.baseUrl}/verify-token`,

    // 運動
    exerciseRecommendation: `${CONFIG.baseUrl}/api/exercise/recommendation`,
    exerciseQuickTips: `${CONFIG.baseUrl}/api/exercise/quick-tips`,
    exerciseHistory: `${CONFIG.baseUrl}/api/exercise/history`,
    exerciseFeedback: `${CONFIG.baseUrl}/api/exercise/feedback`,
    exerciseProgress: `${CONFIG.baseUrl}/api/exercise/progress`,

    // 健康檢查
    health: `${CONFIG.baseUrl}/health`,
    metrics: `${CONFIG.baseUrl}/api/metrics`
};

// 安全地取得 ID Token（從 Firebase Auth，不使用 localStorage）
const getIdTokenSafe = async () => {
    // 檢查 Firebase 是否已初始化
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('Firebase 尚未初始化');
        return null;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        return null;
    }

    try {
        // 強制刷新 token 以確保有效
        return await user.getIdToken(true);
    } catch (error) {
        console.error('取得 ID Token 失敗:', error);
        return null;
    }
};

// API 請求輔助函數（安全版本）
const apiRequest = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: CONFIG.timeout
    };

    // 合併選項
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    // 安全地添加認證 Token（從 Firebase Auth 動態取得）
    if (!finalOptions.headers['Authorization']) {
        const idToken = await getIdTokenSafe();
        if (idToken) {
            finalOptions.headers['Authorization'] = `Bearer ${idToken}`;
        }
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), finalOptions.timeout);

        const response = await fetch(endpoint, {
            ...finalOptions,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('請求超時，請稍後再試');
        }
        throw error;
    }
};

// 導出配置
window.BentoAI = {
    CONFIG,
    API: API_ENDPOINTS,
    request: apiRequest,
    getIdToken: getIdTokenSafe,
    ENV
};

console.log(`🍱 BentoAI 前端已載入 (${ENV} 模式)`);
