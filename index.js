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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const resultados = [];

    $('li.ui-search-layout__item').each((i, el) => {
      const title = $(el).find('h2.ui-search-item__title').text().trim();
      const price = $(el).find('span.andes-money-amount__fraction').text().trim();
      const link = $(el).find('a.ui-search-link').attr('href');

      if (title && price && link) {
        resultados.push({ title, price, link });
      }
    });

    res.json(resultados.slice(0, 10));
  } catch (e) {
    console.error("❌ Error scraping:", e.message);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
