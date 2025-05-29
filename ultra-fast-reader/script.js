document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const fontSizeToggle = document.getElementById('font-size');
    const commandPaletteToggle = document.getElementById('command-palette-toggle');
    const commandPaletteOverlay = document.getElementById('command-palette-overlay');
    const commandPaletteInput = document.getElementById('command-palette-input');
    const commandPaletteResults = document.getElementById('command-palette-results');
    const articleContent = document.getElementById('article-content');
    const html = document.documentElement;
    const body = document.body;
    
    // 記事リスト
    const articles = [
        { file: 'minimalism-in-design.md', title: 'ミニマリズムとデザイン', date: '2025-01-15' },
        { file: 'digital-detox.md', title: 'デジタルデトックスの重要性', date: '2025-01-10' },
        { file: 'reading-in-digital-age.md', title: 'デジタル時代の読書論', date: '2025-01-05' }
    ];
    
    // 現在読んでいる記事の情報
    let currentArticleId = null;
    
    // コマンドリスト
    const commands = [
        { 
            id: 'scroll-to-top', 
            title: '記事の最初に戻る', 
            icon: '↑', 
            subtitle: 'トップに戻る',
            action: () => scrollToTop(),
            keywords: ['top', 'scroll', 'トップ', '最初', '上', '戻る']
        },
        { 
            id: 'theme-light', 
            title: 'テーマ: ライト', 
            icon: '☀️', 
            action: () => setTheme('light'),
            keywords: ['theme', 'light', 'ライト', 'テーマ', '明るい']
        },
        { 
            id: 'theme-dark', 
            title: 'テーマ: ダーク', 
            icon: '🌙', 
            action: () => setTheme('dark'),
            keywords: ['theme', 'dark', 'ダーク', 'テーマ', '暗い']
        },
        { 
            id: 'font-small', 
            title: 'フォントサイズ: 小', 
            icon: 'A', 
            subtitle: '小さい文字',
            action: () => setFontSize('font-small'),
            keywords: ['font', 'small', 'フォント', '小', '文字']
        },
        { 
            id: 'font-normal', 
            title: 'フォントサイズ: 標準', 
            icon: 'A', 
            subtitle: '標準サイズ',
            action: () => setFontSize(''),
            keywords: ['font', 'normal', 'フォント', '標準', '文字']
        },
        { 
            id: 'font-large', 
            title: 'フォントサイズ: 大', 
            icon: 'A', 
            subtitle: '大きい文字',
            action: () => setFontSize('font-large'),
            keywords: ['font', 'large', 'フォント', '大', '文字']
        },
        { 
            id: 'font-gothic', 
            title: 'フォント: ゴシック', 
            icon: 'あ', 
            subtitle: 'Inter + Noto Sans JP',
            action: () => setFontFamily('font-gothic'),
            keywords: ['font', 'gothic', 'フォント', 'ゴシック', 'ゴシック体', 'sans']
        },
        { 
            id: 'font-mincho', 
            title: 'フォント: 明朝', 
            icon: 'あ', 
            subtitle: 'Crimson Pro + Noto Serif JP',
            action: () => setFontFamily('font-mincho'),
            keywords: ['font', 'mincho', 'フォント', '明朝', '明朝体', 'serif']
        }
    ];
    
    let selectedIndex = 0;
    let currentItems = [];
    let scrollSaveTimer = null;
    
    // テーマ切り替え
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        closeCommandPalette();
    }
    
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
    
    // フォントファミリーの初期化
    const savedFontFamily = localStorage.getItem('fontFamily');
    if (savedFontFamily) {
        body.classList.add(savedFontFamily);
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
    
    function setFontSize(sizeClass) {
        // すべてのフォントサイズクラスを削除
        fontSizes.forEach(size => {
            if (size) html.classList.remove(size);
        });
        
        // 新しいクラスを追加
        if (sizeClass) {
            html.classList.add(sizeClass);
            localStorage.setItem('fontSize', sizeClass);
        } else {
            localStorage.removeItem('fontSize');
        }
        
        closeCommandPalette();
    }
    
    // フォントファミリー切り替え
    function setFontFamily(fontClass) {
        // すべてのフォントクラスを削除
        body.classList.remove('font-gothic', 'font-mincho');
        
        // 新しいクラスを追加
        if (fontClass) {
            body.classList.add(fontClass);
            localStorage.setItem('fontFamily', fontClass);
        } else {
            localStorage.removeItem('fontFamily');
        }
        
        closeCommandPalette();
    }
    
    // コマンドパレットの表示/非表示
    function openCommandPalette() {
        commandPaletteOverlay.classList.add('active');
        commandPaletteInput.value = '';
        commandPaletteInput.focus();
        updateCommandPaletteResults('');
    }
    
    function closeCommandPalette() {
        commandPaletteOverlay.classList.remove('active');
        selectedIndex = 0;
    }
    
    // コマンドパレットのトグル
    commandPaletteToggle.addEventListener('click', openCommandPalette);
    
    // キーボードショートカット (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (commandPaletteOverlay.classList.contains('active')) {
                closeCommandPalette();
            } else {
                openCommandPalette();
            }
        }
        
        // ESCでコマンドパレットを閉じる
        if (e.key === 'Escape' && commandPaletteOverlay.classList.contains('active')) {
            closeCommandPalette();
        }
    });
    
    // オーバーレイクリックで閉じる
    commandPaletteOverlay.addEventListener('click', (e) => {
        if (e.target === commandPaletteOverlay) {
            closeCommandPalette();
        }
    });
    
    // コマンドパレット内のキーボードナビゲーション
    commandPaletteInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, currentItems.length - 1);
            updateSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeSelectedItem();
        }
    });
    
    // 検索入力の処理
    commandPaletteInput.addEventListener('input', (e) => {
        const query = e.target.value;
        updateCommandPaletteResults(query);
    });
    
    // コマンドパレットの結果を更新
    function updateCommandPaletteResults(query) {
        const lowerQuery = query.toLowerCase();
        currentItems = [];
        
        // 記事を検索
        articles.forEach(article => {
            if (article.title.toLowerCase().includes(lowerQuery) || 
                article.file.toLowerCase().includes(lowerQuery)) {
                currentItems.push({
                    type: 'article',
                    data: article,
                    title: article.title,
                    subtitle: formatDate(article.date),
                    icon: '📄',
                    action: () => loadArticle(article.file)
                });
            }
        });
        
        // コマンドを検索
        commands.forEach(command => {
            const matchesTitle = command.title.toLowerCase().includes(lowerQuery);
            const matchesKeywords = command.keywords.some(keyword => 
                keyword.toLowerCase().includes(lowerQuery)
            );
            
            if (matchesTitle || matchesKeywords || lowerQuery === '') {
                currentItems.push({
                    type: 'command',
                    data: command,
                    title: command.title,
                    subtitle: command.subtitle,
                    icon: command.icon,
                    action: command.action
                });
            }
        });
        
        // 結果を表示
        renderResults();
        selectedIndex = 0;
        updateSelection();
    }
    
    // 結果を描画
    function renderResults() {
        if (currentItems.length === 0) {
            commandPaletteResults.innerHTML = `
                <div class="command-palette-empty">
                    検索結果が見つかりませんでした
                </div>
            `;
            return;
        }
        
        commandPaletteResults.innerHTML = currentItems.map((item, index) => `
            <button class="command-result" data-index="${index}">
                <span class="command-result-icon">${item.icon}</span>
                <div class="command-result-content">
                    <div class="command-result-title">${highlightMatch(item.title, commandPaletteInput.value)}</div>
                    ${item.subtitle ? `<div class="command-result-subtitle">${item.subtitle}</div>` : ''}
                </div>
            </button>
        `).join('');
        
        // クリックイベントを追加
        commandPaletteResults.querySelectorAll('.command-result').forEach((el, index) => {
            el.addEventListener('click', () => {
                selectedIndex = index;
                executeSelectedItem();
            });
        });
    }
    
    // マッチした文字をハイライト
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    // 正規表現のエスケープ
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 選択状態を更新
    function updateSelection() {
        const results = commandPaletteResults.querySelectorAll('.command-result');
        results.forEach((el, index) => {
            if (index === selectedIndex) {
                el.classList.add('selected');
                el.scrollIntoView({ block: 'nearest' });
            } else {
                el.classList.remove('selected');
            }
        });
    }
    
    // 選択されたアイテムを実行
    function executeSelectedItem() {
        if (currentItems[selectedIndex]) {
            currentItems[selectedIndex].action();
        }
    }
    
    // 日付フォーマット
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }
    
    // 文字数フォーマット
    function formatWordCount(count) {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    }
    
    // スクロール位置の保存（throttled）
    function saveScrollPosition() {
        if (!currentArticleId) return;
        
        clearTimeout(scrollSaveTimer);
        scrollSaveTimer = setTimeout(() => {
            const scrollY = window.scrollY;
            localStorage.setItem(`scroll_${currentArticleId}`, scrollY.toString());
        }, 500); // 500ms後に保存
    }
    
    
    // トップにスクロール
    function scrollToTop() {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
        closeCommandPalette();
    }
    
    // スクロールイベントの監視
    window.addEventListener('scroll', saveScrollPosition);
    
    // Markdown記事の読み込み
    async function loadArticle(filename) {
        try {
            // 現在の記事のスクロール位置を最後に保存
            if (currentArticleId) {
                const scrollY = window.scrollY;
                localStorage.setItem(`scroll_${currentArticleId}`, scrollY.toString());
            }
            
            // スクロール保存タイマーをクリア
            clearTimeout(scrollSaveTimer);
            
            const response = await fetch(`articles/${filename}`);
            const text = await response.text();
            
            // 新しい記事IDを設定（ファイル名から拡張子を除く）
            const newArticleId = filename.replace('.md', '');
            
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
                        <div class="article-meta-main">
                            ${formatDate(frontmatter.date)}${frontmatter.author ? ` • ${frontmatter.author}` : ''}${frontmatter.readingTime ? ` • ${frontmatter.readingTime} min read` : ''}${frontmatter.wordCount ? ` • ${formatWordCount(frontmatter.wordCount)} words` : ''}
                        </div>
                        ${frontmatter.category ? `<div class="article-meta-category">${frontmatter.category}</div>` : ''}
                    </div>
                    ${htmlContent}
                `;
            } else {
                // フロントマターがない場合は直接パース
                articleContent.innerHTML = marked.parse(text);
            }
            
            // コマンドパレットを閉じる
            closeCommandPalette();
            
            // 現在の記事IDを更新
            currentArticleId = newArticleId;
            
            // DOM更新後に位置復元
            requestAnimationFrame(() => {
                const savedPosition = localStorage.getItem(`scroll_${currentArticleId}`);
                if (savedPosition && parseInt(savedPosition) > 0) {
                    // 保存された位置にスクロール
                    window.scrollTo({ 
                        top: parseInt(savedPosition), 
                        behavior: 'instant' 
                    });
                } else {
                    // 保存位置がない場合はトップにスクロール
                    window.scrollTo({ 
                        top: 0, 
                        behavior: 'instant' 
                    });
                }
            });
            
        } catch (error) {
            console.error('記事の読み込みに失敗しました:', error);
            articleContent.innerHTML = '<p>記事の読み込みに失敗しました。</p>';
            currentArticleId = null;
        }
    }
    
    // Markedの設定
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });
    
    // 最初の記事を読み込む
    if (articles.length > 0) {
        loadArticle(articles[0].file);
    }
    
    // ヒント表示（初回のみ）
    if (!localStorage.getItem('commandPaletteHintShown')) {
        setTimeout(() => {
            console.log('💡 ヒント: Cmd/Ctrl + K でコマンドパレットを開きます');
            localStorage.setItem('commandPaletteHintShown', 'true');
        }, 2000);
    }
});