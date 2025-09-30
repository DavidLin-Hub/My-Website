// Markdown renderer - dynamically load if needed
let marked;
// Simple in-memory cache for markdown files
const mdCache = new Map();

// Current language and chapter state
let currentLang = 'en';
let currentChapter = null;
// Incrementing id to guard against race conditions when switching chapters fast
let currentLoadId = 0;

// Language configurations
const LANGUAGES = {
    'en': {
        name: 'English',
        folder: 'english',
        translations: {
            subtitle: 'Your friendly Minecraft tutorial companion',
            toc: '📚 Table of Contents',
            loading: 'Loading content...',
            error: '❌ Failed to load content. Please try again.',
            footer: 'Creator: David Lin'
        },
        chapters: {
            'getting-started': {
                title: '🚀 Getting Started',
                items: [
                    { file: '1 Welcome to Alpaca Guide.md', title: '1. Welcome to Alpaca Guide' },
                    { file: '2 Bedrock vs Java Edition.md', title: '2. Bedrock vs Java Edition' },
                    { file: '3 Buying Minecraft.md', title: '3. Buying Minecraft' },
                    { file: '4 Your First Launcher.md', title: '4. Your First Launcher' },
                    { file: '5 Tune Your Game Settings.md', title: '5. Tune Your Game Settings' },
                    { file: '6 Basic Controls.md', title: '6. Basic Controls' }
                ]
            },
            'survival': {
                title: '🏗️ Survival Basics',
                items: [
                    { file: '7 Survive the First Day.md', title: '7. Survive the First Day' },
                    { file: '8 Offline Login.md', title: '8. Offline Login' },
                    { file: '9 Playing on Servers.md', title: '9. Playing on Servers' },
                    { file: '10 Day Two of Survival.md', title: '10. Day Two of Survival' },
                    { file: '11 Your First Diamond.md', title: '11. Your First Diamond' },
                    { file: '12 Safe Mining.md', title: '12. Safe Mining' }
                ]
            },
            'advanced': {
                title: '⚔️ Advanced Gameplay',
                items: [
                    { file: '13 Enchanting.md', title: '13. Enchanting' },
                    { file: '14 To the Nether.md', title: '14. To the Nether' },
                    { file: '15 Netherite.md', title: '15. Netherite' },
                    { file: '16 Beat the Game.md', title: '16. Beat the Game' },
                    { file: '17 End Cities & Elytra.md', title: '17. End Cities & Elytra' },
                    { file: '18 Special Information.md', title: '18. Special Information' }
                ]
            },
            'pvp': {
                title: '🎯 PvP & Minigames',
                items: [
                    { file: '19 PVP Basics.md', title: '19. PVP Basics' },
                    { file: '20 BedWars.md', title: '20. BedWars' },
                    { file: '21 Bridging Tutorial.md', title: '21. Bridging Tutorial' },
                    { file: '22 SkyWars.md', title: '22. SkyWars' },
                    { file: '23 Dealing with Cheaters.md', title: '23. Dealing with Cheaters' }
                ]
            },
            'servers': {
                title: '🛠️ Servers & Mods',
                items: [
                    { file: '24 Set Up a Basic Server.md', title: '24. Set Up a Basic Server' },
                    { file: '25 Challenge 2b2t.md', title: '25. Challenge 2b2t' },
                    { file: '26 Minecraft China Edition.md', title: '26. Minecraft China Edition' },
                    { file: '27 Mod Loaders.md', title: '27. Mod Loaders' },
                    { file: '28 Recommended Mods.md', title: '28. Recommended Mods' }
                ]
            },
            'expert': {
                title: '🏆 Expert Content',
                items: [
                    { file: '29 Hardcore Mode.md', title: '29. Hardcore Mode' },
                    { file: '30 Protect Against Griefing.md', title: '30. Protect Against Griefing' },
                    { file: '31 Shulker Boxes.md', title: '31. Shulker Boxes' },
                    { file: '32 What is P2W.md', title: '32. What is P2W' },
                    { file: '33 Challenge the Wither.md', title: '33. Challenge the Wither' },
                    { file: '34 Challenge the Warden.md', title: '34. Challenge the Warden' },
                    { file: '35 Final Chapter.md', title: '35. Final Chapter' }
                ]
            }
        }
    },
    'zh-cn': {
        name: '简体中文',
        folder: 'chinese china',
        translations: {
            subtitle: '你友好的 Minecraft 教程伙伴',
            toc: '📚 目录',
            loading: '正在加载内容...',
            error: '❌ 加载内容失败，请重试。',
            footer: '制作者：David Lin'
        },
        chapters: {
            'getting-started': {
                title: '🚀 入门指南',
                items: [
                    { file: '1 欢迎来到 Alpaca Guide.md', title: '1. 欢迎来到 Alpaca Guide' },
                    { file: '2 基岩版&Java版.md', title: '2. 基岩版&Java版' },
                    { file: '3 购买Minecraft.md', title: '3. 购买Minecraft' },
                    { file: '4 你的第一个启动器.md', title: '4. 你的第一个启动器' },
                    { file: '5 调整你的游戏配置.md', title: '5. 调整你的游戏配置' },
                    { file: '6 怎么控制你自己.md', title: '6. 怎么控制你自己' }
                ]
            },
            'survival': {
                title: '🏗️ 生存基础',
                items: [
                    { file: '7 度过第一天.md', title: '7. 度过第一天' },
                    { file: '8 离线登录.md', title: '8. 离线登录' },
                    { file: '9 游玩服务器.md', title: '9. 游玩服务器' },
                    { file: '10 生存第二天.md', title: '10. 生存第二天' },
                    { file: '11 你的第一颗钻石.md', title: '11. 你的第一颗钻石' },
                    { file: '12 安全的挖矿.md', title: '12. 安全的挖矿' }
                ]
            },
            'advanced': {
                title: '⚔️ 进阶玩法',
                items: [
                    { file: '13 附魔.md', title: '13. 附魔' },
                    { file: '14 前往下界.md', title: '14. 前往下界' },
                    { file: '15 下界合金.md', title: '15. 下界合金' },
                    { file: '16 通关游戏.md', title: '16. 通关游戏' },
                    { file: '17 末地城&鞘翅.md', title: '17. 末地城&鞘翅' },
                    { file: '18 特别信息.md', title: '18. 特别信息' }
                ]
            },
            'pvp': {
                title: '🎯 PvP与小游戏',
                items: [
                    { file: '19 PVP基础.md', title: '19. PVP基础' },
                    { file: '20 起床战争.md', title: '20. 起床战争' },
                    { file: '21 搭路教程.md', title: '21. 搭路教程' },
                    { file: '22 SkyWars.md', title: '22. SkyWars' },
                    { file: '23 处理作弊者.md', title: '23. 处理作弊者' }
                ]
            },
            'servers': {
                title: '🛠️ 服务器与模组',
                items: [
                    { file: '24 架设基础服务器.md', title: '24. 架设基础服务器' },
                    { file: '25 挑战2b2t.md', title: '25. 挑战2b2t' },
                    { file: '26 中国版MC.md', title: '26. 中国版MC' },
                    { file: '27 Mod加载器.md', title: '27. Mod加载器' },
                    { file: '28 精品Mod推荐.md', title: '28. 精品Mod推荐' }
                ]
            },
            'expert': {
                title: '🏆 专家内容',
                items: [
                    { file: '29 极限模式.md', title: '29. 极限模式' },
                    { file: '30 防止恶意破坏.md', title: '30. 防止恶意破坏' },
                    { file: '31 潜影盒.md', title: '31. 潜影盒' },
                    { file: '32 什么是P2W.md', title: '32. 什么是P2W' },
                    { file: '33 挑战凋零.md', title: '33. 挑战凋零' },
                    { file: '34 挑战坚守者.md', title: '34. 挑战坚守者' },
                    { file: '35 最终章.md', title: '35. 最终章' }
                ]
            }
        }
    },
    'zh-tw': {
        name: '繁體中文',
        folder: 'chinese taiwan',
        translations: {
            subtitle: '你友好的 Minecraft 教程夥伴',
            toc: '📚 目錄',
            loading: '正在載入內容...',
            error: '❌ 載入內容失敗，請重試。',
            footer: '製作者：David Lin'
        },
        chapters: {
            'getting-started': {
                title: '🚀 入門指南',
                items: [
                    { file: '1 歡迎來到 Alpaca Guide.md', title: '1. 歡迎來到 Alpaca Guide' },
                    { file: '2 基岩版&Java版.md', title: '2. 基岩版&Java版' },
                    { file: '3 購買Minecraft.md', title: '3. 購買Minecraft' },
                    { file: '4 你的第一個啟動器.md', title: '4. 你的第一個啟動器' },
                    { file: '5 調整你的遊戲配置.md', title: '5. 調整你的遊戲配置' },
                    { file: '6 怎麼控制你自己.md', title: '6. 怎麼控制你自己' }
                ]
            },
            'survival': {
                title: '🏗️ 生存基礎',
                items: [
                    { file: '7 度過第一天.md', title: '7. 度過第一天' },
                    { file: '8 離線登錄.md', title: '8. 離線登錄' },
                    { file: '9 遊玩服務器.md', title: '9. 遊玩服務器' },
                    { file: '10 生存第二天.md', title: '10. 生存第二天' },
                    { file: '11 你的第一顆鑽石.md', title: '11. 你的第一顆鑽石' },
                    { file: '12 安全的挖礦.md', title: '12. 安全的挖礦' }
                ]
            },
            'advanced': {
                title: '⚔️ 進階玩法',
                items: [
                    { file: '13 附魔.md', title: '13. 附魔' },
                    { file: '14 前往下界.md', title: '14. 前往下界' },
                    { file: '15 下界合金.md', title: '15. 下界合金' },
                    { file: '16 通關遊戲.md', title: '16. 通關遊戲' },
                    { file: '17 末地城&鞘翅.md', title: '17. 末地城&鞘翅' },
                    { file: '18 特別信息.md', title: '18. 特別信息' }
                ]
            },
            'pvp': {
                title: '🎯 PvP與小遊戲',
                items: [
                    { file: '19 PVP基礎.md', title: '19. PVP基礎' },
                    { file: '20 起床戰爭.md', title: '20. 起床戰爭' },
                    { file: '21 搭路教程.md', title: '21. 搭路教程' },
                    { file: '22 SkyWars.md', title: '22. SkyWars' },
                    { file: '23 處理作弊者.md', title: '23. 處理作弊者' }
                ]
            },
            'servers': {
                title: '🛠️ 服務器與模組',
                items: [
                    { file: '24 架設基礎服務器.md', title: '24. 架設基礎服務器' },
                    { file: '25 挑戰2b2t.md', title: '25. 挑戰2b2t' },
                    { file: '26 中國版MC.md', title: '26. 中國版MC' },
                    { file: '27 Mod加載器.md', title: '27. Mod加載器' },
                    { file: '28 精品Mod推薦.md', title: '28. 精品Mod推薦' }
                ]
            },
            'expert': {
                title: '🏆 專家內容',
                items: [
                    { file: '29 極限模式.md', title: '29. 極限模式' },
                    { file: '30 防止惡意破壞.md', title: '30. 防止惡意破壞' },
                    { file: '31 潛影盒.md', title: '31. 潛影盒' },
                    { file: '32 什麼是P2W.md', title: '32. 什麼是P2W' },
                    { file: '33 挑戰凋零.md', title: '33. 挑戰凋零' },
                    { file: '34 挑戰堅守者.md', title: '34. 挑戰堅守者' },
                    { file: '35 最終章.md', title: '35. 最終章' }
                ]
            }
        }
    }
};

// DOM elements
const loadingEl = document.getElementById('loading');
const contentEl = document.getElementById('article-content');
const errorEl = document.getElementById('error');
let scrollSpyObserver = null;

// Simple markdown parser (fallback if CDN fails)
function simpleMarkdownParser(markdown) {
    return markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        // Wrap in paragraphs
        .replace(/^(.+)/gm, '<p>$1</p>')
        // Clean up empty paragraphs
        .replace(/<p><\/p>/g, '')
        // Horizontal rules
        .replace(/^-{3,}/gm, '<hr>');
}

// Normalize markdown content to avoid edge-case rendering like **“中文短语”** showing literal asterisks
function normalizeMarkdown(md) {
    let s = md;
    // Remove bold wrappers around quoted phrases (Chinese & ASCII quotes)
    s = s.replace(/\*\*“([^”]+)”\*\*/g, '“$1”');
    s = s.replace(/\*\*『([^』]+)』\*\*/g, '『$1』');
    s = s.replace(/\*\*「([^」]+)」\*\*/g, '「$1」');
    s = s.replace(/\*\*"([^"]+)"\*\*/g, '"$1"');
    s = s.replace(/\*\*\'([^\']+)\'\*\*/g, "'$1'");
    // Clean stray escapes around bold markers like \** ... **\
    s = s.replace(/\\\*\\\*/g, '**');
    return s;
}

// Load marked.js library with fallback
async function loadMarked() {
    if (!marked) {
        try {
            console.log('Attempting to load marked.js...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked@5.1.1/marked.min.js';
            
            const loadPromise = new Promise((resolve, reject) => {
                script.onload = () => {
                    marked = window.marked;
                    console.log('Marked.js loaded successfully from CDN');
                    resolve();
                };
                script.onerror = () => {
                    console.warn('Failed to load marked.js from CDN, using fallback parser');
                    marked = { parse: simpleMarkdownParser };
                    resolve();
                };
            });
            
            document.head.appendChild(script);
            await loadPromise;
            
        } catch (error) {
            console.warn('Error loading marked.js, using fallback parser:', error);
            marked = { parse: simpleMarkdownParser };
        }
    }
    return marked;
}

// Show loading state
function showLoading() {
    loadingEl.style.display = 'flex';
    contentEl.style.display = 'none';
    errorEl.style.display = 'none';
}

// Show content
function showContent() {
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    errorEl.style.display = 'none';
}

// Show error
function showError() {
    loadingEl.style.display = 'none';
    contentEl.style.display = 'none';
    errorEl.style.display = 'flex';
}

// Update UI language
function updateLanguageOLD_UNUSED(lang) {
    // This function is no longer used - replaced by updateLanguageUI
    console.warn('updateLanguageOLD_UNUSED called - this should not happen');
}

// Generate navigation HTML
function updateNavigation(lang) {
    const langConfig = LANGUAGES[lang];
    const navContainer = document.getElementById('chapter-nav');
    
    console.log('updateNavigation called with lang:', lang);
    console.log('langConfig:', langConfig ? 'found' : 'not found');
    console.log('navContainer:', navContainer ? 'found' : 'not found');
    
    if (!navContainer) {
        console.error('Navigation container not found');
        return;
    }
    
    if (!langConfig) {
        console.error('Language configuration not found for:', lang);
        return;
    }
    
    let html = '';
    Object.entries(langConfig.chapters).forEach(([sectionKey, section], idx) => {
            html += `
                <div class="chapter-section collapsible">
                <h3>${section.title}</h3>
                <ul>
        `;
        
        section.items.forEach(item => {
            html += `<li><a href="#" data-file="${item.file}" data-lang="${lang}">${item.title}</a></li>`;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    console.log('Generated HTML length:', html.length);
    navContainer.innerHTML = html;
    // apply initial reveal classes
    navContainer.querySelectorAll('.chapter-section').forEach((el,i)=>{
        el.classList.add('reveal-init');
        // small stagger
        setTimeout(()=> el.classList.add('reveal-in'), 40 + i*40);
    });
    // Collapsible behavior
    navContainer.querySelectorAll('.chapter-section.collapsible > h3').forEach(h3 => {
        h3.addEventListener('click', () => {
            const box = h3.parentElement;
            box.classList.toggle('collapsed');
        });
    });
    // Re-apply current search filter if any
    const searchInput = document.getElementById('nav-search');
    if (searchInput && searchInput.value) {
        filterNavigation(searchInput.value);
    }
    console.log('Navigation updated successfully');
}

// Live filter for navigation
// Small debounce helper
function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), wait);
    };
}

function wireSearch() {
    const input = document.getElementById('nav-search');
    if (!input) return;
    if (input.dataset.wired === 'true') return;
    const debounced = debounce((v)=> filterNavigation(v), 150);
    input.addEventListener('input', () => debounced(input.value));
    input.dataset.wired = 'true';
}

function filterNavigation(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('#chapter-nav .chapter-section').forEach(section => {
        let anyVisible = false;
        section.querySelectorAll('li').forEach(li => {
            const a = li.querySelector('a');
            const text = (a?.textContent || '').toLowerCase();
            const hit = q === '' || text.includes(q);
            li.style.display = hit ? '' : 'none';
            // simple highlight
            if (a) {
                a.innerHTML = a.textContent; // reset
                if (q && hit) {
                    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
                    a.innerHTML = a.textContent.replace(re, '<span class="hl">$1</span>');
                }
            }
            if (hit) anyVisible = true;
        });
        section.style.display = anyVisible ? '' : 'none';
    });
}

// Reading progress + Back to top
let progressElRef;
let backTopBtnRef;
function wireScrollUX() {
    if (!progressElRef) progressElRef = document.getElementById('reading-progress');
    if (!backTopBtnRef) backTopBtnRef = document.getElementById('back-to-top');

    const updateProgress = () => {
        if (!progressElRef || !contentEl) return;
        const max = Math.max(1, contentEl.scrollHeight - contentEl.clientHeight);
        const pct = Math.min(100, Math.max(0, (contentEl.scrollTop / max) * 100));
        progressElRef.style.width = pct + '%';
        if (backTopBtnRef) {
            const show = contentEl.scrollTop > 300;
            backTopBtnRef.style.opacity = show ? '1' : '0';
            backTopBtnRef.style.pointerEvents = show ? 'auto' : 'none';
            backTopBtnRef.style.transform = show ? 'translateY(0)' : 'translateY(8px)';
        }
    };

    // Avoid duplicate listeners
    contentEl.removeEventListener('scroll', updateProgress);
    window.removeEventListener('resize', updateProgress);
    contentEl.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();

    if (backTopBtnRef && !backTopBtnRef.dataset.wired) {
        backTopBtnRef.addEventListener('click', () => {
            contentEl.scrollTo({ top: 0, behavior: 'smooth' });
        });
        backTopBtnRef.dataset.wired = 'true';
    }
}

// Lightbox for images
function enhanceImagesForLightbox() {
    const overlay = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    if (!overlay || !imgEl || !closeBtn) return;

    const open = (src) => {
        imgEl.src = src;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { imgEl.src = ''; }, 150);
    };

    // Delegate to content images
    contentEl.querySelectorAll('img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => open(img.src));
    });

    if (!overlay.dataset.wired) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        closeBtn.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) close();
        });
        overlay.dataset.wired = 'true';
    }
}

// Update active navigation
function updateActiveNav(filename, lang) {
    // Remove active class from all links
    document.querySelectorAll('.chapter-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`[data-file="${filename}"][data-lang="${lang}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        // Scroll the sidebar to show the active item
        activeLink.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// Load and render markdown content
async function loadChapter(filename, lang) {
    if (!filename) {
        console.error('No filename provided to loadChapter');
        return;
    }
    
    // Use provided lang or current lang
    const targetLang = lang || currentLang;
    // Create a unique load id and capture it in this invocation
    const loadId = ++currentLoadId;
    console.log('=== LOAD CHAPTER START ===');
    console.log('Filename:', filename);
    console.log('Target language:', targetLang);
    console.log('Current language:', currentLang);
    
    const langConfig = LANGUAGES[targetLang];
    if (!langConfig) {
        console.error('Language config not found for:', targetLang);
        return;
    }
    
    // Store current chapter for reference
    currentChapter = filename;
    
    showLoading();
    
    try {
        // Ensure marked.js is loaded
        await loadMarked();
        console.log('Markdown parser ready');
        
        // Fetch the markdown file (with in-memory cache)
        const filePath = `article/${langConfig.folder}/${filename}`;
        console.log('Fetching:', filePath);
        let markdown;
        if (mdCache.has(filePath)) {
            markdown = mdCache.get(filePath);
            console.log('Loaded from cache');
        } else {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            markdown = await response.text();
            mdCache.set(filePath, markdown);
        }
        
    const normalized = normalizeMarkdown(markdown);
        // If another navigation happened while we were loading, abort updating
        if (loadId !== currentLoadId) {
            console.warn('Stale load ignored for', filename, 'id:', loadId, 'current:', currentLoadId);
            return;
        }
        console.log('Markdown loaded, length:', markdown.length);
        
        // Convert markdown to HTML
        let html;
        if (marked.setOptions) {
            // Using full marked.js
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });
            html = marked.parse(normalized);
        } else {
            // Using fallback parser
            html = marked.parse(normalized);
        }
        
        console.log('HTML generated, length:', html.length);
        
        // If another navigation happened after parsing, abort updating
        if (loadId !== currentLoadId) {
            console.warn('Stale render ignored for', filename, 'id:', loadId, 'current:', currentLoadId);
            return;
        }
    // Update content (remove in-article TOC as requested)
    contentEl.classList.remove('show');
    contentEl.innerHTML = html;
    // show animation
    requestAnimationFrame(() => contentEl.classList.add('show'));
        
    // Re-wire UX that depends on content/nav
    wireSearch();
    wireScrollUX();
    enhanceImagesForLightbox();
    optimizeContentAssets();
        
        // Update navigation
        updateActiveNav(filename, targetLang);
        
        // Update page title
        const firstHeading = contentEl.querySelector('h1, h2, h3');
        if (firstHeading) {
            document.title = `${firstHeading.textContent} - Alpaca Guide`;
        }
        
        // Scroll content to top
        contentEl.scrollTop = 0;
        
    // Update URL hash (use resolved targetLang to avoid undefined reverts)
    const hashValue = `${targetLang}-${filename.replace('.md', '').replace(/\s+/g, '-').toLowerCase()}`;
    suppressHashHandler = true;
    window.location.hash = hashValue;
        
        showContent();
    console.log('Chapter loaded successfully');
    // Idle prefetch the next chapter to speed up navigation
    prefetchNextChapter(filename, targetLang);
        
    } catch (error) {
        console.error('Error loading chapter:', error);
        // Add more detailed error info
        errorEl.innerHTML = `
            <p>❌ ${langConfig.translations.error}</p>
            <p style="font-size: 0.9em; color: #666;">Error: ${error.message}</p>
            <button onclick="loadChapter('${filename}', '${targetLang}')" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
        `;
        showError();
    }
}

// Detect browser language and get appropriate default
function detectDefaultLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    
    if (browserLang.startsWith('zh')) {
        // Check for Traditional Chinese regions
        if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('MO')) {
            return 'zh-tw';
        }
        // Default to Simplified Chinese
        return 'zh-cn';
    }
    
    // Default to English for all other languages
    return 'en';
}

// Load default chapter from URL hash or first chapter
function loadDefaultChapter() {
    console.log('Loading default chapter...');
    console.log('Current language at start:', currentLang);
    
    const hash = window.location.hash.slice(1);
    if (hash) {
        // Parse hash format: lang-chapter-title
        const hashParts = hash.split('-');
        if (hashParts.length >= 2) {
            const hashLang = hashParts[0];
            const chapterPart = hashParts.slice(1).join('-');
            
            if (LANGUAGES[hashLang]) {
                console.log('Loading from hash, language:', hashLang);
                currentLang = hashLang;
                updateLanguageUI(hashLang);
                
                // Try to find matching chapter
                for (const section of Object.values(LANGUAGES[hashLang].chapters)) {
                    for (const item of section.items) {
                        const itemHash = item.file.replace('.md', '').replace(/\s+/g, '-').toLowerCase();
                        if (itemHash === chapterPart) {
                            loadChapter(item.file, hashLang);
                            return;
                        }
                    }
                }
            }
        }
    }
    
    // Load first chapter using current language
    console.log('Loading first chapter with current language:', currentLang);
    const firstChapter = getFirstChapterForLanguage(currentLang);
    if (firstChapter) {
        loadChapter(firstChapter, currentLang);
    }
}

// Handle navigation clicks
function handleNavigation() {
    // Remove all existing event listeners by cloning elements
    const navContainer = document.getElementById('chapter-nav');
    if (!navContainer) return;
    
    // Use event delegation instead of individual listeners
    navContainer.removeEventListener('click', handleNavClick);
    navContainer.addEventListener('click', handleNavClick);
}

// Navigation click handler
function handleNavClick(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('data-file')) {
        e.preventDefault();
        const filename = e.target.getAttribute('data-file');
        const lang = e.target.getAttribute('data-lang') || currentLang;
        console.log('Navigation clicked:', filename, 'language:', lang);
        loadChapter(filename, lang);
    }
}

// Handle language switching
function handleLanguageSwitching() {
    console.log('Setting up language switching...');
    
    // Clear any existing listeners and set up fresh ones
    document.querySelectorAll('.lang-btn').forEach(btn => {
        // Clone to remove all existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const targetLang = this.getAttribute('data-lang');
            console.log('=== LANGUAGE SWITCH START ===');
            console.log('Target language:', targetLang);
            console.log('Current language before switch:', currentLang);
            
            // Immediately update current language
            currentLang = targetLang;
            localStorage.setItem('alpaca-guide-lang', targetLang);
            // Cancel any in-flight loads and clear current chapter
            currentLoadId++;
            currentChapter = null;
            
            console.log('Current language after switch:', currentLang);
            
            // Update UI first
            updateLanguageUI(targetLang);
            
            // Then load content
            const firstChapter = getFirstChapterForLanguage(targetLang);
            if (firstChapter) {
                console.log('Loading first chapter:', firstChapter);
                loadChapter(firstChapter, targetLang);
            }
            
            console.log('=== LANGUAGE SWITCH END ===');
        });
    });
}

// Helper function to update only UI elements
function updateLanguageUI(lang) {
    const langConfig = LANGUAGES[lang];
    if (!langConfig) return;
    
    console.log('Updating UI for language:', lang);
    
    // Update translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langConfig.translations[key]) {
            element.innerHTML = langConfig.translations[key];
        }
    });
    
    // Update navigation
    updateNavigation(lang);
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Re-bind navigation events
    handleNavigation();
}

// Helper function to get first chapter for a language
function getFirstChapterForLanguage(lang) {
    const langConfig = LANGUAGES[lang];
    if (!langConfig) return null;
    
    const firstSection = Object.values(langConfig.chapters)[0];
    if (firstSection && firstSection.items.length > 0) {
        return firstSection.items[0].file;
    }
    return null;
}

// Get current chapter file
function getCurrentChapterFile() {
    return currentChapter;
}

// Find chapter by number in specific language
function findChapterByNumber(number, lang) {
    const langConfig = LANGUAGES[lang];
    if (!langConfig) return null;
    
    for (const section of Object.values(langConfig.chapters)) {
        for (const item of section.items) {
            if (item.file.startsWith(number + ' ')) {
                return item.file;
            }
        }
    }
    return null;
}

// Handle browser back/forward buttons
let suppressHashHandler = false;
window.addEventListener('hashchange', () => {
    if (suppressHashHandler) {
        // Programmatic update; skip handling
        suppressHashHandler = false;
        return;
    }
    loadDefaultChapter();
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Alpaca Guide...');
    
    // Set initial language ONCE
    const savedLang = localStorage.getItem('alpaca-guide-lang') || detectDefaultLanguage();
    console.log('Setting initial language to:', savedLang);
    currentLang = savedLang;
    
    // Update UI to match initial language
    updateLanguageUI(savedLang);
    wireSearch();
    wireScrollUX();
    
    // Set up language switching events
    handleLanguageSwitching();
    
    // Load default content
    loadDefaultChapter();
    
    console.log('Alpaca Guide initialized with language:', currentLang);
});

// Add some useful utilities
window.alpacaGuide = {
    loadChapter,
    getCurrentChapter: () => {
        const activeLink = document.querySelector('.chapter-nav a.active');
        return activeLink ? activeLink.getAttribute('data-file') : null;
    },
    
    // Navigate to next/previous chapter
    nextChapter: () => {
        const activeLink = document.querySelector('.chapter-nav a.active');
        if (activeLink) {
            const nextLink = activeLink.closest('li').nextElementSibling?.querySelector('a') ||
                           activeLink.closest('.chapter-section').nextElementSibling?.querySelector('a');
            if (nextLink) {
                nextLink.click();
            }
        }
    },
    
    prevChapter: () => {
        const activeLink = document.querySelector('.chapter-nav a.active');
        if (activeLink) {
            const prevLink = activeLink.closest('li').previousElementSibling?.querySelector('a') ||
                           activeLink.closest('.chapter-section').previousElementSibling?.querySelectorAll('a');
            if (prevLink) {
                (prevLink.length ? prevLink[prevLink.length - 1] : prevLink).click();
            }
        }
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + Arrow keys for navigation
    if (e.altKey) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            window.alpacaGuide.nextChapter();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            window.alpacaGuide.prevChapter();
        }
    }
});

// Theme toggle with persistence
(function themeInit(){
    const key = 'alpaca-theme';
    const btn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem(key) || 'light';
    if (saved === 'dark') document.documentElement.classList.add('dark');
    if (btn) {
        btn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
        btn.addEventListener('click', ()=>{
            document.documentElement.classList.toggle('dark');
            const dark = document.documentElement.classList.contains('dark');
            localStorage.setItem(key, dark ? 'dark' : 'light');
            btn.textContent = dark ? '☀️' : '🌙';
        });
    }
})();

// Generate Table of Contents and enable scrollspy
function generateTOC(html){
    // Create a DOM to parse headings
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const headings = tmp.querySelectorAll('h1, h2, h3');
    const tocItems = [];
    headings.forEach((h, i)=>{
        if (!h.id) {
            const id = (h.textContent || 'h')
                .toLowerCase()
                .trim()
                .replace(/\s+/g,'-')
                .replace(/[^a-z0-9\-]/g,'') + '-' + i;
            h.id = id;
        }
        tocItems.push({level: Number(h.tagName.substring(1)), id: h.id, text: h.textContent});
    });
    const tocHtml = renderTOC(tocItems);
    const articleHtml = tmp.innerHTML;
    const wrapper = `
        <div class="article-layout">
            <aside class="article-toc">
                ${tocHtml}
            </aside>
            <div class="article-content-inner">
                ${articleHtml}
            </div>
        </div>`;
    // Attach scrollspy later
    setTimeout(()=>setupScrollSpy(), 0);
    return wrapper;
}

function renderTOC(items){
    if (!items.length) return '';
    let html = '<div class="toc"><div class="toc-title">On this page</div><ul>';
    items.forEach(it=>{
        html += `<li class="lvl-${it.level}"><a href="#${it.id}">${escapeHtml(it.text)}</a></li>`;
    });
    html += '</ul></div>';
    return html;
}

function escapeHtml(s){
    return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

function setupScrollSpy(){
    try { if (scrollSpyObserver) { scrollSpyObserver.disconnect(); scrollSpyObserver = null; } } catch {}
    const toc = document.querySelector('.toc');
    if (!toc) return;
    const links = toc.querySelectorAll('a');
    const map = new Map();
    links.forEach(a=>{ const id = a.getAttribute('href').slice(1); const el = document.getElementById(id); if (el) map.set(id, {a, el}); });
    const opts = { root: contentEl, rootMargin: '0px 0px -70% 0px', threshold: 0.01 };
    scrollSpyObserver = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            const id = entry.target.id;
            const item = map.get(id); if (!item) return;
            if (entry.isIntersecting) {
                toc.querySelectorAll('a.active').forEach(x=>x.classList.remove('active'));
                item.a.classList.add('active');
            }
        });
    }, opts);
    map.forEach(({el})=> scrollSpyObserver.observe(el));
    // Smooth scroll for TOC links without altering main hash (keeps chapter routing intact)
    toc.addEventListener('click', (e)=>{
        const a = e.target.closest('a');
        if (!a) return;
        const id = a.getAttribute('href');
        if (!id || !id.startsWith('#')) return;
        const el = document.querySelector(id);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Post-render optimizations (lazy images, decoding hints)
function optimizeContentAssets(){
    if (!contentEl) return;
    contentEl.querySelectorAll('img').forEach(img => {
        // Only adjust if not already set
        if (!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
        // Prefer low priority for content images
        try { if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority','low'); } catch {}
    });
    
    // Add copy buttons to code blocks
    contentEl.querySelectorAll('pre:not(.copy-enabled)').forEach(pre => {
        pre.classList.add('copy-enabled');
        const btn = document.createElement('button');
        btn.className = 'copy-code-btn';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        btn.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            try {
                await navigator.clipboard.writeText(text);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            } catch {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Copy', 2000);
            }
        });
        pre.appendChild(btn);
    });
}

// Prefetch next chapter (best-effort, idle)
function prefetchNextChapter(currentFile, lang){
    const langConfig = LANGUAGES[lang];
    if (!langConfig) return;
    // Flatten items
    const items = [];
    Object.values(langConfig.chapters).forEach(sec => items.push(...sec.items.map(it=>it.file)));
    const idx = items.indexOf(currentFile);
    if (idx === -1 || idx >= items.length - 1) return;
    const nextFile = items[idx+1];
    const filePath = `article/${langConfig.folder}/${nextFile}`;
    if (mdCache.has(filePath)) return;
    const doFetch = () => {
        fetch(filePath).then(r=>{ if(r.ok) return r.text(); throw 0; }).then(txt=>{ mdCache.set(filePath, txt); }).catch(()=>{});
    };
    if ('requestIdleCallback' in window) {
        requestIdleCallback(doFetch, { timeout: 1500 });
    } else {
        setTimeout(doFetch, 300);
    }
}