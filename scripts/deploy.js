const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Repository name - change this to your repo name
const REPO_NAME = 'REPOSITORY-NAME';

// Create a CNAME file if you're using a custom domain
// If not using a custom domain, you can remove this function and its call
function createCNAME() {
  // Uncomment and modify this if you have a custom domain
  // fs.writeFileSync(path.join('out', 'CNAME'), 'your-custom-domain.com');
  console.log('CNAME file would be created here if you had a custom domain');
}

// Create .nojekyll file to prevent GitHub Pages from using Jekyll
function createNojekyll() {
  fs.writeFileSync(path.join('out', '.nojekyll'), '');
  console.log('Created .nojekyll file');
}

// Run the build and export
function buildAndExport() {
  try {
    console.log('Building and exporting Next.js app...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Main function
function main() {
  // Ensure the REPOSITORY_NAME is set
  if (REPO_NAME === 'REPOSITORY-NAME') {
    console.warn('⚠️ Please update the REPO_NAME in scripts/deploy.js with your actual repository name');
  }

  // Build the project
  buildAndExport();

  // Create necessary files
  createNojekyll();
  createCNAME();

  console.log('\n✅ Deployment preparation complete. Your site is ready in the "out" directory.');
  console.log('\nTo deploy:');
  console.log('1. Commit the "out" directory to your gh-pages branch');
  console.log('2. Push the gh-pages branch to GitHub');
  console.log('\nYou can use these commands:');
  console.log('  git checkout -b gh-pages');
  console.log('  git add out/.');
  console.log('  git commit -m "Deploy to GitHub Pages"');
  console.log('  git push origin gh-pages -f');
  console.log('\nThen go to your GitHub repository settings and set GitHub Pages to deploy from the gh-pages branch');
}

// Run the script
main(); 