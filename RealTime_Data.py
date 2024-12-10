import requests

# Gantilah dengan API Key
api_key = "39911b7725c22a836e1220eca0a4a5f7"

# Koordinat Kecamatan Kabupaten Maros (tiga titik per kecamatan)
kecamatan_maros = {
    "Turikale": [(-5.0102, 119.6664), (-5.0150, 119.6700), (-5.0050, 119.6600)],
    "Tompobulu": [(-5.0291, 119.5193), (-5.0300, 119.5205), (-5.0315, 119.5180)],
    "Tanralili": [(-5.0140, 119.4873), (-5.0160, 119.4900), (-5.0130, 119.4850)],
    "Simbang": [(-5.0843, 119.5891), (-5.0860, 119.5905), (-5.0820, 119.5880)],
    "Moncongloe": [(-5.2577, 119.4825), (-5.2600, 119.4850), (-5.2595, 119.4805)],
    "Marusu": [(-5.0805, 119.7543), (-5.0820, 119.7555), (-5.0835, 119.7530)],
    "Maros Baru": [(-5.0351, 119.6681), (-5.0365, 119.6700), (-5.0340, 119.6675)],
    "Mandai": [(-5.1045, 119.5604), (-5.1060, 119.5610), (-5.1055, 119.5585)],
    "Mallawa": [(-5.1844, 119.7843), (-5.1855, 119.7855), (-5.1835, 119.7835)],
    "Lau": [(-5.2180, 119.7427), (-5.2195, 119.7445), (-5.2175, 119.7410)],
    "Cenrana": [(-5.0991, 119.8183), (-5.1005, 119.8200), (-5.0980, 119.8175)],
    "Camba": [(-5.0675, 119.6891), (-5.0685, 119.6905), (-5.0660, 119.6880)],
    "Bontoa": [(-5.2987, 119.5387), (-5.3000, 119.5400), (-5.2995, 119.5370)],
    "Bantimurung": [(-5.0691, 119.7692), (-5.0700, 119.7705), (-5.0680, 119.7685)]
}

# Koordinat Kecamatan Kabupaten Pangkep (tiga titik per kecamatan)
kecamatan_pangkep = {
    "Pangkajene": [(-4.9493, 119.4699), (-4.9505, 119.4710), (-4.9485, 119.4680)],
    "Balocci": [(-4.9990, 119.5381), (-5.0005, 119.5390), (-5.0015, 119.5365)],
    "Bungoro": [(-5.0763, 119.4871), (-5.0780, 119.4890), (-5.0770, 119.4860)],
    "Labakkang": [(-5.0476, 119.5073), (-5.0485, 119.5080), (-5.0465, 119.5055)],
    "Ma'rang": [(-5.1294, 119.4586), (-5.1300, 119.4600), (-5.1310, 119.4575)],
    "Segeri": [(-5.1364, 119.5462), (-5.1375, 119.5470), (-5.1380, 119.5455)],
    "Minasa Te'ne": [(-5.1045, 119.6267), (-5.1060, 119.6280), (-5.1035, 119.6255)],
    "Tondong Tallasa": [(-5.1202, 119.4709), (-5.1215, 119.4715), (-5.1190, 119.4695)],
    "Mandalle": [(-5.0600, 119.3879), (-5.0610, 119.3890), (-5.0585, 119.3865)],
    "Liukang Tupabiring": [(-5.0841, 119.2768), (-5.0850, 119.2775), (-5.0825, 119.2755)],
    "Liukang Tupabiring Utara": [(-5.1043, 119.3172), (-5.1060, 119.3185), (-5.1035, 119.3160)],
    "Liukang Kalmas": [(-5.0762, 119.2553), (-5.0780, 119.2560), (-5.0750, 119.2545)],
    "Liukang Tangaya": [(-5.0291, 119.2252), (-5.0300, 119.2265), (-5.0285, 119.2245)]
}

# URL untuk mengakses data cuaca
def get_weather_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        temperature = data['main']['temp']  # Suhu
        humidity = data['main']['humidity']  # Kelembapan
        rainfall = data.get('rain', {}).get('1h', 0)  # Curah hujan (dalam 1 jam)
        return temperature, humidity, rainfall
    else:
        return None

# Menampilkan data cuaca untuk setiap kecamatan di Maros
for kecamatan, koordinat_list in kecamatan_maros.items():
    print(f"Data Cuaca Kecamatan {kecamatan}, Maros:")
    for lat, lon in koordinat_list:
        temperature, humidity, rainfall = get_weather_data(lat, lon)
        if temperature is not None:
            print(f"Titik Koordinat ({lat}, {lon}) - Suhu: {temperature}°C, Kelembapan: {humidity}%, Curah Hujan: {rainfall} mm")
        else:
            print(f"Titik Koordinat ({lat}, {lon}) - Data tidak tersedia.")
    print()

# Menampilkan data cuaca untuk setiap kecamatan di Pangkep
for kecamatan, koordinat_list in kecamatan_pangkep.items():
    print(f"Data Cuaca Kecamatan {kecamatan}, Pangkep:")
    for lat, lon in koordinat_list:
        temperature, humidity, rainfall = get_weather_data(lat, lon)
        if temperature is not None:
            print(f"Titik Koordinat ({lat}, {lon}) - Suhu: {temperature}°C, Kelembapan: {humidity}%, Curah Hujan: {rainfall} mm")
        else:
            print(f"Titik Koordinat ({lat}, {lon}) - Data tidak tersedia.")
    print()





