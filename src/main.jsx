import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ========================================
// Dynamic Viewport Height Fix for Mobile
// ========================================
// モバイルブラウザのアドレスバーによる高さ変動に対応

function setViewportHeight() {
  // 実際のビューポート高さを取得
  const vh = window.innerHeight * 0.01;
  // CSS変数として設定
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

// 初回設定
setViewportHeight();

// リサイズ時に再計算（デバウンス処理付き）
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(setViewportHeight, 100);
});

// オリエンテーション変更時にも対応
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100);
});

// ページ表示時にも実行
window.addEventListener('pageshow', setViewportHeight);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
