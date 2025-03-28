@echo off
echo EzAIBotz - Setup Script
echo ======================
echo.

echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Environment variables are already set in .env.local:
echo - NEXT_PUBLIC_SUPABASE_URL=https://mdovvsmmpivfcccbpjdd.supabase.co
echo - NEXT_PUBLIC_SUPABASE_ANON_KEY=[...]
echo - NEXT_PUBLIC_APP_URL=http://localhost:3000
echo - DEEPSEEK_API_KEY=sk-bd9ddcc3023d4a8584c50d1b5249ed07
echo.

echo Would you like to seed the database with test data?
echo This will create a test user and sample chatbots.
choice /C YN /M "Seed database?"
if %errorlevel% equ 1 (
    echo.
    echo Seeding database...
    call npm run seed
    if %errorlevel% neq 0 (
        echo Failed to seed database!
        pause
    ) else (
        echo Database seeded successfully!
        echo.
        echo Test user credentials:
        echo Email: test@example.com
        echo Password: password123
    )
)

echo.
echo Setup completed!
echo.
echo Would you like to start the development server now?
choice /C YN /M "Start server?"
if %errorlevel% equ 1 (
    echo.
    echo Starting development server...
    call npm run dev
)

echo.
echo Thank you for using EzAIBotz!
pause 