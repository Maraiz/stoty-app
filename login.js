const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    Swal.fire({
      icon: 'warning',
      title: 'Form tidak lengkap',
      text: 'Mohon isi email dan password.',
    });
    return;
  }

  try {
    Swal.fire({
      title: 'Sedang login...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    Swal.close();

    if (response.ok && !result.error) {
      localStorage.setItem("token", result.loginResult.token);
      localStorage.setItem("name", result.loginResult.name);
      localStorage.setItem("userId", result.loginResult.userId);

      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang, ${result.loginResult.name}!`
      }).then(() => {
        window.location.reload();

        const dashboard = document.getElementById('dashboardSection');
        const landing = document.getElementById('landingSection');
        const loginBox = document.getElementById('loginBox');
        const registerBox = document.getElementById('registerBox');

        if (dashboard) dashboard.classList.remove('hidden');
        if (landing) landing.classList.add('hidden');
        if (loginBox) loginBox.classList.add('hidden');
        if (registerBox) registerBox.classList.add('hidden');

        const greeting = document.getElementById('dashboardGreeting');
        if (greeting) greeting.textContent = `Selamat datang, ${result.loginResult.name}!`;
        if (typeof updateUIBasedOnLoginStatus === 'function') {
          updateUIBasedOnLoginStatus();
        }
      });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Email atau password salah. Silakan coba lagi.',
      });
    }

  } catch (error) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan',
      text: error.message || 'Gagal terhubung ke server.',
    });
  }
});
