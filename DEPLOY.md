# Deploying EzAIBotz to GitHub Pages

This guide walks you through deploying your EzAIBotz application to GitHub Pages using the "Deploy from a branch" method.

## Prerequisites

1. A GitHub repository for your project
2. Git installed on your local machine
3. Node.js and npm installed

## Step 1: Update Repository Configuration

First, update your repository configuration in the following files:

1. In `next.config.js`, replace "REPOSITORY-NAME" with your actual GitHub repository name:
   ```js
   basePath: process.env.NODE_ENV === 'production' ? '/your-actual-repo-name' : '',
   assetPrefix: process.env.NODE_ENV === 'production' ? '/your-actual-repo-name/' : '',
   ```

2. In `scripts/deploy.js`, update the repository name:
   ```js
   const REPO_NAME = 'your-actual-repo-name';
   ```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://your-username.github.io/your-repo-name
```

## Step 3: Build and Prepare for Deployment

Run the deployment script:

```bash
npm run deploy
```

This will:
1. Build your Next.js application
2. Create a `.nojekyll` file to prevent GitHub Pages from using Jekyll
3. Generate other necessary files for GitHub Pages

## Step 4: Create and Push the GitHub Pages Branch

Follow the instructions printed by the deploy script to create and push the `gh-pages` branch:

```bash
git checkout -b gh-pages
git add out/.
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages -f
```

## Step 5: Configure GitHub Pages in Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch and "/ (root)" folder
6. Click "Save"

GitHub will now build and deploy your site. In a few minutes, your site will be available at:
`https://your-username.github.io/your-repo-name`

## Updating Your Deployment

Whenever you make changes and want to update your deployed site:

1. Commit and push your changes to your main branch
2. Run the deployment script again:
   ```bash
   npm run deploy
   ```
3. Push the gh-pages branch again:
   ```bash
   git checkout gh-pages
   git add out/.
   git commit -m "Update deployment"
   git push origin gh-pages -f
   ```

## Troubleshooting

If your site is not displaying correctly:

1. Check that the paths in `next.config.js` are correct
2. Ensure you've created a `.nojekyll` file in the root of the `gh-pages` branch
3. Check the GitHub Pages settings in your repository
4. Look for any error messages in the GitHub Pages build process 