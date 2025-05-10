export const Auth = {
    token: localStorage.getItem('token'),
    userName: localStorage.getItem('name'),
    
    checkAuth() {
      if (!this.userName || !this.token) {
        window.location.href = "index.html";
      }
      return true;
    },
    
    logout() {
      Swal.fire({
        icon: 'question',
        title: 'Konfirmasi Logout',
        text: 'Apakah Anda yakin ingin keluar dari aplikasi?',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          
          Swal.fire({
            icon: 'success',
            title: 'Logout Berhasil',
            text: 'Kamu telah keluar dari aplikasi.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#4f46e5',
          }).then(() => {
            window.location.href = "index.html";
          });
        }
      });
    }
};