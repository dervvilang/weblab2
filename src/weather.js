import "./style.css";

const form = document.getElementById("wx-form");
const result = document.getElementById("wx-result");
const tpl = document.getElementById("wx-card");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value.trim();
  if (!city) return;

  result.innerHTML = `<div class="card">Ищу координаты для: <b>${city}</b>…</div>`;

  try {
    // 1) Геокодинг
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Ошибка геокодинга");
    const geo = await geoRes.json();

    if (!geo.results || geo.results.length === 0) {
      result.innerHTML = `<div class="card">Город не найден.</div>`;
      return;
    }

    const g = geo.results[0];
    const { latitude, longitude, name, country } = g;

    // 2) Прогноз
    const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m&forecast_days=1&timezone=auto`;
    const wxRes = await fetch(wxUrl);
    if (!wxRes.ok) throw new Error("Ошибка прогноза");
    const wx = await wxRes.json();

    result.innerHTML = "";

    const card = tpl.content.cloneNode(true);
    card.querySelector(".title").textContent = `${name}, ${country}`;
    const curr = wx.current_weather;
    const temp = curr?.temperature ?? "—";
    const wind = curr?.windspeed ?? "—";
    const time = curr?.time ?? "";

    card.querySelector(".meta").innerHTML = `
      Сейчас: <b>${temp} °C</b>, ветер ${wind} км/ч<br/>
      Обновлено: ${time}
    `;
    result.appendChild(card);
  } catch (err) {
    result.innerHTML = `<div class="card">Ошибка: ${err.message}</div>`;
  }
});
