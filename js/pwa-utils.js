/**
 * PWA 工具函數
 * 檢測 PWA 模式、頁面轉場、觸控優化
 */

(function() {
    'use strict';

    // ===== PWA 模式檢測 =====
    const isPWA = window.matchMedia('(display-mode: standalone)').matches
               || window.navigator.standalone === true
               || document.referrer.includes('android-app://');

    // 在 PWA 模式下添加 class
    if (isPWA) {
        document.documentElement.classList.add('pwa-mode');
        document.body.classList.add('pwa-mode');
    }

    // 監聽 display-mode 變化
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('pwa-mode');
        } else {
            document.body.classList.remove('pwa-mode');
        }
    });

    // ===== 頁面轉場動畫 =====
    function initPageTransitions() {
        // 頁面載入時的進場動畫
        const mainContent = document.getElementById('mainContent') || document.querySelector('.container');
        if (mainContent) {
            mainContent.classList.add('page-transition');
        }

        // 點擊連結時的離場動畫
        document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript"])').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // 跳過外部連結和特殊連結
                if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                    return;
                }

                e.preventDefault();

                const content = document.getElementById('mainContent') || document.querySelector('.container');
                if (content) {
                    content.classList.add('page-exit');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 200);
                } else {
                    window.location.href = href;
                }
            });
        });
    }

    // ===== 底部導航高亮 =====
    function highlightCurrentNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

        document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
                item.classList.add('active');
            }
        });
    }

    // ===== 觸控回饋 =====
    function initTouchFeedback() {
        // 為所有可點擊元素添加觸控回饋
        const touchableElements = document.querySelectorAll(
            'button, .btn, .btn-icon, .nav-item, .card-touchable, .list-item-touchable, .clickable'
        );

        touchableElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            }, { passive: true });

            el.addEventListener('touchend', function() {
                this.style.opacity = '';
            }, { passive: true });

            el.addEventListener('touchcancel', function() {
                this.style.opacity = '';
            }, { passive: true });
        });
    }

    // ===== 防止雙擊縮放 =====
    function preventDoubleZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }

    // ===== 禁用長按選取（可選）=====
    function disableLongPressSelect() {
        document.addEventListener('contextmenu', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                // 在非輸入框上禁用長按選單
                // e.preventDefault(); // 取消註解以啟用
            }
        });
    }

    // ===== 深色模式檢測 =====
    function initDarkMode() {
        // 檢查本地儲存的設定
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
        } else {
            // 自動跟隨系統
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            }
        }

        // 監聽系統深色模式變化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme || savedTheme === 'auto') {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }
        });
    }

    // ===== 網路狀態監測 =====
    function initNetworkStatus() {
        function updateOnlineStatus() {
            if (navigator.onLine) {
                document.body.classList.remove('offline');
            } else {
                document.body.classList.add('offline');
                showToast('網路已斷開，部分功能可能無法使用');
            }
        }

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    // ===== Toast 提示 =====
    function showToast(message, duration = 3000) {
        // 移除現有的 toast
        const existingToast = document.querySelector('.pwa-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'pwa-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: calc(80px + env(safe-area-inset-bottom, 0px));
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 9999;
            animation: toastIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // 添加 toast 動畫樣式
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        @keyframes toastIn {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
    `;
    document.head.appendChild(toastStyles);

    // ===== 更新 App 提示 =====
    function initUpdatePrompt() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                showToast('有新版本可用，重新整理以更新');
            });
        }
    }

    // ===== 初始化 =====
    function init() {
        // DOM 載入後執行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onReady);
        } else {
            onReady();
        }
    }

    function onReady() {
        initPageTransitions();
        highlightCurrentNav();
        initTouchFeedback();
        initDarkMode();
        initNetworkStatus();
        initUpdatePrompt();

        // PWA 模式下的額外優化
        if (isPWA) {
            preventDoubleZoom();
            console.log('PWA 模式已啟用');
        }
    }

    // 導出全域函數
    window.PWAUtils = {
        isPWA: isPWA,
        showToast: showToast,
        highlightCurrentNav: highlightCurrentNav
    };

    init();
})();
