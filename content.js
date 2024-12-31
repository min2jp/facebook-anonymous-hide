function hideAnonymousPosts() {
    // 投稿者名を含む可能性のある要素を幅広く検索
    const possibleElements = document.querySelectorAll('div[role="article"] div');
    
    possibleElements.forEach(element => {
      if (element.textContent && element.textContent.trim() === '匿名参加者') {
        // 投稿のルート要素を取得
        const articleElement = element.closest('div[role="article"]');
        if (articleElement) {
          // 非表示設定
          articleElement.style.display = 'none';
          articleElement.dataset.hiddenAnonymous = 'true';
          console.log('匿名投稿を非表示にしました');
        }
      }
    });
  }
  
  // 定期的なチェックを実行
  function startPeriodicCheck() {
    // 最初の実行
    hideAnonymousPosts();
  
    // スクロールイベントでのチェック
    let scrollTimeout;
    window.addEventListener('scroll', () => {
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