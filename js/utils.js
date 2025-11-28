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

// 顯示 Toast 訊息
function showToast(message, duration = 3000) {
    // 移除舊的 toast
    const oldToast = document.querySelector('.toast-message');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 9999;
        animation: fadeInOut ${duration}ms ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// 確保 Toast 動畫 CSS 存在
(function addToastStyles() {
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                85% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
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
    showToast
};
