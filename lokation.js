document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert('Geolokasi tidak didukung oleh browser Anda.');
    }
});

function showPosition(position) {
    document.getElementById('latitude').textContent = position.coords.latitude;
    document.getElementById('longitude').textContent = position.coords.longitude;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Pengguna menolak permintaan geolokasi.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Informasi lokasi tidak tersedia.');
            break;
        case error.TIMEOUT:
            alert('Permintaan untuk mendapatkan lokasi melebihi waktu.');
            break;
        case error.UNKNOWN_ERROR:
            alert('Terjadi kesalahan yang tidak diketahui.');
            break;
    }
}
