# Funcionalidades e comportamento

Descrição detalhada do que a aplicação faz hoje. O código está todo em
`calendario-2026.html`.

## 1. Estrutura da página

1. **Cabeçalho** — título, subtítulo e três ações: `+ Novo compromisso`,
   `Ir para hoje` e `Imprimir`.
2. **Barra de meses** (somente no celular) — seta anterior, seletor com os 12
   meses e seta seguinte. Fica fixa no topo durante a rolagem.
3. **Calendário** — 12 cartões de mês gerados por JavaScript.
4. **Legenda dos feriados** — grupos (nacional, estadual, municipal,
   facultativo), amostras de cores e aviso legal.
5. **Meus compromissos** — lista anual ordenada por data e hora.
6. **Rodapé** — origem dos dados e aviso sobre armazenamento local.
7. **Modal de compromissos** — bottom sheet no celular, janela centralizada em
   telas maiores.

## 2. Calendário

- Semana começa no **domingo** (`Dom` a `Sáb`).
- Cada dia é uma célula `td` com `data-data="AAAA-MM-DD"` e `tabindex="0"`.
- Cores:
  - **azul** — feriado nacional;
  - **roxo** — feriado estadual (SP);
  - **verde** — feriado municipal de Mogi das Cruzes;
  - **contorno tracejado** — ponto facultativo (não é feriado obrigatório);
  - **vermelho** — fins de semana;
  - **azul sólido** — dia de hoje (quando o ano aberto é 2026).
- Feriado tem prioridade visual sobre fim de semana; "hoje" tem prioridade
  sobre os dois.
- Dias com compromisso ganham um **ponto azul** na base da célula (branco
  quando o dia é "hoje").
- O mês inicial é o mês atual quando o ano do sistema é 2026; caso contrário,
  janeiro.
- O destaque de "hoje" só aparece se o ano do sistema for 2026. Fora de 2026,
  `Ir para hoje` mostra um alerta explicando que o calendário cobre só 2026.

## 3. Navegação

### Celular (< 640 px)

- A classe `modo-mobile` é aplicada ao contêiner via `matchMedia`, exibindo
  apenas o mês ativo.
- Formas de trocar de mês:
  - setas `‹` e `›`;
  - seletor `Janeiro · 2026` … `Dezembro · 2026`;
  - **swipe** horizontal com pelo menos 60 px de deslocamento e pelo menos 1,5×
    mais horizontal que vertical;
  - clique em um item do painel de compromissos;
  - botão `+ Novo compromisso` (leva ao mês de hoje).
- O swipe não abre o modal por engano: cliques nos primeiros 350 ms após um
  swipe são ignorados.
- A barra fixa usa `scroll-margin-top: 74px` para não cobrir o título do mês.

### Tablet e desktop (≥ 640 px)

- A barra de meses é ocultada e os 12 meses ficam visíveis na grade:

| Largura | Colunas |
|---|---|
| < 640 px | 1 mês (navegação por mês) |
| ≥ 640 px | 2 |
| ≥ 960 px | 3 |
| ≥ 1200 px | 4 |

- A transição entre os modos é dinâmica: redimensionar a janela aplica ou
  remove o modo mobile sem recarregar.

## 4. Agenda

### Abrir o dia

- Clique/toque em qualquer dia, ou `Enter`/`Espaço` com o dia focado.
- O modal mostra a data por extenso em pt-BR, a lista de compromissos do dia e
  o formulário de cadastro.
- Ao abrir, o foco vai para o campo **Compromisso**.
- O scroll do corpo é travado enquanto o modal está aberto.

### Formulário

| Campo | Obrigatório | Limite | Observação |
|---|---|---|---|
| Horário | Não | `time` nativo | Vazio é exibido como `—` |
| Compromisso | Sim | 80 caracteres | Espaços nas pontas são removidos |
| Observação | Não | 160 caracteres | Também sofre `trim` |

- Enviar salva imediatamente, limpa o formulário, atualiza a lista do dia, o
  marcador no calendário e o painel anual. O modal **continua aberto** e o foco
  volta ao campo de título, permitindo cadastrar vários seguidos.
- A lista do dia é ordenada por horário; compromissos sem horário vão para o
  fim (chave interna `99:99`).

### Excluir

- Botão `✕` na lista do dia ou no painel anual.
- Ao excluir o último compromisso de uma data, a chave daquela data é removida
  do armazenamento.
- No painel, o clique no `✕` não dispara a navegação para o dia
  (`stopPropagation`).

### Painel anual

- Exibe todos os compromissos de 2026 ordenados por data e, dentro do dia, por
  hora.
- Cada item mostra dia/mês, dia da semana, horário, título e observação (ou
  "Sem observação").
- Clique no item (ou `Enter`/`Espaço` com ele focado) fecha o modal, troca para
  o mês correspondente no celular, rola até o cartão do mês e destaca o dia com
  uma animação.
- O resumo informa quantos compromissos existem ou convida a agendar.

### Fechar o modal

- Botão `×`.
- Clique/toque no fundo escuro.
- Tecla `Esc`.
- O foco volta ao elemento que estava ativo antes da abertura.

## 5. Persistência

- Chave: `agenda-2026-mogi` no `localStorage`.
- Formato, validação e exemplos em [`DADOS.md`](DADOS.md).
- Sem backend, sem cookies e sem envio de dados.
- Limpar os dados do site/navegador apaga a agenda.
- O armazenamento é isolado por origem: `file://`, produção e previews são
  ambientes distintos.

## 6. Impressão

- `window.print()` pelo botão **Imprimir**.
- Todos os 12 meses são exibidos em **3 colunas**, mesmo no modo mobile.
- Botões de ação, barra de meses, botões de excluir e modal são ocultados.
- Cartões e blocos usam `break-inside: avoid` para não cortar meses.

## 7. Acessibilidade

Implementado:

- `lang="pt-BR"`, título de página descritivo e marcos (`header`, `nav`,
  `main`, `footer`, `section`).
- `aria-label` nas navegações, setas e botões de excluir.
- Modal com `role="dialog"`, `aria-modal="true"`, `aria-labelledby` e
  `aria-describedby`.
- Campos com `<label>` associado.
- Dias e itens do painel focáveis e acionáveis por teclado.
- Indicador de foco visível (`:focus-visible`).
- `prefers-reduced-motion` desativa animações e rolagem suave.
- Área segura do iOS respeitada no modal.

Limitações:

- O modal **não prende o foco** (sem focus trap); é possível tabular para fora.
- O fundo do modal não recebe `aria-hidden`.
- Não há anúncio via `aria-live` ao criar/excluir compromissos.

## 8. Tratamento de erros

- `localStorage` indisponível: a aplicação continua funcionando na sessão; a
  gravação falha em silêncio.
- JSON inválido ou dados fora do formato: a leitura retorna agenda vazia ou
  descarta apenas as entradas inválidas, sem quebrar a página.
- Título vazio: o formulário não salva e devolve o foco ao campo.
- Nenhuma chamada de rede em tempo de execução; não há dependências externas.

## 9. Matriz de testes automatizados

`tests/responsivo.mjs` executa **29 verificações**:

| Grupo | Verificações |
|---|---|
| Mobile 390×844 | barra visível, 1 mês, sem overflow, dia ≥ 39 px, botão com 44 px |
| Navegação | seta troca o mês, seletor acompanha, seletor leva a janeiro |
| Modal | abre, largura total, encostado embaixo, bottom sheet, input 16 px |
| Agenda | item no dia, marcador no calendário, item no painel, fecha no `×`, exclusão limpa tudo |
| Mobile 320×568 | sem overflow, dia tocável |
| Tablet 768×1024 | 12 meses, 2 colunas, barra oculta, sem overflow |
| Desktop 1440×900 | 12 meses, 4 colunas, barra oculta, sem overflow |
| Console | sem erros de página nem respostas 404 |

Como rodar: [`tests/README.md`](../tests/README.md).
