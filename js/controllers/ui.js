// ui.js - Mengelola interface dan animasi
import { DOM } from '../utils/dom.js';
import { Auth } from './auth.js';

export const UI = {
  loadGreeting() {
    const hour = new Date().getHours();
    let greeting = "Selamat datang";

    if (hour < 12) {
      greeting = "Selamat pagi";
    } else if (hour < 15) {
      greeting = "Selamat siang";
    } else if (hour < 19) {
      greeting = "Selamat sore";
    } else {
      greeting = "Selamat malam";
    }

    DOM.greet.innerHTML = `${greeting} di dashboard, <strong>${Auth.userName}</strong>!`;
  },
  
  animateElements() {
    DOM.statCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 * (index + 1));
    });

    DOM.bookCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 300 + (100 * index));
    });
  },
  
  showLoading() {
    DOM.loadingIndicator.style.display = "block";
  },
  
  hideLoading() {
    DOM.loadingIndicator.style.display = "none";
  },
  
  showError(message) {
    Swal.fire("Error", message || "Terjadi kesalahan.", "error");
  },
  
  showSuccess(message) {
    Swal.fire("Berhasil", message || "Operasi berhasil.", "success");
  },
  
  resetStoryForm() {
    DOM.storyForm.reset();
    DOM.imagePreview.style.display = "none";
    DOM.uploadPlaceholder.style.display = "block";
  }
};