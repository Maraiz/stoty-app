// dom.js - Cache DOM elements untuk menghindari querySelector berulang
export const DOM = {
    // Cache elemen saat DOM fully loaded
    init() {
      // User elements
      this.greet = document.getElementById("dashboardGreeting");
      this.logoutBtn = document.getElementById("logoutBtn");
      
      // Form elements
      this.storyForm = document.getElementById("addStoryForm");
      this.description = document.getElementById("storyDescription");
      this.photoInput = document.getElementById("storyPhoto");
      this.latInput = document.getElementById("storyLat");
      this.lonInput = document.getElementById("storyLon");
      this.getLocationBtn = document.getElementById("getLocationBtn");
      this.loadingIndicator = document.getElementById("loadingIndicator");
      
      // Image preview elements
      this.imagePreview = document.getElementById("imagePreview");
      this.uploadPlaceholder = document.getElementById("uploadPlaceholder");
      this.uploadFileBtn = document.getElementById("uploadFileBtn");
      
      // Camera elements
      this.cameraFeed = document.getElementById("cameraFeed");
      this.cameraCanvas = document.getElementById("cameraCanvas");
      this.capturedImage = document.getElementById("capturedImage");
      this.cameraPreview = document.getElementById("cameraPreview");
      this.takePictureBtn = document.getElementById("takePictureBtn");
      this.usePhotoBtn = document.getElementById("usePhotoBtn");
      this.retakeBtn = document.getElementById("retakeBtn");
      this.deletePhotoBtn = document.getElementById('deletePhotoBtn');
      
      // Map element
      this.mapIframe = document.getElementById("mapIframe");
      
      // Story display elements
      this.storyContainer = document.querySelector('.book-showcase');
      this.storyModal = document.getElementById('storyModal');
      this.modalContent = document.getElementById('modalContent');
      this.closeModalBtn = document.querySelector('.close-modal');
      
      // Animation elements
      this.statCards = document.querySelectorAll('.stat-card');
      this.bookCards = document.querySelectorAll('.book-card');
      
      return this;
    }
  };