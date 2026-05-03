// ============= İSTATİSTİK SİSTEMİ =============
const stats = {
    totalLevels: parseInt(localStorage.getItem('stat_totalLevels') || '0'),
    totalFruits: parseInt(localStorage.getItem('stat_totalFruits') || '0'),
    totalStars: parseInt(localStorage.getItem('stat_totalStars') || '0'),
    totalBombs: parseInt(localStorage.getItem('stat_totalBombs') || '0'),
    totalIce: parseInt(localStorage.getItem('stat_totalIce') || '0'),
    bestStreak: parseInt(localStorage.getItem('stat_bestStreak') || '0'),
    perfectLevels: parseInt(localStorage.getItem('stat_perfectLevels') || '0'),
    totalTimePlayed: parseInt(localStorage.getItem('stat_totalTimePlayed') || '0'),
    currentStreak: 0,
    
    update: function(type, value = 1) {
        if (type === 'level') {
            this.totalLevels += value;
            localStorage.setItem('stat_totalLevels', this.totalLevels);
            this.updateStreak(value);
        }
        else if (type === 'fruit') {
            this.totalFruits += value;
            localStorage.setItem('stat_totalFruits', this.totalFruits);
        }
        else if (type === 'star') {
            this.totalStars += value;
            localStorage.setItem('stat_totalStars', this.totalStars);
        }
        else if (type === 'bomb') {
            this.totalBombs += value;
            localStorage.setItem('stat_totalBombs', this.totalBombs);
        }
        else if (type === 'ice') {
            this.totalIce += value;
            localStorage.setItem('stat_totalIce', this.totalIce);
        }
        else if (type === 'perfect') {
            this.perfectLevels += value;
            localStorage.setItem('stat_perfectLevels', this.perfectLevels);
        }
        else if (type === 'time') {
            this.totalTimePlayed += value;
            localStorage.setItem('stat_totalTimePlayed', this.totalTimePlayed);
        }
    },
    
    updateStreak: function(value) {
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
            localStorage.setItem('stat_bestStreak', this.bestStreak);
        }
    },
    
    resetStreak: function() {
        this.currentStreak = 0;
    },
    
    getStats: function() {
        return {
            levels: this.totalLevels,
            fruits: this.totalFruits,
            stars: this.totalStars,
            bombs: this.totalBombs,
            ice: this.totalIce,
            bestStreak: this.bestStreak,
            perfectLevels: this.perfectLevels,
            timePlayed: this.totalTimePlayed
        };
    },
    
    formatTime: function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) return `${hours}s ${minutes}d ${secs}s`;
        if (minutes > 0) return `${minutes}d ${secs}s`;
        return `${secs}s`;
    },
    
    showStatsModal: function() {
        const stats = this.getStats();
        const modal = document.getElementById('statsModal');
        if (!modal) return;
        
        document.getElementById('statLevels').textContent = stats.levels;
        document.getElementById('statFruits').textContent = stats.fruits;
        document.getElementById('statStars').textContent = stats.stars;
        document.getElementById('statBombs').textContent = stats.bombs;
        document.getElementById('statIce').textContent = stats.ice;
        document.getElementById('statStreak').textContent = stats.bestStreak;
        document.getElementById('statPerfect').textContent = stats.perfectLevels;
        document.getElementById('statTime').textContent = this.formatTime(stats.timePlayed);
        
        modal.classList.add('active');
        if (window.gameState) window.gameState.isGameActive = false;
    },
    
    closeStatsModal: function() {
        const modal = document.getElementById('statsModal');
        if (modal) modal.classList.remove('active');
        if (window.gameState) window.gameState.isGameActive = true;
    }
};