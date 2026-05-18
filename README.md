# 🌸 FloraFit — Cuide de você com leveza

> *Seu app de saúde favorito: jejum intermitente e monitoramento calórico num só lugar, com um design que faz você querer abrir todo dia.*

---

## 💡 Sobre o projeto

O **FloraFit** é uma Single Page Application (SPA) desenvolvida com **Vue.js 3** como projeto prático da disciplina. A proposta é simples e poderosa: ajudar o usuário a controlar dois pilares fundamentais da saúde — o **jejum intermitente** e o **consumo calórico diário** — tudo isso de forma visual, intuitiva e persistente.

Nada se perde ao fechar o navegador. Nada some ao recarregar a página. O FloraFit lembra de tudo. 🌿

---

## ✨ Funcionalidades

### ⏳ Módulo de Jejum
- Timer em tempo real com contagem hora:minuto:segundo
- Janelas pré-definidas: **16:8 · 18:6 · 20:4 · 14:10**
- Janela **personalizada** com modal interativo
- Barra de progresso em arco mostrando % da meta atingida
- Histórico completo de jejuns com status (completo ou parcial)

### 🍽️ Módulo de Nutrição
- Meta diária de calorias configurável pelo usuário
- Formulário rápido para registrar refeições (nome + kcal)
- **Anel animado** de progresso calórico do dia
- Barra de alerta quando a meta é ultrapassada
- Lista de refeições com horário e botão de exclusão
- Gráfico de barras com consumo dos últimos 7 dias

### 📊 Dashboard Semanal
- Média calórica dos últimos 7 dias
- Total de horas em jejum acumuladas na semana
- Gráfico de barras com histórico visual diário
- Tabela de resumo por dia (kcal + horas de jejum)
- Histórico completo de jejuns e refeições

### 🏠 Dashboard Principal
- Visão geral do dia: calorias, jejum ativo, meta e registros
- Gráfico de linha com evolução calórica semanal
- Acesso rápido para iniciar jejum ou registrar refeição

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **Vue.js 3** | Framework principal, Composition API com `ref`, `computed`, `watch` |
| **Vue Router 4** | Navegação entre as 4 páginas da SPA |
| **Pinia** | Gerenciamento de estado global (`fastStore` e `nutritionStore`) |
| **Chart.js** | Gráficos de linha e barras |
| **Tailwind CSS v3** | Estilização responsiva e utilitária |
| **localStorage** | Persistência de dados no navegador (sem backend) |
| **Vite** | Bundler e servidor de desenvolvimento |

---

## 🗂️ Estrutura de pastas

```
florafit/
├── src/
│   ├── assets/
│   │   └── main.css              # Estilos globais + Tailwind
│   ├── components/
│   │   ├── AppSidebar.vue        # Barra de navegação (desktop + mobile)
│   │   ├── CalorieRing.vue       # Componente reutilizável: anel SVG animado
│   │   └── MealList.vue          # Componente reutilizável: lista de refeições
│   ├── stores/
│   │   ├── fastStore.js          # Pinia: estado e lógica do jejum
│   │   └── nutritionStore.js     # Pinia: estado e lógica da nutrição
│   ├── views/
│   │   ├── HomeView.vue          # Dashboard principal
│   │   ├── FastView.vue          # Módulo de jejum
│   │   ├── NutritionView.vue     # Módulo de nutrição
│   │   └── WeeklyView.vue        # Dashboard semanal
│   ├── router/
│   │   └── index.js              # Rotas da aplicação
│   ├── App.vue                   # Componente raiz + layout + toast
│   └── main.js                   # Entry point da aplicação
├── tailwind.config.js
├── index.html
└── package.json
```

---

## 📱 Responsividade

O FloraFit foi pensado para funcionar bem em qualquer tela:

- 🖥️ **Desktop** — sidebar lateral fixa com logo e ícones
- 📱 **Mobile** — barra de navegação inferior, layout em coluna única
- 📟 **Tablet** — grid adaptável com 2 colunas

---

## 🚀 Como iniciar o projeto no VS Code

### Pré-requisitos:

Antes de tudo, você precisa ter o **Node.js** instalado na sua máquina.
👉 Baixe em: [https://nodejs.org](https://nodejs.org) — escolha a versão **LTS**

Para confirmar que está instalado, abra o terminal e rode:
```bash
node -v
npm -v
```
Se aparecerem os números das versões, está pronto!

---

### Passo a passo: Como utilizar!

**1. Abra a pasta do projeto no VS Code**

Pelo menu: `File → Open Folder` → selecione a pasta `FloraFit`

Ou pelo terminal:
```bash
cd caminho/para/a/pasta/FloraFit
code .
```

---

**2. Abra o terminal integrado do VS Code**

Use o atalho `` Ctrl + ` `` (crase) ou vá em `Terminal → New Terminal`

---

**3. Instale as dependências**

```bash
npm install
```

Aguarde terminar — então instale o Vue, Pinia, Router, Tailwind e tudo mais. ☕

---

**4. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

---

**5. Acesse no navegador**

O terminal vai mostrar algo assim:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
```

Abra o endereço **http://localhost:5173** no navegador e o FloraFit estará rodando! 🌸

---

### 💾 Sobre os dados

Todos os registros (jejuns, refeições e metas) ficam salvos no **localStorage** do seu navegador. Isso significa que:

- ✅ Os dados persistem ao fechar e reabrir o navegador;
- ✅ Não precisa de internet nem de backend;
- ⚠️ Limpar os dados do navegador apaga os registros!!

---

## 👩‍💻 Desenvolvido por: Lissandra Santos

Feito com 💗 e muito Vue.js — *porque cuidar de você merece um app bonito.*