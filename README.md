# Ponto Cego

Landing page com **hero 3D em WebGL** e um **quiz de diagnóstico interativo**. Em 7 minutos o
visitante revela o ponto cego que está travando o crescimento do negócio dele, entre os 5 pilares
(Posicionamento, Oferta, Geração de Leads, Conversão Comercial, Processos & IA). O quiz calcula um
score de 0 a 10 por pilar, aponta o ponto cego principal, estima o custo em R$, dá uma ação prática
e abre o WhatsApp com o resultado.

Tudo em **HTML, CSS e JavaScript puro**, sem build. O 3D usa Three.js via CDN, com fallback em CSS
caso o WebGL não esteja disponível.

## Estrutura

```
.
├── index.html              Página (hero 3D, problema, como funciona, pilares, quiz, autor, CTA)
├── css/estilo.css          Todo o visual (dark mode, paleta roxo/ciano)
├── js/hero3d.js            Cena 3D do hero (orbe de pontos com o "ponto cego" + reação ao mouse)
├── js/quiz.js              Motor do quiz: perguntas, cálculo, resultado, WhatsApp e salvamento
├── js/main.js              Animações leves (contadores, fade no scroll)
├── favicon.svg             Ícone da aba (olho / ponto cego)
└── google-apps-script.gs   Script pronto para salvar os leads numa planilha do Google
```

## O que editar (o essencial)

Tudo fica em [`js/quiz.js`](js/quiz.js), no topo, no objeto `CONFIG`:

1. **Número do WhatsApp** que recebe o lead. Troque `"SEU_NUMERO"` pelo seu número no formato
   internacional só com dígitos. Ex.: `5515999999999` (55 Brasil, 15 DDD, depois o número).
2. **Salvar no Google Sheets** (opcional, pode ligar depois): cole a URL do Apps Script em
   `sheetsEndpoint`. Enquanto estiver vazio (`""`), o salvamento fica desligado e só o WhatsApp
   funciona.

As **perguntas**, os **pilares** e os **textos do resultado** também estão em `js/quiz.js`, em
listas fáceis de mexer (`PERGUNTAS`, `PILARES`, `DIAGNOSTICO`).

## O hero 3D

A cena fica em [`js/hero3d.js`](js/hero3d.js). É um orbe de pontos (o negócio) girando, com um setor
escuro que representa o ponto cego e um anel que pulsa. Ele reage ao movimento do mouse (e à
inclinação do celular). Se o WebGL não carregar, a página entra em modo `no3d` e mostra um fundo em
degradê, sem quebrar nada.

## Salvar os leads no Google Sheets

Passo a passo (uns 5 minutos):

1. Crie uma planilha nova no Google Sheets.
2. Menu **Extensões > Apps Script**.
3. Apague o que estiver lá e cole todo o conteúdo de [`google-apps-script.gs`](google-apps-script.gs).
4. **Implantar > Nova implantação**: tipo **App da Web**, executar como **Eu**, acesso
   **Qualquer pessoa**.
5. Copie a URL gerada (termina em `/exec`) e cole em `CONFIG.sheetsEndpoint` no `js/quiz.js`.

## Próximo passo: banco de dados (Supabase)

A função `salvarLead()` no `js/quiz.js` é o único ponto que envia os dados. Para migrar do Sheets
para um banco **Supabase (Postgres)** no futuro, basta trocar o destino do `fetch` por uma chamada
à API do Supabase (uma tabela `leads` com as mesmas colunas). O resto não muda.

## Observação

Os números de prova social (negócios diagnosticados, custo estimado) são **ilustrativos** e devem
ser ajustados para a sua realidade antes de divulgar.
