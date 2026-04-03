// Content Loader - โหลดและแสดงข้อมูลจากไฟล์ Markdown
class ContentLoader {
    constructor() {
        this.marked = window.marked;
        this.portfolioContainer = document.querySelector('#portfolio .portfolio-grid');
        this.blogContainer = document.querySelector('#blog .blog-list');
    }

    // แยก frontmatter จากเนื้อหา Markdown
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return { frontmatter: {}, content: content };
        }

        const frontmatterStr = match[1];
        const markdownContent = match[2];

        // แปลง frontmatter string เป็น object
        const frontmatter = {};
        const lines = frontmatterStr.split('\n');

        for (let line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();

                // จัดการ array (เช่น technologies, tags)
                if (value.startsWith('[') && value.endsWith(']')) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
                    }
                } else if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }

                frontmatter[key] = value;
            }
        }

        return { frontmatter, content: markdownContent };
    }

    // โหลดไฟล์ Markdown
    async loadMarkdownFile(filePath) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        console.warn(`File not found or error loading ${filePath}: ${xhr.status}`);
                        resolve(null); // Resolve with null instead of rejecting
                    }
                }
            };
            xhr.onerror = function() {
                console.warn(`Network error loading ${filePath}`);
                resolve(null);
            };
            xhr.send();
        });
    }

    // โหลดไฟล์ทั้งหมดในโฟลเดอร์
    async loadContentFromFolder(folder, fileList) {
        const contentPromises = fileList.map(async (fileName) => {
            const filePath = `${folder}/${fileName}`;
            const content = await this.loadMarkdownFile(filePath);

            if (content) {
                const { frontmatter, content: markdownContent } = this.parseFrontmatter(content);
                const htmlContent = this.marked.parse(markdownContent);

                return {
                    ...frontmatter,
                    fileName,
                    htmlContent,
                    date: new Date(frontmatter.date || '2020-01-01')
                };
            }
            return null;
        });

        const contents = await Promise.all(contentPromises);
        return contents.filter(content => content !== null);
    }

    // เรียงตามวันที่ (ใหม่ขึ้นก่อน)
    sortByDate(contents) {
        return contents.sort((a, b) => b.date - a.date);
    }

    // สร้าง HTML สำหรับ portfolio card
    createPortfolioCard(item) {
        const techStack = item.technologies ?
            item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') :
            '';

        const demoLink = item.demo && item.demo !== '#' ?
            `<a href="${item.demo}">เล่นเกม</a>` : '';

        const sourceLink = item.source && item.source !== '#' ?
            `<a href="${item.source}">ซอร์สโค้ด</a>` : '';

        const links = [demoLink, sourceLink].filter(link => link).join('');

        return `
            <div class="portfolio-card">
                <div class="portfolio-card-header">
                    <h3>${item.image || '📁'} ${item.title}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="portfolio-card-body">
                    <p>${item.htmlContent.split('\n')[0] || 'รายละเอียดโครงการ'}</p>
                    <div class="tech-stack">
                        ${techStack}
                    </div>
                    ${links ? `<div class="portfolio-links">${links}</div>` : ''}
                </div>
            </div>
        `;
    }

    // สร้าง HTML สำหรับ blog card
    createBlogCard(item) {
        const dateStr = item.date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="blog-card">
                <div class="blog-card-image">${item.image || '📝'}</div>
                <div class="blog-card-content">
                    <p class="blog-date">${dateStr}</p>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="#" class="read-more" onclick="showBlogContent('${item.fileName}')">อ่านเพิ่มเติม →</a>
                </div>
            </div>
        `;
    }

    // แสดง portfolio
    async loadPortfolio() {
        try {
            const portfolioFiles = ['bj-makruk.md', 'project2.md', 'project3.md'];
            const portfolioItems = await this.loadContentFromFolder('portfolio', portfolioFiles);
            const sortedItems = this.sortByDate(portfolioItems);

            if (sortedItems.length > 0) {
                const portfolioHTML = sortedItems.map(item => this.createPortfolioCard(item)).join('');
                this.portfolioContainer.innerHTML = portfolioHTML;
            } else {
                this.portfolioContainer.innerHTML = '<p class="loading-error">ไม่สามารถโหลดข้อมูลผลงานได้ กรุณาลองใหม่อีกครั้ง</p>';
            }
        } catch (error) {
            console.error('Error loading portfolio:', error);
            this.portfolioContainer.innerHTML = '<p class="loading-error">เกิดข้อผิดพลาดในการโหลดผลงาน</p>';
        }
    }

    // แสดง blog
    async loadBlogs() {
        try {
            const blogFiles = ['javascript-makruk-game.md', 'javascript-performance-tips.md', 'makruk-ai-minimax.md'];
            const blogItems = await this.loadContentFromFolder('blogs', blogFiles);
            const sortedItems = this.sortByDate(blogItems);

            if (sortedItems.length > 0) {
                const blogHTML = sortedItems.map(item => this.createBlogCard(item)).join('');
                this.blogContainer.innerHTML = blogHTML;
            } else {
                this.blogContainer.innerHTML = '<p class="loading-error">ไม่สามารถโหลดข้อมูลบล็อกได้ กรุณาลองใหม่อีกครั้ง</p>';
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
            this.blogContainer.innerHTML = '<p class="loading-error">เกิดข้อผิดพลาดในการโหลดบล็อก</p>';
        }
    }

    // แสดง fallback content เมื่อโหลดไม่ได้
    showFallbackContent() {
        const fallbackPortfolio = `
            <div class="portfolio-card">
                <div class="portfolio-card-header">
                    <h3>🎮 BJ-Makruk</h3>
                    <p>เกมหมากรุกไทย</p>
                </div>
                <div class="portfolio-card-body">
                    <p>โปรแกรมเล่นหมากรุกไทยที่เขียนด้วย JavaScript ล้วน ๆ พร้อม AI ให้ผู้เล่นได้หมุนหมาย</p>
                    <div class="tech-stack">
                        <span class="tech-tag">JavaScript</span>
                        <span class="tech-tag">HTML5</span>
                        <span class="tech-tag">Canvas</span>
                        <span class="tech-tag">AI</span>
                    </div>
                    <div class="portfolio-links">
                        <a href="./bj-makruk/index.html">เล่นเกม</a>
                        <a href="https://github.com/Homi/Homi.github.io">ซอร์สโค้ด</a>
                    </div>
                </div>
            </div>
            <div class="portfolio-card">
                <div class="portfolio-card-header">
                    <h3>📱 โครงการที่ 2</h3>
                    <p>กำลังพัฒนา</p>
                </div>
                <div class="portfolio-card-body">
                    <p>เว็บแอปพลิเคชันหรือเกมใหม่ที่อยู่ในช่วงพัฒนา เพื่อให้คุณได้เห็นงานล่าสุดของฉัน</p>
                    <div class="tech-stack">
                        <span class="tech-tag">ระหว่างดำเนินการ</span>
                    </div>
                </div>
            </div>
            <div class="portfolio-card">
                <div class="portfolio-card-header">
                    <h3>🚀 โครงการที่ 3</h3>
                    <p>อีกชิ้นหนึ่ง</p>
                </div>
                <div class="portfolio-card-body">
                    <p>โครงการใหม่ที่จะเพิ่มเติมในอนาคต มาติดตามสำหรับการอัปเดตใหม่</p>
                    <div class="tech-stack">
                        <span class="tech-tag">ระหว่างดำเนินการ</span>
                    </div>
                </div>
            </div>
        `;

        const fallbackBlog = `
            <div class="blog-card">
                <div class="blog-card-image">✨</div>
                <div class="blog-card-content">
                    <p class="blog-date">15 มีนาคม 2026</p>
                    <h3>การเขียนเกมหมากรุกด้วย JavaScript</h3>
                    <p>เรียนรู้วิธีการสร้างเอนจิ่นหมากรุกที่สามารถคิดเลยกลยุทธ์ได้ด้วย JavaScript</p>
                    <a href="#" class="read-more">อ่านเพิ่มเติม →</a>
                </div>
            </div>
            <div class="blog-card">
                <div class="blog-card-image">💡</div>
                <div class="blog-card-content">
                    <p class="blog-date">10 มีนาคม 2026</p>
                    <h3>เคล็ดลับการเพิ่มประสิทธิภาพของโค้ด</h3>
                    <p>แนวทางปฏิบัติที่ดีที่สุดสำหรับการเขียนโค้ด JavaScript ที่มีประสิทธิภาพสูง</p>
                    <a href="#" class="read-more">อ่านเพิ่มเติม →</a>
                </div>
            </div>
            <div class="blog-card">
                <div class="blog-card-image">🎯</div>
                <div class="blog-card-content">
                    <p class="blog-date">5 มีนาคม 2026</p>
                    <h3>เล่นเกมหมากรุกกับ AI</h3>
                    <p>วิธีการมินแม็กซ์ (Minimax) และสิ่งที่ต้องรู้เกี่ยวกับการสร้าง AI สำหรับเกม</p>
                    <a href="#" class="read-more">อ่านเพิ่มเติม →</a>
                </div>
            </div>
        `;

        this.portfolioContainer.innerHTML = fallbackPortfolio;
        this.blogContainer.innerHTML = fallbackBlog;
    }
}

// ฟังก์ชันสำหรับแสดงเนื้อหาบล็อกแบบเต็ม (สำหรับอนาคต)
function showBlogContent(fileName) {
    // TODO: เปิด modal หรือหน้าใหม่แสดงเนื้อหาบล็อกเต็ม
    console.log('แสดงเนื้อหาบล็อก:', fileName);
}

// เริ่มโหลดเนื้อหาเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const contentLoader = new ContentLoader();
    const statusMessage = document.getElementById('status-message');

    // ตรวจสอบว่าเป็น local file system หรือไม่
    if (window.location.protocol === 'file:') {
        console.log('Running in local file system, showing fallback content');
        statusMessage.textContent = '📁 กำลังแสดงเนื้อหาจาก local files';
        // แสดง fallback content สำหรับ local development
        contentLoader.showFallbackContent();
        return;
    }

    statusMessage.textContent = '🌐 กำลังโหลดเนื้อหาจาก server...';

    // แสดง loading message
    contentLoader.portfolioContainer.innerHTML = '<p class="loading-error">กำลังโหลดข้อมูลผลงาน...</p>';
    contentLoader.blogContainer.innerHTML = '<p class="loading-error">กำลังโหลดข้อมูลบล็อก...</p>';

    contentLoader.loadAllContent().then(() => {
        statusMessage.textContent = '✅ โหลดเนื้อหาสำเร็จแล้ว!';
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }).catch(error => {
        console.error('Error loading content:', error);
        statusMessage.textContent = '⚠️ เกิดข้อผิดพลาด แสดงเนื้อหาจาก cache';
        // แสดง fallback content ถ้าโหลดไม่ได้
        contentLoader.showFallbackContent();
    });
});