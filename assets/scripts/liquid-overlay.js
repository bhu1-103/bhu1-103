const overlay = document.querySelector('.liquid-overlay');
const btn = document.querySelector('.projects-btn');
const backBtn = document.querySelector('.back-btn');

window.addEventListener('load', () => {
  if (!overlay) return;
  overlay.style.height = '100%';
  overlay.getBoundingClientRect();
  overlay.classList.add('drain');
  overlay.addEventListener('animationend', () => {
    overlay.style.display = 'none';
  }, { once: true});
})

function handleTransition(e,targetUrl) {
  e.preventDefault();
  if (!overlay) {
    window.location.href = targetUrl;
    return;
  }
  overlay.style.display = 'block';
  overlay.classList.remove('drain');
  overlay.classList.add('fill');
  
  overlay.addEventListener('animationend', () => {
    window.location.href = targetUrl;
  }, {once: true});
}

if (btn) {
  btn.addEventListener('click', (e) => {
    handleTransition(e, btn.href);
  })
}

if (backBtn) {
  backBtn.addEventListener('click', e => {
    handleTransition(e,backBtn.href);
  })
}

