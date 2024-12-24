document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();

        if (username === "" || email === "") {
            alert("Semua kolom harus diisi.");
            return;
        }

        if (!validateEmail(email)) {
            alert("E-mail tidak valid.");
            return;
        }

        // Jika validasi berhasil, redirect ke halaman berikutnya
        alert("Login berhasil!");
        loginForm.submit();
    });

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
});
