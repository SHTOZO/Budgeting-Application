@echo off
REM Quick start script for Windows - run from project root

echo === Budgeting App Setup ===
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please download from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo + Node.js found: %NODE_VER%
echo.

REM Install dependencies
echo Installing root dependencies...
call npm install

echo.
echo Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo + Installation complete!
echo.
echo Next steps:
echo 1. Copy server\.env.example to server\.env
echo 2. Update server\.env with your MongoDB URI and JWT Secret
echo 3. Run: npm run dev
echo.
echo The app will be available at http://localhost:3000
pause
