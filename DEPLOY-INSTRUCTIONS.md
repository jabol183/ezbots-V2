# Deploying EzAIBotz (ezbots-V2)

This document provides simplified instructions for deploying your EzAIBotz application to GitHub Pages.

## Option 1: GitHub Actions (Recommended)

Since your environment variables are already stored in GitHub secrets, this is the easiest deployment method:

1. Push your code to the `main` branch of your GitHub repository
2. GitHub Actions will automatically build and deploy your site
3. Your site will be available at: `https://your-username.github.io/ezbots-V2`

To manually trigger a deployment:
1. Go to your GitHub repository
2. Click on "Actions"
3. Select the "Deploy EzAIBotz to Pages" workflow
4. Click "Run workflow"

## Option 2: Manual Deployment

If you prefer to deploy manually:

1. Run the deployment script:
   ```bash
   npm run deploy
   ```

2. Create and push the `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   git add out/.
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages -f
   ```

3. Go to your GitHub repository → Settings → Pages
4. Set the source to "Deploy from a branch"
5. Choose "gh-pages" branch and "/ (root)" folder
6. Click "Save"

## Verifying the Deployment

1. Wait a few minutes for GitHub Pages to build and deploy your site
2. Your site should be available at: `https://your-username.github.io/ezbots-V2`
3. If you encounter any issues, check the "Actions" tab for error logs

## Updating Your Deployment

Whenever you make changes:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy your site

That's it! Your EzAIBotz application is now deployed to GitHub Pages. 