// Toast mesajı
function showToast(message, type = 'info', duration = 2000) {
    let toast = document.querySelector('.toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
        
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '30px';
        toast.style.color = 'white';
        toast.style.fontWeight = '600';
        toast.style.zIndex = '9999';
        toast.style.transition = 'all 0.3s';
        toast.style.opacity = '0';
        toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        toast.style.fontSize = '14px';
        toast.style.textAlign = 'center';
        toast.style.maxWidth = '80%';
    }
    
    const colors = {
        success: '#4CAF50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196F3'
    };
    
    toast.style.background = colors[type] || colors.info;
    toast.innerHTML = message;
    toast.style.opacity = '1';
    toast.style.bottom = '30px';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '20px';
    }, duration);
}

// Titreşim
function vibrate(duration = 50) {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(duration);
    }
}

// Rastgele sayı
function random(min, max) {
    return Math.random() * (max - min) + min;
}