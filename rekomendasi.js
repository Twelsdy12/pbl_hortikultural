// Kelas untuk Rekomendasi Tanaman
class RekomendasiTanaman {
    constructor(locationApi, weatherApi) {
        this.locationApi = locationApi;
        this.weatherApi = weatherApi;
    }

    async dapatkanRekomendasi(kabupaten, kecamatan) {
        try {
            // Mendapatkan koordinat wilayah
            const koordinat = this.locationApi.getCoordinatesByKabupaten(kabupaten);
            if (!koordinat) throw new Error('Koordinat tidak ditemukan untuk wilayah yang dipilih.');

            // Mengambil data cuaca berdasarkan koordinat
            const dataCuaca = await this.weatherApi.fetchWeatherData(koordinat.lat, koordinat.lon);

            // Membuat rekomendasi tanaman berdasarkan data cuaca
            return this.buatRekomendasiTanaman(dataCuaca);
        } catch (error) {
            console.error('Terjadi kesalahan dalam proses rekomendasi:', error);
            return [];
        }
    }

    buatRekomendasiTanaman(dataCuaca) {
        const { temperature, humidity, rainfall } = dataCuaca;

        let rekomendasi = [];
        if (temperature > 25 && humidity > 70) {
            rekomendasi.push({ nama: 'Tomat', kesesuaian: 'Sangat Sesuai', detail: 'Ideal untuk iklim hangat dan lembap.' });
        }
        if (rainfall > 200) {
            rekomendasi.push({ nama: 'Padi', kesesuaian: 'Sesuai', detail: 'Membutuhkan curah hujan tinggi untuk pertumbuhan optimal.' });
        }
        if (temperature > 20 && rainfall < 150) {
            rekomendasi.push({ nama: 'Jagung', kesesuaian: 'Cukup Sesuai', detail: 'Tumbuh baik di daerah dengan curah hujan sedang.' });
        }

        return rekomendasi;
    }
}

// Kelas untuk API Cuaca
class APIWeather {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async fetchWeatherData(lat, lon) {
        const url = https //api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Gagal mengambil data cuaca.');
            }
            const data = await response.json();

            return {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                rainfall: data.rain ? data.rain['1h'] : 0,
            };
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data cuaca:', error);
            throw error;
        }
    }
}

// Inisialisasi Sistem
document.addEventListener('DOMContentLoaded', () => {
    const locationApi = new LocationAPI(); // Menggunakan API lokasi dari location-api.js
    const weatherApi = new APIWeather('MASUKKAN_API_KEY_ANDA'); // Ganti dengan API key Anda

    const rekomendasiTanaman = new RekomendasiTanaman(locationApi, weatherApi);

    // Menangani pengiriman form prediksi
    const formPrediksi = document.getElementById('predictionForm');
    formPrediksi.addEventListener('submit', async (event) => {
        event.preventDefault();

        const kabupaten = document.getElementById('kabupatenSelect').value;
        const kecamatan = document.getElementById('kecamatanSelect').value;

        if (kabupaten && kecamatan) {
            try {
                const rekomendasi = await rekomendasiTanaman.dapatkanRekomendasi(kabupaten, kecamatan);

                // Menampilkan hasil rekomendasi
                const daftarRekomendasi = document.getElementById('recommendationList');
                daftarRekomendasi.innerHTML = rekomendasi.map((item) => `
                    <li class="list-group-item">
                        <strong>${item.nama}</strong> - ${item.kesesuaian}
                        <p>${item.detail}</p>
                    </li>
                `).join('');
            } catch (error) {
                console.error('Gagal mendapatkan rekomendasi:', error);
            }
        } else {
            alert('Mohon pilih Kabupaten dan Kecamatan.');
        }
    });
});