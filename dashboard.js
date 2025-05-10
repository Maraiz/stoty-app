import { StoryController } from './js/controllers/story.js';
import { DOM } from './js/utils/dom.js';
import { CameraController } from './js/controllers/camera.js';
import { UI } from './js/controllers/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  DOM.init();
  updateUIBasedOnLoginStatus();
  const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}
});

function setupPhotoUpload() {
  const { uploadPlaceholder, imagePreview, photoInput, uploadFileBtn, deletePhotoBtn } = DOM;
  const uploadPreview = document.querySelector('.upload-preview');
  
  function triggerFileInput() {
    photoInput.click();
  }
  
  if (uploadPreview) {
    uploadPreview.removeEventListener('click', triggerFileInput);
    uploadPreview.addEventListener('click', triggerFileInput);
  }
   
  if (photoInput) {
    photoInput.addEventListener('change', handleFileUpload);
  }
  
  function handleFileUpload(e) {
    const files = e.target.files;
    if (!files || !files.length) return;
    
    const file = files[0];
    
    if (file.size > 1024 * 1024) { // 1MB
      Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar',
        text: 'Ukuran file maksimal adalah 1MB'
      });
      return;
    }
    
    // Periksa apakah ini file gambar
    if (!file.type.match('image.*')) {
      Swal.fire({
        icon: 'error',
        title: 'Format File Tidak Didukung',
        text: 'Hanya file gambar yang diperbolehkan'
      });
      return;
    }
    
    // Preview gambar
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
      uploadPlaceholder.style.display = 'none';
      
      if (deletePhotoBtn) {
        deletePhotoBtn.style.display = 'inline-block';
      }
    };
    reader.readAsDataURL(file);
  }
  
  if (deletePhotoBtn) {
    deletePhotoBtn.addEventListener('click', () => {
      // Reset file input
      if (photoInput) {
        photoInput.value = '';
      }
      
      if (imagePreview) {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
      }
      
      if (uploadPlaceholder) {
        uploadPlaceholder.style.display = 'block';
      }
      
      if (deletePhotoBtn) {
        deletePhotoBtn.style.display = 'none';
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Foto Dihapus',
        text: 'Foto berhasil dihapus',
        timer: 2000,
        showConfirmButton: false
      });
    });
  }
}

function updateUIBasedOnLoginStatus() {
    const name = localStorage.getItem("name");
    const isLoggedIn = !!name;
  
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardSection = document.getElementById('dashboardSection');
    const landingSection = document.getElementById('landingSection');
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const dashboardGreeting = document.getElementById('dashboardGreeting');
  
    if (isLoggedIn) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (registerBtn) registerBtn.classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
      
      if (dashboardSection) dashboardSection.classList.remove('hidden');
      if (landingSection) landingSection.classList.add('hidden');
      if (loginBox) loginBox.classList.add('hidden');
      if (registerBox) registerBox.classList.add('hidden');
      
      if (dashboardGreeting) dashboardGreeting.textContent = `Selamat datang, ${name}!`;
      
      setupDashboardFeatures();
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (registerBtn) registerBtn.classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
      
      // Tampilkan landing page
      if (dashboardSection) dashboardSection.classList.add('hidden');
      if (landingSection) landingSection.classList.remove('hidden');
    }
  }
  
  // Fungsi untuk logout
// Fungsi untuk logout dengan konfirmasi
function handleLogout() {
  // Panggil Auth.logout jika tersedia
  if (typeof Auth !== 'undefined' && Auth.logout) {
    Auth.logout();
  } else {
     localStorage.clear();
    window.location.href = "index.html";
  }
}
  
  // Setup fitur dashboard
  function setupDashboardFeatures() {
    setupLocationFeatures();
    setupAudioRecording();
    setupPhotoUpload();
    CameraController.init();
    StoryController.init();
    StoryController.getStories();
    UI.loadGreeting();
    UI.animateElements();
    updateUIBasedOnLoginStatus();
  }
  
  // Setup form tambah cerita
  
  // Setup fitur lokasi
// Setup fitur lokasi
function setupLocationFeatures() {
  const getLocationBtn = document.getElementById('getLocationBtn');
  const storyLat = document.getElementById('storyLat');
  const storyLon = document.getElementById('storyLon');
  const mapElement = document.getElementById('map');
  
  let map;
  let marker; // Pindahkan deklarasi marker ke sini agar bisa diakses di seluruh fungsi
  
  // Inisialisasi peta jika elemen ada
  if (mapElement) {
    map = L.map('map').setView([-6.2088, 106.8456], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Tambahkan event click ke peta
    map.on('click', function(e) {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      
      if (storyLat) storyLat.value = lat;
      if (storyLon) storyLon.value = lng;
      
      // Update marker
      updateMarker(lat, lng);
    });
  }
  
  // Fungsi untuk update marker (menghapus yang lama dan membuat yang baru)
  function updateMarker(lat, lng) {
    if (!map) return;
    
    // Hapus marker lama jika ada
    if (marker) {
      map.removeLayer(marker);
    }
    
    // Buat marker baru
    marker = L.marker([lat, lng]).addTo(map);
  }
  
  // Event listener untuk tombol get location
  if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lon = position.coords.longitude.toFixed(6);
            
            if (storyLat) storyLat.value = lat;
            if (storyLon) storyLon.value = lon;
            
            // Update peta
            if (map) {
              map.setView([lat, lon], 15);
              updateMarker(lat, lon); // Gunakan fungsi updateMarker
            }
            
            Swal.fire({
              icon: 'success',
              title: 'Lokasi Ditemukan',
              text: `Latitude: ${lat}, Longitude: ${lon}`,
              timer: 2000,
              showConfirmButton: false
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            Swal.fire({
              icon: 'error',
              title: 'Gagal Mendapatkan Lokasi',
              text: 'Izinkan akses lokasi untuk menggunakan fitur ini',
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Geolocation Tidak Didukung',
          text: 'Browser Anda tidak mendukung geolocation',
        });
      }
    });
  }
}
  
  function setupAudioRecording() {
    const recordAudioBtn = document.getElementById('recordAudioBtn');
    const deleteAudioBtn = document.getElementById('deleteAudioBtn');
    const audioPreview = document.getElementById('audioPreview');
    const audioPreviewContainer = document.getElementById('audioPreviewContainer');
    
    let mediaRecorder;
    let audioChunks = [];
    
    function resetAudioPreview() {
      if (audioPreview) audioPreview.src = '';
      if (audioPreviewContainer) audioPreviewContainer.style.display = 'none';
      if (deleteAudioBtn) deleteAudioBtn.style.display = 'none';
    }
    window.resetAudioPreview = resetAudioPreview;
    
    // Event listener untuk tombol rekam audio
    if (recordAudioBtn) {
      recordAudioBtn.addEventListener('click', async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          
          // Mulai rekaman
          mediaRecorder.start();
          
          // Tampilkan timer dan tombol stop
          let seconds = 0;
          Swal.fire({
            title: 'Merekam Audio',
            html: `
              <div style="font-size: 24px; margin-bottom: 15px;">
                <span id="recordingTimer">00:00</span>
              </div>
              <button id="stopRecordingBtn" class="swal2-confirm swal2-styled">Selesai</button>
            `,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            willClose: () => {
              // Hentikan rekaman jika modal ditutup
              if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
              }
              // Hentikan stream
              stream.getTracks().forEach(track => track.stop());
            }
          });
          
          // Timer untuk rekaman
          const timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('recordingTimer').textContent = 
              `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
          }, 1000);
          
          // Event listener untuk tombol stop
          document.getElementById('stopRecordingBtn').addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
            clearInterval(timerInterval);
            Swal.close();
          });
          
          // Event saat data tersedia
          mediaRecorder.addEventListener('dataavailable', (e) => {
            if (e.data.size > 0) {
              audioChunks.push(e.data);
            }
          });
          
          // Event saat rekaman selesai
          mediaRecorder.addEventListener('stop', () => {
            // Hentikan stream
            stream.getTracks().forEach(track => track.stop());
            
            // Buat blob dan tampilkan di audio player
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            if (audioPreview) {
              audioPreview.src = audioUrl;
              audioPreviewContainer.style.display = 'block';
              deleteAudioBtn.style.display = 'inline-block';
            }
            
            // Tampilkan pesan sukses
            Swal.fire({
              icon: 'success',
              title: 'Rekaman Berhasil',
              text: 'Audio berhasil direkam',
              timer: 2000,
              showConfirmButton: false
            });
          });
        } catch (error) {
          console.error('Error accessing microphone:', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Mengakses Mikrofon',
            text: 'Izinkan akses mikrofon untuk menggunakan fitur ini',
          });
        }
      });
    }
    
    // Event listener untuk tombol hapus audio
    if (deleteAudioBtn) {
      deleteAudioBtn.addEventListener('click', () => {
        resetAudioPreview();
        
        Swal.fire({
          icon: 'success',
          title: 'Rekaman Dihapus',
          text: 'Rekaman audio berhasil dihapus',
          timer: 2000,
          showConfirmButton: false
        });
      });
    }
  }
  
  // Expose fungsi logout ke global scope juga untuk keamanan jika export gagal
  window.handleLogout = handleLogout;
  
  // Export fungsi untuk digunakan di index.js
  export { updateUIBasedOnLoginStatus, handleLogout, setupDashboardFeatures };