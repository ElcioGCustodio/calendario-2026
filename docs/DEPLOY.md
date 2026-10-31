# Publicação e operação

O site é estático e publicado na **Vercel** a partir do repositório no GitHub.
Não há build, servidor ou variáveis de ambiente necessárias em produção.

## 1. Arquitetura

```text
GitHub (main)
   │  push
   ▼
Vercel (integração Git)
   │  deploy estático
   ▼
https://calendario-2026-ivory.vercel.app
   │  rewrite / → /calendario-2026.html
   ▼
calendario-2026.html + favicon.svg
```

| Item | Valor |
|---|---|
| Repositório | `ElcioGCustodio/calendario-2026` (público) |
| Branch de produção | `main` |
| Projeto Vercel | `elcio-gc-ustodio/calendario-2026` |
| URL de produção | <https://calendario-2026-ivory.vercel.app> |
| Alias do deploy `main` | <https://calendario-2026-git-main-elcio-gc-ustodio.vercel.app> |
| Framework preset | Other (site estático) |

## 2. `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/", "destination": "/calendario-2026.html" }
  ],
  "headers": [
    {
      "source": "/calendario-2026.html",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

- **Rewrite**: a raiz `/` entrega o calendário, sem redirecionar e sem expor
  `calendario-2026.html` na URL.
- **Cache**: o HTML é sempre revalidado, evitando versões antigas após deploy.
- `favicon.svg` é servido diretamente pelo caminho `/favicon.svg`.

## 3. Fluxo normal de publicação

```powershell
cd C:\Users\elcio\FOLDER
$env:Path = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:Path

git status
git add -A
git commit -m "Descrição objetiva da mudança"
git push origin main
```

O push dispara automaticamente um novo deploy de produção. Acompanhe em
**Deployments** no painel da Vercel ou pela CLI:

```powershell
& "$env:APPDATA\npm\vercel.cmd" ls
```

Normalmente leva de 10 a 60 segundos. O deployment fica `Ready` quando o site
já está no ar.

### Verificação pós-deploy

1. Confirme o status HTTP:

   ```powershell
   (Invoke-WebRequest "https://calendario-2026-ivory.vercel.app" -UseBasicParsing).StatusCode
   ```

2. Confira no HTML publicado se a mudança chegou:

   ```powershell
   $r = Invoke-WebRequest "https://calendario-2026-ivory.vercel.app" -UseBasicParsing
   $r.Content -match "trecho-da-mudanca"
   ```

3. Rode a suíte contra a produção:

   ```powershell
   cd C:\Users\elcio\FOLDER\tests
   npm.cmd run test:producao
   ```

4. Abra o site no celular (ou emule no DevTools) e teste um compromisso.

## 4. Deploy manual pela CLI

Útil para testar sem passar pelo Git ou publicar uma versão de emergência.

```powershell
cd C:\Users\elcio\FOLDER

# Preview (URL temporária)
& "$env:APPDATA\npm\vercel.cmd"

# Produção
& "$env:APPDATA\npm\vercel.cmd" --prod
```

- O projeto local já está vinculado (`.vercel/project.json`, ignorado pelo Git).
- Em outra máquina, rode `vercel link` antes.
- A CLI **não substitui** a integração Git: o próximo push em `main` volta a
  publicar o que está no repositório.
- Alternativa sem instalação global: `npx vercel --prod`.

## 5. Preview deployments

- Branches e pull requests ganham URLs de preview automáticas.
- Cada preview tem origem própria, portanto **não compartilha a agenda** com a
  produção.
- Use previews para revisar mudanças antes do merge.

## 6. Rollback

### Pela CLI

```powershell
# Listar deployments
& "$env:APPDATA\npm\vercel.cmd" ls

# Voltar a produção para um deployment anterior (ID ou URL)
& "$env:APPDATA\npm\vercel.cmd" rollback <deployment>

# Conferir rollback pendente
& "$env:APPDATA\npm\vercel.cmd" rollback status
```

### Pelo painel

1. Abra **Deployments** no projeto.
2. Escolha o deployment anterior que estava bom.
3. Use o menu **⋯ → Promote to Production** (ou **Rollback**).

Observações:

- O rollback altera o alias de produção, mas **não** altera o Git. O próximo
  push em `main` publica novamente o estado do repositório.
- Para desfazer via Git, prefira `git revert <commit>` e push — mantém o
  histórico auditável.

## 7. Domínio personalizado (futuro)

1. Painel da Vercel → projeto → **Settings → Domains**.
2. Adicione o domínio e configure o DNS indicado (CNAME/A).
3. A Vercel emite o certificado TLS automaticamente.
4. Atualize a URL no `README.md`, em `docs/CONTEXTO.md` e no rodapé do HTML, se
   desejar.

## 8. Solução de problemas

| Sintoma | Causa provável | Solução |
|---|---|---|
| `npm.ps1 não pode ser carregado` | Política de execução do PowerShell | Use `npm.cmd` |
| `git`/`gh`/`vercel` não reconhecido | PATH do terminal antigo | Abra um terminal novo ou prefixe o `PATH` (ver `CONTEXTO.md`) |
| `vercel` não reconhecido | CLI está em `%APPDATA%\npm` | Use `& "$env:APPDATA\npm\vercel.cmd"` ou `npx vercel` |
| Saída da Vercel em vermelho, mas comando funcionou | `stderr` do executável nativo | Ignore ou use `2>&1`; confira `$LASTEXITCODE` |
| Site continua antigo após push | Deploy ainda em andamento ou cache | Aguarde, confira **Deployments** e recarregue com cache limpo |
| 404 na raiz | `vercel.json` ausente/inválido | Confirme o rewrite e faça novo deploy |
| 404 em `/favicon.svg` | Arquivo não enviado | Confira `git status` e o deploy |
| Deploy não dispara | Push em outra branch ou integração desconectada | Faça merge/push em `main`; verifique **Settings → Git** |
| `gh: not logged in` | Sessão expirada | `gh auth login` |
| Vercel pede login | Sessão expirada | `vercel login` |
| Teste não acha navegador | Edge/Chrome em caminho diferente | Defina `BROWSER_PATH` com o caminho do executável |
| Agenda "sumiu" | Outra origem (file://, preview, outro navegador) | Verifique a URL e o navegador; os dados são isolados por origem |
| Modal não fecha | JavaScript bloqueado ou arquivo antigo | Confira o console e a versão publicada |

## 9. Segurança

- **Nunca** commitar `.env.local` (token OIDC), `.vercel/` ou capturas locais.
- O `.gitignore` já cobre esses casos.
- Se um token vazar, revogue/rotacione no painel da Vercel e atualize o arquivo
  local.
- O repositório é público, mas não contém segredos nem dados de usuários.
- A agenda fica apenas no navegador do visitante; não há coleta de dados.

## 10. Checklist de deploy

- [ ] `git status` limpo (ou somente mudanças intencionais)
- [ ] `cd tests && npm.cmd test` — 29/29
- [ ] `git push origin main`
- [ ] Deployment `Ready` no painel
- [ ] Status 200 na URL de produção
- [ ] `npm.cmd run test:producao` — 29/29
- [ ] Teste manual rápido no celular
- [ ] Console sem erros/404
- [ ] `README`/`CHANGELOG` atualizados quando necessário
