const THEME_KEY = 'weblab_theme';

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.style.colorScheme = 'light';
    document.body.classList.remove('dark');
  } else if (theme === 'dark') {
    root.style.colorScheme = 'dark';
    document.body.classList.add('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.style.colorScheme = prefersDark ? 'dark' : 'light';
    document.body.classList.toggle('dark', prefersDark);
  }
}

function setTheme(next) {
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(saved);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = localStorage.getItem(THEME_KEY) || 'system';
    if (current === 'system') applyTheme('system');
  });
})();

document.addEventListener('click', (e) => {
  const btn = e.target.closest('#theme-toggle');
  if (btn) {
    const current = localStorage.getItem(THEME_KEY) || 'system';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    setTheme(next);
    btn.dataset.mode = next;
    btn.title = `Theme: ${next}`;
  }
});

document.addEventListener('click', (e) => {
  const burger = e.target.closest('#burger');
  if (burger) {
    const menu = document.getElementById('menu');
    menu?.classList.toggle('open');
  }
});

document.addEventListener('click', (e) => {
  const menu = document.getElementById('menu');
  if (!menu) return;
  const inside = e.target.closest('#menu') || e.target.closest('#burger');
  if (!inside) menu.classList.remove('open');
});

