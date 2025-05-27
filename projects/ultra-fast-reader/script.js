document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const fontSizeToggle = document.getElementById('font-size');
    const html = document.documentElement;
    
    // テーマ切り替え
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // フォントサイズ切り替え
    const fontSizes = ['', 'font-small', 'font-large'];
    let currentSizeIndex = 0;
    
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        currentSizeIndex = fontSizes.indexOf(savedFontSize);
        if (currentSizeIndex > 0) {
            html.classList.add(savedFontSize);
        }
    }
    
    fontSizeToggle.addEventListener('click', () => {
        // 現在のクラスを削除
        if (fontSizes[currentSizeIndex]) {
            html.classList.remove(fontSizes[currentSizeIndex]);
        }
        
        // 次のサイズに切り替え
        currentSizeIndex = (currentSizeIndex + 1) % fontSizes.length;
        
        // 新しいクラスを追加
        if (fontSizes[currentSizeIndex]) {
            html.classList.add(fontSizes[currentSizeIndex]);
            localStorage.setItem('fontSize', fontSizes[currentSizeIndex]);
        } else {
            localStorage.removeItem('fontSize');
        }
    });
    
    // スムーズスクロール
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