# VIGNESHWARAN J — Cybersecurity Portfolio

A modern, professional, single-page portfolio website with a **cybersecurity / hacker aesthetic**.
Built with pure HTML, CSS, and vanilla JavaScript — zero frameworks, zero build step required.

## 🗂️ File Structure

```
My_Portfolio/
├── index.html      ← Main HTML (all sections & content here)
├── style.css       ← All styles, colors, animations
├── script.js       ← Interactions: matrix, boot screen, typewriter, etc.
├── images/
│   └── photo.jpg   ← YOUR PROFILE PHOTO (replace this!)
└── README.md       ← This file
```

---

## 🚀 How to Open Locally

Simply double-click `index.html` in your file explorer to open it in any browser.

> **For a live-reload dev experience**, install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension and click "Go Live".

---

## ✏️ How to Customize

### 1. Replace Your Profile Photo

1. Add your photo to the `images/` folder and name it `photo.jpg`  
   (or any name — just update `src` in `index.html`).

In `index.html`, find:
```html
<img src="images/photo.jpg" alt="Vigneshwaran J profile photo" ...
```
Change `images/photo.jpg` to the path of your image.

---

### 2. Update Your Bio

In `index.html`, find the `<p class="bio-text">` paragraphs and edit the text:
```html
<!-- ✏️ EDIT: Bio paragraph below -->
<p class="bio-text">
  I'm a passionate ...
</p>
```

---

### 3. Update Info Cards (Name, Title, Location, Status)

Find the `info-grid` div in `index.html`:
```html
<div class="info-grid">
  <div class="info-card">
    <span class="info-label">full_name</span>
    <span class="info-value">Vigneshwaran J</span>  <!-- ✏️ Edit here -->
  </div>
  ...
```

---

### 4. Update Phone & Email

In `index.html`, find the `.contact-terminal` block and update the `data-copy` attributes:
```html
<div class="terminal-row contact-copy" data-copy="YOUR_PHONE_HERE" ...>
  ...
  <span class="t-val contact-val">YOUR_PHONE_HERE</span>
</div>
```

---

### 5. Update Skills

#### Add/Remove Progress Bar Skills (with bars)

In `index.html`, find the `<ul class="skill-list">` blocks and add/modify items:
```html
<li class="skill-item" data-level="85">
  <span class="skill-name">Your Skill Name</span>
  <div class="skill-bar"><div class="skill-fill" data-width="85"></div></div>
</li>
```
- `data-level` and `data-width` = skill percentage (0–100).

#### Add/Remove Skill Tags (pill style)

Find `<div class="skill-tags">` and add/remove `<span class="skill-tag">` items:
```html
<span class="skill-tag">Your Tool</span>
```

---

### 6. Update Projects

Find `<div class="projects-grid">` in `index.html`.  
Copy any `<article class="project-card">` block and update:
- `card-icon`: An emoji (🛡️, 🔐, 💻, etc.)
- `href` in the `.card-link` anchor: your GitHub repo URL
- `card-title`: Project name
- `card-desc`: 2–3 sentence description
- `card-tags`: Tech stack labels

---

### 7. Update Social Links

Find the `social-grid` section. Update `href` on each `.social-card` anchor:
```html
<a href="https://github.com/YOUR_USERNAME" ...>
```

---

### 8. Update Boot Messages

In `script.js`, find `bootMessages` array and edit the text values:
```js
const bootMessages = [
  { text: '> Your custom boot message here ...', color: '#00ff9d', delay: 100 },
  ...
];
```

---

### 9. Update Typewriter Roles

In `script.js`, find the `roles` array:
```js
const roles = [
  'CYBERSECURITY PROFESSIONAL',
  'FULLSTACK DEVELOPER',
  // Add your roles here
];
```

---

### 10. Change Color Accent

In `style.css`, find the `:root` block. Change these two variables:
```css
--neon-green: #00ff9d;  /* Primary accent */
--neon-blue:  #00d4ff;  /* Secondary accent */
```

---

## 🎨 Design Features

| Feature                  | Implementation             |
|--------------------------|----------------------------|
| Matrix rain background   | HTML5 Canvas (`script.js`) |
| Terminal boot animation  | Custom typewriter JS       |
| Typewriter hero tagline  | Cycled typewriter effect   |
| Custom neon cursor       | CSS + JS mouse tracking    |
| Scroll reveal animations | IntersectionObserver       |
| Skill bar animations     | CSS transitions + JS       |
| Glitch text on hover     | CSS `::before` / `::after` |
| Click-to-copy contacts   | Clipboard API              |
| Dark / Light mode toggle | CSS variables + localStorage|
| Responsive layout        | CSS Grid + Media queries   |
| Active nav section       | Scroll position detection  |

---

## 🔧 Browser Support

- Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Fully works without a server (just `file://`)

---

## 📄 License

Personal use. Built for Vigneshwaran J's portfolio — feel free to adapt.

---

*Built with ❤️ and lots of ☕ coffee*
