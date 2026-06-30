/* ============================================================
   RAIO-X DOS 5 GARGALOS · Google Apps Script (salvar leads no Sheets)
   ------------------------------------------------------------
   COMO USAR (5 minutos):
   1. Crie uma planilha nova no Google Sheets.
   2. No menu, vá em  Extensões > Apps Script.
   3. Apague o conteúdo e cole TODO este arquivo.
   4. Clique em  Implantar > Nova implantação.
        - Tipo: "App da Web"
        - Executar como: "Eu"
        - Quem pode acessar: "Qualquer pessoa"
   5. Copie a URL gerada (termina em /exec).
   6. Cole essa URL em  js/quiz.js  no campo  CONFIG.sheetsEndpoint.
   Pronto: cada diagnóstico concluído cai numa linha da planilha.
   ============================================================ */

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    var aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Cria o cabeçalho na primeira vez
    if (aba.getLastRow() === 0) {
      aba.appendRow([
        "Data", "Nome", "E-mail", "WhatsApp",
        "Maior gargalo", "Nota média",
        "Posicionamento", "Oferta", "Geração de Leads",
        "Conversão Comercial", "Processos & IA",
        "Custo mín (R$)", "Custo máx (R$)", "Origem"
      ]);
    }

    // Monta um mapa pilar -> nota para preencher as colunas certas
    var notas = {};
    (dados.scores || []).forEach(function (s) { notas[s.pilar] = s.nota; });

    aba.appendRow([
      dados.data || new Date().toISOString(),
      dados.nome || "",
      dados.email || "",
      dados.whatsapp || "",
      dados.gargalo || "",
      dados.media || "",
      notas["Posicionamento"] || "",
      notas["Oferta"] || "",
      notas["Geração de Leads"] || "",
      notas["Conversão Comercial"] || "",
      notas["Processos & IA"] || "",
      dados.custo_min || "",
      dados.custo_max || "",
      dados.origem || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Teste rápido no editor: rode esta função uma vez para autorizar permissões.
function _teste() {
  doPost({ postData: { contents: JSON.stringify({
    nome: "Teste", email: "teste@email.com", whatsapp: "15999999999",
    gargalo: "Oferta", media: 6,
    scores: [
      { pilar: "Posicionamento", nota: 7 }, { pilar: "Oferta", nota: 4 },
      { pilar: "Geração de Leads", nota: 6 }, { pilar: "Conversão Comercial", nota: 8 },
      { pilar: "Processos & IA", nota: 5 }
    ],
    custo_min: 2400, custo_max: 5800, data: new Date().toISOString(), origem: "teste"
  }) } });
}
