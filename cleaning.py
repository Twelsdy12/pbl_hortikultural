import requests
from datetime import datetime, timedelta
import json

# Fungsi untuk validasi koordinat
def is_valid_coordinates(latitude, longitude):
    return -90 <= latitude <= 90 and -180 <= longitude <= 180

# Koordinat Kabupaten Maros dan Pangkep
kecamatan_coordinates = {
    "Maros": {
        "Turikale": [119.6664, -5.0102],
        "Tompobulu": [119.5193, -5.0291],
        "Tanralili": [119.4873, -5.014],
        "Simbang": [119.5891, -5.0843],
        "Moncongloe": [119.4825, -5.2577],
        "Marusu": [119.7543, -5.0805],
        "Maros Baru": [119.6681, -5.0351],
        "Mandai": [119.5604, -5.1045],
        "Mallawa": [119.7843, -5.1844],
        "Lau": [119.7427, -5.2180],
        "Cenrana": [119.8183, -5.0991],
        "Camba": [119.6891, -5.0675],
        "Bontoa": [119.5387, -5.2987],
        "Bantimurung": [119.7692, -5.0691],
    },
    "Pangkep": {
        "Pangkajene": [119.4699, -4.9493],
        "Balocci": [119.5381, -4.9990],
        "Bungoro": [119.4871, -5.0763],
        "Labakkang": [119.5073, -5.0476],
        "Ma'rang": [119.4586, -5.1294],
        "Segeri": [119.5462, -5.1364],
        "Minasa Te'ne": [119.6267, -5.1045],
        "Tondong Tallasa": [119.4709, -5.1202],
        "Mandalle": [119.3879, -5.0600],
        "Liukang Tupabiring": [119.2768, -5.0841],
        "Liukang Tupabiring Utara": [119.3172, -5.1043],
        "Liukang Kalmas": [119.2553, -5.0762],
        "Liukang Tangaya": [119.2252, -5.0291],
    }
}

# Fungsi untuk mendapatkan data dari API NASA POWER
def get_weather_data(longitude, latitude, start_date, end_date):
    if not is_valid_coordinates(latitude, longitude):
        print(f"Invalid coordinates: Latitude={latitude}, Longitude={longitude}")
        return None

    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?parameters=RH2M,T2M_MAX,T2M_MIN,PRECTOTCORR&community=ag&longitude={longitude}&latitude={latitude}&start={start_date}&end={end_date}&format=json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to get data for coordinates ({latitude}, {longitude}): {response.status_code}")
        return None

# Fungsi untuk membersihkan data (menangani nilai -999.0 di seluruh struktur)
def clean_weather_data(weather_data):
    def replace_invalid_values(data):
        """Replace -999.0 values with appropriate replacements"""
        if isinstance(data, list):
            # Jika data adalah list, bersihkan setiap elemen dalam list
            return [replace_invalid_values(v) for v in data]
        elif isinstance(data, dict):
            # Jika data adalah dictionary, bersihkan nilai-nilai dalam dictionary
            return {key: replace_invalid_values(value) for key, value in data.items()}
        elif isinstance(data, float) and data == -999.0:
            return None  # Ganti -999.0 dengan None (atau bisa dengan nilai lain seperti rata-rata atau 0)
        else:
            return data
    
    # Terapkan pembersihan untuk seluruh struktur data
    return replace_invalid_values(weather_data)

# Mendapatkan tanggal 10 tahun yang lalu dan hari ini
start_date = (datetime.today() - timedelta(days=365 * 10)).strftime('%Y%m%d')
end_date = datetime.today().strftime('%Y%m%d')

# Menyimpan hasil data gabungan
weather_data_combined = {}

# Mengambil data cuaca untuk setiap kecamatan di Maros dan Pangkep
for kabupaten, kecamatan_data in kecamatan_coordinates.items():
    weather_data_combined[kabupaten] = {}
    for kecamatan, coords in kecamatan_data.items():
        longitude, latitude = coords
        print(f"Fetching data for {kecamatan} in {kabupaten} from {start_date} to {end_date}...")
        weather_data = get_weather_data(longitude, latitude, start_date, end_date)

        if weather_data:
            # Bersihkan data setelah diambil
            weather_data = clean_weather_data(weather_data)
            weather_data_combined[kabupaten][kecamatan] = weather_data
            print(f"Data for {kecamatan} in {kabupaten} fetched and cleaned successfully.")
        else:
            print(f"Data for {kecamatan} in {kabupaten} not available.")

# Menyimpan data gabungan ke file JSON
with open("weather_data_combined_cleaned.json", "w") as f:
    json.dump(weather_data_combined, f, indent=4)

print("Data berhasil disimpan ke file weather_data_combined_cleaned.json")
