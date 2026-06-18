# Yurii Baidan — Product Design Portfolio

Personal portfolio website for Yurii Baidan, Senior Product Designer. Built as a high-fidelity static multi-page website with a modular, responsive CSS design system.

## 🚀 Features

- **Multi-Page Layout**: 5 static pages (Home, About, Jurna Case Study, LobbyMatic Skeleton, Health OS Skeleton).
- **Responsive Design System**: Fully responsive layout scaled in `rem` units, with custom breakpoints at `1438px`, `1280px`, `1024px`, `600px`, and `430px`.
- **Fluid Asset Scaling**: Proportional image and card resizing across standard device widths.
- **Typography Polish**: Custom typography with self-hosted Cooper Hewitt fonts and Instrument Serif display styles.
- **Optimized Mobile Stats & Grids**: Stats blocks dynamically reflow to horizontal layouts and 2x2 grids on small screens.

## 📂 Project Structure

```text
anti-try/
├── index.html          # Homepage
├── about.html          # About Page
├── case/
│   ├── jurna.html      # Jurna Case Study
│   ├── lobbymatic.html # LobbyMatic Skeleton Case
│   └── health-os.html  # Health OS Skeleton Case
├── css/
│   ├── tokens.css      # Design token variables
│   ├── reset.css       # Standard CSS reset
│   ├── global.css      # Base styling and utility classes
│   ├── components/     # Component-specific styles
│   └── pages/          # Page-specific layout styles
├── js/
│   └── main.js         # Shared scripts and helpers
└── assets/             # Images, profile photos, and icons
```

## 🛠️ Local Development

To run the site locally, launch any static file server from the project root:

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx http-server -p 8080
```

Open `http://localhost:8080` in your web browser.
