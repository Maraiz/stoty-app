// story.js - Mengelola cerita dan interaksi dengan API
import { DOM } from '../utils/dom.js';
import { Auth } from './auth.js';
import { UI } from './ui.js';
import { addStory } from '../services/api.js';
import { CameraController } from './camera.js';

let mediaRecorder;
let audioChunks = [];
let audioBlob = null;
let detailMap = null;

export const StoryController = {
  init() {
    this.setupEvents();
    this.setupImagePreview();
    this.setupAudioRecording();
  },

  async submitStory(event) {
    event.preventDefault();

    const description = DOM.description.value;
    const photo = DOM.photoInput.files[0];
    const lat = DOM.latInput.value;
    const lon = DOM.lonInput.value;

    if (!photo) return UI.showError("Harap unggah foto terlebih dahulu");
    if (photo.size > 1_000_000) return UI.showError("Ukuran foto maksimal 1MB");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat) formData.append("lat", lat);
    if (lon) formData.append("lon", lon);

    UI.showLoading();

    try {
      await addStory({ token: Auth.token, formData });
      UI.hideLoading();
      UI.showSuccess("Cerita berhasil dikirim!");
      UI.resetStoryForm();

      if (CameraController?.resetCamera) CameraController.resetCamera();

      if (DOM.imagePreview) {
        DOM.imagePreview.src = "#";
        DOM.imagePreview.style.display = "none";
      }

      if (DOM.uploadPlaceholder) {
        DOM.uploadPlaceholder.style.display = "block";
      }

      if (DOM.cameraPreview) {
        DOM.cameraPreview.style.display = "none";
      }

      if (DOM.capturedImage) {
        DOM.capturedImage.src = "#";
      }

      setTimeout(() => window.location.reload(), 1500);
      this.getStories();
    } catch (error) {
      UI.hideLoading();
      UI.showError(error.message || "Terjadi kesalahan saat mengirim cerita.");
    }
  },

  async getStories() {
    DOM.storyContainer.innerHTML = '<p>Loading stories...</p>';

    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      DOM.storyContainer.innerHTML = '';

      data.listStory.forEach((story) => {
        const storyCard = document.createElement('div');
        storyCard.classList.add('book-card');
        storyCard.setAttribute('data-id', story.id);
        storyCard.innerHTML = `
          <div class="book-cover">
            <img src="${story.photoUrl}" alt="${story.name}" />
          </div>
          <div class="book-info">
            <h3 class="book-title">${story.name}</h3>
            <p class="book-author">${new Date(story.createdAt).toLocaleString()}</p>
            <p class="book-stats">${story.description}</p>
          </div>
        `;
        storyCard.addEventListener('click', () => this.getStoryDetail(story.id));
        DOM.storyContainer.appendChild(storyCard);
      });
    } catch (error) {
      DOM.storyContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
  },

  async getStoryDetail(storyId) {
    try {
      DOM.modalContent.innerHTML = `
        <div class="loading-spinner" style="display: flex;">
          <i class="fa fa-spinner fa-pulse fa-3x"></i>
          <p>Memuat detail cerita...</p>
        </div>
      `;

      DOM.storyModal.classList.add('show');
      document.body.style.overflow = 'hidden';

      const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${storyId}`, {
        headers: {
          Authorization: `Bearer ${Auth.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const { name, createdAt, photoUrl, description, lat, lon } = data.story;
      const formattedDate = new Date(createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      DOM.modalContent.innerHTML = `
        <div class="modal-story-header">
          <div>
            <h2 class="modal-story-title">${name}</h2>
            <p class="modal-story-date">
              <i class="fa fa-calendar-o"></i> ${formattedDate}
            </p>
          </div>
        </div>
        <img src="${photoUrl}" alt="${name}" class="modal-story-image" />
        <div class="modal-story-description">${description}</div>
        <div class="modal-story-meta">
          <div class="modal-story-meta-item">
            <i class="fa fa-user"></i> ${name}
          </div>
        </div>
        ${lat && lon ? `
          <div class="modal-map-container">
            <h3 style="margin-bottom: 10px; color: #4f46e5;">
              <i class="fa fa-map-marker"></i> Lokasi Cerita
            </h3>
            <div id="detail-map" style="height: 300px; border-radius: 12px;"></div>
          </div>
        ` : ''}
      `;

      // Initialize Leaflet map for story detail if coordinates are available
      if (lat && lon) {
        setTimeout(() => {
          this.initDetailMap(parseFloat(lat), parseFloat(lon), name);
        }, 100);
      }
    } catch (error) {
      console.error('Gagal ambil detail:', error.message);
      DOM.modalContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <i class="fa fa-exclamation-circle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
          <h3>Gagal memuat detail</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  },

  initDetailMap(lat, lon, name) {
    // Clean up previous map instance if it exists
    if (detailMap) {
      detailMap.remove();
      detailMap = null;
    }

    // Create new map instance
    detailMap = L.map('detail-map').setView([lat, lon], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(detailMap);

    // Add a marker for the story location
    const marker = L.marker([lat, lon])
      .addTo(detailMap)
      .bindPopup(name || 'Lokasi Cerita')
      .openPopup();

    // Make sure map renders correctly
    setTimeout(() => {
      detailMap.invalidateSize();
    }, 100);
  },

  // Tambahkan ini ke dalam setupModalEvents di StoryController
  setupModalEvents() {
    // Pastikan referensi DOM untuk closeModalBtn sudah benar
    DOM.closeModalBtn = document.querySelector('.close-modal');

    DOM.closeModalBtn.addEventListener('click', () => {
      DOM.storyModal.classList.remove('show');
      document.body.style.overflow = 'auto';

      // Clean up map instance when modal is closed
      if (detailMap) {
        detailMap.remove();
        detailMap = null;
      }
    });

    window.addEventListener('click', (e) => {
      if (e.target === DOM.storyModal) {
        DOM.storyModal.classList.remove('show');
        document.body.style.overflow = 'auto';

        // Clean up map instance when modal is closed
        if (detailMap) {
          detailMap.remove();
          detailMap = null;
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.storyModal.classList.contains('show')) {
        DOM.storyModal.classList.remove('show');
        document.body.style.overflow = 'auto';

        // Clean up map instance when modal is closed
        if (detailMap) {
          detailMap.remove();
          detailMap = null;
        }
      }
    });
    DOM.storyModal.addEventListener('show', () => {
      adjustModalPosition();
    });

    // Adjust modal position when window is resized
    window.addEventListener('resize', () => {
      if (DOM.storyModal.classList.contains('show')) {
        adjustModalPosition();
      }
    });
    function adjustModalPosition() {
      const modalContent = DOM.modalContent.parentElement;
      const windowHeight = window.innerHeight;
      const modalHeight = modalContent.offsetHeight;

      if (modalHeight > windowHeight) {
        // Jika modal lebih tinggi dari window, posisikan di atas
        DOM.storyModal.style.alignItems = 'flex-start';
        DOM.storyModal.style.paddingTop = '20px';
        DOM.storyModal.style.paddingBottom = '20px';
      } else {
        // Jika modal lebih pendek dari window, posisikan di tengah
        DOM.storyModal.style.alignItems = 'center';
        DOM.storyModal.style.paddingTop = '0';
        DOM.storyModal.style.paddingBottom = '0';
      }
    }
  },



  setupEvents() {
    DOM.storyForm.addEventListener("submit", (e) => this.submitStory(e));
    this.setupModalEvents();
  },

  setupImagePreview() {
    DOM.photoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          DOM.imagePreview.src = e.target.result;
          DOM.imagePreview.style.display = "block";
          DOM.uploadPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(file);
      } else {
        DOM.imagePreview.src = "#";
        DOM.imagePreview.style.display = "none";
        DOM.uploadPlaceholder.style.display = "block";
      }
    });
  },
  setupAudioRecording() {
    const recordBtn = document.getElementById("recordAudioBtn");
    const deleteBtn = document.getElementById("deleteAudioBtn");
    const audioPreview = document.getElementById("audioPreview");
    const audioPreviewContainer = document.getElementById("audioPreviewContainer");

    recordBtn.addEventListener("click", async () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        recordBtn.innerHTML = '<i class="fa fa-microphone"></i> Rekam Audio';
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioPreview.src = audioUrl;
          audioPreviewContainer.style.display = "block";
          deleteBtn.style.display = "inline-block";
        };

        mediaRecorder.start();
      } catch (err) {
        UI.showError("Gagal akses mikrofon. Pastikan izin sudah diberikan.");
      }
    });

    deleteBtn.addEventListener("click", () => {
      audioBlob = null;
      audioPreview.src = "";
      audioPreviewContainer.style.display = "none";
      deleteBtn.style.display = "none";
    });
  },

};