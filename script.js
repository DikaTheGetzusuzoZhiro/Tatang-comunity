const loader=document.getElementById("loader");
window.addEventListener("load",()=>setTimeout(()=>{loader.style.opacity="0";loader.style.visibility="hidden";setTimeout(()=>loader.remove(),900)},1800));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");observer.unobserve(e.target)}})
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
const menu=document.querySelector(".menu");
menu.addEventListener("click",()=>{
  const nav=document.querySelector(".navbar nav");
  const open=nav.classList.toggle("open");
  if(open){nav.style.display="flex";nav.style.position="absolute";nav.style.top="68px";nav.style.left="0";nav.style.right="0";nav.style.padding="18px";nav.style.background="#0d0018";nav.style.flexDirection="column";nav.style.alignItems="center";nav.style.borderBottom="1px solid #ffffff12"}
  else nav.style.display="";
});
