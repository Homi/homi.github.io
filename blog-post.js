class BlogPostPage {
    constructor() {
        this.marked = window.marked;
        this.titleElement = document.getElementById('article-title');
        this.descriptionElement = document.getElementById('article-description');
        this.metaElement = document.getElementById('article-meta');
        this.tagsElement = document.getElementById('article-tags');
        this.contentElement = document.getElementById('article-content');
        this.descriptionMetaTag = document.querySelector('meta[name="description"]');
    }

    normalizeMarkdownContent(content) {
        return content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    }

    parseFrontmatter(content) {
        const normalizedContent = this.normalizeMarkdownContent(content);
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
        const match = normalizedContent.match(frontmatterRegex);

        if (!match) {
            return { frontmatter: {}, content: normalizedContent };
        }

        const frontmatter = {};
        const lines = match[1].split('\n');

        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex <= 0) {
                continue;
            }

            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value);
                } catch (error) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
                }
            } else if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }

            frontmatter[key] = value;
        }

        return { frontmatter, content: match[2] };
    }

    async loadTextFile(filePath) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                        return;
                    }

                    resolve(null);
                }
            };
            xhr.onerror = function() {
                resolve(null);
            };
            xhr.send();
        });
    }

    async loadContentIndex() {
        const indexContent = await this.loadTextFile('./blogs/index.json');

        if (!indexContent) {
            return [];
        }

        try {
            const parsedIndex = JSON.parse(indexContent);
            if (Array.isArray(parsedIndex)) {
                return parsedIndex;
            }

            if (Array.isArray(parsedIndex.files)) {
                return parsedIndex.files;
            }
        } catch (error) {
            console.error('Invalid blog index JSON', error);
        }

        return [];
    }

    getRequestedPost() {
        const params = new URLSearchParams(window.location.search);
        return params.get('post');
    }

    isSafePostFileName(fileName) {
        return /^[a-z0-9-]+\.md$/i.test(fileName);
    }

    formatDate(dateValue) {
        const date = new Date(dateValue || '2020-01-01');
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    estimateReadingTime(markdownContent) {
        const plainText = markdownContent
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/`[^`]*`/g, ' ')
            .replace(/[#!>*_[\]()\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const wordCount = plainText ? plainText.split(' ').length : 0;
        return Math.max(1, Math.ceil(wordCount / 220));
    }

    renderTags(tags) {
        if (!Array.isArray(tags) || tags.length === 0) {
            this.tagsElement.innerHTML = '';
            return;
        }

        this.tagsElement.innerHTML = tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
    }

    renderArticle(article) {
        const readTime = this.estimateReadingTime(article.markdownContent);

        this.titleElement.textContent = article.title || 'บทความจากบล็อก';
        this.descriptionElement.textContent = article.description || 'บทความฉบับเต็มจาก Homi';
        this.metaElement.innerHTML = `
            <span>${this.formatDate(article.date)}</span>
            <span>อ่านประมาณ ${readTime} นาที</span>
            <span>ไฟล์ ${article.fileName.replace('.md', '')}</span>
        `;
        this.renderTags(article.tags);
        this.contentElement.innerHTML = article.htmlContent;
        document.title = `${article.title || 'บทความ'} - Homi`;

        if (this.descriptionMetaTag && article.description) {
            this.descriptionMetaTag.setAttribute('content', article.description);
        }
    }

    renderError(title, description, message) {
        this.titleElement.textContent = title;
        this.descriptionElement.textContent = description;
        this.metaElement.innerHTML = '';
        this.tagsElement.innerHTML = '';
        this.contentElement.innerHTML = `<p class="loading-error">${message}</p>`;
        document.title = `${title} - Homi`;

        if (this.descriptionMetaTag) {
            this.descriptionMetaTag.setAttribute('content', description);
        }
    }

    async init() {
        if (!this.marked) {
            this.renderError('ไม่สามารถแสดงบทความได้', 'ตัวแปลง Markdown ยังโหลดไม่สำเร็จ', 'กรุณารีเฟรชหน้าแล้วลองอีกครั้ง');
            return;
        }

        const requestedPost = this.getRequestedPost();

        if (!requestedPost) {
            this.renderError('ไม่พบบทความที่ต้องการ', 'หน้านี้ต้องเปิดผ่านลิงก์จากรายการบล็อก', 'กรุณากลับไปที่หน้าหลักแล้วเลือกบทความจากส่วนบล็อก');
            return;
        }

        if (!this.isSafePostFileName(requestedPost)) {
            this.renderError('ลิงก์บทความไม่ถูกต้อง', 'ระบบปฏิเสธชื่อไฟล์ที่ไม่อยู่ในรูปแบบที่รองรับ', 'กรุณากลับไปเลือกบทความจากหน้าหลักอีกครั้ง');
            return;
        }

        const knownPosts = await this.loadContentIndex();
        if (knownPosts.length > 0 && !knownPosts.includes(requestedPost)) {
            this.renderError('ไม่พบบทความนี้', 'ชื่อไฟล์ของบทความไม่อยู่ในรายการที่เผยแพร่', 'กรุณาตรวจสอบลิงก์ หรือกลับไปเลือกบทความจากหน้าหลักอีกครั้ง');
            return;
        }

        const markdownFile = await this.loadTextFile(`./blogs/${requestedPost}`);
        if (!markdownFile) {
            const isLocalFile = window.location.protocol === 'file:';
            const message = isLocalFile
                ? 'หน้าอ่านบทความต้องเปิดผ่าน local server หรือ GitHub Pages เพื่อให้เบราว์เซอร์โหลดไฟล์ Markdown ได้'
                : 'เกิดข้อผิดพลาดระหว่างโหลดไฟล์บทความ กรุณาลองใหม่อีกครั้ง';

            this.renderError('ยังโหลดบทความไม่ได้', 'ระบบไม่สามารถดึงเนื้อหาของบทความฉบับเต็มได้ในตอนนี้', message);
            return;
        }

        const parsedArticle = this.parseFrontmatter(markdownFile);
        this.renderArticle({
            ...parsedArticle.frontmatter,
            fileName: requestedPost,
            markdownContent: parsedArticle.content,
            htmlContent: this.marked.parse(parsedArticle.content),
            date: parsedArticle.frontmatter.date || '2020-01-01'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const blogPostPage = new BlogPostPage();
    blogPostPage.init();
});