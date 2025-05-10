// index.js dengan router terpisah
import './login.js';
import './register.js';
import { updateUIBasedOnLoginStatus, handleLogout } from './dashboard.js';
import { Auth } from './js/controllers/auth.js';
import Router from './js/services/routes.js';

function getElementByIdSafe(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element dengan ID "${id}" tidak ditemukan`);
    return null;
  }
  return element;
}

// Fungsi menampilkan halaman landing 
function showLanding() {
  // Gunakan fungsi bantuan
  const landingSection = getElementByIdSafe('landingSection');
  const loginBox = getElementByIdSafe('loginBox');
  const registerBox = getElementByIdSafe('registerBox');
  const dashboardSection = getElementByIdSafe('dashboardSection');
  
  if (landingSection) landingSection.classList.remove('hidden');
  if (loginBox) loginBox.classList.add('hidden');
  if (registerBox) registerBox.classList.add('hidden');
  if (dashboardSection) dashboardSection.classList.add('hidden');
}

// Fungsi menampilkan halaman login
function showLogin() {
  const landingSection = getElementByIdSafe('landingSection');
  const loginBox = getElementByIdSafe('loginBox');
  const registerBox = getElementByIdSafe('registerBox');
  const dashboardSection = getElementByIdSafe('dashboardSection');
  
  if (landingSection) landingSection.classList.add('hidden');
  if (loginBox) loginBox.classList.remove('hidden');
  if (registerBox) registerBox.classList.add('hidden');
  if (dashboardSection) dashboardSection.classList.add('hidden');
}

// Fungsi menampilkan halaman register
function showRegister() {
  const landingSection = getElementByIdSafe('landingSection');
  const loginBox = getElementByIdSafe('loginBox');
  const registerBox = getElementByIdSafe('registerBox');
  const dashboardSection = getElementByIdSafe('dashboardSection');
  
  if (landingSection) landingSection.classList.add('hidden');
  if (loginBox) loginBox.classList.add('hidden');
  if (registerBox) registerBox.classList.remove('hidden');
  if (dashboardSection) dashboardSection.classList.add('hidden');
}

// Fungsi menampilkan halaman dashboard
function showDashboard() {
  const landingSection = getElementByIdSafe('landingSection');
  const loginBox = getElementByIdSafe('loginBox');
  const registerBox = getElementByIdSafe('registerBox');
  const dashboardSection = getElementByIdSafe('dashboardSection');
  
  if (landingSection) landingSection.classList.add('hidden');
  if (loginBox) loginBox.classList.add('hidden');
  if (registerBox) registerBox.classList.add('hidden');
  if (dashboardSection) dashboardSection.classList.remove('hidden');
}

// Fungsi untuk menangani klik pada header logo
function handleBrandClick(e) {
  e.preventDefault();
  
  // Cek status login untuk menentukan halaman yang ditampilkan
  const isLoggedIn = !!localStorage.getItem("name");
  
  if (isLoggedIn) {
    // Jika user sudah login, arahkan ke dashboard
    window.location.hash = '#dashboard';
  } else {
    // Jika user belum login, arahkan ke landing page
    window.location.hash = '#home';
  }
  
  // Scroll ke atas halaman
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  // Setup event listener untuk tombol-tombol navigasi
  const logoutBtn = getElementByIdSafe('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Auth.logout();
      window.location.hash = '#home'; // Redirect ke home setelah logout
    });
  }

  const loginBtn = getElementByIdSafe('loginBtn');
  const registerBtn = getElementByIdSafe('registerBtn');
  const navbarBrand = document.querySelector('.navbar-brand');

  if (loginBtn) loginBtn.addEventListener('click', () => {
    window.location.hash = '#login';
  });
  
  if (registerBtn) registerBtn.addEventListener('click', () => {
    window.location.hash = '#register';
  });
  
  if (navbarBrand) navbarBrand.addEventListener('click', handleBrandClick);

  // Inisialisasi router
  Router.init();
  
  // Update UI berdasarkan status login
  updateUIBasedOnLoginStatus();
});

// 🔥 Ekspose fungsi ke global agar bisa dipanggil dari HTML dan login.js
window.showLanding = showLanding;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showDashboard = showDashboard;
window.updateUIBasedOnLoginStatus = updateUIBasedOnLoginStatus;
window.handleBrandClick = handleBrandClick;

// Export fungsi untuk digunakan di file lain, seperti routes.js
export { showLanding, showLogin, showRegister, showDashboard };