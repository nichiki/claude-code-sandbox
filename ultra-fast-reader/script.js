document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const fontSizeToggle = document.getElementById('font-size');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const articleList = document.getElementById('article-list');
    const articleContent = document.getElementById('article-content');
    const html = document.documentElement;
    
    // 記事リスト
    const articles = [
        { file: 'minimalism-in-design.md', title: 'ミニマリズムとデザイン', date: '2025-01-15' },
        { file: 'digital-detox.md', title: 'デジタルデトックスの重要性', date: '2025-01-10' },
        { file: 'reading-in-digital-age.md', title: 'デジタル時代の読書論', date: '2025-01-05' }
    ];
    
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
    
    // サイドバー切り替え（モバイル用）
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    mobileSidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // オーバーレイクリックでサイドバーを閉じる
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
    
    // 記事リストの作成
    function renderArticleList() {
        articleList.innerHTML = '';
        articles.forEach((article, index) => {
            const articleItem = document.createElement('button');
            articleItem.className = 'article-item';
            if (index === 0) articleItem.classList.add('active');
            
            articleItem.innerHTML = `
                <h3>${article.title}</h3>
                <span class="date">${formatDate(article.date)}</span>
            `;
            
            articleItem.addEventListener('click', () => {
                loadArticle(article.file);
                // アクティブ状態の更新
                document.querySelectorAll('.article-item').forEach(item => {
                    item.classList.remove('active');
                });
                articleItem.classList.add('active');
                
                // モバイルでサイドバーを閉じる
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
            
            articleList.appendChild(articleItem);
        });
    }
    
    // 日付フォーマット
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    
    // Markdown記事の読み込み
    async function loadArticle(filename) {
        try {
            const response = await fetch(`articles/${filename}`);
            const text = await response.text();
            
            // YAMLフロントマターとコンテンツを分離
            const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            
            if (match) {
                const frontmatter = jsyaml.load(match[1]);
                const content = match[2];
                
                // Markdownをパース
                const htmlContent = marked.parse(content);
                
                // 記事を表示
                articleContent.innerHTML = `
                    <div class="article-meta">
                        <span class="date">${formatDate(frontmatter.date)}</span>
                        ${frontmatter.author ? `<span class="author">— ${frontmatter.author}</span>` : ''}
                    </div>
                    ${htmlContent}
                `;
            } else {
                // フロントマターがない場合は直接パース
                articleContent.innerHTML = marked.parse(text);
            }
            
            // ページトップへスクロール
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('記事の読み込みに失敗しました:', error);
            articleContent.innerHTML = '<p>記事の読み込みに失敗しました。</p>';
        }
    }
    
    // Markedの設定
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });
    
    // 初期化
    renderArticleList();
    
    // 最初の記事を読み込む
    if (articles.length > 0) {
        loadArticle(articles[0].file);
    }
    
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