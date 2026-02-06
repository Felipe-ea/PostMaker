# 🎨 PostMaker Pro - Gerador de Posts Personalizados

Ferramenta web profissional para criar posts personalizados com nome e telefone, agora com Firebase e categorias!

## ✨ Novidades da Versão 3.0 PRO

### 🔥 Firebase Integration

- ☁️ **Armazenamento na nuvem**: Templates salvos no Firebase Firestore
- 🌐 **Compartilhamento global**: Crie uma vez, todos usam
- 📱 **Multi-dispositivo**: Acesse de qualquer lugar
- 💾 **Fallback inteligente**: Funciona com localStorage se Firebase não estiver configurado

### 🏷️ Sistema de Categorias

- 🟣 **Royal Pago**: Templates exclusivos para Royal Pago
- 🟢 **Capital Plus**: Templates exclusivos para Capital Plus
- 🔍 **Filtros**: Visualize templates por categoria
- 🎯 **Organização**: Melhor gestão de templates

### 🎨 Design Profissional

- 🌈 **Gradientes animados**: Background moderno e dinâmico
- 🎭 **Fonte Inter**: Typography profissional do Google Fonts
- 💫 **Animações suaves**: Transições e efeitos polidos
- 📱 **100% Responsivo**: Mobile-first design otimizado

### ⚡ Melhorias de UX

- 🔄 **Loading states**: Feedback visual de carregamento
- 📢 **Toast notifications**: Notificações elegantes
- 🎨 **Badges de categoria**: Identificação visual clara
- ✅ **Validações**: Mensagens de erro amigáveis

## 📋 Funcionalidades Completas

### Área do Administrador

- Upload de imagens para usar como templates
- **Caixas arrastáveis** para definir coordenadas de nome e telefone
- **Redimensionamento** das caixas pelos cantos
- Configuração de fonte, tamanho e cor do texto
- Preview em tempo real das alterações
- Gerenciamento de templates salvos

### Área do Usuário

- Galeria responsiva de templates
- Seleção visual com marcação
- **Preview dinâmico** enquanto digita
- Preenchimento simples de nome e telefone
- Máscara automática para telefone
- Download da imagem final em alta qualidade (PNG)

## 🚀 Como Usar

### 1. Configurar Templates (Admin)

1. Abra `index.html` no navegador
2. Clique em "Acessar Admin"
3. Faça upload de uma imagem
4. **Arraste a caixa vermelha** (NOME) para a posição desejada
5. **Arraste a caixa azul** (TELEFONE) para a posição desejada
6. Ajuste tamanho, fonte e cor conforme necessário
7. Dê um nome ao template e clique em "Salvar Template"

### 2. Gerar Posts (Usuário)

1. Abra `index.html` no navegador
2. Clique em "Criar Meu Post"
3. Escolha um template (aparece uma marca verde ✓)
4. Digite seu nome e telefone
5. **Veja o preview em tempo real** conforme digita
6. Clique em "Gerar Meu Post"
7. Baixe sua imagem personalizada

## 📱 Mobile-First

A aplicação foi desenvolvida pensando primeiro em dispositivos móveis:

- Interface adaptável para qualquer tamanho de tela
- Suporte completo a touch (arrastar, pinçar, rolar)
- Botões e áreas de toque otimizadas
- Fonte-size ajustado para prevenir zoom automático
- Rolagem suave e fluida

## 💾 Armazenamento

Os templates são salvos no **localStorage** do navegador. Os dados ficam armazenados localmente no dispositivo que criou os templates.

## 🌐 Hospedagem

Para disponibilizar na web:

1. **Opção 1 - GitHub Pages (Grátis)**

   - Crie um repositório no GitHub
   - Faça upload dos arquivos
   - Ative GitHub Pages nas configurações

2. **Opção 2 - Netlify (Grátis)**

   - Acesse netlify.com
   - Arraste a pasta do projeto
   - Pronto!

3. **Opção 3 - Vercel (Grátis)**
   - Acesse vercel.com
   - Importe o projeto
   - Deploy automático

## 📱 Compatibilidade

- ✅ Chrome / Edge (Desktop e Mobile)
- ✅ Firefox (Desktop e Mobile)
- ✅ Safari (Desktop e Mobile)
- ✅ Opera
- ✅ Samsung Internet
- ✅ iOS Safari
- ✅ Android WebView

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Mobile-first, Flexbox, Grid
- **JavaScript (Vanilla)**: ES6+, sem dependências
- **Canvas API**: Renderização e manipulação de imagens
- **localStorage**: Persistência de dados
- **Touch Events**: Suporte completo a dispositivos móveis

## ⚡ Performance

- Sem dependências externas (0 KB de frameworks)
- Carregamento instantâneo
- Funciona 100% offline após primeiro acesso
- Otimizado para dispositivos móveis

## 🎨 Recursos Avançados

- Anti-aliasing para texto suave
- Renderização em alta qualidade
- Suporte a imagens de qualquer tamanho
- Preview em tempo real sem lag
- Drag & drop responsivo com touch

## 📝 Observações Técnicas

- Funciona 100% no navegador, sem backend necessário
- Suporta formatos: JPG, PNG, GIF, WebP, AVIF
- Tamanho máximo limitado pelo navegador (~10MB recomendado)
- Templates ficam salvos localmente em cada navegador/dispositivo
- Coordenadas são salvas em valores absolutos para precisão

---

Criado em 2026 - PostMaker v2.0
