// utils.js - Yardımcı fonksiyonlar

// LocalStorage'dan değer oku
function getStorage(key, defaultValue) {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
}

// LocalStorage'a değer yaz
function setStorage(key, value) {
    localStorage.setItem(key, value);
}

// Rastgele sayı üret
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Rastgele tam sayı üret
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// İki nokta arası mesafe
function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

// Renk dönüştürücü (hex -> rgba)
function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Zaman formatla (saniye -> mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Cihaz titreşimi (varsa)
function vibrate(duration = 100) {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(duration);
    }
}

// Ses çal (tekrar kullanılabilir)
function playAudio(audioId, volume = 1) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// Toast mesajı göster (merkezi)
function showToast(message, duration = 2000, isSuccess = true) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${isSuccess ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #f44336, #d32f2f)'};
        color: white;
        padding: 16px 32px;
        border-radius: 50px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: toastFadeIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// CSS animasyonları ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes toastFadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, 30px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes toastFadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, 30px);
        }
    }
`;
document.head.appendChild(style);