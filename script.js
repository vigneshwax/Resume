// Resume constants
const NAME  = 'Vigneshwaran M';
const PHONE = '+919344117877';
const EMAIL = 'VIGNESHWARAN.OFCL@GMAIL.COM';

// Direct PDF path (served by your site)
const PDF_PATH = 'https://vigneshwax.github.io/Resume/Resume.pdf';
const PDF_NAME = 'Vigneshwaran_M_Resume.pdf';

// Theme persistence
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

// Dynamic status bar color
const themeMeta = document.querySelector('meta[name="theme-color"]') || (() => {
  const m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); return m;
})();
function syncThemeColor() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
  themeMeta.setAttribute('content', bg);
}
syncThemeColor();

// Settings menu
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
function toggleMenu(open) {
  const next = open ?? settingsMenu.getAttribute('aria-hidden') !== 'false';
  settingsMenu.setAttribute('aria-hidden', String(!next));
  settingsMenu.style.display = next ? 'block' : 'none';
  settingsBtn.setAttribute('aria-expanded', String(next));
}
settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
document.addEventListener('click', (e) => { if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) toggleMenu(false); });

// Theme toggle
document.getElementById('menuTheme').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeColor();
  toggleMenu(false);
});

// Print
document.getElementById('menuPrint').addEventListener('click', () => { window.print(); toggleMenu(false); });

// vCard download
document.getElementById('menuVcard').addEventListener('click', () => {
  const vcard = [
    'BEGIN:VCARD','VERSION:3.0',
    'N:Vigneshwaran;M;;;','FN:Vigneshwaran M',
    'TITLE:B.Com (CA), MBA-HRM',
    `TEL;TYPE=CELL:${PHONE}`,
    `EMAIL;TYPE=INTERNET;PREF=1:${EMAIL}`,
    'ADR;TYPE=HOME:;;No: 7, Velalar St, Ukkal Vlg;Thiruvannamalai;TN;631701;India',
    'URL:https://vigneshwaranhr.blogspot.com/',
    'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/vigneshwaran-peoplefirst',
    'END:VCARD'
  ].join('\n');
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Vigneshwaran_M.vcf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  toggleMenu(false);
});

// PDF download helpers
function downloadPDF(path = PDF_PATH, filename = PDF_NAME) {
  const a = document.createElement('a');
  a.href = path;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Menu: Download PDF
document.getElementById('menuDownloadPdf').addEventListener('click', () => {
  downloadPDF();
  toggleMenu(false);
});

// Share via system or copy fallback
document.getElementById('menuShare').addEventListener('click', async () => {
  const text = `Hi, this is ${NAME}. Phone: ${PHONE} • Email: ${EMAIL}\nResume: ${location.href}`;
  try { if (navigator.share) { await navigator.share({ title: `${NAME} — Resume`, text, url: location.href }); toggleMenu(false); return; } } catch {}
  await navigator.clipboard.writeText(location.href);
  toggleMenu(false);
  alert('Link copied');
});

// Hire now
const HIRE_SUBJ = `Application — ${NAME}`;
const HIRE_BODY = `Hello,

This is ${NAME}.
Phone: ${PHONE}
Email: ${EMAIL}
Resume: ${location.href}

Thank you.`;
function openHireMail() {
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(HIRE_SUBJ)}&body=${encodeURIComponent(HIRE_BODY)}`;
  const win = window.open(href, '_self');
  setTimeout(() => { if (!win) alert('Could not open the email app. Use the email link in the header.'); }, 500);
}
document.getElementById('hireNowBottom').addEventListener('click', openHireMail);

// Reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Ripple for tool buttons
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function() { this.classList.remove('run'); void this.offsetWidth; this.classList.add('run'); });
});

// Tilt for education (disabled on touch / reduced motion)
(() => {
  const cards = Array.from(document.querySelectorAll('[data-tilt]'));
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  if (!cards.length || prefersReduce || isTouch) return;
  const maxTilt = 4;
  function onMove(e) { const c = e.currentTarget, r = c.getBoundingClientRect(); const x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height; c.style.transform = `perspective(600px) rotateX(${(y-.5)*-maxTilt}deg) rotateY(${(x-.5)*maxTilt}deg) translateY(-2px)`; }
  function reset(e){ e.currentTarget.style.transform = ''; }
  cards.forEach(c => { c.addEventListener('mousemove', onMove); c.addEventListener('mouseleave', reset); });
})();

// Reading progress
const bar = document.getElementById('progressBar');
document.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  bar.style.width = `${scrolled * 100}%`;
}, { passive: true });

// Back to top
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => { backTop.classList.toggle('show', window.scrollY > 400); });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// FAB quick actions
const fab = document.getElementById('fab');
const fabMain = document.getElementById('fabDownload'); // anchor with native download
const fabWhats = document.getElementById('fabWhats');
const fabEmail = document.getElementById('fabEmail');

// Prefill quick links
fabEmail.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Application — ' + NAME)}&body=${encodeURIComponent('Hello,\n\nThis is ' + NAME + '.\nPhone: ' + PHONE + '\nEmail: ' + EMAIL + '\nResume: ' + location.href + '\n\nThank you.')}`;
fabWhats.href  = `https://wa.me/?text=${encodeURIComponent('Hi, this is ' + NAME + '. Phone: ' + PHONE + ' • Email: ' + EMAIL + '\nResume: ' + location.href)}`;

// Long‑press on FAB to toggle extras (short‑tap handled natively by anchor)
let pressT;
fabMain.addEventListener('pointerdown', () => { pressT = setTimeout(() => { fab.classList.toggle('open'); }, 450); });
['pointerup','pointerleave','pointercancel'].forEach(ev => fabMain.addEventListener(ev, () => clearTimeout(pressT)));

// Centered, draggable 15s “Download the resume” toast
(function setupDownloadToast() {
  const toast  = document.getElementById('dlToast');
  if (!toast) return;

  const btnDl  = document.getElementById('toastDl');
  const btnNo  = document.getElementById('toastNo');
  const handle = document.getElementById('toastHandle');

  // Re-center toast for next show
  function resetToastPosition() {
    toast.classList.remove('toast--moved');
    toast.style.left = '50%';
    toast.style.top  = '50%';
    toast.style.bottom = '';
    toast.style.transform = 'translate(-50%, -50%)';
  }

  // Show once per session after 15s
  if (!sessionStorage.getItem('dlToastSeen')) {
    setTimeout(() => { toast.setAttribute('aria-hidden', 'false'); }, 15000);
  }

  // Actions
  btnDl.addEventListener('click', () => {
    toast.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('dlToastSeen', '1');
    resetToastPosition();
    downloadPDF();
  });
  btnNo.addEventListener('click', () => {
    toast.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem('dlToastSeen', '1');
    resetToastPosition();
  });

  // Drag within viewport; keep X centering baseline after first move
  let dragging = false, startX = 0, startY = 0, baseCenterX = 0, baseTop = 0;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function onPointerDown(e) {
    dragging = true;
    const rect = toast.getBoundingClientRect();
    baseCenterX = rect.left + rect.width / 2;
    baseTop     = rect.top;
    startX = e.clientX; startY = e.clientY;
    toast.style.transition = 'none';
    handle.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const newCenterX = clamp(baseCenterX + dx, 140, vw - 140);
    const newTop     = clamp(baseTop + dy, 10, vh - 160);

    toast.style.left    = `${(newCenterX / vw) * 100}%`;
    toast.style.top     = `${newTop}px`;
    toast.style.bottom  = 'auto';
    toast.style.transform = 'translateX(-50%)';
    toast.classList.add('toast--moved');
  }

  function onPointerUp(e) {
    dragging = false;
    toast.style.transition = '';
    handle.releasePointerCapture?.(e.pointerId);
  }

  handle.addEventListener('pointerdown', onPointerDown);
  handle.addEventListener('pointermove', onPointerMove);
  handle.addEventListener('pointerup', onPointerUp);
  handle.addEventListener('pointercancel', onPointerUp);

  // Esc to dismiss and re-center next time
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toast.getAttribute('aria-hidden') === 'false') {
      toast.setAttribute('aria-hidden', 'true');
      sessionStorage.setItem('dlToastSeen', '1');
      resetToastPosition();
    }
  });
})();


