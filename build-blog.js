const fs = require('fs');
const path = require('path');

// 1. Read Posts
const postsPath = path.join(__dirname, 'blog', 'posts.json');
const postsData = fs.readFileSync(postsPath, 'utf8');
const posts = JSON.parse(postsData);

// Format date helper
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ar-EG', options);
};

// 2. Define Shared Header & Footer
const header = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}}</title>
<meta name="description" content="{{EXCERPT}}">
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{EXCERPT}}">
<meta property="og:image" content="{{IMAGE}}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/style.css">
<script>
window.shareArticle = function(platform, title) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title + " | مدونة أسس");
  if (platform === 'twitter') {
    window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
  } else if (platform === 'linkedin') {
    window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`, '_blank');
  } else if (platform === 'whatsapp') {
    window.open(\`https://api.whatsapp.com/send?text=\${text} \${url}\`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(window.location.href).then(() => { alert('تم نسخ الرابط بنجاح!'); });
  }
};
</script>
</head>
<body>
<header>
  <div class="nav">
    <div class="brand">
      <a href="../index.html" style="display:flex; align-items:center; gap:12px;">
        <img src="../assets/logo.png" alt="شعار أسس">
        <div class="brand-name">أسس<span>OSOS DEV</span></div>
      </a>
    </div>
    <nav>
      <ul>
        <li><a href="../index.html#services">خدماتنا</a></li>
        <li><a href="../index.html#process">طريقة عملنا</a></li>
        <li><a href="../index.html#work">أعمالنا</a></li>
        <li><a href="index.html">المدونة</a></li>
        <li><a href="../index.html#contact">تواصل معنا</a></li>
      </ul>
    </nav>
    <a href="../index.html#contact" class="nav-cta">ابدأ مشروعك</a>
  </div>
</header>`;

const footer = `<footer>
  <div class="wrap">
    <div class="footer-top">
      <div>
        <div class="footer-brand">
          <img src="../assets/logo.png" alt="شعار أسس">
          <span>أسس.ديف — OSOS.dev</span>
        </div>
        <p class="desc">استوديو برمجي يبني مواقع وتطبيقات على أساس تقني متين وتصميم مدروس.</p>
      </div>
      <div>
        <h5>روابط</h5>
        <ul>
          <li><a href="../index.html#services">خدماتنا</a></li>
          <li><a href="../index.html#process">طريقة عملنا</a></li>
          <li><a href="../index.html#work">أعمالنا</a></li>
          <li><a href="index.html">المدونة</a></li>
        </ul>
      </div>
      <div>
        <h5>تواصل</h5>
        <ul>
          <li><a href="https://instagram.com/osos" target="_blank" rel="noopener">إنستقرام @osos</a></li>
          <li><a href="../index.html#contact">احجز استشارة</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
        <span class="credit">© 2026 osos.dev. جميع الحقوق محفوظة.</span>
        <span class="credit">تصميم وتطوير <b>بدر فرحان</b> &amp; <b>حمزة الخطيب</b></span>
    </div>
  </div>
</footer>
</body>
</html>`;

// 3. Generate Blog Index Page (blog/index.html)
let indexGridHTML = '';
posts.forEach((post, index) => {
  indexGridHTML += `
    <div class="blog-card fade-up-card" style="animation-delay: ${index * 0.15}s; cursor: pointer;" onclick="window.location.href='${post.slug}.html'">
      <div class="blog-card-img">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-card-body">
        <span class="blog-date">${formatDate(post.date)}</span>
        <h3><a href="${post.slug}.html">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <a href="${post.slug}.html" class="read-more">اقرأ المزيد &larr;</a>
      </div>
    </div>
  `;
});

const indexPageHTML = header
  .replace('{{TITLE}}', 'المدونة | أسس — OSOS')
  .replace('{{EXCERPT}}', 'مقالات متخصصة في تطوير الويب، التصميم، وريادة الأعمال الرقمية.')
  .replace('{{IMAGE}}', '../assets/logo.png') + `
<section class="blog-hero">
  <div class="wrap" style="text-align:center; padding: 100px 0 60px;">
    <div class="eyebrow" style="justify-content:center; margin: 0 auto 26px;"><span class="eyebrow-dot"></span> المدونة</div>
    <h1 style="font-size:clamp(34px, 4vw, 54px); margin-bottom:16px;">أفكار ورؤى حول الويب</h1>
    <p style="margin:0 auto; max-width:600px; color:var(--secondary); font-size:18px;">مقالات متخصصة في تطوير الويب، التصميم، وريادة الأعمال الرقمية.</p>
  </div>
</section>
<section class="blog-list" style="padding-bottom:120px;">
  <div class="wrap">
    <div class="portfolio-grid">
      ${indexGridHTML}
    </div>
  </div>
</section>
` + footer;

fs.writeFileSync(path.join(__dirname, 'blog', 'index.html'), indexPageHTML);

// 4. Generate Individual Article Pages (blog/[slug].html)
posts.forEach(post => {
  const articleHTML = header
    .replace('{{TITLE}}', `${post.title} | مدونة أسس`)
    .replace('{{EXCERPT}}', post.excerpt)
    .replace('{{IMAGE}}', post.image) + `
<section class="article-wrapper" style="padding: 120px 0; min-height: 80vh;">
  <div class="wrap" style="max-width: 800px; margin: 0 auto;">
    <article class="single-article fade-up-card" style="animation-delay: 0.1s">
      <div class="article-header">
        <span class="blog-date">${formatDate(post.date)}</span>
        <h1>${post.title}</h1>
      </div>
      <div class="article-img">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="article-body">
        ${post.content}
      </div>
      
      <!-- Share Module -->
      <div class="article-share">
        <span>شارك هذا المقال:</span>
        <div class="share-buttons">
          <button onclick="shareArticle('twitter', '${post.title.replace(/'/g, "\\'")}')" aria-label="Share on X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 3.869H5.078z"/></svg>
          </button>
          <button onclick="shareArticle('linkedin', '${post.title.replace(/'/g, "\\'")}')" aria-label="Share on LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </button>
          <button onclick="shareArticle('whatsapp', '${post.title.replace(/'/g, "\\'")}')" aria-label="Share on WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </button>
          <button onclick="shareArticle('copy', '${post.title.replace(/'/g, "\\'")}')" aria-label="Copy Link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>
      </div>
      
      <!-- Author Box -->
      <div class="article-author-box" style="cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;" onclick="window.location.href='../badr.html'" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px -10px rgba(55, 52, 152, 0.2)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <div class="author-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div class="author-info">
          <strong>بدر فرحان</strong>
          <span>كاتب المقال</span>
        </div>
      </div>

      <div class="article-footer">
        <a href="index.html" class="btn-ghost" style="margin:0;">&rarr; العودة للمدونة</a>
      </div>
    </article>
  </div>
</section>
` + footer;

  fs.writeFileSync(path.join(__dirname, 'blog', `${post.slug}.html`), articleHTML);
});

console.log('Blog built successfully! 🚀');
