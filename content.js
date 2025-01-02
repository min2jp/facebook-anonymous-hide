function hideAnonymousPosts() {
  // デスクトップ版
  document.querySelectorAll('div[role="article"]').forEach(article => {
    const authorElement = article.querySelector('div[data-ad-comet-preview="message"]');
    if (authorElement && authorElement.textContent.includes('匿名参加者')) {
      article.style.display = 'none';
      article.dataset.hiddenAnonymous = 'true';
    }
  });

  // モバイル版
  document.querySelectorAll('div[class="m displayed"]').forEach(container => {
    const anonymousText = container.querySelector('span[class="rtl-ignore f2 a"]');
    if (anonymousText && anonymousText.textContent.trim() === '匿名参加者') {
      container.style.display = 'none';
      container.dataset.hiddenAnonymous = 'true';
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