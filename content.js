function hideAnonymousPosts() {
  const possibleElements = document.querySelectorAll([
    'div[role="article"] div',          // デスクトップ版
    'span[class="rtl-ignore f2 a"]',    // モバイル版
    'span[class*="rtl-ignore"]'         // モバイル版の可能性がある別パターン
  ].join(','));
  
  possibleElements.forEach(element => {
    if (element.textContent && element.textContent.trim() === '匿名参加者') {
      // デスクトップ版とモバイル版の両方の親要素を検索
      const articleElement = element.closest('div[role="article"]') || 
                           element.closest('div[data-type="container"][class*="displayed"]');
      if (articleElement) {
        articleElement.style.display = 'none';
        articleElement.dataset.hiddenAnonymous = 'true';
      }
    }
  });
}

function startPeriodicCheck() {
  // 最初の実行
  hideAnonymousPosts();

  // スクロールイベントでのチェック
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(hideAnonymousPosts, 150);
  });

  // タッチイベントの追加（モバイル向け）
  window.addEventListener('touchmove', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(hideAnonymousPosts, 150);
  });

  // 定期的なチェック（新しい投稿の読み込みに対応）
  setInterval(hideAnonymousPosts, 2000);

  // DOMの変更監視
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        hideAnonymousPosts();
      }
    });
  });

  // 監視の開始
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// ページロード完了時に開始
if (document.readyState === 'complete') {
  startPeriodicCheck();
} else {
  window.addEventListener('load', startPeriodicCheck);
}

// DOMContentLoaded時にも実行
document.addEventListener('DOMContentLoaded', startPeriodicCheck);