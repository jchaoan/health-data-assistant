/**
 * 健康數據助理 PWA 安裝提示組件
 * 在頁面底部顯示安裝提示橫幅
 */

(function() {
    'use strict';

    // 檢查是否已經在 standalone 模式（已安裝）
    function isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    // 檢查是否已經關閉過提示（24小時內）
    function isDismissed() {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) return false;

        const dismissTime = parseInt(dismissed, 10);
        const now = Date.now();
        // 24小時後再次顯示
        return (now - dismissTime) < 24 * 60 * 60 * 1000;
    }

    // 記錄關閉時間
    function setDismissed() {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }

    // 建立安裝提示橫幅
    function createInstallBanner() {
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-icon">📲</div>
                <div class="pwa-banner-text">
                    <strong>安裝健康數據助理</strong>
                    <span>加入主畫面，享受更好體驗</span>
                </div>
                <div class="pwa-banner-actions">
                    <button class="pwa-banner-btn pwa-install-btn" id="pwaBannerInstall">安裝</button>
                    <button class="pwa-banner-btn pwa-dismiss-btn" id="pwaBannerDismiss">稍後</button>
                </div>
            </div>
        `;

        // 加入樣式
        const style = document.createElement('style');
        style.textContent = `
            #pwa-install-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.3s ease;
                padding: 15px 20px;
                padding-bottom: max(15px, env(safe-area-inset-bottom));
            }

            #pwa-install-banner.show {
                transform: translateY(0);
            }

            .pwa-banner-content {
                display: flex;
                align-items: center;
                gap: 15px;
                max-width: 600px;
                margin: 0 auto;
            }

            .pwa-banner-icon {
                font-size: 36px;
                flex-shrink: 0;
            }

            .pwa-banner-text {
                flex: 1;
                min-width: 0;
            }

            .pwa-banner-text strong {
                display: block;
                color: #333;
                font-size: 16px;
                margin-bottom: 2px;
            }

            .pwa-banner-text span {
                color: #666;
                font-size: 13px;
            }

            .pwa-banner-actions {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }

            .pwa-banner-btn {
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }

            .pwa-install-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .pwa-install-btn:hover {
                transform: scale(1.05);
            }

            .pwa-dismiss-btn {
                background: #f0f0f0;
                color: #666;
            }

            .pwa-dismiss-btn:hover {
                background: #e0e0e0;
            }

            /* 深色模式 */
            body.dark-mode #pwa-install-banner {
                background: #1e1e1e;
            }

            body.dark-mode .pwa-banner-text strong {
                color: #e0e0e0;
            }

            body.dark-mode .pwa-banner-text span {
                color: #aaa;
            }

            body.dark-mode .pwa-dismiss-btn {
                background: #333;
                color: #e0e0e0;
            }

            body.dark-mode .pwa-dismiss-btn:hover {
                background: #444;
            }

            /* 已有底部導航列時調整位置 */
            body.has-bottom-nav #pwa-install-banner {
                bottom: 70px;
            }

            @media (max-width: 480px) {
                .pwa-banner-content {
                    flex-wrap: wrap;
                }

                .pwa-banner-actions {
                    width: 100%;
                    justify-content: flex-end;
                    margin-top: 10px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(banner);

        return banner;
    }

    // PWA 安裝提示事件
    let deferredPrompt = null;
    let banner = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // 檢查條件
        if (isInstalled() || isDismissed()) {
            return;
        }

        // 顯示橫幅
        showBanner();
    });

    function showBanner() {
        if (!banner) {
            banner = createInstallBanner();

            // 安裝按鈕
            document.getElementById('pwaBannerInstall').addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        hideBanner();
                    }
                    deferredPrompt = null;
                } else {
                    // 無法自動安裝，跳轉到說明頁面
                    window.location.href = '/install';
                }
            });

            // 稍後按鈕
            document.getElementById('pwaBannerDismiss').addEventListener('click', () => {
                setDismissed();
                hideBanner();
            });
        }

        // 延遲顯示動畫
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    }

    function hideBanner() {
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
                banner = null;
            }, 300);
        }
    }

    // 監聽安裝完成
    window.addEventListener('appinstalled', () => {
        hideBanner();
    });

    // 對於 iOS，顯示引導到說明頁面
    function isIOS() {
        return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    }

    function isSafari() {
        return /safari/.test(navigator.userAgent.toLowerCase()) &&
               !/chrome/.test(navigator.userAgent.toLowerCase());
    }

    // iOS Safari 特殊處理
    if (isIOS() && isSafari() && !isInstalled() && !isDismissed()) {
        // iOS Safari 不支援 beforeinstallprompt，手動顯示
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                showBanner();
                // 修改安裝按鈕行為
                const installBtn = document.getElementById('pwaBannerInstall');
                if (installBtn) {
                    installBtn.textContent = '了解更多';
                    installBtn.onclick = () => {
                        window.location.href = '/install';
                    };
                }
            }, 2000);
        });
    }

    // 導出功能
    window.BentoAIPWA = {
        showBanner,
        hideBanner,
        isInstalled
    };
})();
