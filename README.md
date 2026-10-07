# QuoteSpark ✨ — Daily Inspiration & Wisdom Generator

**QuoteSpark** is a modern, responsive, and minimalist quote generator web application crafted with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. It delivers thoughtfully curated quotes paired with dynamic gradient atmospheres, offline resilience, and social sharing capabilities.

---

## 🌟 Key Features

### 1. Centered Quote Display & Anti-Repetition
- Displays quotes in an elegant glassmorphism card featuring **Playfair Display** serif typography for quotes and **Inter** for clean UI readability.
- **Smart Shuffling**: Clicking **"New Quote"** fetches a fresh quote and ensures the exact same quote is never repeated twice in a row.

### 2. Dual-Engine Quote Fetching with Offline Resilience
- **DummyJSON Live API**: Random quotes fetched live from `https://dummyjson.com/quotes/random` with zero API keys required.
- **Curated Fallback Library**: Over 40 hand-picked, categorized quotes built directly into the app.
- **Automatic Fallback**: If the API is slow, unreachable, or the user is offline, QuoteSpark instantly selects from the curated local database so the app never fails.
- Visual badge indicator displays whether the quote was sourced live from the API or from the curated library.

### 3. Mood & Category Filter Chips
- Instant filtering across 5 core emotional categories:
  - 🔥 **Motivation**
  - 🧭 **Life**
  - 📖 **Wisdom**
  - 💖 **Love**
  - 🏆 **Success**
  - ✨ **All** (Live API + global library)
- Category selections dynamically pick from tagged local quotes.

### 4. Interactive Action Suite
- 📋 **Copy to Clipboard**: Copies formatted `"Quote" — Author` to your clipboard with a confirmation toast.
- 🔗 **Share**: Uses the native **Web Share API** on supported mobile & desktop devices; falls back automatically to Twitter/X intent sharing.
- ❤️ **Favorites Drawer**:
  - Heart any quote to persist it into `localStorage`.
  - Celebratory confetti burst when saving.
  - Slide-over drawer with search, count badge, copy, view on main card, and removal.
- 🖼️ **Download as PNG**: Generates a high-resolution PNG image of the quote card using `html-to-image` for sharing on social media or saving as a wallpaper.
- 🔊 **Text-to-Speech (Audio)**: Built-in speech synthesis reads quotes aloud with natural cadence.

### 5. Premium Aesthetics & Dynamic Theming
- **Dynamic Gradient Atmospheres**: The soft ambient background smoothly morphs between curated palettes (*Sunset Blush*, *Lavender Twilight*, *Aurora Breeze*, *Ocean Whisper*, *Golden Dawn*, *Cherry Blossom*, *Nordic Frost*) on every new quote.
- **Dark & Light Mode**: Smooth toggle with persistent `localStorage` preference and auto-detection of system preferences.
- **Shimmer Skeleton**: Elegant loading skeleton during quote transitions.
- **Respects Motion Preferences**: Full `prefers-reduced-motion` compliance.

### 6. Keyboard Shortcuts
- Press <kbd>Space</kbd> or <kbd>N</kbd> anywhere on the page to immediately generate a new quote.
- Intelligent input detection prevents triggering while typing in search fields or drawers.

---

## 🏗️ Project Structure

```
Quote Generator/
├── index.html                   # HTML entry with Playfair Display & Inter fonts
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Custom typography, animations, glass shadows, dark mode
├── postcss.config.js            # PostCSS configuration
├── src/
│   ├── main.tsx                 # React application root
│   ├── App.tsx                  # App coordinator, dynamic gradients, shortcuts, layout
│   ├── index.css                # Tailwind directives & glassmorphic utilities
│   ├── types/
│   │   └── quote.ts             # TypeScript definitions for Quote, Category, Theme, Toast
│   ├── lib/
│   │   ├── api.ts               # Timeout-safe DummyJSON API client
│   │   ├── quotes.ts            # Curated 40-quote fallback database with category tags
│   │   └── gradients.ts         # Curated dynamic gradient theme presets
│   ├── hooks/
│   │   ├── useLocalStorage.ts   # Persistent local storage hook
│   │   ├── useFavorites.ts      # Favorites state, removal, and confetti effects
│   │   └── useQuote.ts          # Core quote state machine, anti-repetition, offline fallback
│   └── components/
│       ├── Header.tsx           # Branding, shortcuts hint, favorites count badge, theme toggle
│       ├── QuoteCard.tsx        # Responsive quote card with export ref and metadata pills
│       ├── ActionButtons.tsx    # New Quote, Copy, Favorite, Share, PNG Export, Voice
│       ├── CategoryChips.tsx    # Filter chips for moods and categories
│       ├── FavoritesDrawer.tsx  # Slide-over management panel with search and actions
│       ├── ThemeToggle.tsx      # Dark / light mode switcher
│       ├── SkeletonCard.tsx     # Loading shimmer skeleton
│       └── Toast.tsx            # Non-intrusive floating feedback notifications
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation
Clone or navigate to the project directory and install dependencies:

```bash
cd "Quote Generator"
npm install
```

### Running Locally
Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`.

### Production Build
To create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing Features

1. **Testing DummyJSON API Fetching**:
   - On the "All" category, click **"New Quote"** (or press <kbd>Space</kbd>). Note the source badge says "API" and quotes load dynamically.
2. **Testing Category Filters**:
   - Click "Motivation", "Wisdom", "Love", "Success", or "Life". The card instantly shifts to a quote matched to that category with the "Curated" indicator.
3. **Testing Offline Fallback**:
   - In Chrome/Firefox DevTools: Open **Network** tab -> toggle Throttling dropdown to **Offline**.
   - Click **"New Quote"** or press <kbd>Space</kbd>.
   - The app continues working smoothly by pulling from the 40 built-in fallback quotes without crashing.
4. **Testing Favorites & Search**:
   - Click the heart icon on any quote. Notice the confetti animation and toast.
   - Click the **Favorites** button in the header.
   - Search by keyword or author, or click the right-arrow to load that favorite onto the main card.
5. **Testing Image Export**:
   - Click the Download button (tray with arrow down).
   - An image file named `quotespark-[author]-[id].png` is rendered and downloaded to your computer.

---

## 📄 License
MIT © QuoteSpark
