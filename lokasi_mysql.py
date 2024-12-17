import mysql.connector

# Koordinat Kecamatan Kabupaten Maros (latitude, longitude)
maros_coordinates = {
    "Turikale": [-5.0102, 119.6664],
    "Tompobulu": [-5.0291, 119.5193],
    "Tanralili": [-5.014, 119.4873],
    "Simbang": [-5.0843, 119.5891],
    "Moncongloe": [-5.2577, 119.4825],
    "Marusu": [-5.0805, 119.7543],
    "Maros Baru": [-5.0351, 119.6681],
    "Mandai": [-5.1045, 119.5604],
    "Mallawa": [-5.1844, 119.7843],
    "Lau": [-5.2180, 119.7427],
    "Cenrana": [-5.0991, 119.8183],
    "Camba": [-5.0675, 119.6891],
    "Bontoa": [-5.2987, 119.5387],
    "Bantimurung": [-5.0691, 119.7692]
}

# Koordinat Kecamatan Kabupaten Pangkep (latitude, longitude)
pangkep_coordinates = {
    "Pangkajene": [-4.9493, 119.4699],
    "Balocci": [-4.9990, 119.5381],
    "Bungoro": [-5.0763, 119.4871],
    "Labakkang": [-5.0476, 119.5073],
    "Ma'rang": [-5.1294, 119.4586],
    "Segeri": [-5.1364, 119.5462],
    "Minasa Te'ne": [-5.1045, 119.6267],
    "Tondong Tallasa": [-5.1202, 119.4709],
    "Mandalle": [-5.0600, 119.3879],
    "Liukang Tupabiring": [-5.0841, 119.2768],
    "Liukang Tupabiring Utara": [-5.1043, 119.3172],
    "Liukang Kalmas": [-5.0762, 119.2553],
    "Liukang Tangaya": [-5.0291, 119.2252]
}

# Membuat koneksi ke database MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",  # Ganti dengan username MySQL Anda
    password="",  # Ganti dengan password MySQL Anda
    database="hortikultura"  # Ganti dengan nama database Anda
)

cursor = conn.cursor()

# Query untuk menyisipkan data
insert_query = """
    INSERT INTO lokasi (nama_kecamatan, kabupaten, latitude, longitude)
    VALUES (%s, %s, %s, %s)
"""

# Fungsi untuk memasukkan data kecamatan Maros
for kecamatan, koordinat in maros_coordinates.items():
    latitude, longitude = koordinat
    cursor.execute(insert_query, (kecamatan, 'Maros', latitude, longitude))

# Fungsi untuk memasukkan data kecamatan Pangkep
for kecamatan, koordinat in pangkep_coordinates.items():
    latitude, longitude = koordinat
    cursor.execute(insert_query, (kecamatan, 'Pangkep', latitude, longitude))

# Menyimpan perubahan ke database
conn.commit()

# Menutup koneksi
cursor.close()
conn.close()

print("Data koordinat berhasil dimasukkan ke dalam database.")
