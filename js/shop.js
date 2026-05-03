// shop.js - Market işlemleri

// Sayfa yüklendiğinde jeton miktarını göster
document.addEventListener('DOMContentLoaded', () => {
    updateCoinDisplay();
    
    // localStorage'dan jeton miktarını al
    const coins = localStorage.getItem('coins');
    if (coins) {
        document.getElementById('coinAmount').textContent = coins;
    }
});

// Jeton miktarını güncelle
function updateCoinDisplay() {
    const coins = localStorage.getItem('coins') || '50';
    const displays = document.querySelectorAll('#coinAmount, #coinDisplay');
    displays.forEach(disp => {
        if (disp) disp.textContent = coins;
    });
}

// Sekme göster
function showTab(tabName) {
    // Tüm sekmeleri gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Tüm butonların active class'ını kaldır
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Seçili sekmeyi göster
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Tıklanan butona active ekle
    event.target.classList.add('active');
}

// Satın alma işlemi
function purchaseItem(button) {
    const item = button.closest('.shop-item');
    const price = item.dataset.price;
    const coins = parseInt(item.dataset.coins) || 0;
    const hearts = parseInt(item.dataset.hearts) || 0;
    
    // Mevcut jetonları al
    let currentCoins = parseInt(localStorage.getItem('coins') || '50');
    
    // Butonu devre dışı bırak
    button.disabled = true;
    button.textContent = 'İşleniyor...';
    
    // Ödeme simülasyonu (Google Play entegrasyonu buraya gelecek)
    setTimeout(() => {
        // Jeton ekle
        if (coins > 0) {
            currentCoins += coins;
            localStorage.setItem('coins', currentCoins);
        }
        
        // Kalp ekle
        if (hearts > 0) {
            let currentHearts = parseInt(localStorage.getItem('hearts') || '5');
            currentHearts = Math.min(5, currentHearts + hearts);
            localStorage.setItem('hearts', currentHearts);
        }
        
        // Başarılı mesajı
        button.textContent = '✓ Satın Alındı';
        updateCoinDisplay();
        
        // 2 saniye sonra butonu eski haline getir
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Satın Al';
        }, 2000);
        
        // Toast mesajı göster
        showToast('Satın alma başarılı! 🎉');
        
    }, 1500);
}

// Toast mesajı göster
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 50%;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #4CAF50, #45a049);
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