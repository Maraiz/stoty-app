// routes.js - Mengelola routing berbasis hash dalam SPA

// Import fungsi navigasi dari file lain jika perlu
import { showLanding, showLogin, showRegister, showDashboard } from '../../index.js';
import { StoryController } from '../controllers/story.js';
import { PageTransition } from './transition.js';

// Definisi objek router
const Router = {
  // Mendefinisikan route dan handler-nya
  routes: {
    'home': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        PageTransition.transition(() => {
          if (isLoggedIn) {
            showDashboard();
          } else {
            showLanding();
          }
        });
      }
    },
    'login': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        if (!isLoggedIn) {
          PageTransition.transition(() => {
            showLogin();
          });
        } else {
          // Redirect ke dashboard jika sudah login
          window.location.hash = '#dashboard';
        }
      }
    },
    'register': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        if (!isLoggedIn) {
          PageTransition.transition(() => {
            showRegister();
          });
        } else {
          // Redirect ke dashboard jika sudah login
          window.location.hash = '#dashboard';
        }
      }
    },
    'dashboard': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        if (isLoggedIn) {
          PageTransition.transition(() => {
            showDashboard();
            // Refresh data cerita jika fungsi tersedia
            if (typeof StoryController !== 'undefined' && StoryController.getStories) {
              StoryController.getStories();
            }
          });
        } else {
          // Redirect ke login jika belum login
          window.location.hash = '#login';
        }
      },
      // Opsional: definisi untuk sub-routes
      subroutes: {
        'stories': function() {
          // Menampilkan daftar cerita
          PageTransition.transition(() => {
            showDashboard();
            // Logika tambahan untuk melihat daftar cerita
          });
        },
        'profile': function() {
          // Menampilkan profil
          PageTransition.transition(() => {
            showDashboard();
            // Logika tambahan untuk melihat profil
          });
        }
      }
    }
  },
  
  // Fungsi untuk menangani perubahan hash
  handleHashChange: function() {
    // Ambil hash dari URL (hapus karakter # diawal)
    let hash = window.location.hash.substring(1);
    
    // Jika hash kosong, gunakan 'home' sebagai default
    if (!hash) {
      hash = 'home';
    }
    
    // Periksa apakah hash mengandung subroute (format: 'mainroute/subroute')
    const hashParts = hash.split('/');
    const mainRoute = hashParts[0];
    const subRoute = hashParts.length > 1 ? hashParts[1] : null;
    
    // Cek apakah route ada
    if (this.routes[mainRoute]) {
      // Jika ada subroute dan route memiliki subroutes
      if (subRoute && this.routes[mainRoute].subroutes && this.routes[mainRoute].subroutes[subRoute]) {
        // Panggil handler untuk subroute
        this.routes[mainRoute].subroutes[subRoute]();
      } else {
        // Panggil handler untuk route utama
        this.routes[mainRoute].handler();
      }
    } else {
      // Route tidak ditemukan, redirect ke home
      console.warn(`Route '${hash}' tidak ditemukan, redirect ke home`);
      window.location.hash = '#home';
    }
  },
  
  // Inisialisasi router
  init: function() {
    // Set event listener untuk hashchange
    window.addEventListener('hashchange', () => this.handleHashChange());
    
    // Tangani hash awal saat halaman dimuat
    this.handleHashChange();
    
    // Log inisialisasi router dengan info dukungan View Transition
    if (PageTransition.isSupported()) {
      console.log('Router initialized with View Transition support');
    } else {
      console.log('Router initialized without View Transition support (browser tidak mendukung)');
    }
  }
};

// Export router
export default Router;