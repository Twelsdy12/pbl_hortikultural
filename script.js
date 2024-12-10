const API_KEY = 'd0cfc11c22534c00952121033242011'; // Ganti dengan API key Anda
const BASE_URL = 'http://localhost:3000';

// Fungsi untuk mengambil data cuaca dari API WeatherAPI
async function fetchWeatherData(location) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${location}&aqi=no`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Tidak dapat mengambil data cuaca.');
        }
        const data = await response.json();
        return {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            rainfall: data.current.precip_mm
        };
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        alert('Gagal mendapatkan data cuaca. Silakan coba lagi.');
    }
}

// Fungsi untuk memperbarui tampilan dengan data cuaca
function updateWeatherDisplay(data) {
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('rainfall').textContent = `${data.rainfall} mm`;
}

// Deteksi lokasi menggunakan Geolocation API
document.getElementById('detectLocation').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = `${position.coords.latitude},${position.coords.longitude}`;
            const weatherData = await fetchWeatherData(location);
            if (weatherData) {
                updateWeatherDisplay(weatherData);
            }
        }, (error) => {
            alert('Gagal mendeteksi lokasi. Silakan pilih lokasi manual.');
        });
    } else {
        alert('Browser Anda tidak mendukung fitur Geolokasi.');
    }
});

// Memproses lokasi manual
document.getElementById('kabupatenSelect').addEventListener('change', async function () {
    const kabupaten = this.value;
    if (kabupaten) {
        const weatherData = await fetchWeatherData(kabupaten);
        if (weatherData) {
            updateWeatherDisplay(weatherData);
        }
    }
});

// URL server lokal
const BASE_URL = 'http://localhost:3000';

async function loadProvinces() {
    try {
        const response = await fetch(`${BASE_URL}/provinces`);
        const provinces = await response.json();

        const provinceSelect = document.getElementById('province');
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.id;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading provinces:', error);
    }
}

async function loadDistricts() {
    const provinceId = document.getElementById('province').value;
    if (!provinceId) return;

    try {
        const response = await fetch(`${BASE_URL}/districts?provinceId=${provinceId}`);
        const { districts } = await response.json();

        const districtSelect = document.getElementById('district');
        districtSelect.innerHTML = '<option value="">-- Pilih Kabupaten --</option>';
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.id;
            option.textContent = district.name;
            districtSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading districts:', error);
    }
}

async function loadWeather() {
    const provinceId = document.getElementById('province').value;
    const districtId = document.getElementById('district').value;

    if (!provinceId || !districtId) return;

    try {
        const response = await fetch(`${BASE_URL}/cuaca?provinceId=${provinceId}&districtId=${districtId}`);
        const { data } = await response.json();

        const weatherElement = document.getElementById('weather');
        const weather = data.weather.data[0].value;
        weatherElement.textContent = `Cuaca: ${weather}`;
    } catch (error) {
        console.error('Error loading weather:', error);
    }
}

// Memuat daftar provinsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadProvinces);


// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
};

// Smooth scroll for navigation
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
};

// Weather data animation
const animateWeatherData = (elementId, finalValue, unit, duration = 1000) => {
    const element = document.getElementById(elementId);
    const start = 0;
    const range = finalValue - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const updateNumber = () => {
        current += increment;
        if (current >= finalValue) {
            element.textContent = `${finalValue}${unit}`;
            return;
        }
        element.textContent = `${Math.round(current)}${unit}`;
        requestAnimationFrame(updateNumber);
    };
    
    updateNumber();
};

// Typing effect for hero section
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    type();
};

// Interactive chart for weather data
const createWeatherChart = (data) => {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
};

// Form validation and submission handling
class PredictionForm {
    constructor() {
        this.form = document.getElementById('predictionForm');
        this.locationBtn = document.getElementById('detectLocation');
        this.loading = document.querySelector('.loading');
        this.resultSection = document.querySelector('.result-section');
        this.recommendationList = document.getElementById('recommendationList');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.locationBtn.addEventListener('click', this.handleLocationDetection.bind(this));
    }

    handleLocationDetection() {
        if (navigator.geolocation) {
            this.loading.style.display = 'block';
            navigator.geolocation.getCurrentPosition(
                this.handleLocationSuccess.bind(this),
                this.handleLocationError.bind(this)
            );
        } else {
            this.showNotification('Browser Anda tidak mendukung geolokasi', 'error');
        }
    }

    handleLocationSuccess(position) {
        const { latitude, longitude } = position.coords;
        this.fetchWeatherData(latitude, longitude);
    }

    handleLocationError(error) {
        this.loading.style.display = 'none';
        this.showNotification(`Error: ${error.message}`, 'error');
    }

    async fetchWeatherData(lat, lon) {
        // Simulasi fetch data cuaca
        setTimeout(() => {
            const weatherData = {
                temperature: 28,
                humidity: 75,
                rainfall: 250
            };

            this.updateWeatherDisplay(weatherData);
            this.loading.style.display = 'none';
        }, 1500);
    }

    updateWeatherDisplay(data) {
        // Animate weather data display
        animateWeatherData('temperature', data.temperature, '°C');
        animateWeatherData('humidity', data.humidity, '%');
        animateWeatherData('rainfall', data.rainfall, 'mm');
    }

    handleSubmit(e) {
        e.preventDefault();
        this.loading.style.display = 'block';

        // Simulasi analisis data
        setTimeout(() => {
            this.loading.style.display = 'none';
            this.showResults();
        }, 2000);
    }

    showResults() {
        this.resultSection.style.display = 'block';
        this.resultSection.classList.add('fade-in');

        const recommendations = [
            {
                name: 'Tomat',
                compatibility: 'Sangat Sesuai',
                description: 'Ideal untuk suhu 25-30°C dengan kelembaban sedang',
                icon: 'fa-seedling'
            },
            {
                name: 'Cabai',
                compatibility: 'Sesuai',
                description: 'Cocok untuk daerah dengan curah hujan moderat',
                icon: 'fa-pepper-hot'
            },
            {
                name: 'Terong',
                compatibility: 'Cukup Sesuai',
                description: 'Dapat tumbuh dengan baik di iklim tropis',
                icon: 'fa-carrot'
            }
        ];

        this.displayRecommendations(recommendations);
    }

    displayRecommendations(recommendations) {
        this.recommendationList.innerHTML = recommendations.map((item, index) => `
            <li class="list-group-item recommendation-item" style="animation-delay: ${index * 200}ms">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <i class="fas ${item.icon} fa-2x text-success me-3"></i>
                        <div>
                            <h6 class="mb-1">${item.name}</h6>
                            <p class="mb-1 text-muted">${item.description}</p>
                        </div>
                    </div>
                    <span class="badge bg-success">${item.compatibility}</span>
                </div>
            </li>
        `).join('');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Interactive plant cards
class PlantCard {
    constructor(element) {
        this.card = element;
        this.initializeCard();
    }

    initializeCard() {
        this.card.addEventListener('mouseover', this.handleHover.bind(this));
        this.card.addEventListener('mouseout', this.handleHoverOut.bind(this));
        this.card.addEventListener('click', this.handleClick.bind(this));
    }

    handleHover() {
        this.card.classList.add('card-hover');
    }

    handleHoverOut() {
        this.card.classList.remove('card-hover');
    }

    handleClick() {
        this.card.classList.add('card-click');
        setTimeout(() => {
            this.card.classList.remove('card-click');
        }, 200);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scroll
    smoothScroll();

    // Initialize form handling
    const predictionForm = new PredictionForm();

    // Initialize plant cards
    document.querySelectorAll('.feature-card').forEach(card => {
        new PlantCard(card);
    });

    // Add scroll animation
    window.addEventListener('scroll', animateOnScroll);

    // Initialize typing effect for hero section
    const heroText = document.querySelector('.hero-section h1');
    if (heroText) {
        heroText.innerHTML = '';
        typeWriter(heroText, 'Sistem Prediksi Tanaman Hortikultura', 100);
    }

    // Add notification system
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // Add loading indicators
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });
});

// Add custom cursor effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add parallax effect to hero section
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        hero.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    }
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

const kecamatanData = {
    maros: [
        { value: 'bontoa', name: 'Bontoa' },
        { value: 'bantimurung', name: 'Bantimurung' },
        { value: 'turikale', name: 'Turikale' },
        { value: 'camba', name: 'Camba' },
        { value: 'lau', name: 'Lau' },
        { value: 'moncongloe', name: 'Moncongloe' },
        { value: 'tanralili', name: 'Tanralili' },
    ],
    pangkep: [
        { value: 'pangkajene', name: 'Pangkajene' },
        { value: 'kepulauan', name: 'Kepulauan' },
        { value: 'marang', name: 'Ma\'rang' },
        { value: 'segeri', name: 'Segeri' },
        { value: 'segeri', name: 'Labakkang' }
    ]
};

document.getElementById('kabupatenSelect').addEventListener('change', function() {
    const selectedKabupaten = this.value;
    const kecamatanSelect = document.getElementById('kecamatanSelect');
    const kecamatanContainer = document.getElementById('kecamatanContainer');

    kecamatanSelect.innerHTML = '<option value="">Pilih Kecamatan</option>';

    if (selectedKabupaten) {
        kecamatanContainer.style.display = 'block';

        const kecamatanOptions = kecamatanData[selectedKabupaten];
        kecamatanOptions.forEach(function(kecamatan) {
            const option = document.createElement('option');
            option.value = kecamatan.value;
            option.textContent = kecamatan.name;
            kecamatanSelect.appendChild(option);
        });
    } else {
        kecamatanContainer.style.display = 'none';
    }
});