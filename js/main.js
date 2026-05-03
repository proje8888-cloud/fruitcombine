// Ana başlangıç
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fruit Combine başlatılıyor...');
    
    const savedJeton = localStorage.getItem('fruitCombine_jeton');
    gameState.jeton = savedJeton ? parseInt(savedJeton) : CONFIG.INITIAL_JETON;
    
    const savedLevel = localStorage.getItem('fruitCombine_level');
    gameState.currentLevel = savedLevel ? parseInt(savedLevel) : 1;
    
    gameState.fallingSpeed = calculateFallSpeed(gameState.currentLevel);
    
    updateUI();
    loadSettings();
    
    // Arkaplan müziğini başlat
    setTimeout(() => {
        if (gameState.musicEnabled) {
            document.getElementById('backgroundMusic')?.play().catch(() => {});
        }
    }, 1000);
});

window.addEventListener('beforeunload', function() {
    localStorage.setItem('fruitCombine_jeton', gameState.jeton);
    localStorage.setItem('fruitCombine_level', gameState.currentLevel);
});