/**
 * Testes de responsividade e da agenda do Calendário 2026.
 *
 * Uso:
 *   npm install
 *   npm test                                  # testa o arquivo local
 *   npm run test:producao                     # testa a URL publicada
 *   node responsivo.mjs <url> --screenshots   # URL arbitrária + capturas
 *
 * Requer um navegador Chromium/Edge/Chrome instalado. O caminho pode ser
 * definido pela variável de ambiente BROWSER_PATH.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const RAIZ = path.resolve(import.meta.dirname, "..");
const URL_PADRAO = pathToFileURL(path.join(RAIZ, "calendario-2026.html")).href;
const ARGUMENTOS = process.argv.slice(2);
const URL_ALVO = ARGUMENTOS.find((arg) => !arg.startsWith("--")) || URL_PADRAO;
const SALVAR_CAPTURAS = ARGUMENTOS.includes("--screenshots");
const DIR_SAIDA = path.join(import.meta.dirname, "saida");

const CANDIDATOS_NAVEGADOR = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function acharNavegador() {
  const encontrado = CANDIDATOS_NAVEGADOR.find((caminho) => fs.existsSync(caminho));
  if (!encontrado) {
    throw new Error(
      "Nenhum navegador encontrado. Defina BROWSER_PATH com o caminho do msedge/chrome."
    );
  }
  return encontrado;
}

const resultados = [];
function verificar(nome, condicao, detalhe = "") {
  resultados.push({ nome, ok: Boolean(condicao), detalhe });
  if (!condicao) {
    console.error(`  ✗ ${nome}${detalhe ? " — " + detalhe : ""}`);
  }
}

async function estadoMobile(page) {
  return page.evaluate(() => {
    const visiveis = [...document.querySelectorAll(".mes")].filter(
      (m) => m.offsetParent !== null
    );
    const td = document.querySelector(".mes.ativo td[data-data]");
    const celula = td ? td.getBoundingClientRect() : { width: 0, height: 0 };
    const btn = document.getElementById("btn-novo").getBoundingClientRect();
    return {
      nav: getComputedStyle(document.querySelector(".mes-nav")).display,
      mesesVisiveis: visiveis.length,
      titulo: visiveis[0]?.querySelector("h2")?.firstChild?.textContent || "",
      celula: { largura: Math.round(celula.width), altura: Math.round(celula.height) },
      botaoNovo: { largura: Math.round(btn.width), altura: Math.round(btn.height) },
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      colunas: getComputedStyle(document.getElementById("calendario")).gridTemplateColumns
    };
  });
}

const mesAtivo = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".mes")].findIndex((m) =>
      m.classList.contains("ativo")
    )
  );

(async () => {
  const navegador = acharNavegador();
  if (SALVAR_CAPTURAS) fs.mkdirSync(DIR_SAIDA, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: navegador,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  });

  const problemas = [];
  try {
    const page = await browser.newPage();
    page.on("pageerror", (e) => problemas.push("pageerror: " + e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) problemas.push(`${r.status()} ${r.url()}`);
    });

    // ---------- Mobile 390 × 844 ----------
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    await page.goto(URL_ALVO, { waitUntil: "load" });
    await sleep(400);

    console.log("\n▶ Mobile 390×844");
    const mobile = await estadoMobile(page);
    verificar("barra de meses visível", mobile.nav === "flex", mobile.nav);
    verificar("apenas 1 mês visível", mobile.mesesVisiveis === 1, String(mobile.mesesVisiveis));
    verificar("sem rolagem horizontal", mobile.overflowX <= 0, String(mobile.overflowX));
    verificar("dia com altura ≥ 39px", mobile.celula.altura >= 39, String(mobile.celula.altura));
    verificar("botão principal com 44px", mobile.botaoNovo.altura >= 44, String(mobile.botaoNovo.altura));

    const mesInicial = mobile.titulo;
    await page.click("#mes-proximo");
    await sleep(350);
    const mesDepois = await page.evaluate(
      () => document.querySelector(".mes.ativo h2").firstChild.textContent
    );
    const indiceDepois = await mesAtivo(page);
    verificar("seta › troca de mês", mesDepois !== mesInicial, `${mesInicial} → ${mesDepois}`);
    verificar("seletor acompanha o mês", indiceDepois >= 0, String(indiceDepois));

    await page.select("#seletor-mes", "0");
    await sleep(350);
    const mesSelecionado = await page.evaluate(
      () => document.querySelector(".mes.ativo h2").firstChild.textContent
    );
    verificar("seletor leva a janeiro", mesSelecionado === "Janeiro", mesSelecionado);

    // Modal + agenda
    await page.click(".mes.ativo td[data-data]");
    await sleep(350);
    const modal = await page.evaluate(() => {
      const m = document.querySelector(".modal");
      const r = m.getBoundingClientRect();
      return {
        aberto: !document.getElementById("modal").hidden,
        largura: Math.round(r.width),
        topo: Math.round(r.top),
        base: Math.round(r.bottom),
        viewport: { largura: window.innerWidth, altura: window.innerHeight },
        fonteInput: getComputedStyle(document.getElementById("campo-titulo")).fontSize
      };
    });
    verificar("modal abre ao tocar no dia", modal.aberto);
    verificar("modal ocupa a largura toda", modal.largura === modal.viewport.largura, `${modal.largura}px`);
    verificar("modal encostado embaixo", modal.base === modal.viewport.altura);
    verificar("modal é bottom sheet", modal.topo > modal.viewport.altura * 0.3, `${modal.topo}px`);
    verificar("input com 16px (sem zoom iOS)", modal.fonteInput === "16px", modal.fonteInput);

    if (SALVAR_CAPTURAS) {
      await page.screenshot({ path: path.join(DIR_SAIDA, "mobile-modal.png") });
    }

    await page.type("#campo-titulo", "Teste automatizado");
    await page.click('#form-compromisso button[type="submit"]');
    await sleep(300);
    const agendado = await page.evaluate(() => ({
      itens: document.querySelectorAll("#lista-dia li:not(.vazio-lista)").length,
      pontos: document.querySelectorAll("td.com-compromisso").length,
      painel: document.querySelectorAll(".item-compromisso").length
    }));
    verificar("compromisso aparece no dia", agendado.itens === 1, String(agendado.itens));
    verificar("dia ganha marcador", agendado.pontos === 1, String(agendado.pontos));
    verificar("compromisso aparece no painel", agendado.painel === 1, String(agendado.painel));

    await page.click("#fechar-modal");
    await sleep(250);
    const fechou = await page.evaluate(
      () => document.getElementById("modal").hidden
    );
    verificar("modal fecha pelo X", fechou);

    await page.click(".item-compromisso .btn-excluir");
    await sleep(300);
    const restou = await page.evaluate(() => ({
      itens: document.querySelectorAll(".item-compromisso").length,
      pontos: document.querySelectorAll("td.com-compromisso").length
    }));
    verificar("exclusão limpa painel e marcador", restou.itens === 0 && restou.pontos === 0);

    if (SALVAR_CAPTURAS) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(250);
      await page.screenshot({ path: path.join(DIR_SAIDA, "mobile.png"), fullPage: true });
    }

    // ---------- Mobile pequeno 320 × 568 ----------
    await page.setViewport({
      width: 320,
      height: 568,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    await sleep(400);
    console.log("\n▶ Mobile 320×568");
    const pequeno = await estadoMobile(page);
    verificar("sem rolagem horizontal em 320px", pequeno.overflowX <= 0, String(pequeno.overflowX));
    verificar("dia continua tocável", pequeno.celula.altura >= 39, String(pequeno.celula.altura));

    // ---------- Tablet 768 × 1024 ----------
    await page.setViewport({ width: 768, height: 1024 });
    await sleep(400);
    console.log("\n▶ Tablet 768×1024");
    const tablet = await page.evaluate(() => ({
      mesesVisiveis: [...document.querySelectorAll(".mes")].filter(
        (m) => m.offsetParent !== null
      ).length,
      colunas: getComputedStyle(document.getElementById("calendario")).gridTemplateColumns.split(" ").length,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      nav: getComputedStyle(document.querySelector(".mes-nav")).display
    }));
    verificar("12 meses visíveis", tablet.mesesVisiveis === 12, String(tablet.mesesVisiveis));
    verificar("2 colunas", tablet.colunas === 2, String(tablet.colunas));
    verificar("barra mobile oculta", tablet.nav === "none", tablet.nav);
    verificar("sem rolagem horizontal", tablet.overflowX <= 0, String(tablet.overflowX));

    // ---------- Desktop 1440 × 900 ----------
    await page.setViewport({ width: 1440, height: 900 });
    await sleep(400);
    console.log("\n▶ Desktop 1440×900");
    const desktop = await page.evaluate(() => ({
      mesesVisiveis: [...document.querySelectorAll(".mes")].filter(
        (m) => m.offsetParent !== null
      ).length,
      colunas: getComputedStyle(document.getElementById("calendario")).gridTemplateColumns.split(" ").length,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      nav: getComputedStyle(document.querySelector(".mes-nav")).display
    }));
    verificar("12 meses visíveis", desktop.mesesVisiveis === 12, String(desktop.mesesVisiveis));
    verificar("4 colunas", desktop.colunas === 4, String(desktop.colunas));
    verificar("barra mobile oculta", desktop.nav === "none", desktop.nav);
    verificar("sem rolagem horizontal", desktop.overflowX <= 0, String(desktop.overflowX));

    if (SALVAR_CAPTURAS) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(250);
      await page.screenshot({ path: path.join(DIR_SAIDA, "desktop.png"), fullPage: true });
    }

    // ---------- Console ----------
    console.log("\n▶ Console do navegador");
    verificar("sem erros de página/404", problemas.length === 0, problemas.join(" | "));

    const falhas = resultados.filter((r) => !r.ok);
    console.log(
      `\n${resultados.length - falhas.length}/${resultados.length} verificações OK` +
        (falhas.length ? ` — ${falhas.length} falha(s)` : " ✔")
    );
    if (falhas.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((erro) => {
  console.error("\nErro ao executar os testes:", erro.message);
  process.exit(1);
});
