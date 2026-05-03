// settings.js - Ayarlar sayfası işlemleri

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateCoinDisplay();
});

// Ayarları yükle
function loadSettings() {
    // Müzik ayarı
    const musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
    document.getElementById('musicToggle').checked = musicEnabled;
    
    // Ses ayarı
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    document.getElementById('soundToggle').checked = soundEnabled;
    
    // Titreşim ayarı
    const vibrationEnabled = localStorage.getItem('vibrationEnabled') !== 'false';
    const vibrationToggle = document.getElementById('vibrationToggle');
    if (vibrationToggle) {
        vibrationToggle.checked = vibrationEnabled;
    }
}

// Jeton miktarını güncelle
function updateCoinDisplay() {
    const coins = localStorage.getItem('coins') || '50';
    const display = document.getElementById('coinDisplay');
    if (display) {
        display.textContent = coins;
    }
}

// Müzik aç/kapat
function toggleMusic() {
    const isEnabled = document.getElementById('musicToggle').checked;
    localStorage.setItem('musicEnabled', isEnabled);
    
    // Tıklama sesi çal
    playClickSound();
}

// Ses aç/kapat
function toggleSound() {
    const isEnabled = document.getElementById('soundToggle').checked;
    localStorage.setItem('soundEnabled', isEnabled);
    
    // Tıklama sesi çal (eğer açıksa)
    if (isEnabled) {
        playClickSound();
    }
}

// Seviye atla
function skipLevel() {
    const coins = parseInt(localStorage.getItem('coins') || '50');
    
    if (coins >= 8) {
        // 8 jeton düş
        localStorage.setItem('coins', coins - 8);
        
        // Mevcut level'ı artır
        let currentLevel = parseInt(localStorage.getItem('currentLevel') || '1');
        localStorage.setItem('currentLevel', currentLevel + 1);
        
        // Başarılı mesajı
        showToast('Seviye atlandı! 🚀');
        updateCoinDisplay();
        playClickSound();
        
        // 1 saniye sonra oyun sayfasına dön
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1000);
    } else {
        // Yetersiz jeton
        showToast('Yetersiz jeton! 🪙', 'error');
    }
}

// Tıklama sesi çal
function playClickSound() {
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    if (!soundEnabled) return;
    
    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }
}

// Toast mesajı göster
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 50%;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #ff4444, #cc0000)'};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-weight: bold;
        z-index: 1000;
        animation: slideUp 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Gizlilik politikası
function openPrivacy() {
    window.open('https://www.example.com/privacy', '_blank');
}

// Yardım
function openHelp() {
    alert('Nasıl oynanır?\n\n🍎 Hedef meyveleri topla\n💣 Bombadan kaçın\n❄️ Buz ile meyveleri dondur\n⭐ Yıldız kazanarak ilerle');
}

// CSS animasyonu ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);