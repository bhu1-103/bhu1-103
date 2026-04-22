const overlay = document.querySelector('.liquid-overlay');
const buttons = document.querySelectorAll('.projects-btn');

window.addEventListener('load', () => {
  if (!overlay) return;
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

document.querySelectorAll('.project').forEach(p => {
  p.addEventListener('click', () => {
    p.classList.toggle('active');
  });
});

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleTransition(e, btn.href);
  });
});
