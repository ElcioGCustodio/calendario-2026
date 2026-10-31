# Testes automatizados

Suíte de responsividade e agenda do Calendário 2026, usando **puppeteer-core**
com um navegador Chromium já instalado (Edge ou Chrome). Não baixa navegador.

## Requisitos

- Node.js **20.11 ou superior** (usa `import.meta.dirname`). Testado com
  Node v26.13.0.
- Edge, Google Chrome ou Chromium instalado.
- Conexão com a internet apenas para `npm install` e para testar a produção.

## Instalação

```powershell
cd C:\Users\elcio\FOLDER\tests
npm.cmd install
```

> No Windows/PowerShell use `npm.cmd`, porque `npm.ps1` é bloqueado pela
> política de execução.

## Como rodar

```powershell
# Testa o arquivo local calendario-2026.html
npm.cmd test

# Testa a URL publicada
npm.cmd run test:producao

# URL arbitrária (preview, outro domínio etc.)
node responsivo.mjs https://calendario-2026-git-main-elcio-gc-ustodio.vercel.app

# Salvar capturas em tests/saida/
node responsivo.mjs --screenshots
node responsivo.mjs https://calendario-2026-ivory.vercel.app --screenshots
```

Saída esperada:

```text
▶ Mobile 390×844
▶ Mobile 320×568
▶ Tablet 768×1024
▶ Desktop 1440×900
▶ Console do navegador

29/29 verificações OK ✔
```

Código de saída `0` quando tudo passa; `1` em caso de falha ou erro de execução.

## Navegador utilizado

O script procura, nesta ordem:

1. `BROWSER_PATH` (variável de ambiente)
2. Edge em `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
3. Edge em `C:\Program Files\Microsoft\Edge\Application\msedge.exe`
4. Chrome em `C:\Program Files\Google\Chrome\Application\chrome.exe`
5. Chrome em `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
6. Caminhos comuns no Linux e no macOS

Para forçar outro navegador:

```powershell
$env:BROWSER_PATH = "D:\apps\chrome.exe"
npm.cmd test
```

## O que é verificado

| Grupo | Verificações |
|---|---|
| Mobile 390×844 | barra fixa visível, apenas 1 mês, sem rolagem horizontal, dia com ≥ 39 px, botão principal com 44 px |
| Navegação | seta `›` troca o mês, seletor acompanha, selecionar índice 0 leva a janeiro |
| Modal | abre ao tocar no dia, largura total, encostado no rodapé, topo abaixo de 30% da tela (bottom sheet), input com 16 px |
| Agenda | compromisso aparece no dia, marcador no calendário, item no painel, fecha pelo `×`, exclusão limpa painel e marcador |
| Mobile 320×568 | sem overflow horizontal, dia continua tocável |
| Tablet 768×1024 | 12 meses visíveis, 2 colunas, barra mobile oculta, sem overflow |
| Desktop 1440×900 | 12 meses visíveis, 4 colunas, barra mobile oculta, sem overflow |
| Console | nenhum `pageerror` e nenhuma resposta HTTP ≥ 400 |

Total: **29 verificações**.

## Capturas de tela

Com `--screenshots`, os arquivos são gravados em `tests/saida/`:

- `mobile.png` (página inteira)
- `mobile-modal.png`
- `desktop.png` (página inteira)

A pasta está no `.gitignore` e não deve ser commitada.

## Isolamento dos dados

- O teste local abre `file:///.../calendario-2026.html`.
- O teste de produção abre a URL remota.
- Cada execução usa um perfil temporário do navegador, criado pelo Puppeteer.
  O `localStorage` do navegador pessoal **não** é afetado.
- O próprio teste cria um compromisso "Teste automatizado" e o exclui em
  seguida. Se a execução for interrompida, o dado fica apenas no perfil
  temporário, que é descartado.

## Estrutura

```text
tests/
├── responsivo.mjs     # suíte completa
├── package.json       # scripts e dependência
├── package-lock.json  # versões travadas
├── README.md
└── saida/             # capturas (gerado, ignorado)
```

O utilitário interno `verificar(nome, condicao, detalhe)` registra cada
resultado. Para adicionar uma verificação, avalie o estado com
`page.evaluate(...)` e chame `verificar(...)`; a contagem final se ajusta
sozinha.

## CI (opcional)

Ainda não existe pipeline configurado. Um exemplo para GitHub Actions:

```yaml
name: testes
on: [push, pull_request]
jobs:
  responsivo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
        working-directory: tests
      - run: npm test
        working-directory: tests
        env:
          BROWSER_PATH: /usr/bin/google-chrome
```

O runner do GitHub já traz o Google Chrome instalado.
