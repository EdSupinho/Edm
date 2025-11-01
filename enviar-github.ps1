# Script para enviar projeto para GitHub
# Execute: .\enviar-github.ps1

Write-Host "🚀 Preparando para enviar para GitHub..." -ForegroundColor Cyan

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Por favor, instale o Git primeiro:" -ForegroundColor Yellow
    Write-Host "   1. Baixe: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "   2. Instale o Git" -ForegroundColor Yellow
    Write-Host "   3. REINICIE o PowerShell" -ForegroundColor Yellow
    Write-Host "   4. Execute este script novamente" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Alternativa: Use GitHub Desktop (mais fácil)" -ForegroundColor Cyan
    Write-Host "   https://desktop.github.com" -ForegroundColor Cyan
    exit
}

Write-Host ""
Write-Host "📝 Executando comandos Git..." -ForegroundColor Cyan

# Verificar se já é um repositório Git
if (Test-Path ".git") {
    Write-Host "ℹ️  Repositório Git já existe" -ForegroundColor Yellow
} else {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Cyan
    git init
}

# Adicionar arquivos
Write-Host "📎 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: Loja online completa com React Native e Flask"
    Write-Host "✅ Commit criado!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Nenhuma mudança para commitar" -ForegroundColor Yellow
}

# Configurar repositório remoto
Write-Host ""
Write-Host "🔗 Configurando repositório remoto..." -ForegroundColor Cyan
Write-Host "   URL: https://github.com/EdSupinho/my-app.git" -ForegroundColor Gray

# Remover remote se já existir
git remote remove origin 2>$null

# Adicionar remote
git remote add origin https://github.com/EdSupinho/my-app.git

# Renomear branch para main
git branch -M main 2>$null

Write-Host ""
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Cyan
Write-Host "   (Você pode precisar fazer login)" -ForegroundColor Yellow
Write-Host ""

# Fazer push
try {
    git push -u origin main
    Write-Host ""
    Write-Host "✅ Sucesso! Código enviado para GitHub!" -ForegroundColor Green
    Write-Host "   Verifique em: https://github.com/EdSupinho/my-app" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "⚠️  Erro ao enviar. Possíveis causas:" -ForegroundColor Yellow
    Write-Host "   1. Repositório não existe no GitHub (crie primeiro)" -ForegroundColor Yellow
    Write-Host "   2. Problema de autenticação" -ForegroundColor Yellow
    Write-Host "   3. Não está conectado à internet" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solução:" -ForegroundColor Cyan
    Write-Host "   1. Crie o repositório em: https://github.com/new" -ForegroundColor Cyan
    Write-Host "   2. Use Personal Access Token se pedir senha" -ForegroundColor Cyan
    Write-Host "      GitHub → Settings → Developer settings → Tokens" -ForegroundColor Cyan
}

