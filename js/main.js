/* Animações leves da landing (não afeta o quiz) */

/* Conta os números do hero quando aparecem */
function animarContador(el, alvo, dur){
  const ini=performance.now();
  function passo(t){
    const k=Math.min((t-ini)/dur,1);
    const eased=1-Math.pow(1-k,3);
    el.textContent=Math.round(alvo*eased).toLocaleString("pt-BR");
    if(k<1) requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
}

const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target;
    if(el.dataset.done) return;
    el.dataset.done="1";
    const alvo=parseInt(el.dataset.alvo,10);
    animarContador(el, alvo, 1400);
  });
},{threshold:.6});

window.addEventListener("DOMContentLoaded",()=>{
  const total=document.getElementById("counterTotal");
  const today=document.getElementById("counterToday");
  if(total){ total.dataset.alvo="3247"; io.observe(total); }
  if(today){ today.dataset.alvo="42"; io.observe(today); }

  // revela seções com leve fade ao rolar
  const reveal=new IntersectionObserver((ents)=>{
    ents.forEach(en=>{ if(en.isIntersecting){ en.target.style.opacity="1"; en.target.style.transform="none"; reveal.unobserve(en.target);} });
  },{threshold:.12});
  document.querySelectorAll(".sec").forEach(s=>{
    s.style.opacity="0"; s.style.transform="translateY(18px)";
    s.style.transition="opacity .6s ease, transform .6s ease";
    reveal.observe(s);
  });
});
