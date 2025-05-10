// js/services/transition.js
export class PageTransition {
    // Metode untuk mengecek apakah browser mendukung View Transition API
    static isSupported() {
      return Boolean(document.startViewTransition);
    }
    
    // Metode untuk melakukan transisi halaman
    static async transition(updateDOM) {
      // Jika browser tidak mendukung View Transition API, langsung update DOM saja
      if (!this.isSupported()) {
        updateDOM();
        return;
      }
      
      try {
        // Gunakan View Transition API
        const transition = document.startViewTransition(updateDOM);
        
        // Tunggu hingga transisi selesai
        await transition.finished;
      } catch (error) {
        console.error('Transisi gagal:', error);
        // Jika gagal, tetap update DOM tanpa transisi
        updateDOM();
      }
    }
  }