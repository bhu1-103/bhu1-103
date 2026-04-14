const btn = document.querySelector('.projects-btn');
const overlay = document.querySelector('.liquid-overlay');
const backBtn = document.querySelector('.back-btn');

window.addEventListener('pageshow', (event) => {
  if (overlay && event.persisted) {
    overlay.style.display = 'none';
    overlay.classList.remove('cycle');
  }
});

/* homepage.html script*/
if (btn && overlay) {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const rect = btn.getBoundingClientRect();
    /*overlay.style.left = rect.left + rect.width / 2 + 'px';
    overlay.style.top= rect.top + rect.height / 2 + 'px';*/

    overlay.style.display = 'block';
    overlay.classList.remove('cycle');

    overlay.classList.add('cycle');

    setTimeout(() => {
      window.location.href = btn.href;
    }, 700);
  });
}

/* projects.html script*/
if (overlay && window.location.pathname.includes('projects')) {
  window.addEventListener('load', () => {

    setTimeout(() => {
      overlay.style.display = 'none';
    }, 700);
  });
}

if (backBtn && overlay) {
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();

    overlay.style.display = 'block';

    overlay.classList.remove('active', 'shrink', 'full', 'cycle');

    overlay.classList.add('cycle');

    setTimeout(() => {
      window.location.href = backBtn.href;
    }, 1400);
  });
}
