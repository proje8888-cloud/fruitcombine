let hearts = 5;
let lastHeartTime = Date.now();

function updateHearts() {
    const now = Date.now();
    const diff = now - lastHeartTime;
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes >= 15 && hearts < 5) {
        hearts++;
        lastHeartTime = now;
        localStorage.setItem('hearts', hearts);
        localStorage.setItem('lastHeartTime', lastHeartTime);
    }
}
// 1 dakikada bir kontrol et
setInterval(updateHearts, 60000);