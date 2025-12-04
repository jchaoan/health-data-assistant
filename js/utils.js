/**
 * BentoAI 共用工具函數
 */

// 設定存儲鍵
const BENTOAI_SETTINGS_KEY = 'bentoai_settings';

// 取得應用程式設定
function getAppSettings() {
    const saved = localStorage.getItem(BENTOAI_SETTINGS_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        mealReminder: false,
        goalNotification: false,
        darkMode: false,
        unit: 'metric'
    };
}

// 儲存應用程式設定
function saveAppSettings(settings) {
    localStorage.setItem(BENTOAI_SETTINGS_KEY, JSON.stringify(settings));
}

// 檢查是否使用英制
function isImperialUnit() {
    return getAppSettings().unit === 'imperial';
}

// 單位轉換：身高
function convertHeight(valueCm, toImperial = null) {
    const useImperial = toImperial !== null ? toImperial : isImperialUnit();

    if (useImperial) {
        // cm 轉換為 ft'in"
        const totalInches = valueCm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}'${inches}"`;
    }
    return valueCm;
}

// 單位轉換：體重
function convertWeight(valueKg, toImperial = null) {
    const useImperial = toImperial !== null ? toImperial : isImperialUnit();

    if (useImperial) {
        // kg 轉換為 lb
        return (valueKg * 2.205).toFixed(1);
    }
    return valueKg;
}

// 反向轉換：英制身高轉公制
function convertHeightToMetric(feet, inches) {
    const totalInches = (feet * 12) + inches;
    return Math.round(totalInches * 2.54);
}

// 反向轉換：英制體重轉公制
function convertWeightToMetric(valueLb) {
    return (valueLb / 2.205).toFixed(1);
}

// 取得身高單位標籤
function getHeightUnit() {
    return isImperialUnit() ? '' : 'cm';
}

// 取得體重單位標籤
function getWeightUnit() {
    return isImperialUnit() ? 'lb' : 'kg';
}

// 取得身高輸入提示
function getHeightPlaceholder() {
    return isImperialUnit() ? "例如：5'10\"" : '例如：170';
}

// 取得體重輸入提示
function getWeightPlaceholder() {
    return isImperialUnit() ? '例如：154' : '例如：70';
}

// 格式化身高顯示
function formatHeight(valueCm) {
    if (!valueCm) return '-';
    const converted = convertHeight(valueCm);
    const unit = getHeightUnit();
    return unit ? `${converted}${unit}` : converted;
}

// 格式化體重顯示
function formatWeight(valueKg) {
    if (!valueKg) return '-';
    const converted = convertWeight(valueKg);
    const unit = getWeightUnit();
    return `${converted}${unit}`;
}

// 套用深色模式
function applyDarkMode() {
    const settings = getAppSettings();
    if (settings.darkMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
    }
}

// 頁面載入時自動套用深色模式
document.addEventListener('DOMContentLoaded', applyDarkMode);

// 顯示 Toast 訊息（支援不同類型）
// type: 'success' | 'error' | 'warning' | 'info' | 'default'
function showToast(message, type = 'default', duration = 3000) {
    // 相容舊用法：如果 type 是數字，當作 duration
    if (typeof type === 'number') {
        duration = type;
        type = 'default';
    }

    // 移除舊的 toast
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();

    // 類型對應的圖示和顏色
    const typeConfig = {
        success: { icon: '✅', bg: 'linear-gradient(135deg, #27ae60, #2ecc71)', color: '#fff' },
        error: { icon: '❌', bg: 'linear-gradient(135deg, #e74c3c, #c0392b)', color: '#fff' },
        warning: { icon: '⚠️', bg: 'linear-gradient(135deg, #f39c12, #e67e22)', color: '#fff' },
        info: { icon: 'ℹ️', bg: 'linear-gradient(135deg, #3498db, #2980b9)', color: '#fff' },
        default: { icon: '', bg: 'rgba(0,0,0,0.85)', color: '#fff' }
    };

    const config = typeConfig[type] || typeConfig.default;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
        ${config.icon ? `<span class="toast-icon">${config.icon}</span>` : ''}
        <span class="toast-text">${message}</span>
        <span class="toast-close" onclick="this.parentElement.remove()">✕</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${config.bg};
        color: ${config.color};
        padding: 14px 20px;
        border-radius: 12px;
        font-size: 14px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        animation: toastSlideIn 0.3s ease, toastFadeOut 0.3s ease ${duration - 300}ms forwards;
        max-width: 90%;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// 快捷方法
function showSuccess(message, duration = 3000) { showToast(message, 'success', duration); }
function showError(message, duration = 4000) { showToast(message, 'error', duration); }
function showWarning(message, duration = 3500) { showToast(message, 'warning', duration); }
function showInfo(message, duration = 3000) { showToast(message, 'info', duration); }

// 確保 Toast 動畫 CSS 存在
(function addToastStyles() {
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastSlideIn {
                0% { opacity: 0; transform: translateX(-50%) translateY(30px); }
                100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes toastFadeOut {
                0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
            .toast-message .toast-icon { font-size: 18px; }
            .toast-message .toast-text { flex: 1; }
            .toast-message .toast-close {
                cursor: pointer;
                opacity: 0.7;
                font-size: 12px;
                padding: 2px 6px;
                margin-left: 5px;
            }
            .toast-message .toast-close:hover { opacity: 1; }
        `;
        document.head.appendChild(style);
    }
})();

// ========== 骨架屏 (Skeleton Screen) ==========

// 添加骨架屏樣式
(function addSkeletonStyles() {
    if (!document.getElementById('skeleton-styles')) {
        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = `
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeletonShimmer 1.5s infinite;
                border-radius: 8px;
            }

            @keyframes skeletonShimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .skeleton-card {
                background: white;
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 15px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }

            .skeleton-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }

            .skeleton-title {
                height: 20px;
                width: 60%;
                margin-bottom: 10px;
            }

            .skeleton-text {
                height: 14px;
                width: 80%;
                margin-bottom: 8px;
            }

            .skeleton-text-short {
                height: 14px;
                width: 40%;
            }

            .skeleton-image {
                width: 100%;
                height: 150px;
                border-radius: 10px;
                margin-bottom: 15px;
            }

            .skeleton-btn {
                height: 40px;
                width: 120px;
                border-radius: 20px;
            }

            /* 深色模式骨架屏 */
            body.dark-mode .skeleton {
                background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
                background-size: 200% 100%;
            }

            body.dark-mode .skeleton-card {
                background: #1e1e1e;
            }
        `;
        document.head.appendChild(style);
    }
})();

// 建立骨架屏卡片 HTML
function createSkeletonCard(type = 'default') {
    const templates = {
        // 飲食記錄卡片骨架
        'diet-record': `
            <div class="skeleton-card">
                <div style="display: flex; gap: 15px;">
                    <div class="skeleton skeleton-image" style="width: 80px; height: 80px; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text-short"></div>
                    </div>
                </div>
            </div>
        `,
        // 統計卡片骨架
        'stat-card': `
            <div class="skeleton-card">
                <div class="skeleton skeleton-text-short" style="margin-bottom: 15px;"></div>
                <div class="skeleton" style="height: 40px; width: 50%; margin-bottom: 10px;"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `,
        // 列表項目骨架
        'list-item': `
            <div class="skeleton-card" style="display: flex; align-items: center; gap: 15px; padding: 15px;">
                <div class="skeleton skeleton-avatar"></div>
                <div style="flex: 1;">
                    <div class="skeleton skeleton-title" style="width: 50%;"></div>
                    <div class="skeleton skeleton-text-short"></div>
                </div>
            </div>
        `,
        // 預設骨架
        'default': `
            <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text-short"></div>
            </div>
        `
    };

    return templates[type] || templates['default'];
}

// 顯示骨架屏
function showSkeleton(containerId, type = 'default', count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    for (let i = 0; i < count; i++) {
        html += createSkeletonCard(type);
    }
    container.innerHTML = html;
}

// 隱藏骨架屏（用實際內容替換）
function hideSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// ========== 下拉刷新 (Pull to Refresh) ==========

// 添加下拉刷新樣式
(function addPullRefreshStyles() {
    if (!document.getElementById('pull-refresh-styles')) {
        const style = document.createElement('style');
        style.id = 'pull-refresh-styles';
        style.textContent = `
            .pull-refresh-indicator {
                position: fixed;
                top: -60px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 30px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9998;
                transition: top 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }

            .pull-refresh-indicator.visible {
                top: 20px;
            }

            .pull-refresh-indicator.refreshing {
                top: 20px;
            }

            .pull-refresh-spinner {
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: pullRefreshSpin 0.8s linear infinite;
            }

            @keyframes pullRefreshSpin {
                to { transform: rotate(360deg); }
            }

            .pull-refresh-arrow {
                transition: transform 0.2s ease;
            }

            .pull-refresh-arrow.rotated {
                transform: rotate(180deg);
            }
        `;
        document.head.appendChild(style);
    }
})();

// 初始化下拉刷新
function initPullRefresh(options = {}) {
    const {
        onRefresh = null,         // 刷新時的回調函數
        threshold = 80,           // 觸發刷新的下拉距離
        containerSelector = null  // 容器選擇器，null 表示整個頁面
    } = options;

    if (!onRefresh) {
        console.warn('[PullRefresh] 未設定 onRefresh 回調');
        return;
    }

    // 建立指示器
    let indicator = document.querySelector('.pull-refresh-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'pull-refresh-indicator';
        indicator.innerHTML = '<span class="pull-refresh-arrow">↓</span><span class="pull-refresh-text">下拉刷新</span>';
        document.body.appendChild(indicator);
    }

    const arrow = indicator.querySelector('.pull-refresh-arrow');
    const text = indicator.querySelector('.pull-refresh-text');

    let startY = 0;
    let currentY = 0;
    let isRefreshing = false;

    const container = containerSelector ? document.querySelector(containerSelector) : document.body;

    container.addEventListener('touchstart', (e) => {
        if (isRefreshing) return;
        if (window.scrollY > 5) return; // 只在頂部時啟用

        startY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (isRefreshing) return;
        if (window.scrollY > 5) return;

        currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;

        if (pullDistance > 0 && pullDistance < threshold * 2) {
            indicator.classList.add('visible');

            if (pullDistance > threshold) {
                arrow.classList.add('rotated');
                text.textContent = '放開刷新';
            } else {
                arrow.classList.remove('rotated');
                text.textContent = '下拉刷新';
            }
        }
    }, { passive: true });

    container.addEventListener('touchend', async () => {
        if (isRefreshing) return;

        const pullDistance = currentY - startY;

        if (pullDistance > threshold && window.scrollY <= 5) {
            // 觸發刷新
            isRefreshing = true;
            indicator.classList.add('refreshing');
            indicator.innerHTML = '<div class="pull-refresh-spinner"></div><span>刷新中...</span>';

            try {
                await onRefresh();
                indicator.innerHTML = '<span>✓</span><span>刷新完成</span>';
            } catch (error) {
                indicator.innerHTML = '<span>✕</span><span>刷新失敗</span>';
            }

            setTimeout(() => {
                indicator.classList.remove('visible', 'refreshing');
                indicator.innerHTML = '<span class="pull-refresh-arrow">↓</span><span class="pull-refresh-text">下拉刷新</span>';
                isRefreshing = false;
            }, 1000);
        } else {
            indicator.classList.remove('visible');
        }

        startY = 0;
        currentY = 0;
    }, { passive: true });

    console.log('[PullRefresh] 下拉刷新已啟用');
}

// ========== 新手引導 (Onboarding) ==========

const ONBOARDING_KEY = 'bentoai_onboarding_completed';

// 添加新手引導樣式
(function addOnboardingStyles() {
    if (!document.getElementById('onboarding-styles')) {
        const style = document.createElement('style');
        style.id = 'onboarding-styles';
        style.textContent = `
            .onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.85);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: onboardingFadeIn 0.3s ease;
            }

            @keyframes onboardingFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .onboarding-card {
                background: white;
                border-radius: 24px;
                width: 90%;
                max-width: 380px;
                padding: 40px 30px;
                text-align: center;
                animation: onboardingSlideUp 0.4s ease;
            }

            @keyframes onboardingSlideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .onboarding-icon {
                font-size: 70px;
                margin-bottom: 20px;
            }

            .onboarding-title {
                font-size: 22px;
                font-weight: 700;
                color: #333;
                margin-bottom: 12px;
            }

            .onboarding-desc {
                font-size: 15px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 30px;
            }

            .onboarding-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 25px;
            }

            .onboarding-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #ddd;
                transition: all 0.3s ease;
            }

            .onboarding-dot.active {
                background: linear-gradient(135deg, #667eea, #764ba2);
                width: 24px;
                border-radius: 5px;
            }

            .onboarding-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 14px 40px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }

            .onboarding-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }

            .onboarding-skip {
                position: absolute;
                top: 20px;
                right: 20px;
                color: rgba(255,255,255,0.7);
                background: none;
                border: none;
                font-size: 14px;
                cursor: pointer;
            }

            .onboarding-skip:hover {
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
})();

// 新手引導步驟
const onboardingSteps = [
    {
        icon: '👋',
        title: '歡迎使用健康數據助理！',
        desc: '讓 AI 幫助您輕鬆管理飲食營養，開始健康生活的第一步。'
    },
    {
        icon: '📸',
        title: '拍照辨識食物',
        desc: '只要拍張照片，AI 就會自動辨識食物並計算營養成分，超方便！'
    },
    {
        icon: '📊',
        title: '追蹤營養攝取',
        desc: '查看每日、每週統計，了解您的飲食習慣和營養均衡狀況。'
    },
    {
        icon: '🤖',
        title: 'AI 健康建議',
        desc: '根據您的飲食記錄，AI 會提供個人化的營養建議。'
    },
    {
        icon: '🎉',
        title: '開始使用吧！',
        desc: '立即記錄您的第一餐，讓健康管理變得簡單又有趣！'
    }
];

// 顯示新手引導
function showOnboarding(forceShow = false) {
    // 檢查是否已完成引導
    if (!forceShow && localStorage.getItem(ONBOARDING_KEY)) {
        return;
    }

    let currentStep = 0;

    const overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';

    function renderStep(stepIndex) {
        const step = onboardingSteps[stepIndex];
        const isLastStep = stepIndex === onboardingSteps.length - 1;

        overlay.innerHTML = `
            <button class="onboarding-skip" onclick="this.closest('.onboarding-overlay').remove(); localStorage.setItem('${ONBOARDING_KEY}', 'true');">跳過</button>
            <div class="onboarding-card">
                <div class="onboarding-icon">${step.icon}</div>
                <h2 class="onboarding-title">${step.title}</h2>
                <p class="onboarding-desc">${step.desc}</p>
                <div class="onboarding-dots">
                    ${onboardingSteps.map((_, i) => `<div class="onboarding-dot ${i === stepIndex ? 'active' : ''}"></div>`).join('')}
                </div>
                <button class="onboarding-btn" id="onboardingNextBtn">
                    ${isLastStep ? '開始使用' : '下一步'}
                </button>
            </div>
        `;

        const nextBtn = overlay.querySelector('#onboardingNextBtn');
        nextBtn.onclick = () => {
            if (isLastStep) {
                localStorage.setItem(ONBOARDING_KEY, 'true');
                overlay.remove();
            } else {
                currentStep++;
                renderStep(currentStep);
            }
        };
    }

    renderStep(0);
    document.body.appendChild(overlay);
}

// 重置新手引導（用於測試）
function resetOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY);
    console.log('[Onboarding] 新手引導已重置');
}

// 檢查是否需要顯示新手引導
function checkOnboarding() {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
        // 延遲一點顯示，讓頁面先載入完成
        setTimeout(() => showOnboarding(), 500);
    }
}

// 導出給全域使用
window.BentoAIUtils = {
    getAppSettings,
    saveAppSettings,
    isImperialUnit,
    convertHeight,
    convertWeight,
    convertHeightToMetric,
    convertWeightToMetric,
    getHeightUnit,
    getWeightUnit,
    getHeightPlaceholder,
    getWeightPlaceholder,
    formatHeight,
    formatWeight,
    applyDarkMode,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    createSkeletonCard,
    showSkeleton,
    hideSkeleton,
    initPullRefresh,
    showOnboarding,
    resetOnboarding,
    checkOnboarding
};

// 也導出為全域函數，方便直接呼叫
window.showToast = showToast;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;
window.showSkeleton = showSkeleton;
window.hideSkeleton = hideSkeleton;
window.initPullRefresh = initPullRefresh;
window.showOnboarding = showOnboarding;
window.resetOnboarding = resetOnboarding;
window.checkOnboarding = checkOnboarding;
