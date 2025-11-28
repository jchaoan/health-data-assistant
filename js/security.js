/**
 * BentoAI 安全工具函數
 * 防止 XSS 攻擊和其他安全問題
 */

// HTML 實體編碼 - 防止 XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 清理 HTML 標籤 - 更嚴格的過濾
function sanitizeHtml(html) {
    if (!html) return '';

    // 允許的標籤白名單
    const allowedTags = [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'hr', 'span', 'div'
    ];

    // 允許的屬性白名單
    const allowedAttributes = ['href', 'title', 'class', 'id'];

    // 建立臨時 DOM 來解析
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 遞迴清理節點
    function cleanNode(node) {
        // 處理元素節點
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();

            // 檢查是否為允許的標籤
            if (!allowedTags.includes(tagName)) {
                // 不允許的標籤：保留文字內容，移除標籤
                const textContent = node.textContent;
                const textNode = document.createTextNode(textContent);
                node.parentNode.replaceChild(textNode, node);
                return;
            }

            // 移除不允許的屬性
            const attributes = Array.from(node.attributes);
            attributes.forEach(attr => {
                if (!allowedAttributes.includes(attr.name.toLowerCase())) {
                    node.removeAttribute(attr.name);
                }
                // 檢查 href 是否有危險協議
                if (attr.name.toLowerCase() === 'href') {
                    const href = attr.value.toLowerCase().trim();
                    if (href.startsWith('javascript:') ||
                        href.startsWith('vbscript:') ||
                        href.startsWith('data:')) {
                        node.removeAttribute('href');
                    }
                }
            });

            // 移除事件處理器（on* 屬性）
            Array.from(node.attributes).forEach(attr => {
                if (attr.name.toLowerCase().startsWith('on')) {
                    node.removeAttribute(attr.name);
                }
            });

            // 遞迴處理子節點
            Array.from(node.childNodes).forEach(child => cleanNode(child));
        }
    }

    // 清理所有子節點
    Array.from(tempDiv.childNodes).forEach(child => cleanNode(child));

    return tempDiv.innerHTML;
}

// 安全地渲染 Markdown（搭配 marked.js 使用）
function safeMarkdown(markdownText) {
    if (!markdownText) return '';

    // 先用 marked 解析
    if (typeof marked !== 'undefined') {
        const html = marked.parse(markdownText);
        // 再用 sanitizeHtml 清理
        return sanitizeHtml(html);
    }

    // 如果沒有 marked，直接跳脫
    return escapeHtml(markdownText).replace(/\n/g, '<br>');
}

// 驗證 URL 是否安全
function isValidUrl(url) {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        // 只允許 http 和 https
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

// 驗證 Email 格式
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 防止 JSON 注入
function safeJsonParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch {
        console.warn('JSON 解析失敗，使用預設值');
        return defaultValue;
    }
}

// 安全地設定 innerHTML
function setInnerHtmlSafe(element, html, allowMarkdown = false) {
    if (!element) return;

    if (allowMarkdown) {
        element.innerHTML = safeMarkdown(html);
    } else {
        element.innerHTML = sanitizeHtml(html);
    }
}

// 導出給全域使用
window.BentoAISecurity = {
    escapeHtml,
    sanitizeHtml,
    safeMarkdown,
    isValidUrl,
    isValidEmail,
    safeJsonParse,
    setInnerHtmlSafe
};
