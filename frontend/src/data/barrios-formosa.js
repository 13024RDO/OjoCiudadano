// src/data/barrios-formosa.js
const barriosFormosa = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "San Miguel" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.1831, -26.1892],
            [-58.1831, -26.1792],
            [-58.1731, -26.1792],
            [-58.1731, -26.1892],
            [-58.1831, -26.1892],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { nombre: "Barrio Obrero" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.1768, -26.1785],
            [-58.1768, -26.1685],
            [-58.1668, -26.1685],
            [-58.1668, -26.1785],
            [-58.1768, -26.1785],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { nombre: "17 de Octubre" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.1906, -26.1951],
            [-58.1906, -26.1851],
            [-58.1806, -26.1851],
            [-58.1806, -26.1951],
            [-58.1906, -26.1951],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { nombre: "Lomas del Sur" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.1962, -26.2037],
            [-58.1962, -26.1937],
            [-58.1862, -26.1937],
            [-58.1862, -26.2037],
            [-58.1962, -26.2037],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { nombre: "Villa del Carmen" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-58.1704, -26.1773],
            [-58.1704, -26.1673],
            [-58.1604, -26.1673],
            [-58.1604, -26.1773],
            [-58.1704, -26.1773],
          ],
        ],
      },
    },
  ],
};

export default barriosFormosa;
