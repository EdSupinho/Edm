@echo off
echo 🛍️  Loja Online - Iniciando Sistema
echo ==================================

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado. Instale Python 3.x primeiro.
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instale Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se Expo CLI está instalado
expo --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Instalando Expo CLI...
    npm install -g @expo/cli
)

echo 🚀 Iniciando Backend Flask...
cd backend
start "Backend Flask" python run.py

REM Aguardar um pouco para o backend inicializar
timeout /t 3 /nobreak >nul

echo 📱 Iniciando Frontend Expo...
cd ..
npx expo start

pause
