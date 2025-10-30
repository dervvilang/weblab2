const THEME_KEY = 'weblab_theme'; 

function applyTheme(mode) {
  const root = document.documentElement; 
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effective = mode === 'system' ? (sysDark ? 'dark' : 'light') : mode;

  root.setAttribute('data-theme', effective === 'dark' ? 'dark' : 'light');

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.dataset.mode = mode;
    btn.textContent =
      mode === 'light' ? 'Тема: светлая' :
      mode === 'dark'  ? 'Тема: тёмная'  :
                         'Тема: системная';
  }
}

function setTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(saved);

  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    const curr = localStorage.getItem(THEME_KEY) || 'system';
    if (curr === 'system') applyTheme('system');
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange); 

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#theme-toggle');
    if (!btn) return;
    const curr = localStorage.getItem(THEME_KEY) || 'system';
    const next = curr === 'light' ? 'dark' : curr === 'dark' ? 'system' : 'light';
    setTheme(next);
  });
})();
