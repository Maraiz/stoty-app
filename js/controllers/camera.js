// camera.js - Mengelola fungsi kamera
import { DOM } from '../utils/dom.js';
import { UI } from './ui.js';

export const CameraController = {
  currentStream: null,
  
  init() {
    this.setupEvents();
    this.createCancelCameraButton(); // Tambahkan pembuatan tombol batal saat inisialisasi
  },
  
  async startCamera() {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      DOM.cameraFeed.srcObject = this.currentStream;
      DOM.cameraFeed.style.display = "block";
      DOM.takePictureBtn.style.display = "block";
      DOM.uploadFileBtn.style.display = "none";
      
      // Tampilkan tombol batal saat kamera aktif
      if (DOM.cancelCameraBtn) {
        DOM.cancelCameraBtn.style.display = "block";
      }
    } catch (err) {
      console.error("Error mengakses kamera:", err);
      UI.showError("Tidak dapat mengakses kamera");
    }
  },
  
  takePhoto() {
    const context = DOM.cameraCanvas.getContext("2d");
    DOM.cameraCanvas.width = DOM.cameraFeed.videoWidth;
    DOM.cameraCanvas.height = DOM.cameraFeed.videoHeight;
    context.drawImage(DOM.cameraFeed, 0, 0, DOM.cameraCanvas.width, DOM.cameraCanvas.height);

    const dataUrl = DOM.cameraCanvas.toDataURL("image/png");
    DOM.capturedImage.src = dataUrl;
    DOM.cameraPreview.style.display = "block";
    DOM.cameraFeed.style.display = "none";
    DOM.takePictureBtn.style.display = "none";
    DOM.uploadPlaceholder.style.display = "none";
    
    // Sembunyikan tombol batal setelah foto diambil
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "none";
    }
  },
  
  usePhoto() {
    fetch(DOM.capturedImage.src)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "captured.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        DOM.photoInput.files = dataTransfer.files;
        this.stopCamera();
        
        // Trigger image preview update
        const event = new Event('change');
        DOM.photoInput.dispatchEvent(event);
        
        // Reset komponen kamera
        this.cleanupCameraComponents();
        
        // Tampilkan tombol hapus foto setelah foto digunakan
        if (DOM.deletePhotoBtn) {
          DOM.deletePhotoBtn.style.display = "inline-block";
        }
      });
  },
  
  retakePhoto() {
    DOM.cameraPreview.style.display = "none";
    DOM.takePictureBtn.style.display = "block";
    DOM.cameraFeed.style.display = "block";
    
    // Tampilkan kembali tombol batal
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "block";
    }
  },
  
  cancelCamera() {
    // Hentikan kamera dan bersihkan
    this.stopCamera();
    this.cleanupCameraComponents();
    
    // Tampilkan kembali tombol upload
    DOM.uploadFileBtn.style.display = "block";
    DOM.takePictureBtn.style.display = "block";
    
    // Sembunyikan tombol batal
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "none";
    }
    
    // Tampilkan placeholder upload
    DOM.uploadPlaceholder.style.display = "block";
    
    // Notifikasi kecil bahwa kamera dibatalkan
    UI.showInfo("Penggunaan kamera dibatalkan");
  },
  
  deletePhoto() {
    // Reset foto dan input file
    DOM.photoInput.value = "";
    DOM.imagePreview.src = "#";
    DOM.imagePreview.style.display = "none";
    DOM.uploadPlaceholder.style.display = "block";
    
    // Bersihkan semua komponen kamera
    this.cleanupCameraComponents();
    
    // Sembunyikan tombol hapus foto
    if (DOM.deletePhotoBtn) {
      DOM.deletePhotoBtn.style.display = "none";
    }
    
    // Tampilkan kembali tombol upload dan ambil foto
    DOM.uploadFileBtn.style.display = "block";
    DOM.takePictureBtn.style.display = "block";
    
    // Tampilkan notifikasi
    UI.showSuccess("Foto berhasil dihapus");
  },
  
  // Fungsi baru untuk membersihkan komponen kamera
  cleanupCameraComponents() {
    // Bersihkan kamera feed dan preview
    if (DOM.cameraFeed) {
      DOM.cameraFeed.style.display = "none";
      DOM.cameraFeed.srcObject = null;
    }
    
    if (DOM.cameraPreview) {
      DOM.cameraPreview.style.display = "none";
    }
    
    if (DOM.capturedImage) {
      DOM.capturedImage.src = "#";
    }
    
    // Pastikan tombol kamera tersedia kembali
    if (DOM.takePictureBtn) {
      DOM.takePictureBtn.style.display = "block";
    }
    
    // Sembunyikan tombol batal
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "none";
    }
    
    // Hentikan stream kamera yang berjalan
    this.stopCamera();
  },
  
  stopCamera() {
    if (this.currentStream) {
      const tracks = this.currentStream.getTracks();
      tracks.forEach(track => track.stop());
      this.currentStream = null;
    }
  },
  
  resetCamera() {
    this.cleanupCameraComponents();
    
    // Tampilkan tombol upload
    if (DOM.uploadFileBtn) {
      DOM.uploadFileBtn.style.display = "block";
    }
    
    // Sembunyikan tombol hapus foto
    if (DOM.deletePhotoBtn) {
      DOM.deletePhotoBtn.style.display = "none";
    }
    
    // Tampilkan placeholder upload
    if (DOM.uploadPlaceholder) {
      DOM.uploadPlaceholder.style.display = "block";
    }
  },
  
  setupEvents() {
    // Reset lingering event listener
    DOM.takePictureBtn.removeEventListener("click", this.startCamera);
    DOM.takePictureBtn.removeEventListener("click", this.takePhoto);
    
    // Set correct event listeners
    DOM.takePictureBtn.addEventListener("click", () => {
      if (!this.currentStream) {
        this.startCamera();
      } else {
        this.takePhoto();
      }
    });
    
    DOM.usePhotoBtn.addEventListener("click", () => this.usePhoto());
    DOM.retakeBtn.addEventListener("click", () => this.retakePhoto());
    
    // File upload handling
    DOM.uploadFileBtn.addEventListener('click', () => DOM.photoInput.click());
    
    // Handler untuk tombol hapus foto
    if (!DOM.deletePhotoBtn) {
      this.createDeletePhotoButton();
    } else {
      // Jika sudah ada, pasang event listener
      DOM.deletePhotoBtn.addEventListener('click', () => this.deletePhoto());
    }
    
    // Handler untuk tombol batal kamera
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.addEventListener('click', () => this.cancelCamera());
    }
    
    // Tambahkan handler untuk perubahan file input juga
    DOM.photoInput.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        // Jika ada file dipilih, tampilkan tombol hapus
        if (DOM.deletePhotoBtn) {
          DOM.deletePhotoBtn.style.display = "inline-block";
        }
      }
    });
  },
  
  createDeletePhotoButton() {
    // Membuat tombol hapus foto jika belum ada di HTML
    const uploadActions = document.querySelector('.upload-actions');
    if (uploadActions) {
      // Cek apakah tombol sudah ada
      if (!document.getElementById('deletePhotoBtn')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.id = 'deletePhotoBtn';
        deleteBtn.className = 'upload-btn danger-btn';
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i> Hapus Foto';
        deleteBtn.style.display = 'none'; // Awalnya tersembunyi
        
        // Tambahkan ke DOM
        uploadActions.appendChild(deleteBtn);
        
        // Update referensi di DOM object
        DOM.deletePhotoBtn = deleteBtn;
        
        // Tambahkan event listener
        deleteBtn.addEventListener('click', () => this.deletePhoto());
      }
    }
  },
  
  createCancelCameraButton() {
    // Membuat tombol batal kamera jika belum ada di HTML
    const uploadActions = document.querySelector('.upload-actions');
    if (uploadActions) {
      // Cek apakah tombol sudah ada
      if (!document.getElementById('cancelCameraBtn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancelCameraBtn';
        cancelBtn.className = 'upload-btn cancel-btn';
        cancelBtn.innerHTML = '<i class="fa fa-times"></i> Batal';
        cancelBtn.style.display = 'none'; // Awalnya tersembunyi
        
        // Atur posisi tombol di sebelah tombol ambil foto
        const takePictureBtn = document.getElementById('takePictureBtn');
        if (takePictureBtn) {
          uploadActions.insertBefore(cancelBtn, takePictureBtn.nextSibling);
        } else {
          uploadActions.appendChild(cancelBtn);
        }
        
        // Tambahkan style untuk tombol batal
        cancelBtn.style.marginLeft = '8px';
        cancelBtn.style.backgroundColor = '#f44336';
        cancelBtn.style.color = 'white';
        
        // Update referensi di DOM object
        DOM.cancelCameraBtn = cancelBtn;
        
        // Tambahkan event listener
        cancelBtn.addEventListener('click', () => this.cancelCamera());
      }
    }
  }
};