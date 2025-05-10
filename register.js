const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = registerForm.name.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();

  if (!name || !email || !password) {
    Swal.fire({
      icon: 'warning',
      title: 'Form tidak lengkap',
      text: 'Mohon isi nama, email, dan password.',
    });
    return;
  }

  try {
    Swal.fire({
      title: 'Sedang mendaftar...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const response = await fetch("https://story-api.dicoding.dev/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();
    Swal.close();

    if (!result.error) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pendaftaran berhasil, silakan login.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        showLogin();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: result.message || 'Pendaftaran gagal.',
        confirmButtonColor: '#d33',
      });
    }
  } catch (error) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'Terjadi kesalahan: ' + error.message,
      confirmButtonColor: '#d33',
    });
  }
});