/* ============================================================
   PONTO CEGO · motor do quiz
   Tudo aqui é editável: pilares, perguntas, textos do resultado.
   ============================================================ */

/* ---- CONFIG: troque por seus dados ---- */
const CONFIG = {
  // Número do WhatsApp que recebe o lead (formato internacional, só dígitos).
  // Ex.: "5515999999999" (55 = Brasil, 15 = DDD). TROQUE AQUI:
  whatsappNumero: "SEU_NUMERO",
  // Endpoint do Google Sheets (Apps Script Web App). Preenchido depois. Deixe "" para desligar.
  sheetsEndpoint: ""
};

/* ---- Os 5 pilares (ordem importa) ---- */
const PILARES = [
  { id: "posicionamento", nome: "Posicionamento", cor: "#7c5cff" },
  { id: "oferta",         nome: "Oferta",         cor: "#5c8cff" },
  { id: "leads",          nome: "Geração de Leads", cor: "#36c5e0" },
  { id: "conversao",      nome: "Conversão Comercial", cor: "#2ee6b6" },
  { id: "processos",      nome: "Processos & IA", cor: "#ff9a4d" }
];

/* ---- 15 perguntas (3 por pilar). Cada opção dá de 0 a 4 pontos. ---- */
const PERGUNTAS = [
  // POSICIONAMENTO
  { pilar:"posicionamento", q:"Se eu perguntar ao seu cliente ideal por que escolher você e não o concorrente, ele saberia responder na hora?",
    opts:[ {t:"Sim, é claríssimo e ele repete na ponta da língua",p:4},{t:"Mais ou menos, ele hesita um pouco",p:2},{t:"Não, somos vistos como mais um do mesmo",p:0} ] },
  { pilar:"posicionamento", q:"Você compete mais por preço ou por valor percebido?",
    opts:[ {t:"Por valor, o preço quase nunca é o motivo da escolha",p:4},{t:"Depende do cliente, varia bastante",p:2},{t:"Quase sempre cai na guerra de preço",p:0} ] },
  { pilar:"posicionamento", q:"Você tem um nicho ou público bem definido?",
    opts:[ {t:"Sim, sei exatamente quem é meu cliente ideal",p:4},{t:"Tenho uma ideia, mas atendo quase todo mundo",p:2},{t:"Pego qualquer cliente que aparece",p:0} ] },

  // OFERTA
  { pilar:"oferta", q:"O que você vende é fácil de entender em uma frase?",
    opts:[ {t:"Sim, explico em uma frase e a pessoa entende",p:4},{t:"Preciso de um tempo pra explicar",p:2},{t:"As pessoas costumam ficar confusas",p:0} ] },
  { pilar:"oferta", q:"Sua oferta tem algo que o concorrente não consegue copiar fácil (garantia, bônus, formato)?",
    opts:[ {t:"Sim, temos diferenciais claros na oferta",p:4},{t:"Alguns, mas nada muito forte",p:2},{t:"Não, é basicamente igual ao mercado",p:0} ] },
  { pilar:"oferta", q:"Quando você apresenta o preço, o cliente acha caro com frequência?",
    opts:[ {t:"Raramente, o valor fica claro antes do preço",p:4},{t:"Às vezes, depende do cliente",p:2},{t:"Quase sempre o preço trava a venda",p:0} ] },

  // LEADS
  { pilar:"leads", q:"Você sabe quantos contatos novos (leads) chegam por mês?",
    opts:[ {t:"Sim, acompanho o número de perto",p:4},{t:"Mais ou menos, tenho uma noção",p:2},{t:"Não faço ideia",p:0} ] },
  { pilar:"leads", q:"Se você quisesse o dobro de clientes mês que vem, saberia como gerar mais leads?",
    opts:[ {t:"Sim, é só aumentar o que já funciona",p:4},{t:"Teria que testar, não tenho certeza",p:2},{t:"Não, dependo do boca a boca e da sorte",p:0} ] },
  { pilar:"leads", q:"De onde vêm a maioria dos seus clientes hoje?",
    opts:[ {t:"De canais que eu controlo e consigo escalar",p:4},{t:"De indicação, mas com alguma previsibilidade",p:2},{t:"Só de indicação, sem controle nenhum",p:0} ] },

  // CONVERSAO
  { pilar:"conversao", q:"De cada 10 pessoas interessadas, quantas viram clientes?",
    opts:[ {t:"4 ou mais, tenho uma boa taxa",p:4},{t:"Umas 2 ou 3",p:2},{t:"Menos de 2, ou não sei medir",p:0} ] },
  { pilar:"conversao", q:"O processo de venda depende quase só de você?",
    opts:[ {t:"Não, o time vende sem mim",p:4},{t:"Em parte, divido com o time",p:2},{t:"Sim, se eu paro, a venda para",p:0} ] },
  { pilar:"conversao", q:"Você tem um passo a passo claro do primeiro contato até o fechamento?",
    opts:[ {t:"Sim, é um processo definido e seguido",p:4},{t:"Existe na cabeça, mas não está escrito",p:2},{t:"Cada venda é de um jeito",p:0} ] },

  // PROCESSOS
  { pilar:"processos", q:"Quanto da operação roda sem você precisar estar presente?",
    opts:[ {t:"A maior parte, tenho processos e sistemas",p:4},{t:"Metade, ainda dependo bastante",p:2},{t:"Quase nada anda sem mim",p:0} ] },
  { pilar:"processos", q:"Você usa alguma ferramenta ou IA para automatizar tarefas repetitivas?",
    opts:[ {t:"Sim, automatizo bastante coisa",p:4},{t:"Uso pouco, mais o básico",p:2},{t:"Não, é tudo no manual",p:0} ] },
  { pilar:"processos", q:"As informações do negócio (clientes, vendas, tarefas) estão organizadas num lugar só?",
    opts:[ {t:"Sim, tenho tudo centralizado",p:4},{t:"Em parte, espalhado em alguns lugares",p:2},{t:"Está tudo solto, na cabeça e em papéis",p:0} ] }
];

/* ---- Textos do resultado por pilar (gargalo principal) ---- */
const DIAGNOSTICO = {
  posicionamento:{
    titulo:"Posicionamento",
    dor:"O mercado te vê como mais um. Sem um motivo claro pra escolher você, a decisão do cliente acaba caindo no preço, e aí a margem evapora.",
    domino:"Posicionamento fraco contamina tudo: a oferta vira commodity, os leads chegam frios e a venda fica difícil. É a raiz que envenena os outros 4 pilares.",
    acao:"Hoje mesmo: escreva em uma frase para quem você resolve qual problema específico e melhor que ninguém. Teste essa frase com 3 clientes.",
    proximo:"Construir uma mensagem central que diferencie você do concorrente e guie toda a comunicação."
  },
  oferta:{
    titulo:"Oferta",
    dor:"Sua oferta não está clara ou irresistível o suficiente. O cliente até se interessa, mas trava na hora de decidir, e você ouve muito 'tá caro'.",
    domino:"Uma oferta confusa derruba a conversão e faz você gastar mais em leads pra compensar. O esforço de venda dobra pra fechar o mesmo.",
    acao:"Hoje mesmo: liste o que o cliente realmente leva (resultado, não tarefa) e adicione uma garantia ou bônus que tire o medo de comprar.",
    proximo:"Reembalar a oferta em torno do resultado e do valor percebido, não do que você 'faz'."
  },
  leads:{
    titulo:"Geração de Leads",
    dor:"Você depende de indicação e sorte. Sem um fluxo previsível de novos contatos, o faturamento vira montanha-russa: um mês cheio, outro vazio.",
    domino:"Sem leads constantes, todo o resto fica ocioso: um bom posicionamento e uma boa oferta não geram dinheiro se ninguém novo descobre você.",
    acao:"Hoje mesmo: escolha 1 canal (indicação ativa, conteúdo ou tráfego pago) e defina uma meta simples de contatos novos por semana.",
    proximo:"Montar uma máquina de aquisição que você controla, em vez de esperar o cliente cair do céu."
  },
  conversao:{
    titulo:"Conversão Comercial",
    dor:"Chega gente interessada, mas pouca vira cliente, ou só fecha quando você entra pessoalmente. A venda é um gargalo preso em você.",
    domino:"Conversão baixa queima todo o investimento feito em leads. Você paga caro pra atrair e perde a maioria na hora de fechar.",
    acao:"Hoje mesmo: escreva o passo a passo da sua melhor venda (do primeiro contato ao sim) e transforme isso num roteiro repetível.",
    proximo:"Criar um processo comercial que o time siga, para a venda não depender só de você."
  },
  processos:{
    titulo:"Processos & IA",
    dor:"O negócio anda na sua cabeça e no improviso. Você é o gargalo: se parar, tudo para. Crescer só significa trabalhar ainda mais.",
    domino:"Sem processo, cada novo cliente vira mais caos e sobrecarga. Isso limita o quanto você consegue crescer sem quebrar a operação.",
    acao:"Hoje mesmo: liste as 3 tarefas que mais te consomem tempo e marque qual delas dá pra documentar, delegar ou automatizar primeiro.",
    proximo:"Transformar a operação artesanal em sistema, com processos e automação que rodam sem você."
  }
};

/* ============================================================
   ESTADO + RENDER
   ============================================================ */
const state = { etapa:"intro", idx:0, lead:{nome:"",email:"",whats:""}, respostas:[] };
const card = document.getElementById("quizCard");

function render(){
  if(state.etapa==="intro") return renderIntro();
  if(state.etapa==="pergunta") return renderPergunta();
  if(state.etapa==="resultado") return renderResultado();
}

/* ---- Intro: captura de lead ---- */
function renderIntro(){
  card.innerHTML = `
    <div class="q-fade">
      <span class="q-tag">Comece grátis</span>
      <h3 class="q-title">Pra onde envio o seu diagnóstico?</h3>
      <p class="q-desc">Preencha abaixo. Leva 30 segundos e o resultado vai aparecer aqui e no seu WhatsApp.</p>
      <div class="q-field" id="f-nome">
        <label>Seu nome</label>
        <input type="text" id="in-nome" placeholder="Como você se chama?" value="${state.lead.nome}" autocomplete="name" />
        <span class="err">Digite seu nome.</span>
      </div>
      <div class="q-field" id="f-email">
        <label>Seu melhor e-mail</label>
        <input type="email" id="in-email" placeholder="voce@email.com" value="${state.lead.email}" autocomplete="email" />
        <span class="err">Digite um e-mail válido.</span>
      </div>
      <div class="q-field" id="f-whats">
        <label>Seu WhatsApp (com DDD)</label>
        <input type="tel" id="in-whats" placeholder="(15) 99999-9999" value="${state.lead.whats}" autocomplete="tel" />
        <span class="err">Digite um WhatsApp válido (DDD + número).</span>
      </div>
      <p class="q-consent">Seus dados são usados só para te enviar o resultado. Sem spam.</p>
      <div class="q-actions">
        <button class="q-back" disabled>voltar</button>
        <button class="q-next" id="btn-start">Revelar meu ponto cego</button>
      </div>
    </div>`;
  document.getElementById("btn-start").onclick = iniciarQuiz;
}

function iniciarQuiz(){
  const nome=document.getElementById("in-nome").value.trim();
  const email=document.getElementById("in-email").value.trim();
  const whats=document.getElementById("in-whats").value.trim();
  let ok=true;
  setInvalid("f-nome", nome.length<2 && (ok=false));
  setInvalid("f-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (ok=false));
  setInvalid("f-whats", whats.replace(/\D/g,"").length<10 && (ok=false));
  if(!ok) return;
  state.lead={nome,email,whats};
  state.etapa="pergunta"; state.idx=0;
  render();
}
function setInvalid(id,cond){ document.getElementById(id).classList.toggle("invalid",!!cond); }

/* ---- Pergunta ---- */
function renderPergunta(){
  const total=PERGUNTAS.length;
  const p=PERGUNTAS[state.idx];
  const sel=state.respostas[state.idx];
  const pct=Math.round((state.idx)/total*100);
  card.innerHTML = `
    <div class="q-fade">
      <div class="q-progress"><i style="width:${pct}%"></i></div>
      <div class="q-progress-label"><span>Pergunta ${state.idx+1} de ${total}</span><span>${pct}%</span></div>
      <span class="q-tag">${PILARES.find(x=>x.id===p.pilar).nome}</span>
      <h3 class="q-title">${p.q}</h3>
      <div class="q-options">
        ${p.opts.map((o,i)=>`
          <button class="q-opt ${sel===i?'sel':''}" data-i="${i}">
            <span class="dot"></span><span>${o.t}</span>
          </button>`).join("")}
      </div>
      <div class="q-actions">
        <button class="q-back" id="btn-back" ${state.idx===0?'disabled':''}>voltar</button>
        <button class="q-next" id="btn-next" ${sel===undefined?'disabled':''}>${state.idx===total-1?'Ver meu resultado':'Próxima'}</button>
      </div>
    </div>`;
  card.querySelectorAll(".q-opt").forEach(b=>{
    b.onclick=()=>{
      state.respostas[state.idx]=parseInt(b.dataset.i);
      card.querySelectorAll(".q-opt").forEach(x=>x.classList.remove("sel"));
      b.classList.add("sel");
      document.getElementById("btn-next").disabled=false;
    };
  });
  document.getElementById("btn-back").onclick=()=>{ if(state.idx>0){state.idx--;render();} };
  document.getElementById("btn-next").onclick=()=>{
    if(state.respostas[state.idx]===undefined) return;
    if(state.idx<total-1){ state.idx++; render(); }
    else { state.etapa="resultado"; render(); }
  };
}

/* ---- Cálculo ---- */
function calcular(){
  const soma={}, cont={};
  PILARES.forEach(p=>{soma[p.id]=0;cont[p.id]=0;});
  PERGUNTAS.forEach((p,i)=>{
    const r=state.respostas[i]; if(r===undefined) return;
    soma[p.pilar]+=p.opts[r].p; cont[p.pilar]++;
  });
  const scores=PILARES.map(p=>{
    const max=cont[p.id]*4 || 1;
    const nota=Math.round((soma[p.id]/max)*10);
    return {...p, nota};
  });
  const gargalo=[...scores].sort((a,b)=>a.nota-b.nota)[0];
  const media=Math.round(scores.reduce((s,x)=>s+x.nota,0)/scores.length);
  // custo estimado: pior pilar pesa mais. Faixa ilustrativa.
  const custo=estimarCusto(gargalo.nota, media);
  return {scores, gargalo, media, custo};
}
function estimarCusto(notaGargalo, media){
  // quanto pior o gargalo, maior a estimativa de perda mensal (ilustrativa)
  const base=(10-notaGargalo)*1200 + (10-media)*600;
  const low=Math.max(800, Math.round(base/100)*100);
  const high=Math.round(low*2.4/100)*100;
  return {low, high};
}
function brl(n){ return n.toLocaleString("pt-BR"); }

/* ---- Resultado ---- */
function renderResultado(){
  const res=calcular();
  const d=DIAGNOSTICO[res.gargalo.id];
  const bars=res.scores.map(s=>{
    const weak=s.id===res.gargalo.id;
    return `<div class="r-bar-row ${weak?'weak':''}">
      <span class="r-bar-name">${s.nome}</span>
      <span class="r-bar-track"><span class="r-bar-fill" data-w="${s.nota*10}" style="background:${s.cor}"></span></span>
      <span class="r-bar-val" style="color:${s.cor}">${s.nota}</span>
    </div>`;
  }).join("");

  card.innerHTML = `
    <div class="q-fade">
      <div class="r-head">
        <span class="r-tag">Seu diagnóstico está pronto, ${escapeHtml(firstName(state.lead.nome))}</span>
        <h3 class="r-main">Seu ponto cego é<br /><span>${d.titulo}</span></h3>
        <p class="r-sub">Nota média do seu negócio: <b>${res.media}/10</b></p>
      </div>
      <div class="r-bars">${bars}</div>
      <div class="r-block"><h4>🎯 O que isso significa</h4><p>${d.dor}</p></div>
      <div class="r-block"><h4>🔗 O efeito dominó</h4><p>${d.domino}</p></div>
      <div class="r-block r-cost"><h4>💸 Custo estimado do ponto cego</h4><p>Entre <b>R$ ${brl(res.custo.low)}</b> e <b>R$ ${brl(res.custo.high)}</b> por mês em oportunidade perdida. <span style="color:var(--muted);font-size:13px">(estimativa ilustrativa com base nas respostas)</span></p></div>
      <div class="r-block"><h4>⚡ Ação prática pra hoje</h4><p>${d.acao}</p></div>
      <div class="r-block"><h4>🧭 Próximo passo</h4><p>${d.proximo}</p></div>
      <div class="r-cta">
        <a href="${linkWhatsApp(res, d)}" target="_blank" rel="noopener" class="btn btn-primary r-wa" id="btn-wa">Receber o plano completo no WhatsApp</a>
        <p class="r-small">Vou te mandar o detalhamento e o caminho pra destravar o ${d.titulo.toLowerCase()}.</p>
        <button class="r-restart" id="btn-restart">refazer o diagnóstico</button>
      </div>
    </div>`;

  // anima as barras
  requestAnimationFrame(()=>setTimeout(()=>{
    card.querySelectorAll(".r-bar-fill").forEach(f=>{ f.style.width=f.dataset.w+"%"; });
  },80));

  document.getElementById("btn-restart").onclick=()=>{
    state.etapa="intro"; state.idx=0; state.respostas=[]; render();
    document.getElementById("quiz").scrollIntoView({behavior:"smooth"});
  };

  // salva o lead (Google Sheets) uma vez
  salvarLead(res, d);
}

/* ---- WhatsApp ---- */
function linkWhatsApp(res, d){
  const n=CONFIG.whatsappNumero.replace(/\D/g,"");
  const msg=
`Oi! Fiz o diagnóstico Ponto Cego.

Nome: ${state.lead.nome}
Meu ponto cego: ${d.titulo}
Nota média: ${res.media}/10
Scores: ${res.scores.map(s=>s.nome+" "+s.nota).join(" · ")}

Quero o plano completo pra destravar.`;
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
}

/* ---- Salvar no Google Sheets (Apps Script Web App) ---- */
let _salvou=false;
function salvarLead(res, d){
  if(_salvou) return; _salvou=true;
  if(!CONFIG.sheetsEndpoint) return; // ainda não configurado
  const payload={
    nome:state.lead.nome, email:state.lead.email, whatsapp:state.lead.whats,
    gargalo:d.titulo, media:res.media,
    scores:res.scores.map(s=>({pilar:s.nome,nota:s.nota})),
    custo_min:res.custo.low, custo_max:res.custo.high,
    data:new Date().toISOString(), origem:location.href
  };
  // no-cors: dispara e esquece (Apps Script aceita POST simples)
  fetch(CONFIG.sheetsEndpoint,{
    method:"POST", mode:"no-cors",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify(payload)
  }).catch(()=>{});
}

/* ---- helpers ---- */
function firstName(n){ return (n||"").trim().split(" ")[0]; }
function escapeHtml(s){ return (s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

/* boot */
render();
