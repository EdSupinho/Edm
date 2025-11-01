#!/bin/bash

# Script para iniciar a loja online completa
# Backend Flask + Frontend React Native/Expo

echo "🛍️  Loja Online - Iniciando Sistema"
echo "=================================="

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Instale Python 3.x primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar se Expo CLI está instalado
if ! command -v expo &> /dev/null; then
    echo "📦 Instalando Expo CLI..."
    npm install -g @expo/cli
fi

echo "🚀 Iniciando Backend Flask..."
cd backend
python3 run.py &
BACKEND_PID=$!

# Aguardar um pouco para o backend inicializar
sleep 3

echo "📱 Iniciando Frontend Expo..."
cd ..
npx expo start

# Função para limpar processos ao sair
cleanup() {
    echo "🛑 Parando servidores..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait
