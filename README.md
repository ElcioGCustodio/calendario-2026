# Calendário 2026 · Mogi das Cruzes

Calendário anual de 2026 com feriados nacionais, estaduais (SP) e municipais de
Mogi das Cruzes, além de uma agenda de compromissos salva no próprio navegador.
Interface **mobile first**, em português, sem dependências externas.

| | |
|---|---|
| **Site publicado** | <https://calendario-2026-ivory.vercel.app> |
| **Repositório** | <https://github.com/ElcioGCustodio/calendario-2026> |
| **Projeto na Vercel** | <https://vercel.com/elcio-gc-ustodio/calendario-2026> |
| **Status** | Publicado · testes automatizados: 29/29 ✔ |

## Funcionalidades

- Os 12 meses de 2026 em uma única página, com semana começando no domingo.
- Feriados **nacionais**, **estaduais (SP)** e **municipais de Mogi das Cruzes**
  destacados por cor, com legenda completa e base legal.
- **Pontos facultativos** exibidos separadamente, com aviso de que não são
  feriados obrigatórios.
- Agenda por dia: horário, título (até 80 caracteres) e observação (até 160).
- Marcador nos dias com compromisso e painel com todos os compromissos do ano.
- Criação, listagem e exclusão de compromissos; clique no item do painel leva ao
  dia correspondente.
- Persistência em `localStorage` (chave `agenda-2026-mogi`).
- Impressão em 3 colunas, com todos os meses visíveis.
- Favicon próprio e layout de impressão.

## Mobile first

O CSS foi escrito primeiro para telas pequenas e ampliado com `min-width`:

- **< 640 px** — um mês por tela, barra de meses fixa no topo, navegação por
  setas, seletor de mês e **swipe** lateral; modal em *bottom sheet*.
- **≥ 640 px** — dois meses por linha e cabeçalho em linha.
- **≥ 960 px** — três meses por linha.
- **≥ 1200 px** — quatro meses por linha.

Detalhes de ergonomia: alvos de toque de pelo menos 40 px, campos com 16 px
(evita o zoom automático do iOS), `env(safe-area-inset-bottom)` no modal e
respeito a `prefers-reduced-motion`.

## Estrutura do projeto

```text
.
├── calendario-2026.html      # aplicação completa (HTML + CSS + JS)
├── favicon.svg               # ícone da aba
├── vercel.json               # rewrite da raiz e cache
├── tests/
│   ├── responsivo.mjs        # 29 verificações de responsividade e agenda
│   ├── package.json          # scripts de teste
│   └── README.md             # como rodar os testes
├── docs/
│   ├── CONTEXTO.md           # estado do projeto, contas, ambiente e pendências
│   ├── FUNCIONALIDADES.md    # comportamento detalhado da aplicação
│   ├── DADOS.md              # feriados, base legal e formato do localStorage
│   ├── DEPLOY.md             # publicação, verificação e rollback
│   └── CHANGELOG.md          # histórico de mudanças
└── README.md
```

## Rodar localmente

Abra `calendario-2026.html` no navegador — é um arquivo único e funciona
offline. Para servir por HTTP:

```bash
npx serve .
# acesse http://localhost:3000
```

## Testes

Requer Node.js 20.11+ e Edge, Chrome ou Chromium instalado.

```bash
cd tests
npm install
npm test                 # testa o arquivo local
npm run test:producao    # testa a URL publicada
```

Os testes cobrem layout mobile/tablet/desktop, navegação de meses, modal,
criação/exclusão de compromissos e erros de console. Veja
[`tests/README.md`](tests/README.md).

## Publicação

O deploy é automático: todo push na branch `main` é publicado pela integração
GitHub ↔ Vercel.

```bash
git add -A
git commit -m "descrição da mudança"
git push
```

Passo a passo completo, verificação pós-deploy e rollback em
[`docs/DEPLOY.md`](docs/DEPLOY.md).

## Armazenamento e privacidade

Os compromissos ficam **somente no navegador de cada visitante**
(`localStorage`), não são enviados a nenhum servidor e não são compartilhados
entre dispositivos. Limpar os dados do site apaga a agenda. O formato dos dados
está documentado em [`docs/DADOS.md`](docs/DADOS.md).

## Observações legais

- Feriados nacionais: Lei nº 9.093/1995 e legislação específica; o Dia Nacional
  de Zumbi e da Consciência Negra (20/11) é feriado nacional desde 2024.
- Feriado estadual: Revolução Constitucionalista de 1932 (09/07), em São Paulo.
- Feriados municipais de Mogi das Cruzes: Lei Municipal nº 3.125/1986 (Corpus
  Christi e Nossa Senhora de Sant'Ana) e Lei Municipal nº 1.585/1966 (Aniversário
  da cidade).
- Pontos facultativos **não** são feriados obrigatórios; dependem de decreto
  municipal ou acordo com o empregador.
- Confirme sempre as datas no site oficial da Prefeitura de Mogi das Cruzes.

## Documentação

| Documento | Conteúdo |
|---|---|
| [`docs/CONTEXTO.md`](docs/CONTEXTO.md) | Como retomar o trabalho: contas, ambiente, decisões, pendências e backlog |
| [`docs/FUNCIONALIDADES.md`](docs/FUNCIONALIDADES.md) | Telas, interações, acessibilidade e matriz de testes |
| [`docs/DADOS.md`](docs/DADOS.md) | Tabela de feriados, base legal e esquema do `localStorage` |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Publicação, verificação, rollback e solução de problemas |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Histórico de versões e commits |
| [`tests/README.md`](tests/README.md) | Testes automatizados |

## Limitações conhecidas

Sem sincronização entre dispositivos, sem recorrência de compromissos, sem
notificações e sem navegação para outros anos. O modal não prende o foco do
teclado (fecha com `Esc` e devolve o foco ao elemento anterior). O calendário
cobre apenas 2026. Detalhes e backlog em [`docs/CONTEXTO.md`](docs/CONTEXTO.md).
