import json
from collections import defaultdict

# Membaca file JSON
with open('weather_data_combined.json') as f:
    weather_data = json.load(f)

# Menyimpan total curah hujan per kecamatan, per bulan, dan per tahun
curah_hujan_per_kecamatan = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))

# Menyusun data per kecamatan dan menghitung total curah hujan per bulan dan per tahun
for kecamatan, kecamatan_data in weather_data['Maros'].items():
    if 'properties' in kecamatan_data and 'parameter' in kecamatan_data['properties']:
        # Ambil data curah hujan PRECTOTCORR per tanggal
        curah_hujan_harian = kecamatan_data['properties']['parameter']['PRECTOTCORR']
        
        # Menghitung total curah hujan per bulan dan per tahun
        for tanggal, curah_hujan in curah_hujan_harian.items():
            tahun = tanggal[:4]  # Mengambil tahun (4 karakter pertama)
            bulan = tanggal[4:6]  # Mengambil bulan (2 karakter setelah tahun)
            
            # Menambahkan curah hujan untuk kecamatan, bulan, dan tahun yang sesuai
            curah_hujan_per_kecamatan[kecamatan][tahun][bulan] += curah_hujan

# Menampilkan hasil
for kecamatan, tahun_data in curah_hujan_per_kecamatan.items():
    print(f"\nKecamatan {kecamatan}:")
    for tahun, bulan_data in tahun_data.items():
        print(f"  Tahun {tahun}:")
        for bulan, total_curah_hujan in bulan_data.items():
            print(f"    Bulan {bulan}: {total_curah_hujan:.2f} mm/bulan")
