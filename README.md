# Calendário 2026 · Mogi das Cruzes

Calendário anual de 2026 com feriados nacionais, estaduais (SP) e municipais de
Mogi das Cruzes, além de agenda de compromissos salva no navegador.

**Publicado em:** <https://calendario-2026-ivory.vercel.app>

## Conteúdo

| Arquivo | Descrição |
|---|---|
| `calendario-2026.html` | Aplicação completa: calendário, legenda de feriados e agenda |
| `vercel.json` | Configuração da Vercel (raiz `/` serve o calendário) |
| `README.md` | Este arquivo |

Tudo é um único arquivo HTML, sem dependências externas. Funciona offline.

## Rodar localmente

Basta abrir `calendario-2026.html` no navegador.

Para servir por HTTP (necessário em alguns navegadores para o `localStorage`
funcionar de forma consistente):

```bash
npx serve .
# acesse http://localhost:3000
```

## Publicar na Vercel

### Opção 1 — Integração com GitHub (deploy automático)

1. O código precisa estar em um repositório no GitHub:

   ```bash
   git init
   git add .
   git commit -m "Calendário 2026 de Mogi das Cruzes"
   gh repo create calendario-2026 --public --source=. --push
   ```

2. Acesse <https://vercel.com/new>, escolha **Import Git Repository** e
   selecione o repositório `calendario-2026`.
3. Mantenha as configurações padrão (Framework Preset: **Other**) e clique em
   **Deploy**.

A partir daí, cada `git push` na branch `main` gera um deploy automático.
Pull requests ganham Preview Deployments.

### Opção 2 — Deploy direto pela CLI

```bash
npx vercel        # preview
npx vercel --prod # produção
```

A CLI não cria a integração com o GitHub; use a Opção 1 se quiser deploy
automático a cada push.

## Atualizar o calendário

```bash
git add calendario-2026.html
git commit -m "Atualiza feriados/agenda"
git push
```

Com a integração do GitHub configurada, a Vercel publica a nova versão
automaticamente.

## Observações

- Os compromissos da agenda ficam no `localStorage` do navegador de cada
  visitante — não são enviados para servidor nem compartilhados entre
  dispositivos.
- Datas de feriados: Leis nº 9.093/1995 e 14.759/2023, Lei Estadual paulista de
  9 de julho, Lei Municipal nº 3.125/1986 e Lei Municipal nº 1.585/1966.
  Confira sempre o site oficial da Prefeitura de Mogi das Cruzes.
