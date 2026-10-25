const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const WA='255765478390';
const waLink=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const root=document.documentElement;

const yr=$('#year'); if(yr) yr.textContent=new Date().getFullYear();
$$('[data-stars]').forEach(s=>s.innerHTML='<svg class="i"><use href="#i-star"/></svg>'.repeat(5));

/* toast */
const toast=$('#toast');
function say(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2400)}

/* theme */
root.dataset.theme=store.get('boaz-theme')||'light';
const themeBtn=$('#themeBtn');
if(themeBtn) themeBtn.onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';store.set('boaz-theme',root.dataset.theme)};

/* language */
const SW={
 nav_contact:'Mawasiliano',
 hero_h1:'Usikubali <em>kuharibika</em> kuwa jibu la mwisho',
 hero_p:'Matengenezo ya simu, kufungua software, micro-soldering na huduma za kompyuta Dodoma. Tunarekebisha ambavyo wengine hawawezi.',
 svc_eyebrow:'Huduma', svc_h2:'Kila tunachotengeneza', svc_p:'Kutoka software hadi hardware ya ndani ya bodi, mahali pamoja.',
 ab_eyebrow:'Kuhusu sisi', ab_h2:'Mtaalamu unayemwamini wa elektroniki Dodoma',
 gal_eyebrow:'Ndani ya duka', gal_h2:'Karakana yetu', gal_p:'Gusa picha kuikuza.',
 pr_eyebrow:'Bei', pr_h2:'Bei wazi na nafuu', pr_p:'Bei za kuanzia. Gharama ya mwisho hutegemea kifaa na tatizo.',
 te_eyebrow:'Maoni', te_h2:'Wateja wanasemaje', te_p:'Maoni kutoka kwa wateja Dodoma na Tanzania nzima.',
 co_eyebrow:'Mawasiliano', co_h2:'Wasiliana nasi', co_p:'Uko tayari kutengeneza kifaa chako? Tufikie kwa njia yoyote.'
};
let lang=store.get('boaz-lang')||'en';
const i18n=$$('[data-i18n]'); i18n.forEach(e=>e.dataset.en=e.innerHTML);
const langBtn=$('#langBtn');
function applyLang(){
  i18n.forEach(e=>{const k=e.dataset.i18n;e.innerHTML=(lang==='sw'&&SW[k])?SW[k]:e.dataset.en});
  if(langBtn) langBtn.textContent=lang==='sw'?'SW':'EN';
  root.lang=lang; updateOpen();
}
if(langBtn) langBtn.onclick=()=>{lang=lang==='en'?'sw':'en';store.set('boaz-lang',lang);applyLang()};

/* open status (Dodoma time) */
function updateOpen(){
  const dot=$('#openDot'), txt=$('#openText'); if(!dot||!txt)return;
  const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Dar_es_Salaam',weekday:'short',hour:'numeric',hour12:false}).formatToParts(new Date());
  const day=p.find(x=>x.type==='weekday').value, h=+p.find(x=>x.type==='hour').value%24;
  const open=day!=='Sun'&&h>=8&&h<19;
  dot.className='dot '+(open?'open':'closed');
  txt.textContent=open?(lang==='sw'?'Tumefungua sasa':'Open now · Dodoma'):(lang==='sw'?'Tumefungwa · Jumatatu–Jumamosi 8AM–7PM':'Closed · Mon–Sat 8AM–7PM');
}
setInterval(updateOpen,60000);
applyLang();

/* mobile nav */
const nav=$('#nav'), burger=$('#burger');
if(nav&&burger){
  const setNav=o=>{nav.classList.toggle('open',o);burger.innerHTML=`<svg class="i"><use href="#i-${o?'x':'menu'}"/></svg>`};
  burger.onclick=()=>setNav(!nav.classList.contains('open'));
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>setNav(false)));
  document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!burger.contains(e.target))setNav(false)});
}

/* scroll */
const bar=$('#progress'), toTop=$('#toTop');
addEventListener('scroll',()=>{
  const h=document.documentElement;
  if(bar) bar.style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+'%';
  if(toTop) toTop.classList.toggle('show',h.scrollTop>600);
},{passive:true});
if(toTop) toTop.onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* reveal + counters */
const ro=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.1});
$$('.reveal').forEach(e=>ro.observe(e));
function countUp(el){
  const t=+el.dataset.count, suf=el.dataset.suffix||'';
  const start=performance.now(), dur=1600;
  (function tick(n){
    const p=Math.min((n-start)/dur,1);
    el.firstChild.textContent=Math.round(t*(1-Math.pow(1-p,3))).toLocaleString()+suf;
    if(p<1)requestAnimationFrame(tick);
  })(start);
}
const co=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){countUp(e.target);o.unobserve(e.target)}}),{threshold:.6});
$$('[data-count]').forEach(e=>co.observe(e));

/* hero finder */
const fin=$('#finderInput');
if(fin){
  $$('#quick button').forEach(b=>b.onclick=()=>{fin.value=b.textContent+' ';fin.focus()});
  $('#finder').addEventListener('submit',e=>{
    e.preventDefault();
    const d=fin.value.trim();
    window.open(waLink(d?`Hello Boaz Electronics, I need a free estimate for my device: ${d}`:'Hello Boaz Electronics, I need a free estimate for my device.'),'_blank','noopener');
  });
}

/* sidebar estimate form (service pages) */
const est=$('#estimate');
if(est) est.addEventListener('submit',e=>{
  e.preventDefault();
  const d=$('#estDevice').value.trim();
  window.open(waLink(`Hello Boaz Electronics, ${est.dataset.topic}${d?' My device: '+d:''}`),'_blank','noopener');
});

/* service filter */
$$('#tabs .tab').forEach(t=>t.onclick=()=>{
  $$('#tabs .tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
  $$('#svcGrid .card').forEach(c=>c.classList.toggle('hide',t.dataset.f!=='all'&&c.dataset.cat!==t.dataset.f));
});

/* faq */
$$('.faq-item').forEach(it=>{
  const a=$('.faq-a',it);
  $('.faq-q',it).onclick=()=>{
    const was=it.classList.contains('open');
    $$('.faq-item.open').forEach(o=>{o.classList.remove('open');$('.faq-a',o).style.maxHeight=0});
    if(!was){it.classList.add('open');a.style.maxHeight=a.scrollHeight+'px'}
  };
});

/* lightbox */
const gal=$$('.gal'), lb=$('#lightbox');
if(lb&&gal.length){
  let cur=0;
  const show=i=>{cur=(i+gal.length)%gal.length;const im=$('img',gal[cur]);$('#lbImg').src=im.src;$('#lbImg').alt=im.alt;$('#lbCap').textContent=$('figcaption',gal[cur]).textContent};
  gal.forEach((g,i)=>g.onclick=()=>{show(i);lb.classList.add('open')});
  $('#lbClose').onclick=()=>lb.classList.remove('open');
  $('#lbPrev').onclick=()=>show(cur-1);
  $('#lbNext').onclick=()=>show(cur+1);
  lb.onclick=e=>{if(e.target===lb)lb.classList.remove('open')};
  addEventListener('keydown',e=>{
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')lb.classList.remove('open');
    if(e.key==='ArrowLeft')show(cur-1);
    if(e.key==='ArrowRight')show(cur+1);
  });
}

/* copy phone */
const cb=$('#copyBtn');
if(cb) cb.onclick=async()=>{try{await navigator.clipboard.writeText('+255765478390');say('Phone number copied')}catch(e){say('+255 765 478 390')}};

/* contact form */
const form=$('#contactForm');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    let ok=true;
    const chk=(el,v)=>{el.closest('.fg').classList.toggle('invalid',!v);if(!v)ok=false};
    chk($('#fName'),$('#fName').value.trim().length>1);
    chk($('#fPhone'),/^[+\d][\d\s-]{6,}$/.test($('#fPhone').value.trim()));
    chk($('#fService'),!!$('#fService').value);
    if(!ok){say('Please fix the highlighted fields');return}
    const dev=$('#fDevice').value.trim(), msg=$('#fMsg').value.trim();
    const text=['Hello Boaz Electronics!','','*Name:* '+$('#fName').value.trim(),'*Phone:* '+$('#fPhone').value.trim(),dev?'*Device:* '+dev:null,'*Service:* '+$('#fService').value,msg?'*Problem:* '+msg:null].filter(x=>x!==null).join('\n');
    say('Opening WhatsApp…');
    setTimeout(()=>{window.open(waLink(text),'_blank','noopener');form.reset()},600);
  });
  $$('#contactForm input,#contactForm select').forEach(el=>el.addEventListener('input',()=>el.closest('.fg').classList.remove('invalid')));
}
