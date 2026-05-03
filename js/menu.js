// menu.js - KISA VE NET
document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('playButton');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            // Hızlı tıklama efekti
            this.style.transform = 'scale(0.95)';
            
            // levels.html'e git
            setTimeout(() => {
                window.location.href = 'levels.html';
            }, 200);
        });
    }
});