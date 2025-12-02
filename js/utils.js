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
        document.body.classList.add('dark-mode');
    } else {
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
    showInfo
};

// 也導出為全域函數，方便直接呼叫
window.showToast = showToast;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;
