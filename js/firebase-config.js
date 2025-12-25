/**
 * BentoAI Firebase 共用配置
 * 集中管理 Firebase 設定，避免 API Key 散落各處
 */

// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyCk4GY-VkG4dd_zXP5HZQDlZbjdY0k0img",
    authDomain: "fooddata-92fa8.firebaseapp.com",
    projectId: "fooddata-92fa8",
    storageBucket: "fooddata-92fa8.firebasestorage.app",
    messagingSenderId: "459965557703",
    appId: "1:459965557703:web:6a16b3937935219eb887e2",
    measurementId: "G-R16CYV7QC2"
};

// API 端點
const API_BASE_URL = 'https://bentoai-api-278768520764.asia-east1.run.app';

// 初始化 Firebase（如果尚未初始化）
function initFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    return {
        auth: firebase.auth(),
        db: firebase.firestore()
    };
}

// 安全地取得 ID Token（不存放在 localStorage）
async function getIdToken() {
    const user = firebase.auth().currentUser;
    if (!user) {
        throw new Error('用戶未登入');
    }
    return await user.getIdToken(true); // true = 強制刷新
}

// 帶有認證的 API 請求
async function authenticatedFetch(url, options = {}) {
    try {
        const idToken = await getIdToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        return response;
    } catch (error) {
        console.error('API 請求失敗:', error);
        throw error;
    }
}

// 導出給全域使用
window.BentoAIFirebase = {
    config: firebaseConfig,
    apiBaseUrl: API_BASE_URL,
    init: initFirebase,
    getIdToken,
    authenticatedFetch
};
