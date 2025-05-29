// メインのJavaScriptファイル
// 共通機能やユーティリティをここに追加

document.addEventListener('DOMContentLoaded', () => {
    console.log('Form Showcase loaded');
    
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});