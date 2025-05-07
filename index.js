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
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.85 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const resultados = [];

    $('.ui-search-result__content-wrapper').each((i, el) => {
      const title = $(el).find('h2.ui-search-item__title').text().trim();
      const price = $(el).find('span.andes-money-amount__fraction').text().trim();
      const url = $(el).closest('a.ui-search-link').attr('href');

      if (title && price && url) {
        resultados.push({ title, price, url });
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
