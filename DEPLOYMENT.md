# Deployment Guide for Pawtato Heroes Stats Dashboard

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel will automatically detect the Vite configuration
5. Click "Deploy"
6. Your app will be live in ~2 minutes!

### Method 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow the prompts)
vercel

# Deploy to production
vercel --prod
```

## Configuration Files

The project includes these files for Vercel deployment:

- **`vercel.json`**: Vercel configuration
- **`.vercelignore`**: Files to exclude from deployment
- **`.nvmrc`**: Node.js version specification

## Build Details

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 20.19.0 or higher recommended
- **Framework**: Vite + React

## Post-Deployment

After deployment, your dashboard will be available at:

- Production: `https://your-project.vercel.app`
- Preview deployments for each git push

## Performance Notes

The app includes a large JSON data file (~7MB). This is expected and the app will:

- Load on first visit
- Be cached by the browser for subsequent visits
- Render quickly once loaded

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## Environment Variables

This project doesn't require any environment variables as it uses static JSON data.

## Troubleshooting

### Build Fails

- Ensure Node.js version is 20.19.0 or higher
- Try running `npm install` and `npm run build` locally first

### Large Bundle Size Warning

- This is expected due to the large JSON data file
- The warning can be safely ignored for this use case

### 404 Errors on Refresh

- The `vercel.json` includes URL rewrites to handle client-side routing
- This should be automatically configured

## Support

For Vercel-specific issues, visit [Vercel Documentation](https://vercel.com/docs)
