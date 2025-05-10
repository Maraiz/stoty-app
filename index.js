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
function showLanding() {
  const landingSection = getElementByIdSafe('landingSection');
  const loginBox = getElementByIdSafe('loginBox');
  const registerBox = getElementByIdSafe('registerBox');
  const dashboardSection = getElementByIdSafe('dashboardSection');
  
  if (landingSection) landingSection.classList.remove('hidden');
  if (loginBox) loginBox.classList.add('hidden');
  if (registerBox) registerBox.classList.add('hidden');
  if (dashboardSection) dashboardSection.classList.add('hidden');
}

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

function handleBrandClick(e) {
  e.preventDefault();
  
  const isLoggedIn = !!localStorage.getItem("name");
  
  if (isLoggedIn) {
    window.location.hash = '#dashboard';
  } else {
    window.location.hash = '#home';
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = getElementByIdSafe('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Auth.logout();
      window.location.hash = '#home';
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

  Router.init();
  
  updateUIBasedOnLoginStatus();
});

window.showLanding = showLanding;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showDashboard = showDashboard;
window.updateUIBasedOnLoginStatus = updateUIBasedOnLoginStatus;
window.handleBrandClick = handleBrandClick;

export { showLanding, showLogin, showRegister, showDashboard };