import "./style.css";

const form = document.getElementById("book-form");
const queryInput = document.getElementById("book-query");
const results = document.getElementById("book-results");
const tpl = document.getElementById("book-item");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = queryInput.value.trim();
  if (!q) return;

  results.innerHTML = `<div class="card">Ищу книги по запросу: <b>${q}</b>…</div>`;

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Ошибка ответа Open Library");
    const data = await res.json();

    if (!data.docs || data.docs.length === 0) {
      results.innerHTML = `<div class="card">Ничего не найдено.</div>`;
      return;
    }

    results.innerHTML = "";
    data.docs.forEach((doc) => {
      const node = tpl.content.cloneNode(true);
      const title = doc.title || "Без названия";
      const author = (doc.author_name && doc.author_name.join(", ")) || "Автор не указан";
      const year = doc.first_publish_year || "—";
      const coverId = doc.cover_i;

      node.querySelector(".title").textContent = title;
      node.querySelector(".meta").textContent = `${author} • ${year}`;
      node.querySelector(".link").href = `https://openlibrary.org${doc.key}`;

      const img = node.querySelector(".cover");
      if (coverId) {
        img.src = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
        img.alt = `Обложка: ${title}`;
      } else {
        img.remove();
      }

      results.appendChild(node);
    });
  } catch (err) {
    results.innerHTML = `<div class="card">Ошибка: ${err.message}</div>`;
  }
});
