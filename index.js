const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ El servidor está en funcionamiento.");
});

const ACCESS_TOKEN = 'APP_USR-241718011749496-050607-9b519718db89cfffe4621ab0b6510206-241853977';

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda "q"' });
  }

  try {
    const url = `https://api.mercadolibre.com/sites/MLC/search?q=${encodeURIComponent(query)}&limit=10`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });

    const results = response.data.results.map(item => ({
      title: item.title,
      price: item.price,
      seller_id: item.seller.id,
      permalink: item.permalink
    }));

    res.json(results);
  } catch (e) {
    console.error("❌ Error al consultar la API de Mercado Libre:");
    if (e.response) {
      console.error("📋 Código de estado:", e.response.status);
      console.error("📋 Datos de error:", e.response.data);
    } else {
      console.error("📋 Error general:", e.message);
    }
    res.status(500).json({ error: "Error al consultar la API de Mercado Libre" });
  }
});
);

// ✅ Importante: escuchar en 0.0.0.0 para que Render lo detecte
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
