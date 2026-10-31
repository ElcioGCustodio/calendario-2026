# Dados: feriados e agenda

Este documento descreve os dados usados pelo calendário: a tabela de feriados de
2026 e o formato da agenda salva no navegador.

## 1. Feriados de 2026

Semana começando no domingo. A coluna **Tipo** corresponde às cores da legenda.

### Nacionais

| Data | Dia da semana | Feriado | Base / observação |
|---|---|---|---|
| 01/01 | quinta-feira | Confraternização Universal | Feriado nacional |
| 03/04 | sexta-feira | Sexta-feira da Paixão | Feriado nacional religioso (data móvel) |
| 21/04 | terça-feira | Tiradentes | Feriado nacional |
| 01/05 | sexta-feira | Dia do Trabalho | Feriado nacional |
| 07/09 | segunda-feira | Independência do Brasil | Feriado nacional |
| 12/10 | segunda-feira | Nossa Senhora Aparecida | Lei federal nº 6.802/1980 |
| 02/11 | segunda-feira | Finados | Feriado nacional |
| 15/11 | domingo | Proclamação da República | Feriado nacional |
| 20/11 | sexta-feira | Consciência Negra | Lei federal nº 14.759/2023 — feriado nacional desde 2024 |
| 25/12 | sexta-feira | Natal | Feriado nacional |

### Estadual (São Paulo)

| Data | Dia da semana | Feriado | Base / observação |
|---|---|---|---|
| 09/07 | quinta-feira | Revolução Constitucionalista | Feriado estadual de São Paulo — Revolução de 1932 |

### Municipais — Mogi das Cruzes

| Data | Dia da semana | Feriado | Base / observação |
|---|---|---|---|
| 04/06 | quinta-feira | Corpus Christi | Lei Municipal nº 3.125/1986 — data móvel |
| 26/07 | domingo | Nossa Senhora de Sant'Ana | Lei Municipal nº 3.125/1986 — padroeira da cidade |
| 01/09 | terça-feira | Aniversário de Mogi das Cruzes | Lei Municipal nº 1.585/1966 — fundação da cidade |

### Pontos facultativos (não obrigatórios)

| Data | Dia da semana | Data comemorativa | Observação |
|---|---|---|---|
| 16/02 | segunda-feira | Carnaval | Segunda-feira de Carnaval |
| 17/02 | terça-feira | Carnaval | Terça-feira de Carnaval |
| 18/02 | quarta-feira | Quarta-feira de Cinzas | Expediente até as 13h |
| 30/10 | sexta-feira | Dia do Servidor Público | Data de referência: 28/10 |
| 24/12 | quinta-feira | Véspera de Natal | Após as 14h |
| 31/12 | quinta-feira | Véspera de Ano Novo | Após as 14h |

> **Atenção:** pontos facultativos não são feriados obrigatórios. A folga depende
> de decreto da Prefeitura ou de acordo com o empregador. Confirme sempre as
> datas no site oficial da Prefeitura de Mogi das Cruzes.

### Regras gerais

- Feriados nacionais seguem a Lei nº 9.093/1995 e legislação específica.
- Datas móveis de 2026: Páscoa em **05/04/2026**, portanto Paixão em **03/04** e
  Corpus Christi em **04/06**; Carnaval em **16 e 17/02**.
- O calendário cobre **somente 2026**.
- Fins de semana são destacados em vermelho, independentemente de feriado.

## 2. Como os feriados aparecem no código

No `<script>` de `calendario-2026.html`:

```js
const ANO = 2026;

const FERIADOS = [
  { data: "01-01", nome: "Confraternização Universal", tipo: "nacional" },
  { data: "04-03", nome: "Sexta-feira da Paixão", tipo: "nacional", nota: "Paixão de Cristo" },
  // ...
  { data: "09-01", nome: "Aniversário de Mogi das Cruzes", tipo: "municipal",
    nota: "Fundação da cidade — Lei Municipal nº 1.585/1966" }
];
```

| Campo | Obrigatório | Descrição |
|---|---|---|
| `data` | Sim | `MM-DD`, sempre relativo a `ANO` |
| `nome` | Sim | Texto exibido na legenda |
| `tipo` | Sim | `nacional`, `estadual`, `municipal` ou `facultativo` |
| `nota` | Não | Texto complementar (base legal, observação) |

Regras de precedência visual: **hoje** > **feriado** > **fim de semana**.

## 3. Agenda no `localStorage`

### Chave e formato

- Chave: **`agenda-2026-mogi`**
- Valor: JSON objeto em que cada chave é uma data `AAAA-MM-DD` e cada valor é
  uma lista de compromissos.

```json
{
  "2026-10-31": [
    {
      "id": "m8x2k1abcde",
      "hora": "14:30",
      "titulo": "Consulta médica",
      "obs": "Levar exames"
    },
    {
      "id": "m8x2k1fghij",
      "hora": "",
      "titulo": "Pagar conta",
      "obs": ""
    }
  ],
  "2026-12-24": [
    {
      "id": "m8x2k1klmno",
      "hora": "19:00",
      "titulo": "Ceia de Natal",
      "obs": "Na casa da avó"
    }
  ]
}
```

### Campos de um compromisso

| Campo | Tipo | Regras |
|---|---|---|
| `id` | string | Gerado com `Date.now()` em base 36 + 5 caracteres aleatórios. Usado para excluir |
| `hora` | string | `HH:MM` ou `""` (sem horário). Exibido como `—` quando vazio |
| `titulo` | string | Obrigatório, sem espaços nas pontas, até 80 caracteres |
| `obs` | string | Opcional, sem espaços nas pontas, até 160 caracteres |

### Ordenação

- Na lista do dia: por `hora`; compromissos sem horário usam `99:99` e ficam no
  fim.
- No painel anual: por data (`AAAA-MM-DD`) e depois por hora.
- A ordenação é textual, suficiente porque o formato `HH:MM` tem dois dígitos.

### Validação na carga

Ao abrir a página, o JSON é lido e validado:

1. Se não existir, retorna `{}`.
2. Se não for um objeto, retorna `{}`.
3. Chaves fora do padrão `AAAA-MM-DD` são descartadas.
4. Valores que não sejam arrays são descartados.
5. Compromissos sem `titulo` string não vazio são descartados.
6. `id`, `hora` e `obs` recebem valores padrão seguros.
7. Erros de JSON ou de acesso ao armazenamento resultam em agenda vazia, sem
   quebrar a interface.

### Limites e privacidade

- Sem backend, sem cookies e sem envio de dados.
- Cada origem tem seu próprio armazenamento: `file://`, produção e previews da
  Vercel **não compartilham** a agenda.
- Limite típico do `localStorage`: cerca de 5 MB por origem (varia por
  navegador). Como cada compromisso ocupa poucas centenas de bytes, o limite
  prático é de milhares de itens.
- Os dados não são criptografados. Qualquer pessoa com acesso ao navegador
  consegue lê-los. Evite informações sensíveis.
- Se a gravação falhar (modo privado, cota cheia), a aplicação segue funcionando
  apenas na sessão atual, sem aviso.

## 4. Inspecionar, salvar e restaurar

No console do navegador (Ferramentas do Desenvolvedor):

```js
// Ver a agenda como objeto
JSON.parse(localStorage.getItem("agenda-2026-mogi"))

// Copiar o JSON para a área de transferência (DevTools)
copy(localStorage.getItem("agenda-2026-mogi"))

// Restaurar um backup
localStorage.setItem("agenda-2026-mogi", JSON.stringify({ /* ... */ }))
location.reload()

// Apagar tudo
localStorage.removeItem("agenda-2026-mogi")
location.reload()
```

Não há exportação/importação pela interface hoje; esse é um item do backlog.

## 5. Atualizar para outro ano

O app é fixo em 2026. Para criar a versão de 2027:

1. Recalcule as datas móveis (Páscoa, Carnaval, Paixão, Corpus Christi).
2. Atualize `const ANO = 2027`.
3. Atualize o array `FERIADOS` (formato `MM-DD`).
4. Atualize a chave `agenda-2026-mogi` (decida se migra os dados antigos).
5. Procure por `2026` no HTML e nos documentos: título, `<h1>`, rodapé,
   `theme-color` não muda, textos da legenda e `README`.
6. Atualize a tabela deste documento e o [`CHANGELOG.md`](CHANGELOG.md).
7. Rode os testes (`cd tests && npm.cmd test`) e publique.

Sugestão para o futuro: transformar `ANO` em configuração única e gerar os
feriados móveis por cálculo, reduzindo o risco de erro manual.
