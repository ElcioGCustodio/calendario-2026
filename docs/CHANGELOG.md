# Changelog

Mudanças relevantes do Calendário 2026. O projeto não usa versionamento formal;
os números abaixo organizam as entregas.

## [0.4.0] — 2026-10-31 — Documentação e testes

Commit: `4b0ffcd`

### Adicionado

- Suíte automatizada `tests/responsivo.mjs` com **29 verificações** de
  responsividade, navegação, modal, agenda e console.
- `tests/package.json` e `package-lock.json` (puppeteer-core `^25.16.0`).
- Scripts `npm test` (arquivo local) e `npm run test:producao` (URL publicada).
- Captura opcional de telas com `--screenshots` em `tests/saida/`.
- Documentação: `docs/CONTEXTO.md`, `docs/FUNCIONALIDADES.md`,
  `docs/DADOS.md`, `docs/DEPLOY.md`, `docs/CHANGELOG.md` e
  `tests/README.md`.
- Tabela completa de feriados e base legal.
- Registro de contas, ambiente, decisões, limitações e backlog.

### Alterado

- `README.md` reescrito com visão geral, links, estrutura, testes e índice da
  documentação.
- `.gitignore` passa a ignorar `tests/saida/`.

## [0.3.0] — 2026-10-31 — Favicon e correção do 404

Commit: `7a2bff5`

### Adicionado

- `favicon.svg` (calendário azul com o ano de 2026).
- `<link rel="icon">` no HTML.

### Corrigido

- Erro 404 na raiz do site, eliminado com o favicon e o rewrite já existente.
- Console de produção sem erros ou recursos ausentes.

## [0.2.0] — 2026-10-31 — Mobile first

Commit: `3f113bf`

### Adicionado

- Layout mobile first com um mês por tela.
- Barra de navegação fixa com setas, seletor de mês e suporte a **swipe**.
- Modal em **bottom sheet** no celular e centralizado no desktop.
- Botão `+ Novo compromisso` com atalho para o dia atual.
- Navegação do painel de compromissos para o dia correspondente, inclusive
  trocando de mês no celular.
- `viewport-fit=cover`, `theme-color`, área segura do iOS e fonte de 16 px nos
  campos.
- `prefers-reduced-motion` e ajustes de impressão.
- README com seção mobile first.

### Alterado

- CSS reorganizado em base mobile + breakpoints de 640, 960 e 1200 px.
- Área de toque dos dias e botões ampliada (≥ 40 px).
- `scroll-margin` ajustado para a barra fixa.
- Header e ações reorganizados para telas pequenas.

## [0.1.0] — 2026-10-31 — Versão inicial

Commit: `4311a53` (seguido de `ef65644`, que documenta a URL de produção)

### Adicionado

- Calendário completo de 2026 em português, com semana começando no domingo.
- 10 feriados nacionais, 1 estadual (SP) e 3 municipais de Mogi das Cruzes.
- 6 pontos facultativos com aviso de que não são obrigatórios.
- Legenda por tipo, com cores, datas, dias da semana e base legal.
- Agenda por dia: horário, título, observação, marcadores e painel anual.
- Criação, listagem e exclusão de compromissos.
- Persistência em `localStorage` com validação dos dados.
- Destaque do dia atual, botão `Ir para hoje` e impressão.
- Publicação na Vercel com rewrite da raiz e deploy automático via GitHub.
