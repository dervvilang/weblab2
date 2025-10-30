import "./style-BZ5FMwGp.js";

const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const form = document.getElementById("fx-form");
const output = document.getElementById("fx-result");
const status = document.getElementById("fx-status");

const setStatus = (message = "", variant = "info") => {
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("status-error", variant === "error");
};

(async function loadCurrencies() {
  if (!fromSelect || !toSelect) return;
  try {
    setStatus("Загружаю список валют…");
    const response = await fetch("https://api.frankfurter.app/currencies");
    if (!response.ok) throw new Error("Не удалось получить список валют");
    const currencies = await response.json();
    Object.keys(currencies)
      .sort()
      .forEach((code) => {
        const optionFrom = new Option(`${code} — ${currencies[code]}`, code);
        const optionTo = new Option(`${code} — ${currencies[code]}`, code);
        fromSelect.add(optionFrom);
        toSelect.add(optionTo);
      });
    fromSelect.value = "USD";
    toSelect.value = "EUR";
    setStatus("");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(message, "error");
  }
})();

form == null || form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const amount = Number(document.getElementById("amount")?.value ?? 0);
  const from = fromSelect == null ? void 0 : fromSelect.value;
  const to = toSelect == null ? void 0 : toSelect.value;
  if (!amount || amount <= 0 || !from || !to) {
    setStatus("Введите сумму и выберите валюты.", "error");
    return;
  }
  setStatus(`Конвертирую ${amount} ${from} → ${to}…`);
  output && (output.innerHTML = "");
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
    if (!response.ok) throw new Error("Ошибка ответа Frankfurter");
    const data = await response.json();
    const value = data.rates?.[to];
    if (value == null) throw new Error("Не удалось получить курс");
    if (output) {
      output.innerHTML = `<div><b>${amount} ${from}</b> = <b>${value} ${to}</b></div><div class="hint">Дата курса: ${data.date}</div>`;
    }
    setStatus("");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Ошибка: ${message}`, "error");
    output && (output.innerHTML = "");
  }
});
