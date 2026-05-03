function showResultScreen(isWin, stars) {
    const screen = document.getElementById('result-screen');
    screen.style.display = 'flex';
    
    if (isWin) {
        document.getElementById('result-title').innerText = "TEBRİKLER!";
        document.getElementById('star-display').innerText = "⭐".repeat(stars);
        document.getElementById('next-level-btn').style.display = 'block';
    } else {
        document.getElementById('result-title').innerText = "KAYBETTİN!";
        document.getElementById('star-display').innerText = "💔";
        document.getElementById('next-level-btn').style.display = 'none';
        // Kalp düşür
        useHeart();
    }
}