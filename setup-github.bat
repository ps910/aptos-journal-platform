@echo off
echo ================================
echo  GitHub Repository Setup
echo ================================
echo.

echo This script will help you push your code to GitHub
echo.

:menu
echo Please choose an option:
echo 1. Initialize Git and make first commit
echo 2. Add GitHub remote and push
echo 3. Deploy (reset deployment settings)
echo 4. Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto init
if "%choice%"=="2" goto push
if "%choice%"=="3" goto deploy
if "%choice%"=="4" goto end

echo Invalid choice. Please try again.
goto menu

:init
echo.
echo Initializing Git repository...
git init
echo.
echo Adding all files...
git add .
echo.
echo Making first commit...
git commit -m "Initial commit - Aptos Journal Platform"
echo.
echo ✅ Git initialized and first commit made!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub: https://github.com/new
echo 2. Copy the repository URL
echo 3. Run option 2 to push your code
echo.
pause
goto menu

:push
echo.
set /p repo_url="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "
echo.
echo Adding remote repository...
git remote add origin %repo_url%
echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main
echo.
echo ✅ Code pushed to GitHub successfully!
echo.
pause
goto menu

:deploy
echo.
echo ================================
echo  Reset to Local Development
echo ================================
echo.
echo Resetting all deployment settings...
echo.

REM Remove deployment config files
if exist "deployment-config.json" del /f /q deployment-config.json
if exist ".env.production" del /f /q .env.production
if exist "vercel.json" (
    echo Resetting Vercel configuration...
    del /f /q vercel.json
)
if exist "netlify.toml" (
    echo Resetting Netlify configuration...
    del /f /q netlify.toml
)
if exist "render.yaml" (
    echo Resetting Render configuration...
    del /f /q render.yaml
)

echo.
echo Setting up for local development...
echo Creating .env.local file...

REM Create default local environment
(
echo VITE_API_URL=http://localhost:3001
echo VITE_APP_NAME=Aptos Journal Platform
) > frontend\.env.local

(
echo PORT=3001
echo NODE_ENV=development
) > backend\.env.local

echo.
echo ✅ All deployment settings reset!
echo ✅ Application configured for local development
echo.
echo Next steps:
echo 1. Frontend: npm install in frontend/ then npm run dev
echo 2. Backend: npm install in backend/ then npm start
echo.
pause
goto menu

:end
echo.
echo Goodbye!
timeout /t 2 > nul
