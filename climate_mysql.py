import json
import mysql.connector
from datetime import datetime

# Membaca data cuaca dari file JSON
with open("weather_data_combined_cleaned.json", "r") as f:
    weather_data_combined_cleaned = json.load(f)

# Koneksi ke database MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="data_web"
)

cursor = db.cursor()

# Menyisipkan data cuaca ke tabel climate_data
for kabupaten, kecamatan_data in weather_data_combined_cleaned.items():
    for kecamatan, weather_data in kecamatan_data.items():
        # Akses data cuaca berdasarkan kecamatan
        parameters = weather_data['properties']['parameter']
        
        # Loop melalui setiap tanggal dalam data
        for date, suhu_max in parameters['T2M_MAX'].items():
            tanggal = datetime.strptime(date, '%Y%m%d').date()
            suhu_max = suhu_max
            suhu_min = parameters['T2M_MIN'][date]
            kelembapan_min = parameters['RH2M'][date]
            kelembapan_max = kelembapan_min  # Misalnya jika tidak ada kelembapan_max, pakai nilai yang sama
            curah_hujan = parameters['PRECTOTCORR'][date]

            # Mendapatkan kecamatan_id dari nama kecamatan
            cursor.execute("SELECT kecamatan_id FROM kecamatan WHERE nama_kecamatan = %s", (kecamatan,))
            kecamatan_id = cursor.fetchone()[0]

            # Menyisipkan data cuaca ke dalam tabel
            cursor.execute("""
                INSERT INTO climate_data (kecamatan_id, tanggal, suhu_max, suhu_min, kelembapan_min, kelembapan_max, curah_hujan)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (kecamatan_id, tanggal, suhu_max, suhu_min, kelembapan_min, kelembapan_max, curah_hujan))

        db.commit()

cursor.close()
db.close()

print("Data cuaca berhasil disimpan ke tabel climate_data.")
