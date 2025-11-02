# 🐾 Pawtato Heroes Minting Dashboard

A beautiful, interactive stats dashboard for tracking Pawtato Heroes NFT minting data built with React, TypeScript, Vite, and Chart.js.

## 🚀 Features

- **Real-time Statistics**: Display total heroes minted, SUI paid, players count, and more
- **Interactive Charts**: Visualize weekly minting trends and phase distributions
- **Top Players**: See the top 10 players by heroes minted
- **Responsive Design**: Beautiful UI that works on all screen sizes
- **Modern Tech Stack**: Built with React 19, TypeScript, and Chart.js

## 📊 Dashboard Components

### Stat Cards

- Total Heroes Minted
- Total SUI Paid
- Paid Heroes Minted
- Total Players
- Average Heroes per Player
- Average SUI Price

### Charts

- **Weekly Hero Minted** (Bar Chart): Shows the weekly distribution of minted heroes
- **Transaction Timeline** (Line Chart): Minute-by-minute transaction count showing minting activity over time
- **Phase-wise Minting Timeline** (Multi-Line Chart): Shows minting activity for each phase over time with different colored lines
- **Paid vs Unpaid Heroes** (Pie Chart): Distribution between paid and unpaid heroes
- **Heroes by Phase** (Pie Chart): Distribution of heroes across different phases
- **Top 10 Players** (Bar Chart): Most active players by hero count
- **Top 10 Players SUI Distribution** (Pie Chart): Shows proportional SUI contribution

### Player Data Table

- **All Players - SUI Paid**: Complete table of all players with:
  - Rank by SUI paid
  - Player wallet address
  - Total SUI paid
  - Total heroes minted
  - Sortable columns
  - Pagination (15 players per page)

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Chart.js** - Data visualization
- **react-chartjs-2** - React wrapper for Chart.js

## 📦 Installation

```bash
npm install
```

## 🏃 Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx       # Main dashboard component
│   ├── Dashboard.css       # Dashboard styles
│   ├── StatCard.tsx        # Reusable stat card component
│   ├── StatCard.css        # Stat card styles
│   ├── BarChart.tsx        # Reusable bar chart component
│   ├── BarChart.css        # Bar chart styles
│   ├── PieChart.tsx        # Reusable pie chart component
│   ├── PieChart.css        # Pie chart styles
│   ├── LineChart.tsx       # Reusable line chart component
│   ├── LineChart.css       # Line chart styles
│   ├── MultiLineChart.tsx  # Reusable multi-line chart component
│   ├── MultiLineChart.css  # Multi-line chart styles
│   ├── Table.tsx           # Reusable table component with pagination
│   └── Table.css           # Table styles
├── types.ts                # TypeScript interfaces
├── result_metrics_pawtato_final.json  # Data source
├── App.tsx                 # Root app component
├── App.css                 # App styles
├── index.css               # Global styles
└── main.tsx                # Entry point
```

## 📝 Data Format

The dashboard reads from `result_metrics_pawtato_final.json` with the following structure:

- `total_*` keys → Displayed as stat cards
- `weekly_*` keys → Displayed as bar charts
- `player_hero_minted` → Processed for additional analytics

## 🎨 Component Architecture

All components are reusable and customizable:

- **StatCard**: Generic component for displaying statistics
- **BarChart**: Configurable bar chart with customizable colors
- **LineChart**: Configurable line chart for time-series data with smooth curves
- **MultiLineChart**: Multi-dataset line chart for comparing multiple time-series
- **PieChart**: Configurable pie chart for distribution data
- **Table**: Reusable table component with pagination and sorting capabilities

## 🔧 Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

## 🚀 Deploy to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click "Deploy" (Vercel auto-detects Vite configuration)
5. Your dashboard will be live in ~2 minutes!

### Deploy via CLI

```bash
npm install -g vercel
vercel
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### What's Included

- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Deployment exclusions
- ✅ `.nvmrc` - Node.js version specification
- ✅ URL rewrites for client-side routing
- ✅ Optimized build settings
- ✅ SEO metadata (Open Graph, Twitter Cards)
- ✅ PWA manifest for mobile app-like experience
- ✅ `robots.txt` for search engine crawling

### After Deployment

Once deployed, update the following URLs in `index.html`:

- Replace `https://pawtato-heroes-stats.vercel.app/` with your actual Vercel URL
- Add an Open Graph image at `/public/og-image.png` (1200x630px recommended)

## 🙏 Credits

Created by [Vendetta](https://vendettagame.xyz/)

## 📄 License

MIT

---

Made with ❤️ for Pawtato Heroes community
