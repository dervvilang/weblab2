import "./style.css";

const fromSel = document.getElementById("from");
const toSel = document.getElementById("to");
const form = document.getElementById("fx-form");
const result = document.getElementById("fx-result");

// Подгружаем список валют
(async function loadCurrencies() {
  try {
    const res = await fetch("https://api.frankfurter.app/currencies");
    if (!res.ok) throw new Error("Не удалось получить список валют");
    const data = await res.json();

    const codes = Object.keys(data).sort();
    codes.forEach((code) => {
      const opt1 = new Option(`${code} — ${data[code]}`, code);
      const opt2 = new Option(`${code} — ${data[code]}`, code);
      fromSel.add(opt1);
      toSel.add(opt2);
    });

    fromSel.value = "USD";
    toSel.value = "EUR";
  } catch (e) {
    result.textContent = e.message;
  }
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const amount = Number(document.getElementById("amount").value);
  const from = fromSel.value;
  const to = toSel.value;
  if (!amount || amount <= 0) return;

  result.innerHTML = `<div class="hint">Конвертирую ${amount} ${from} → ${to}…</div>`;

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Ошибка ответа Frankfurter");
    const data = await res.json();

    const rate = data.rates?.[to];
    if (rate == null) throw new Error("Не удалось получить курс");

    result.innerHTML = `
      <div><b>${amount} ${from}</b> = <b>${rate} ${to}</b></div>
      <div class="hint">Дата курса: ${data.date}</div>
    `;
  } catch (err) {
    result.innerHTML = `<div class="card">Ошибка: ${err.message}</div>`;
  }
});
