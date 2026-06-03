/**
 * FWT JAPAN - Main Script
 */

// --- 1. ティッカーの初期化関数 ---
// フッターが後から読み込まれるため、関数化して必要なタイミングで呼び出せるようにします。
const initFWTTicker = () => {
  const tracks = document.querySelectorAll('.fwt-ticker-track');
  
  tracks.forEach(track => {
    // すでに初期化済みの場合はスキップ（二重複製防止）
    if (track.dataset.initialized === "true") return;

    // 現在のテキスト内容を取得
    const content = track.innerHTML;
    
    // 内容を1回だけ複製して結合（元の2倍の長さに）
    // CSSの translateX(-50%) と組み合わせることで無限ループを実現します
    track.innerHTML = content + content;
    
    // 初期化完了フラグをセット
    track.dataset.initialized = "true";
  });
};

// --- 2. ナビゲーションバーのスクロール制御 ---
const handleNavbarScroll = () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-white', 'text-slate-900', 'shadow-sm', 'border-b', 'border-slate-100');
      navbar.classList.remove('text-white', 'bg-transparent');
    } else {
      navbar.classList.remove('bg-white', 'text-slate-900', 'shadow-sm', 'border-b', 'border-slate-100');
      navbar.classList.add('text-white', 'bg-transparent');
    }
  });
};

// --- 3. モバイルメニュー（ハンバーガー）の制御 ---
const handleMobileMenu = () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;

  const menuIcon = menuToggle.querySelector('i');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('opacity-0');
    mobileMenu.classList.toggle('pointer-events-none');
    
    // アイコンの切り替え（Remix Icon想定）
    if (menuIcon) {
      if (mobileMenu.classList.contains('opacity-0')) {
        menuIcon.className = 'ri-menu-line text-xl';
      } else {
        menuIcon.className = 'ri-close-line text-xl';
      }
    }
  });
};

// --- 4. フッターの読み込みとティッカーの実行 ---
document.addEventListener('DOMContentLoaded', () => {
  // 初期状態でページ内にある要素の制御を開始
  handleNavbarScroll();
  handleMobileMenu();
  initFWTTicker(); // ページ本体にティッカーがある場合用

  const footerContainer = document.getElementById('common-footer-container');

  if (footerContainer) {
    // 共通フッターの取得
    fetch('/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Footer load failed');
        return response.text();
      })
      .then(html => {
        // HTMLを注入
        footerContainer.innerHTML = html;
        
        // 【重要】フッター注入直後に、フッター内のティッカーを初期化
        initFWTTicker();
      })
      .catch(error => {
        console.error('Footer Error:', error);
      });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletterForm');
  
  // フォームが存在するページのみ処理を実行
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('emailInput');
      const submitBtn = document.getElementById('submitBtn');
      const messageDiv = document.getElementById('responseMessage');
      
      // 連打・二重送信防止モードON
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>送信中...</span>';
      
      const gasUrl = 'https://script.google.com/macros/s/AKfycbyQXHDxSPg_1-5SlI7UK3IvffOG-ECmo5JCjReZZ_NgXzm3C89DbF0nAFClSXeIBSLz/exec';
      
      fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'email': emailInput.value
        })
      })
      .then(() => {
        // 成功時
        messageDiv.innerText = '正常に登録されました。ありがとうございます！';
        messageDiv.className = 'text-xs mt-2 text-center md:text-left font-medium text-green-400 absolute -bottom-6 left-2';
        messageDiv.classList.remove('hidden');
        emailInput.value = ''; // 入力欄をクリア
      })
      .catch(error => {
        // エラー時
        messageDiv.innerText = 'エラーが発生しました。もう一度お試しください。';
        messageDiv.className = 'text-xs mt-2 text-center md:text-left font-medium text-red-400 absolute -bottom-6 left-2';
        messageDiv.classList.remove('hidden');
        console.error('Error:', error);
      })
      .finally(() => {
        // ボタンを元に戻す
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = originalBtnText;

        // 5秒後にメッセージを消去する（UI向上のための任意追加）
        setTimeout(() => {
          messageDiv.classList.add('hidden');
        }, 5000);
      });
    });
  }
});