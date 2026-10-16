const CONFIG = { checkoutUrl: "" };
const note = document.getElementById('notice');
let noteTimer;

document.querySelectorAll('[data-checkout]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    if (/^https:\/\//i.test(CONFIG.checkoutUrl)) {
      window.location.href = CONFIG.checkoutUrl;
      return;
    }
    note.classList.add('show');
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => note.classList.remove('show'), 4500);
  });
});

document.querySelectorAll('img[data-asset]').forEach(img => {
  const slot = img.closest('.slot');
  function show(){ if(img.naturalWidth > 0) slot.classList.add('loaded'); }
  img.addEventListener('load', show);
  if (img.complete) show();
});

const mobileCta = document.querySelector('.mobile-cta');
function updateCta(){
  if(!mobileCta) return;
  mobileCta.classList.toggle('visible', window.scrollY > 420);
}
window.addEventListener('scroll', updateCta, { passive: true });
updateCta();

document.getElementById('year').textContent = new Date().getFullYear();
