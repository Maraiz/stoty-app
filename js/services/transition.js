export class PageTransition {
    static isSupported() {
      return Boolean(document.startViewTransition);
    }
  
    static async transition(updateDOM) {
      if (!this.isSupported()) {
        updateDOM();
        return;
      }
      
      try {
        const transition = document.startViewTransition(updateDOM);
        await transition.finished;
      } catch (error) {
        console.error('Transisi gagal:', error);
        updateDOM();
      }
    }
  }