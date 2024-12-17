import mysql.connector

# Koneksi ke database
connection = mysql.connector.connect(
    host="localhost",  # Ganti dengan host database Anda
    user="root",   # Ganti dengan username MySQL Anda
    password="",  # Ganti dengan password MySQL Anda
    database="data_web"  # Ganti dedata_webngan nama database Anda
)

cursor = connection.cursor()

# Definisikan nilai variabel yang diperlukan
kecamatan_id = 1       # Ganti dengan ID kecamatan yang sesuai
tahun = 2024           # Ganti dengan tahun yang sesuai
bulan = 11             # Ganti dengan bulan yang sesuai
temperature = 25.0     # Ganti dengan suhu rata-rata
humidity = 85.0        # Ganti dengan kelembapan rata-rata
suhu_min = 20.0        # Ganti dengan batas suhu minimum tanaman
suhu_max = 30.0        # Ganti dengan batas suhu maksimum tanaman
kelembapan_min = 70.0  # Ganti dengan batas kelembapan minimum tanaman
kelembapan_max = 90.0  # Ganti dengan batas kelembapan maksimum tanaman
curah_hujan_min = 100  # Ganti dengan batas curah hujan minimum tanaman (mm/bulan)
curah_hujan_max = 200  # Ganti dengan batas curah hujan maksimum tanaman (mm/bulan)

# Menyiapkan output untuk skor kecocokan
suitability_score = 0

# Memanggil stored procedure untuk menghitung skor kecocokan
cursor.callproc('calculate_suitability_score_procedure', 
                (kecamatan_id, tahun, bulan, temperature, humidity, suhu_min, suhu_max, kelembapan_min, kelembapan_max, curah_hujan_min, curah_hujan_max, suitability_score))

# Mendapatkan hasil dari stored procedure
for result in cursor.stored_results():
    suitability_score = result.fetchone()[0]
    print(f"Skor Kecocokan: {suitability_score}")

cursor.close()
connection.close()

