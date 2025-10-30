import "./style-BZ5FMwGp.js";

const form = document.getElementById("wx-form");
const results = document.getElementById("wx-result");
const template = document.getElementById("wx-card");
const status = document.getElementById("wx-status");

const setStatus = (message = "", variant = "info") => {
  if (!status) return;
  status.innerHTML = message;
  status.classList.toggle("status-error", variant === "error");
};

form == null || form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityInput = document.getElementById("city");
  const city = cityInput?.value.trim();
  if (!city) return;
  setStatus(`Ищу координаты для: <b>${city}</b>…`);
  if (results) results.innerHTML = "";
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`);
    if (!geoResponse.ok) throw new Error("Ошибка геокодинга");
    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      setStatus("Город не найден.", "error");
      return;
    }
    const location = geoData.results[0];
    const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m&forecast_days=1&timezone=auto`);
    if (!forecastResponse.ok) throw new Error("Ошибка прогноза");
    const forecast = await forecastResponse.json();
    if (results) results.innerHTML = "";
    const fragment = template?.content.cloneNode(true);
    if (fragment && results) {
      const node = fragment.querySelector(".title");
      if (node) node.textContent = `${location.name}, ${location.country}`;
      const current = forecast.current_weather ?? {};
      const temperature = current.temperature ?? "—";
      const wind = current.windspeed ?? "—";
      const time = current.time ?? "";
      const meta = fragment.querySelector(".meta");
      if (meta) meta.innerHTML = `Сейчас: <b>${temperature} °C</b>, ветер ${wind} км/ч<br/>Обновлено: ${time}`;
      results.appendChild(fragment);
    }
    setStatus(`Погода обновлена для ${location.name}.`);
  } catch (error) {
    if (results) results.innerHTML = "";
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`Ошибка: ${message}`, "error");
  }
});
