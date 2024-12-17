import mysql.connector

# Koneksi ke database MySQL
conn = mysql.connector.connect(
    host='localhost',
    user='root',  # Ganti dengan username MySQL Anda
    password='',  # Ganti dengan password MySQL Anda
    database='hortikultura'  # Ganti dengan nama database Anda
)

cursor = conn.cursor()

# Data yang akan dimasukkan
plant_data = [
    ('Padi', 19, 27, 33, 90, 175, 500),
    ('Jagung', 14, 30, 78, 83, 85, 400),
    ('Kedelai', 23, 30, 70, 100, 100, 400),
    ('Bawang Merah', 25, 32, 80, 90, 25, 208),
    ('Cabai Merah', 25, 27, 60, 80, 0, 200)
]

# Query untuk memasukkan data
query = """
INSERT INTO plant_requirements (nama_tanaman, suhu_min, suhu_max, kelembapan_min, kelembapan_max, curah_hujan_min, curah_hujan_max)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

# Memasukkan data ke tabel
cursor.executemany(query, plant_data)

# Commit perubahan dan menutup koneksi
conn.commit()
cursor.close()
conn.close()

print("Data berhasil dimasukkan!")
