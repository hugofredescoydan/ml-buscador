const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Reemplaza con el enlace ACTUAL de tu Apps Script que entrega el token
const TOKEN_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyM4Zx5xbpeVUHLit9nlmsxEn1Nxw-uGGHQ-3h7BjKrTbLCjQ5TpVO7NeIIjicEs1kw/exec';

// ✅ Ruta para verificar que el servidor corre
app.get("/", (req, res) => {
  res.send("✅ El servidor está en funcionamiento.");
});

// 🔍 Ruta de búsqueda en Mercado Libre
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda "q"' });
  }

  try {
const url = `https://api.mercadolibre.com/sites/MLC/search?q=${encodeURIComponent(query)}&limit=10`;
const response = await axios.get(url);  // 🔓 Sin autenticación


    const results = response.data.results.map(item => ({
      title: item.title,
      price: item.price,
      seller_id: item.seller.id,
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

// 🚀 Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
