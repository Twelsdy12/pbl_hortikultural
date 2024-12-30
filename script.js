document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const registerForm = document.querySelector("#registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = users.some(user => user.username === username && user.email === email);

            if (!userExists) {
                alert("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
                return;
            }

            alert("Login berhasil!");
            window.location.href = "user-dashboard.html";
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("registerUsername").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.email === email)) {
                alert("E-mail sudah terdaftar.");
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registrasi berhasil! Silakan login.");
            window.location.href = "index.html";
        });
    }
});
