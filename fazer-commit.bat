@echo off
echo 🚀 Preparando para fazer commit e enviar para GitHub...
echo.

REM Verificar se Git está disponível
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git não encontrado no PATH
    echo.
    echo Por favor:
    echo 1. Reinicie o PowerShell/Terminal
    echo 2. Ou adicione Git ao PATH do sistema
    echo.
    pause
    exit /b 1
)

echo ✅ Git encontrado!
echo.

REM Verificar se já é repositório
if not exist ".git" (
    echo 📦 Inicializando repositório Git...
    git init
    echo.
)

echo 📎 Adicionando arquivos...
git add .
echo.

echo 💾 Fazendo commit...
git commit -m "Initial commit: Loja online completa com React Native e Flask"
echo.

echo 🔗 Configurando repositório remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/EdSupinho/my-app.git
echo.

echo 📤 Enviando para GitHub...
echo    (Você precisará fazer login)
echo.
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Sucesso! Código enviado para GitHub!
    echo    Verifique em: https://github.com/EdSupinho/my-app
) else (
    echo.
    echo ⚠️  Erro ao enviar. Verifique:
    echo    1. Repositório existe no GitHub?
    echo    2. Credenciais corretas?
    echo    3. Conexão com internet?
)

echo.
pause

