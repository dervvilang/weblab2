import "./style-BZ5FMwGp.js";

const form = document.getElementById("book-form");
const queryInput = document.getElementById("book-query");
const results = document.getElementById("book-results");
const template = document.getElementById("book-item");
const status = document.getElementById("book-status");

const setStatus = (message = "", variant = "info") => {
  if (!status) return;
  status.innerHTML = message;
  status.classList.toggle("status-error", variant === "error");
};

form == null || form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const term = (queryInput == null ? void 0 : queryInput.value.trim()) ?? "";
  if (!term) return;
  setStatus(`Ищу книги по запросу: <b>${term}</b>…`);
  results && (results.innerHTML = "");
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(term)}&limit=20`);
    if (!response.ok) throw new Error("Ошибка ответа Open Library");
    const data = await response.json();
    if (!data.docs || data.docs.length === 0) {
      setStatus("Ничего не найдено.");
      return;
    }
    results && (results.innerHTML = "");
    data.docs.forEach((entry) => {
      var _a, _b;
      const clone = template == null ? void 0 : template.content.cloneNode(true);
      if (!clone) return;
      const title = entry.title || "Без названия";
      const authors = (entry.author_name && entry.author_name.join(", ")) || "Автор не указан";
      const year = entry.first_publish_year || "—";
      const cover = entry.cover_i;
      clone.querySelector(".title").textContent = title;
      clone.querySelector(".meta").textContent = `${authors} • ${year}`;
      (_a = clone.querySelector(".link")) == null ? void 0 : _a.setAttribute("href", `https://openlibrary.org${entry.key}`);
      const coverImage = clone.querySelector(".cover");
      if (cover) {
        coverImage.src = `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
        coverImage.alt = `Обложка: ${title}`;
      } else {
        (_b = coverImage == null ? void 0 : coverImage.parentElement) == null ? void 0 : _b.removeChild(coverImage);
      }
      results == null ? void 0 : results.appendChild(clone);
    });
    setStatus(`Найдено результатов: ${results == null ? void 0 : results.children.length}`);
  } catch (error) {
    results && (results.innerHTML = "");
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Ошибка: ${message}`, "error");
  }
});
