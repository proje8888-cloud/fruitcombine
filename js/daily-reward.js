// ============= GÜNLÜK ÖDÜL SİSTEMİ =============
const dailyRewards = {
    lastClaimDay: parseInt(localStorage.getItem('dailyRewardDay') || '0'),
    currentStreak: parseInt(localStorage.getItem('dailyStreak') || '0'),
    
    rewards: [
        { day: 1, coins: 10, items: [] },
        { day: 2, coins: 15, items: ['ice'] },
        { day: 3, coins: 20, items: [] },
        { day: 4, coins: 25, items: ['move'] },
        { day: 5, coins: 30, items: [] },
        { day: 6, coins: 35, items: ['time'] },
        { day: 7, coins: 50, items: ['ice', 'move', 'heart'] }
    ],
    
    canClaim: function() {
        const last = new Date(this.lastClaimDay);
        const now = new Date();
        if (this.lastClaimDay === 0) return true;
        return last.getDate() !== now.getDate() || 
               last.getMonth() !== now.getMonth() || 
               last.getFullYear() !== now.getFullYear();
    },
    
    claim: function() {
        if (!this.canClaim()) return false;
        const now = new Date();
        this.lastClaimDay = now.getTime();
        this.currentStreak = (this.currentStreak % 7) + 1;
        localStorage.setItem('dailyRewardDay', this.lastClaimDay);
        localStorage.setItem('dailyStreak', this.currentStreak);
        return this.currentStreak;
    },
    
    getTodaysReward: function() {
        const streak = this.currentStreak || 1;
        return this.rewards[streak - 1];
    }
};

function showDailyRewardModal() {
    const modal = document.getElementById('dailyRewardModal');
    if (!modal) return;
    
    const streak = dailyRewards.currentStreak || 1;
    const reward = dailyRewards.rewards[streak - 1];
    
    document.getElementById('rewardCoins').textContent = reward.coins;
    
    let extraHtml = '';
    reward.items.forEach(item => {
        if (item === 'ice') extraHtml += '❄️ Buz ';
        if (item === 'move') extraHtml += '➕ Hamle+5 ';
        if (item === 'time') extraHtml += '⏰ Süre+10 ';
        if (item === 'heart') extraHtml += '❤️ Kalp ';
    });
    document.getElementById('rewardExtra').innerHTML = extraHtml || '-';
    
    for (let i = 1; i <= 7; i++) {
        const dayBox = document.getElementById(`day${i}`);
        if (dayBox) {
            if (i < streak) dayBox.className = 'day-box completed';
            else if (i === streak) dayBox.className = 'day-box active';
            else dayBox.className = 'day-box';
        }
    }
    
    modal.classList.add('active');
    if (window.gameState) window.gameState.isGameActive = false;
}

function closeDailyReward() {
    const modal = document.getElementById('dailyRewardModal');
    if (modal) modal.classList.remove('active');
    if (window.gameState) window.gameState.isGameActive = true;
}

function claimDailyReward() {
    const day = dailyRewards.claim();
    if (!day) {
        showToast('❌ Bugün zaten ödül aldınız!');
        return;
    }
    
    const reward = dailyRewards.rewards[day - 1];
    
    if (window.gameState) {
        window.gameState.coins += reward.coins;
        localStorage.setItem('coins', window.gameState.coins);
        
        reward.items.forEach(item => {
            if (item === 'ice') {
                window.gameState.giftItems.ice = (window.gameState.giftItems.ice || 0) + 1;
                localStorage.setItem('gift_ice', window.gameState.giftItems.ice);
            }
            if (item === 'move') {
                window.gameState.giftItems.move = (window.gameState.giftItems.move || 0) + 1;
                localStorage.setItem('gift_move', window.gameState.giftItems.move);
            }
            if (item === 'time') {
                window.gameState.giftItems.time = (window.gameState.giftItems.time || 0) + 1;
                localStorage.setItem('gift_time', window.gameState.giftItems.time);
            }
            if (item === 'heart') {
                window.gameState.hearts = Math.min(5, window.gameState.hearts + 1);
                localStorage.setItem('hearts', window.gameState.hearts);
            }
        });
        
        if (window.updateUI) window.updateUI();
        if (window.updateGiftCounters) window.updateGiftCounters();
    }
    
    closeDailyReward();
    showToast(`🎉 ${reward.coins} jeton kazandınız!`);
}

function checkDailyReward() {
    if (dailyRewards.canClaim()) {
        setTimeout(() => showDailyRewardModal(), 1000);
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}