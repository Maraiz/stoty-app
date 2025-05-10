import { DOM } from '../utils/dom.js';
import { UI } from './ui.js';

export const CameraController = {
  currentStream: null,
  
  init() {
    this.setupEvents();
    this.createCancelCameraButton();
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
        
        const event = new Event('change');
        DOM.photoInput.dispatchEvent(event);
        
        this.cleanupCameraComponents();
        if (DOM.deletePhotoBtn) {
          DOM.deletePhotoBtn.style.display = "inline-block";
        }
      });
  },
  
  retakePhoto() {
    DOM.cameraPreview.style.display = "none";
    DOM.takePictureBtn.style.display = "block";
    DOM.cameraFeed.style.display = "block";
    
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "block";
    }
  },
  
  cancelCamera() {
    this.stopCamera();
    this.cleanupCameraComponents();
    
    DOM.uploadFileBtn.style.display = "block";
    DOM.takePictureBtn.style.display = "block";
  
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "none";
    }
    
    DOM.uploadPlaceholder.style.display = "block";
    UI.showInfo("Penggunaan kamera dibatalkan");
  },
  
  deletePhoto() {
    DOM.photoInput.value = "";
    DOM.imagePreview.src = "#";
    DOM.imagePreview.style.display = "none";
    DOM.uploadPlaceholder.style.display = "block";

    this.cleanupCameraComponents();
    if (DOM.deletePhotoBtn) {
      DOM.deletePhotoBtn.style.display = "none";
    }
    
    DOM.uploadFileBtn.style.display = "block";
    DOM.takePictureBtn.style.display = "block";
    UI.showSuccess("Foto berhasil dihapus");
  },
  
  cleanupCameraComponents() {
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
    
    if (DOM.takePictureBtn) {
      DOM.takePictureBtn.style.display = "block";
    }
    
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.style.display = "none";
    }
    
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
    
    if (DOM.uploadFileBtn) {
      DOM.uploadFileBtn.style.display = "block";
    }
    
    if (DOM.deletePhotoBtn) {
      DOM.deletePhotoBtn.style.display = "none";
    }
    
    if (DOM.uploadPlaceholder) {
      DOM.uploadPlaceholder.style.display = "block";
    }
  },
  
  setupEvents() {

    DOM.takePictureBtn.removeEventListener("click", this.startCamera);
    DOM.takePictureBtn.removeEventListener("click", this.takePhoto);
    DOM.takePictureBtn.addEventListener("click", () => {
      if (!this.currentStream) {
        this.startCamera();
      } else {
        this.takePhoto();
      }
    });
    
    DOM.usePhotoBtn.addEventListener("click", () => this.usePhoto());
    DOM.retakeBtn.addEventListener("click", () => this.retakePhoto());
    DOM.uploadFileBtn.addEventListener('click', () => DOM.photoInput.click());
    
    if (!DOM.deletePhotoBtn) {
      this.createDeletePhotoButton();
    } else {
      DOM.deletePhotoBtn.addEventListener('click', () => this.deletePhoto());
    }
    
    if (DOM.cancelCameraBtn) {
      DOM.cancelCameraBtn.addEventListener('click', () => this.cancelCamera());
    }
    
    DOM.photoInput.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        if (DOM.deletePhotoBtn) {
          DOM.deletePhotoBtn.style.display = "inline-block";
        }
      }
    });
  },
  
  createDeletePhotoButton() {
    const uploadActions = document.querySelector('.upload-actions');
    if (uploadActions) {
      if (!document.getElementById('deletePhotoBtn')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.id = 'deletePhotoBtn';
        deleteBtn.className = 'upload-btn danger-btn';
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i> Hapus Foto';
        deleteBtn.style.display = 'none';
        
        uploadActions.appendChild(deleteBtn);
        
        DOM.deletePhotoBtn = deleteBtn;
        
        deleteBtn.addEventListener('click', () => this.deletePhoto());
      }
    }
  },
  
  createCancelCameraButton() {
    const uploadActions = document.querySelector('.upload-actions');
    if (uploadActions) {
      if (!document.getElementById('cancelCameraBtn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancelCameraBtn';
        cancelBtn.className = 'upload-btn cancel-btn';
        cancelBtn.innerHTML = '<i class="fa fa-times"></i> Batal';
        cancelBtn.style.display = 'none';
        
        const takePictureBtn = document.getElementById('takePictureBtn');
        if (takePictureBtn) {
          uploadActions.insertBefore(cancelBtn, takePictureBtn.nextSibling);
        } else {
          uploadActions.appendChild(cancelBtn);
        }
        
        cancelBtn.style.marginLeft = '8px';
        cancelBtn.style.backgroundColor = '#f44336';
        cancelBtn.style.color = 'white';
        
        DOM.cancelCameraBtn = cancelBtn;
        
        cancelBtn.addEventListener('click', () => this.cancelCamera());
      }
    }
  }
};