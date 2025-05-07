const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ El servidor está en funcionamiento.");
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda "q"' });
  }

  try {
    const url = `https://listado.mercadolibre.cl/${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const resultados = [];

    $(".ui-search-result__wrapper").each((i, el) => {
      const title = $(el).find(".ui-search-item__title").text().trim();
      const price = $(el).find(".price-tag-fraction").first().text().trim();
      const seller = $(el).find(".ui-search-official-store-label").text().trim() || "N/A";
      const link = $(el).find("a.ui-search-link").attr("href");

      if (title && price && link) {
        resultados.push({ title, price, seller, link });
      }
    });

    res.json(resultados.slice(0, 10));
  } catch (e) {
    console.error("❌ Error:", e.message);
    res.status(500).json({ error: "Error al obtener datos de Mercado Libre" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
