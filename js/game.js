const Game = {
    coins: 50,
    hearts: 5,
    currentLevel: 1,
    score: 0,
    moves: 0,
    timeLeft: 0,
    targetNeeded: 0,
    targetType: '',
    isPaused: false,
    timerInterval: null,
    spawnInterval: null,

    initLevel(lvl) {
        const config = LevelManager.getConfig(lvl);
        this.currentLevel = lvl;
        this.targetNeeded = config.targetCount;
        this.targetType = config.targetFruit;
        this.moves = config.moves;
        this.timeLeft = config.duration;
        this.score = 0;

        document.getElementById('menu-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        this.updateUI();
        this.startLoop();
        document.getElementById('bgMusic').play();
    },

    startLoop() {
        if(this.timerInterval) clearInterval(this.timerInterval);
        if(this.spawnInterval) clearInterval(this.spawnInterval);

        this.timerInterval = setInterval(() => {
            if(!this.isPaused) {
                this.timeLeft--;
                this.updateUI();
                if(this.timeLeft <= 0) this.endGame(false);
            }
        }, 1000);

        this.spawnInterval = setInterval(() => {
            if(!this.isPaused) this.spawnItem();
        }, 800 - (this.currentLevel * 20)); // Level arttıkça hızlanır
    },

    spawnItem() {
        const area = document.getElementById('game-canvas');
        const item = document.createElement('div');
        item.className = 'item';
        
        const rand = Math.random();
        if(rand < 0.1) {
            item.innerHTML = "💣"; // Bomba
            item.onclick = () => this.triggerBomb();
        } else if(rand < 0.2) {
            item.innerHTML = "❄️"; // Buz
            item.onclick = () => this.useFreeze();
        } else {
            item.innerHTML = "🍎"; // Basitlik için emoji, sen 3D PNG koyabilirsin
            item.onclick = () => this.collect(item);
        }

        item.style.left = Math.random() * (window.innerWidth - 60) + 'px';
        item.style.animation = `fall ${3 - (this.currentLevel * 0.1)}s linear`;
        area.appendChild(item);
        
        item.onanimationend = () => item.remove();
    },

    collect(el) {
        if(this.moves <= 0) return;
        this.moves--;
        this.score += 10;
        this.targetNeeded = Math.max(0, this.targetNeeded - 1);
        
        document.getElementById('clickSnd').play();
        el.remove();
        this.updateUI();
        if(this.targetNeeded === 0) this.endGame(true);
    },

    triggerBomb() {
        document.getElementById('bombSnd').play();
        this.targetNeeded += 5; // Ceza: Hedef artar
        this.updateUI();
        // Ekran sallanma efekti eklenebilir
    },

    useFreeze() {
        this.isPaused = true;
        document.getElementById('ice-overlay').style.display = 'block';
        setTimeout(() => {
            this.isPaused = false;
            document.getElementById('ice-overlay').style.display = 'none';
        }, 3000);
    },

    updateUI() {
        document.getElementById('heartText').innerText = this.hearts;
        document.getElementById('coinText').innerText = this.coins;
        document.getElementById('moveText').innerText = this.moves;
        document.getElementById('timeText').innerText = this.timeLeft;
        document.getElementById('targetText').innerText = `Kalan: ${this.targetNeeded}`;
    },

    endGame(isWin) {
        clearInterval(this.timerInterval);
        clearInterval(this.spawnInterval);
        document.getElementById('result-screen').style.display = 'flex';
        document.getElementById('result-status').innerText = isWin ? "KAZANDIN!" : "KAYBETTİN!";
        if(!isWin) this.hearts--;
    }
};