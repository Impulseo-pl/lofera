/* Lofera – łuk z logo jako drzwi do wnętrza */
(function(){
  var d=document,html=d.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  html.classList.add('anim-ok');
  var lenis=null;
  if(window.Lenis&&!reduce){lenis=new Lenis({lerp:.085,smoothWheel:true});(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());}
  function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}

  /* nagłówek */
  var top=d.querySelector('.top'),lastY=0;
  function hdr(){var y=scrollY;if(top){top.classList.toggle('solid',y>innerHeight*.9||!d.querySelector('.door')&&y>20);top.classList.toggle('hide',y>innerHeight&&y>lastY+3);if(y<lastY-3)top.classList.remove('hide')}lastY=y}
  addEventListener('scroll',hdr,{passive:true});hdr();

  /* menu */
  var menu=d.querySelector('.menu');
  d.querySelectorAll('[data-menu]').forEach(function(b){b.addEventListener('click',function(){var o=!menu.classList.contains('open');menu.classList.toggle('open',o);d.body.style.overflow=o?'hidden':'';if(lenis){o?lenis.stop():lenis.start()}})});

  /* DRZWI */
  var door=d.querySelector('.door');
  if(door){
    var img=door.querySelector('.door-img'),pic=img.querySelector('img'),h1s=door.querySelectorAll('.door-t h1 span'),sub=door.querySelector('.door-t .sub'),cap=door.querySelector('.door-cap'),shade=door.querySelector('.door-shade');var kick=door.querySelector('.door-k');
    var L=reduce?1:0,t0=null;
    function frame(){
      var vw=innerWidth,vh=innerHeight,mob=vw<700;
      var aw=mob?vw*.5:Math.min(vw*.24,400),ah=Math.min(vh*(mob?.28:.6),aw*1.55);
      var r=door.getBoundingClientRect(),p=clamp(-r.top/(door.offsetHeight-vh),0,1),e=ease(clamp(p/.85,0,1));
      var w=aw+(vw-aw)*e,h=(ah+(vh-ah)*e),x=(vw-w)/2,yy=(mob?vh*.39:(vh-ah)/2+20)*(1-e);
      var hL=h*L,top_=yy+h-hL,rad=(aw/2)*(1-e);
      img.style.clipPath='inset('+top_.toFixed(1)+'px '+(vw-x-w).toFixed(1)+'px '+(vh-yy-h).toFixed(1)+'px '+x.toFixed(1)+'px round '+rad.toFixed(1)+'px '+rad.toFixed(1)+'px 0 0)';
      pic.style.setProperty('--s',(1.18-.18*e).toFixed(4));
      if(h1s.length===2){var dx=e*(mob?20:28);h1s[0].style.transform='translateX('+(-dx)+'vw)';h1s[1].style.transform='translateX('+dx+'vw)';h1s[0].style.opacity=h1s[1].style.opacity=clamp(1-e*1.6,0,1);}
      if(sub)sub.style.opacity=clamp(1-e*2.5,0,1);if(kick)kick.style.opacity=clamp(1-e*2.5,0,1);
      cap.classList.toggle('on',e>.9);shade.classList.toggle('on',e>.9);
    }
    function intro(ts){if(t0===null)t0=ts;L=ease(clamp((ts-t0)/1400,0,1));frame();if(L<1)requestAnimationFrame(intro)}
    var go=function(){reduce?frame():requestAnimationFrame(intro)};
    if(pic.complete)setTimeout(go,150);else pic.addEventListener('load',function(){setTimeout(go,150)});
    addEventListener('scroll',frame,{passive:true});addEventListener('resize',frame);frame();
  }

  /* przeglądarki ujęć w projektach */
  d.querySelectorAll('.viewer').forEach(function(v){
    var main=v.querySelector('.v-main'),im=main.querySelector('img'),cnt=main.querySelector('.count'),bs=v.querySelectorAll('.v-thumbs button'),cur=0;
    function show(i){if(i===cur)return;cur=i;bs.forEach(function(b,k){b.classList.toggle('on',k===i)});im.classList.add('out');
      setTimeout(function(){var b=bs[i];im.src=b.dataset.src;im.alt=b.dataset.alt;im.onload=function(){im.classList.remove('out')};if(im.complete)im.classList.remove('out');if(cnt)cnt.textContent='Ujęcie '+(i+1)+' z '+bs.length},420)}
    bs.forEach(function(b,i){b.addEventListener('click',function(){show(i)})});
    main.addEventListener('click',function(){openLb(im.src,im.alt)});
    v.setAttribute('tabindex','0');v.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show((cur+1)%bs.length);if(e.key==='ArrowLeft')show((cur-1+bs.length)%bs.length)});
  });

  /* zakres: zdjęcie zmienia się z pozycją */
  var sp=d.querySelector('.scope-pic');
  if(sp){var ims=sp.querySelectorAll('img'),lis=d.querySelectorAll('.scope-list li');
    function sel(i){lis.forEach(function(l,k){l.classList.toggle('on',k===i)});ims.forEach(function(m,k){m.classList.toggle('on',k===i)})}
    lis.forEach(function(l,i){l.addEventListener('mouseenter',function(){sel(i)})});
    addEventListener('scroll',function(){var mid=innerHeight*.5,best=0,bd=1e9;lis.forEach(function(l,i){var r=l.getBoundingClientRect(),dd=Math.abs(r.top+r.height/2-mid);if(dd<bd){bd=dd;best=i}});sel(best)},{passive:true});
    sel(0);
  }

  /* paralaksa szerokich zdjęć */
  var wides=[].slice.call(d.querySelectorAll('.wide img'));
  if(wides.length&&!reduce){function pw(){wides.forEach(function(m){var r=m.parentNode.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var q=(r.top+r.height/2-innerHeight/2)/innerHeight;m.style.transform='translateY('+(-8+q*-10).toFixed(2)+'%)'})}addEventListener('scroll',pw,{passive:true});pw()}

  /* odsłanianie */
  var els=d.querySelectorAll('.rv,.reveal');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'});els.forEach(function(e){io.observe(e)})}else els.forEach(function(e){e.classList.add('in')});

  /* lightbox */
  var lb=d.querySelector('.lb'),lbi=lb&&lb.querySelector('img');
  function openLb(src,alt){if(!lb)return;lbi.src=src;lbi.alt=alt||'';lb.classList.add('open');if(lenis)lenis.stop()}
  if(lb){lb.addEventListener('click',function(){lb.classList.remove('open');if(lenis)lenis.start()});addEventListener('keydown',function(e){if(e.key==='Escape'){lb.classList.remove('open');if(lenis)lenis.start()}})}
  d.querySelectorAll('[data-lb]').forEach(function(f){f.addEventListener('click',function(){openLb(f.dataset.lb,(f.querySelector('img')||{}).alt)})});

  /* przejście między stronami: łuk wjeżdża i zjeżdża */
  var cur=d.querySelector('.curtain');
  if(cur){
    if(cur.classList.contains('cover')){requestAnimationFrame(function(){requestAnimationFrame(function(){cur.classList.add('leave');setTimeout(function(){cur.className='curtain'},900)})})}
    if(!reduce)d.addEventListener('click',function(e){var a=e.target.closest('a');if(!a||e.metaKey||e.ctrlKey||a.target==='_blank')return;var h=a.getAttribute('href')||'';if(!/\.html$/.test(h))return;e.preventDefault();try{sessionStorage.setItem('lfnav','1')}catch(x){}cur.className='curtain';void cur.offsetWidth;cur.classList.add('in');setTimeout(function(){location.href=a.href},760)});
    addEventListener('pageshow',function(e){if(e.persisted)cur.className='curtain'});
  }
})();

(function(){try{if(String(location.protocol).indexOf('http')!==0)return;try{if(/[?&#]team=1/.test(location.search+location.hash)){localStorage.setItem('nb_team','1');}}catch(e){}try{if(localStorage.getItem('nb_team')==='1')return;}catch(e){}if(/crm-newbeginning|crm\.impulseo\.pl/.test(document.referrer||''))return;try{if(navigator.webdriver)return;}catch(e){}try{if(/^https?:\/\/(kris20032|impulseo-pl)\.github\.io\/?$/i.test(document.referrer||''))return;}catch(e){}if(sessionStorage.getItem('_dv'))return;sessionStorage.setItem('_dv','1');var seg=(location.pathname.split('/').filter(Boolean)[0])||'';var base=location.origin+(seg?('/'+seg):'');var ua='';try{ua=(navigator.userAgent||'').slice(0,300);}catch(e){}var EP='https://zngfubfinbojfgaxdrbf.supabase.co/functions/v1/demo-view';try{fetch(EP,{method:'POST',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify({demo_url:base,page:location.pathname,referrer:(document.referrer||null),user_agent:(ua||null)})}).catch(function(){});}catch(e){}}catch(e){}})();
