const express = require("express");
const axios = require("axios");

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
    const url = `https://api.mercadolibre.com/sites/MLC/search?q=${encodeURIComponent(query)}&limit=10`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const results = response.data.results.map(item => ({
      title: item.title,
      price: item.price,
      seller_id: item.seller?.id || 'N/A',
      permalink: item.permalink
    }));

    res.json(results);
  } catch (e) {
    console.error("❌ Error al obtener datos de Mercado Libre:", e.message);
    if (e.response) {
      console.error("📋 Código:", e.response.status);
      console.error("📋 Detalle:", e.response.data);
    }
    res.status(500).json({ error: "Error al obtener datos de Mercado Libre" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
