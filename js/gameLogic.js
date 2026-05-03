function collectFruit(element) {
    if (moves <= 0 || isPaused) return;

    // Tıklanan meyvenin tipini kontrol et
    if (element.dataset.type === targetFruit) {
        score += 10;
        targetCount--; // Hedefe yaklaşıyoruz
        playAudio('match3Sound');
    }

    moves--; // Her tıklama bir hamle götürür
    element.classList.add('fruit-pop'); // CSS animasyonu tetikle
    setTimeout(() => element.remove(), 400);

    updateUI();
    checkGameStatus();
}

function checkGameStatus() {
    if (targetCount <= 0) {
        endGame(true); // Kazandı
    } else if (moves <= 0 || timeLeft <= 0) {
        endGame(false); // Kaybetti
    }
}

function calculateStars(remainingTime, remainingMoves) {
    let stars = 1;
    if (remainingTime > 20 && remainingMoves > 5) stars = 3;
    else if (remainingTime > 10 || remainingMoves > 2) stars = 2;
    return stars;
}