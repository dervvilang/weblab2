// theme.js
(function(){
const root = document.documentElement;
const btn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if(saved){ root.setAttribute('data-theme', saved); }
btn?.addEventListener('click', () => {
const current = root.getAttribute('data-theme');
const next = current === 'light' ? 'dark' : 'light';
root.setAttribute('data-theme', next);
localStorage.setItem('theme', next);
});
})();
