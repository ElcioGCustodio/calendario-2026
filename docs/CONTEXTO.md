# Contexto e retomada do projeto

Última atualização: **31/10/2026**.

Este documento existe para que o trabalho possa ser retomado sem depender da
memória da conversa: registra o estado atual, as contas, o ambiente, as decisões
técnicas, as pendências e os cuidados.

## 1. Objetivo

Ter um calendário de 2026 para **Mogi das Cruzes (SP)** que:

- mostre todos os feriados nacionais, estaduais (SP), municipais e pontos
  facultativos;
- permita agendar compromissos clicando nos dias;
- funcione bem em celular (**mobile first**), tablet e desktop;
- esteja publicado gratuitamente via GitHub + Vercel;
- seja um arquivo estático simples, sem backend e sem dependências externas.

## 2. Onde está

| Item | Endereço |
|---|---|
| Produção | <https://calendario-2026-ivory.vercel.app> |
| Alias de deploy `main` | <https://calendario-2026-git-main-elcio-gc-ustodio.vercel.app> |
| Repositório | <https://github.com/ElcioGCustodio/calendario-2026> |
| Projeto Vercel | <https://vercel.com/elcio-gc-ustodio/calendario-2026> |
| Pasta local | `C:\Users\elcio\FOLDER` |
| Branch de produção | `main` |

## 3. Contas e autenticação

| Serviço | Conta | Observação |
|---|---|---|
| GitHub | `ElcioGCustodio` | Autenticado no `gh` CLI; e-mail de commit `339873419+ElcioGCustodio@users.noreply.github.com` |
| Vercel | `elciogcustodio` | Escopo/time `elcio-gc-ustodio`; CLI autenticada |
| Git local | `ElcioGCustodio` | Identidade configurada somente no repositório |

- O login foi feito pelo navegador; as credenciais ficam no armazenamento local
  das CLIs (`gh` e Vercel), não no repositório.
- `.env.local` contém um **token OIDC da Vercel** usados em testes locais. Está
  ignorado pelo Git. **Nunca commitar, colar em issue ou compartilhar.**
- `.vercel/` contém o vínculo local com o projeto e também está ignorado.
- Para conferir a autenticação:

  ```powershell
  gh auth status
  & "$env:APPDATA\npm\vercel.cmd" whoami
  ```

## 4. Ambiente de desenvolvimento

Windows + PowerShell 5.1. Versões usadas:

| Ferramenta | Versão | Caminho / observação |
|---|---|---|
| Node.js | v26.13.0 | `node` |
| Git | 2.56.0.windows.4 | `C:\Program Files\Git\cmd\git.exe` |
| GitHub CLI | 2.103.3 | `C:\Program Files\GitHub CLI\gh.exe` |
| Vercel CLI | 65.9.0 | `%APPDATA%\npm\vercel.cmd` |
| Microsoft Edge | 156.0.4314.50 | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` |
| puppeteer-core | ^25.16.0 | dependência de desenvolvimento em `tests/` |

Cuidados no Windows:

- O PowerShell bloqueia `npm.ps1`; use sempre **`npm.cmd`**.
- Ferramentas recém-instaladas só aparecem em **terminais novos** (PATH).
- Ao chamar a Vercel no PowerShell, use
  `& "$env:APPDATA\npm\vercel.cmd" ...`; mensagens em `stderr` podem aparecer
  como `NativeCommandError` sem serem erro real.
- Git e `gh` podem não estar no PATH de um terminal antigo. Prefixe com:

  ```powershell
  $env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:Path
  ```

## 5. Decisões técnicas

1. **Arquivo único** `calendario-2026.html` com HTML, CSS e JS embutidos. Sem
   build, sem framework, sem CDN. Funciona offline e é trivial de publicar.
2. **Mobile first**: CSS base para telas pequenas e `@media (min-width: ...)`
   para ampliar. Breakpoints em 640, 960 e 1200 px.
3. **Um mês por tela no celular**, com barra fixa, setas, seletor e swipe.
   No desktop os 12 meses aparecem em grade (2/3/4 colunas).
4. **Agenda em `localStorage`** (chave `agenda-2026-mogi`), sem backend. Isso
   evita custo e cadastro, mas limita a sincronização.
5. **Ano fixo em 2026** (`const ANO = 2026`), com datas de feriados em `MM-DD`.
6. **Vercel serve a raiz `/`** via `rewrite` para `calendario-2026.html`.
7. **Deploy automático** pela integração GitHub ↔ Vercel a cada push em `main`.
8. **Testes com Puppeteer** controlando o Edge já instalado (`puppeteer-core`,
   sem baixar outro navegador).

## 6. Estado atual

- [x] Calendário com os 12 meses e legenda de feriados.
- [x] Agenda (criar, listar, excluir, marcadores e painel anual).
- [x] Layout mobile first com navegação por mês, swipe e bottom sheet.
- [x] Favicon próprio e correção do 404 da raiz.
- [x] Publicado na Vercel com deploy automático validado.
- [x] Suíte automatizada com **29 verificações** (`tests/`).
- [x] Documentação completa (`README.md` e `docs/`).
- [x] `.gitignore` cobre `tests/saida/` (capturas de tela).

Commits principais:

| Commit | Descrição |
|---|---|
| `4311a53` | Versão inicial: feriados e agenda |
| `ef65644` | Documenta a URL de produção |
| `3f113bf` | Layout mobile first e navegação de meses |
| `7a2bff5` | Favicon e correção do 404 na raiz |
| `4b0ffcd` | Documentação completa e testes automatizados |

Consulte `git log --oneline` para o histórico completo.

## 7. Como retomar

```powershell
cd C:\Users\elcio\FOLDER
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:Path

git pull
git status

cd tests
npm.cmd install
npm.cmd test
```

Depois:

1. Abra `https://calendario-2026-ivory.vercel.app` e confira o mês atual.
2. Veja o painel da Vercel para confirmar que o último deploy está `Ready`.
3. Leia o backlog abaixo e escolha o próximo item.
4. Rode `npm.cmd run test:producao` dentro de `tests/` após qualquer deploy.

## 8. Pendências

Nenhuma pendência bloqueante. O projeto está publicado e testado.

Para 2027, será necessário atualizar o ano e recalcular os feriados móveis
(ver seção 10 e [`DADOS.md`](DADOS.md)).

## 9. Backlog sugerido

| Prioridade | Item | Notas |
|---|---|---|
| Média | Exportar/importar agenda (`.ics` ou JSON) | Backup manual e integração com Google/Outlook |
| Média | PWA com offline e instalação na tela inicial | Hoje já funciona offline como arquivo, mas não é instalável |
| Média | Sincronização entre dispositivos | Exige backend/autenticação (Vercel KV, Supabase etc.) |
| Média | Navegação entre anos | Hoje o ano é fixo em 2026 |
| Baixa | Domínio personalizado | Configurável no painel da Vercel |
| Baixa | Lembretes/notificações | Depende de service worker + permissão do usuário |
| Baixa | Recorrência de compromissos | Exige modelo de dados mais complexo |
| Baixa | Prender o foco no modal (focus trap) | Melhoria de acessibilidade |
| Baixa | CI no GitHub Actions | Rodar `tests/` em cada push/PR |
| Baixa | Testes de swipe, `Esc`, impressão e "Ir para hoje" | Ampliar a suíte atual |

## 10. Limitações e riscos

- **Sem sincronização**: a agenda é local ao navegador e ao domínio. O arquivo
  aberto via `file://` e o site na Vercel têm armazenamentos **diferentes**;
  previews da Vercel também têm domínios diferentes.
- **Sem recorrência, notificações ou múltiplos anos.**
- **Feriados móveis fixados para 2026** (Carnaval, Sexta-feira da Paixão,
  Corpus Christi). Para outro ano, recalcule as datas.
- **Sem focus trap** no modal: `Esc`, botão `×` e clique no fundo fecham e o
  foco volta ao elemento anterior.
- **`localStorage`** pode falhar (modo privado, cota cheia). A gravação falha em
  silêncio e os dados ficam só na sessão; a leitura descarta entradas inválidas.
- **Dados não oficiais**: as datas foram conferidas em leis, mas devem ser
  confirmadas na Prefeitura antes de uso crítico.
- **Token OIDC** em `.env.local` é sensível; se vazar, revogue/rotacione.
- A Vercel leva alguns segundos para publicar após o push; não considere o site
  atualizado imediatamente.

## 11. Comandos úteis

```powershell
# Estado do repositório
git status
git log --oneline --decorate -n 10

# Testes
cd tests
npm.cmd test
npm.cmd run test:producao
node responsivo.mjs https://calendario-2026-ivory.vercel.app --screenshots

# Vercel
& "$env:APPDATA\npm\vercel.cmd" whoami
& "$env:APPDATA\npm\vercel.cmd" ls
& "$env:APPDATA\npm\vercel.cmd" rollback --help
```

Mais detalhes de publicação em [`DEPLOY.md`](DEPLOY.md).
