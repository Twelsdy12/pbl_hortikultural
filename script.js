// Map Initialization
const map = L.map('map').setView([-5.0, 119.5], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Kabupaten-Kecamatan Coordinate Data
const kecamatanCoordinates = {
    Maros: { "Bontoa": [-5.2987, 119.5387], "Bantimurung": [-5.0691, 119.7692] },
    Pangkep: { "Pangkajene": [-4.9493, 119.4699], "Labakkang": [-5.0476, 119.5073] },
};

// Add Markers for Sample Locations
Object.keys(kecamatanCoordinates).forEach((kabupaten) => {
    Object.keys(kecamatanCoordinates[kabupaten]).forEach((kecamatan) => {
        L.marker(kecamatanCoordinates[kabupaten][kecamatan])
            .addTo(map)
            .bindPopup(`<b>${kecamatan}</b>, ${kabupaten}`)
            .openPopup();
    });
});
