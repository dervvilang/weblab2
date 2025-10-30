import { defineConfig } from "vite";

// Если репозиторий назовёшь иначе — замени на "/<имя_репозитория>/"
export default defineConfig({
  base: "/weblab2/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        books: "books.html",
        currency: "currency.html",
        weather: "weather.html"
      }
    }
  }
});
