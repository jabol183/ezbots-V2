@echo off
echo Starting EzAIBotz development server...
echo.
echo Ensure you have:
echo 1. Set up your .env.local file with Supabase credentials
echo 2. Run the Supabase schema.sql in your Supabase project
echo 3. Run 'npm run seed' to populate test data (optional)
echo.
echo Press any key to continue...
pause > nul

npm run dev 