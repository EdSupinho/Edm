# 📤 Como Enviar para GitHub - Instruções Rápidas

## ❗ IMPORTANTE: Você precisa instalar Git primeiro!

### Opção 1: Instalar Git (Recomendado)

1. **Baixe Git para Windows:**
   - https://git-scm.com/download/win
   - Clique em "Download for Windows"

2. **Instale o Git:**
   - Execute o instalador
   - Mantenha todas as opções padrão
   - Clique em "Next" até finalizar

3. **Reinicie o PowerShell:**
   - Feche e abra novamente o PowerShell

4. **Verifique se funcionou:**
   ```powershell
   git --version
   ```
   Deve mostrar: `git version 2.x.x`

### Opção 2: Usar GitHub Desktop (Mais Fácil) ⭐

1. **Baixe GitHub Desktop:**
   - https://desktop.github.com
   - Instale normalmente

2. **Faça login** com sua conta GitHub

3. **Adicionar repositório:**
   - File → Add Local Repository
   - Escolha a pasta: `C:\Users\K JUNIOR\Downloads\my-app`
   - Clique em "Add Repository"

4. **Publicar:**
   - Escreva mensagem: "Initial commit"
   - Clique em "Commit to main"
   - Clique em "Publish repository"
   - Marque "Keep this code private" (opcional)
   - Clique em "Publish Repository"

---

## 🚀 Depois de Instalar Git

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Name**: `my-app`
3. Escolha **Public** ou **Private**
4. **NÃO marque** nada em "Initialize this repository"
5. Clique em **"Create repository"**

### 2. Executar Comandos

Abra o PowerShell na pasta do projeto e execute:

```powershell
# Script automático (mais fácil)
.\enviar-github.ps1
```

**OU execute manualmente:**

```powershell
git init
git add .
git commit -m "Initial commit: Loja online completa"
git remote add origin https://github.com/EdSupinho/my-app.git
git branch -M main
git push -u origin main
```

### 3. Autenticação

Se pedir usuário/senha:
- **Usuário**: Seu nome de usuário do GitHub (`EdSupinho`)
- **Senha**: Use um **Personal Access Token** (não sua senha normal)

**Como criar token:**
1. GitHub → Seu perfil → Settings
2. Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Nome: `my-app`
5. Marque: `repo` (todas as permissões)
6. Generate token
7. **COPIE O TOKEN** (você não verá novamente!)
8. Use este token como senha

---

## ✅ Verificar

Acesse: https://github.com/EdSupinho/my-app

Você deve ver todos os arquivos do projeto!

---

## 🔄 Atualizar Depois

Quando fizer mudanças no código:

```powershell
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## ❓ Problemas Comuns

### "git não é reconhecido"
- Instale Git primeiro (veja Opção 1 acima)
- **Reinicie o PowerShell** após instalar

### "repository not found"
- Certifique-se que criou o repositório no GitHub primeiro
- Verifique se o nome está correto: `EdSupinho/my-app`

### "authentication failed"
- Use Personal Access Token (não sua senha)
- Veja instruções acima sobre criar token

---

## 🎯 Resumo Rápido

1. ✅ Instalar Git OU GitHub Desktop
2. ✅ Criar repositório em https://github.com/new
3. ✅ Executar `.\enviar-github.ps1` OU comandos manuais
4. ✅ Usar Personal Access Token como senha
5. ✅ Verificar em https://github.com/EdSupinho/my-app

**Pronto!** 🎉

