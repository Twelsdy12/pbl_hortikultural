import mysql.connector

# Koneksi ke database MySQL
conn = mysql.connector.connect(
    host="localhost",         # Ganti dengan host database Anda
    user="root",              # Ganti dengan username MySQL Anda
    password="",      # Ganti dengan password MySQL Anda
    database="data_web"       # Ganti dengan nama database Anda
)

cursor = conn.cursor()

# Query SQL untuk mendapatkan ID Tanaman dan Skor Kecocokan
query = """
    SELECT 
        pr.plant_id, 
        calculate_suitability_score(
            cd.suhu_min, 
            cd.kelembapan_min, 
            cd.curah_hujan,
            pr.suhu_min, 
            pr.suhu_max, 
            pr.kelembapan_min, 
            pr.kelembapan_max, 
            pr.curah_hujan_min, 
            pr.curah_hujan_max, 
            DAY(LAST_DAY(cd.tanggal))
        ) AS suitability_score
    FROM 
        plant_requirements pr
    JOIN 
        climate_data cd ON cd.kecamatan_id = %s
    WHERE 
        cd.tanggal BETWEEN %s AND %s;
"""

# Eksekusi query dengan parameter
kecamatan_id = 1  # Ganti dengan ID kecamatan yang relevan
start_date = '2023-11-01'  # Ganti dengan tanggal mulai
end_date = '2023-12-31'  # Ganti dengan tanggal akhir

cursor.execute(query, (kecamatan_id, start_date, end_date))

# Ambil hasilnya
results = cursor.fetchall()

# Menampilkan hasil dalam format yang diinginkan
for row in results:
    plant_id, suitability_score = row
    print(f"Plant ID: {plant_id}, Skor Kecocokan: {suitability_score:.2f}")

# Menutup koneksi
cursor.close()
conn.close()
