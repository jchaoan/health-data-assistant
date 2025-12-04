/**
 * 深色模式工具 - 立即執行以避免頁面閃爍
 * 所有頁面都需要在 <head> 中引入此腳本（不要用 defer）
 */
(function() {
    'use strict';

    const SETTINGS_KEY = 'bentoai_settings';

    // 深色模式通用樣式（底部導航欄等共用元件）
    const darkModeStyles = `
        /* ===== 深色模式 - 底部導航欄 ===== */
        body.dark-mode .bottom-nav {
            background: #1a1a2e !important;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.4) !important;
            border-top: 1px solid #2a2a3e;
        }

        body.dark-mode .nav-item {
            color: #888 !important;
        }

        body.dark-mode .nav-item:hover {
            background: #2a2a3e !important;
            color: #a78bfa !important;
        }

        body.dark-mode .nav-item.active {
            color: #a78bfa !important;
        }

        body.dark-mode .nav-item.active .nav-icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
        }

        body.dark-mode .nav-icon {
            color: inherit;
        }

        /* ===== 深色模式 - 通用背景 ===== */
        body.dark-mode {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
        }

        /* ===== 深色模式 - 卡片與容器 ===== */
        body.dark-mode .card,
        body.dark-mode .container > div[class*="card"],
        body.dark-mode .modal-content {
            background: #1e1e2e !important;
            color: #e0e0e0 !important;
        }

        /* ===== 深色模式 - 表單元素 ===== */
        body.dark-mode input,
        body.dark-mode select,
        body.dark-mode textarea {
            background: #2a2a3e !important;
            color: #e0e0e0 !important;
            border-color: #3a3a4e !important;
        }

        body.dark-mode input:focus,
        body.dark-mode select:focus,
        body.dark-mode textarea:focus {
            border-color: #a78bfa !important;
        }

        body.dark-mode input::placeholder,
        body.dark-mode textarea::placeholder {
            color: #666 !important;
        }

        /* ===== 深色模式 - 按鈕 ===== */
        body.dark-mode .btn-secondary {
            background: #3a3a4e !important;
            color: #e0e0e0 !important;
        }

        body.dark-mode .btn-secondary:hover {
            background: #4a4a5e !important;
        }

        /* ===== 深色模式 - 文字顏色 ===== */
        body.dark-mode h1, body.dark-mode h2, body.dark-mode h3 {
            color: #e0e0e0 !important;
        }

        body.dark-mode p, body.dark-mode span, body.dark-mode label {
            color: #b0b0b0 !important;
        }

        /* ===== 深色模式 - 滾動條 ===== */
        body.dark-mode::-webkit-scrollbar {
            width: 8px;
        }

        body.dark-mode::-webkit-scrollbar-track {
            background: #1a1a2e;
        }

        body.dark-mode::-webkit-scrollbar-thumb {
            background: #3a3a4e;
            border-radius: 4px;
        }

        body.dark-mode::-webkit-scrollbar-thumb:hover {
            background: #4a4a5e;
        }
    `;

    // 注入深色模式樣式
    function injectDarkModeStyles() {
        if (document.getElementById('dark-mode-styles')) return;

        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = darkModeStyles;
        document.head.appendChild(style);
    }

    // 立即注入樣式
    injectDarkModeStyles();

    // 立即讀取並套用深色模式設定
    function applyDarkMode() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                if (settings.darkMode) {
                    document.documentElement.classList.add('dark-mode');
                    document.body && document.body.classList.add('dark-mode');
                }
            }
        } catch (e) {
            console.warn('[深色模式] 讀取設定失敗:', e);
        }
    }

    // 立即執行
    applyDarkMode();

    // DOM 載入後再次確認（確保 body 有套用）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectDarkModeStyles();
            applyDarkMode();
        });
    }

    // 監聽 storage 變化（其他頁面/分頁切換深色模式時同步）
    window.addEventListener('storage', function(e) {
        if (e.key === SETTINGS_KEY) {
            try {
                const settings = JSON.parse(e.newValue || '{}');
                if (settings.darkMode) {
                    document.documentElement.classList.add('dark-mode');
                    document.body.classList.add('dark-mode');
                } else {
                    document.documentElement.classList.remove('dark-mode');
                    document.body.classList.remove('dark-mode');
                }
            } catch (err) {}
        }
    });
})();
