# SomniaAgent SDK Landing Page

> Professional landing page for SomniaAgent SDK

## 🎯 Overview

This is the landing page for **SomniaAgent SDK** - showcasing the AI Agent Development Framework for Somnia Blockchain.

## 🚀 Quick Start

### Local Development

```bash
# Navigate to landing directory
cd hackathons/003-somnia-ai/landing

# Open in browser (any local server)
python3 -m http.server 8000
# or
npx serve
```

Then open http://localhost:8000

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd hackathons/003-somnia-ai/landing
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? somniaagent-sdk
# - Directory? ./
# - Override settings? No
```

## 📁 Structure

```
landing/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # Interactive features
└── README.md       # This file
```

## ✨ Features

### Sections
1. **Hero** - Main value proposition with stats
2. **Code Demo** - Before/after comparison
3. **Features** - 6 key features with icons
4. **Deployed Contracts** - Live contract addresses
5. **Get Started** - 3-step quick start
6. **Footer** - Links and resources

### Interactive Elements
- ✅ Smooth scrolling
- ✅ Scroll animations
- ✅ Click-to-copy contract addresses
- ✅ Animated statistics
- ✅ Hover effects
- ✅ Responsive design

## 🎨 Design

- **Colors**: Dark theme with purple/blue gradient
- **Typography**: Inter font family
- **Layout**: Responsive grid system
- **Animations**: Smooth transitions and scroll effects

## 🔗 Links

All links point to:
- GitHub repo: https://github.com/hieple7985/master-dorahack
- Somnia Explorer: https://shannon-explorer.somnia.network
- Contract addresses: Real deployed contracts

## 📱 Responsive

Fully responsive design:
- Desktop: Full grid layouts
- Tablet: Adjusted columns
- Mobile: Single column, stacked layout

## 🚀 Deployment Options

### 1. Vercel (Recommended)
```bash
vercel
```

### 2. Netlify
```bash
netlify deploy
```

### 3. GitHub Pages
```bash
# Push to gh-pages branch
git subtree push --prefix hackathons/003-somnia-ai/landing origin gh-pages
```

### 4. Static Hosting
Upload `index.html`, `styles.css`, `script.js` to any static host.

## 📊 Performance

- ✅ No external dependencies (except Google Fonts)
- ✅ Minimal JavaScript
- ✅ Optimized CSS
- ✅ Fast load time
- ✅ SEO-friendly

## 🎯 SEO

- Meta description
- Semantic HTML
- Proper heading hierarchy
- Alt text for images (if added)
- Open Graph tags (can be added)

## 🔧 Customization

### Update Contract Addresses
Edit `index.html` lines with contract addresses:
```html
<code class="contract-address">0x...</code>
```

### Update Links
Edit `index.html` footer section:
```html
<a href="YOUR_LINK">Link Text</a>
```

### Update Colors
Edit `styles.css` `:root` variables:
```css
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    /* ... */
}
```

## 📝 TODO

- [ ] Add Open Graph meta tags
- [ ] Add Twitter Card meta tags
- [ ] Add favicon
- [ ] Add demo video embed
- [ ] Add testimonials section
- [ ] Add FAQ section
- [ ] Add newsletter signup

## 📄 License

MIT License - Part of SomniaAgent SDK

---

**Built with ❤️ for Somnia AI Hackathon 2025**

