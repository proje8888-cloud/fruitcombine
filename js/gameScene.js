class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Oyun değişkenleri
        this.gridSize = 8;
        this.cellSize = 60;
        this.movesLeft = 12;
        this.score = 0;
        this.level = 1;
        this.hearts = 5;
        this.gameStarted = false;
        
        // Meyve tipleri
        this.fruitTypes = ['apple', 'orange', 'banana', 'grape', 'strawberry', 'watermelon'];
        
        // Oyun durumu
        this.grid = [];
        this.selectedFruit = null;
        this.isSwapping = false;
        this.canPlay = false;
    }

    preload() {
        // Resim yükleme - geçici grafikler oluşturacağız
    }

    create() {
        console.log('GameScene create() çalıştı');
        
        // Önce geçici grafikleri oluştur
        this.createTempGraphics();
        
        // Oyun arayüzünü çiz
        this.drawUI();
        this.createGrid();
        this.drawGrid();
        
        // Oyunu başlat butonu
        const startButton = this.add.rectangle(400, 550, 200, 60, 0x00aa00)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(400, 550, 'OYUNU BAŞLAT', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);

        startButton.on('pointerdown', () => {
            console.log('Oyun başlatıldı');
            this.startGame();
            startButton.destroy();
            this.gameStarted = true;
        });
    }

    createTempGraphics() {
        console.log('Geçici grafikler oluşturuluyor...');
        
        // Meyveler için renkli daireler oluştur
        const colors = [0xff5555, 0xffaa00, 0xffff55, 0x55ff55, 0xff55ff, 0x5555ff];
        const names = ['apple', 'orange', 'banana', 'grape', 'strawberry', 'watermelon'];
        
        for (let i = 0; i < names.length; i++) {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(colors[i], 1);
            graphics.fillCircle(32, 32, 32);
            graphics.generateTexture(names[i], 64, 64);
            graphics.destroy();
        }
        
        // Kalp resmi oluştur
        const heartGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        heartGraphics.fillStyle(0xff5555, 1);
        heartGraphics.fillCircle(16, 16, 16);
        heartGraphics.generateTexture('heart', 32, 32);
        heartGraphics.destroy();
        
        console.log('Geçici grafikler oluşturuldu');
    }

    drawUI() {
        console.log('UI çiziliyor...');
        
        // Başlık
        this.add.text(400, 30, 'FRUIT COMBINING', {
            fontSize: '48px',
            fill: '#ffaa00',
            fontFamily: 'Arial, sans-serif',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Hamle sayacı
        this.movesText = this.add.text(650, 150, `HAMLE: ${this.movesLeft}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        });

        // Kalpler
        this.heartIcons = [];
        for (let i = 0; i < 5; i++) {
            const heart = this.add.image(650 + i * 35, 200, 'heart')
                .setScale(0.5)
                .setVisible(i < this.hearts);
            this.heartIcons.push(heart);
        }

        // Puan
        this.scoreText = this.add.text(650, 250, `PUAN: ${this.score}`, {
            fontSize: '24px',
            fill: '#55ff55',
            fontFamily: 'Arial, sans-serif'
        });

        // Seviye
        this.levelText = this.add.text(650, 300, `SEVİYE: ${this.level}`, {
            fontSize: '24px',
            fill: '#aaaaff',
            fontFamily: 'Arial, sans-serif'
        });
        
        console.log('UI çizildi');
    }

    createGrid() {
        console.log('Grid oluşturuluyor...');
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = null;
            }
        }
    }

    drawGrid() {
        console.log('Grid çizgileri çiziliyor...');
        const startX = 200;
        const startY = 150;

        // Izgara çizgileri
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.add.rectangle(
                    startX + x * this.cellSize,
                    startY + y * this.cellSize,
                    this.cellSize - 5,
                    this.cellSize - 5,
                    0xffffff,
                    0.05
                ).setStrokeStyle(2, 0x333333);
            }
        }
    }

    startGame() {
        console.log('Oyun başlatılıyor...');
        const startX = 200;
        const startY = 150;
        
        this.canPlay = true;
        console.log('canPlay:', this.canPlay);

        // Rastgele meyveler oluştur
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const fruitType = Phaser.Math.RND.pick(this.fruitTypes);
                const fruit = this.add.image(
                    startX + x * this.cellSize,
                    startY + y * this.cellSize,
                    fruitType
                ).setScale(0.4)
                 .setInteractive({ useHandCursor: true })
                 .setData('x', x)
                 .setData('y', y);

                fruit.on('pointerdown', () => {
                    console.log(`Meyve tıklandı: (${x}, ${y})`);
                    this.selectFruit(fruit);
                });
                
                this.grid[y][x] = { 
                    sprite: fruit, 
                    type: fruitType, 
                    x: x, 
                    y: y 
                };
            }
        }

        console.log('Meyveler oluşturuldu, eşleşme kontrolü yapılıyor...');
        // Başlangıçta eşleşme kontrolü
        this.checkMatches(true);
    }

    selectFruit(fruit) {
        if (!this.canPlay || this.isSwapping || !this.gameStarted) {
            console.log('Oynanamıyor: canPlay=', this.canPlay, 'isSwapping=', this.isSwapping);
            return;
        }

        console.log('Meyve seçildi:', fruit.getData('x'), fruit.getData('y'));
        
        if (!this.selectedFruit) {
            // İlk meyve seçimi
            this.selectedFruit = fruit;
            fruit.setTint(0xaaaaaa); // Gri ton
            console.log('İlk meyve seçildi');
        } else {
            // İkinci meyve seçimi
            const firstX = this.selectedFruit.getData('x');
            const firstY = this.selectedFruit.getData('y');
            const secondX = fruit.getData('x');
            const secondY = fruit.getData('y');

            console.log(`Swap deneniyor: (${firstX},${firstY}) <-> (${secondX},${secondY})`);
            
            // Sadece yan yana meyveler swap yapabilir
            const isAdjacent = 
                (Math.abs(firstX - secondX) === 1 && firstY === secondY) ||
                (Math.abs(firstY - secondY) === 1 && firstX === secondX);

            if (isAdjacent) {
                console.log('Meyveler yan yana, swap yapılıyor...');
                this.swapFruits(this.selectedFruit, fruit);
            } else {
                console.log('Meyveler yan yana değil, seçim değiştiriliyor...');
                // Farklı meyve seçildi, sadece seçimi değiştir
                this.selectedFruit.clearTint();
                this.selectedFruit = fruit;
                fruit.setTint(0xaaaaaa);
            }
        }
    }

    swapFruits(fruit1, fruit2) {
        console.log('swapFruits fonksiyonu çalıştı');
        this.isSwapping = true;
        this.canPlay = false;

        const x1 = fruit1.getData('x');
        const y1 = fruit1.getData('y');
        const x2 = fruit2.getData('x');
        const y2 = fruit2.getData('y');

        console.log(`Swap: (${x1},${y1}) <-> (${x2},${y2})`);

        // Grid'de yerlerini değiştir
        const temp = this.grid[y1][x1];
        this.grid[y1][x1] = this.grid[y2][x2];
        this.grid[y2][x2] = temp;

        // Sprite verilerini güncelle
        fruit1.setData('x', x2);
        fruit1.setData('y', y2);
        fruit2.setData('x', x1);
        fruit2.setData('y', y1);

        // Grid referanslarını güncelle
        if (this.grid[y1][x1]) {
            this.grid[y1][x1].x = x1;
            this.grid[y1][x1].y = y1;
        }
        if (this.grid[y2][x2]) {
            this.grid[y2][x2].x = x2;
            this.grid[y2][x2].y = y2;
        }

        // Animasyon
        this.tweens.add({
            targets: fruit1,
            x: fruit2.x,
            y: fruit2.y,
            duration: 200,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: fruit2,
            x: fruit1.x,
            y: fruit1.y,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                console.log('Swap animasyonu tamamlandı');
                this.isSwapping = false;
                this.selectedFruit.clearTint();
                this.selectedFruit = null;
                this.checkMatches(false);
            }
        });
    }

    checkMatches(initial = false) {
        console.log('checkMatches çağrıldı, initial:', initial);
        const matches = this.findMatches();
        console.log('Bulunan eşleşmeler:', matches.length);
        
        if (matches.length > 0) {
            // Eşleşme var
            console.log('Eşleşme bulundu, meyveler kaldırılıyor...');
            this.removeMatches(matches);
            if (!initial) {
                this.updateMoves();
            }
        } else {
            // Eşleşme yok
            console.log('Eşleşme yok');
            if (!initial) {
                // Geçersiz hamle
                console.log('Geçersiz hamle, canPlay true yapılıyor');
                this.canPlay = true;
            } else {
                this.canPlay = true;
            }
        }
    }

    findMatches() {
        const matches = [];
        console.log('Eşleşmeler aranıyor...');

        // Yatay kontrol
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize - 2; x++) {
                const cell1 = this.grid[y][x];
                const cell2 = this.grid[y][x + 1];
                const cell3 = this.grid[y][x + 2];
                
                if (cell1 && cell2 && cell3) {
                    if (cell1.type === cell2.type && cell1.type === cell3.type) {
                        console.log(`Yatay eşleşme: (${x},${y}) tip: ${cell1.type}`);
                        matches.push({ x, y, horizontal: true });
                    }
                }
            }
        }

        // Dikey kontrol
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize - 2; y++) {
                const cell1 = this.grid[y][x];
                const cell2 = this.grid[y + 1][x];
                const cell3 = this.grid[y + 2][x];
                
                if (cell1 && cell2 && cell3) {
                    if (cell1.type === cell2.type && cell1.type === cell3.type) {
                        console.log(`Dikey eşleşme: (${x},${y}) tip: ${cell1.type}`);
                        matches.push({ x, y, horizontal: false });
                    }
                }
            }
        }

        return matches;
    }

    removeMatches(matches) {
        console.log('Eşleşen meyveler kaldırılıyor...');
        const fruitsToRemove = [];
        const matchedPositions = new Set();

        matches.forEach(match => {
            if (match.horizontal) {
                for (let i = 0; i < 3; i++) {
                    const fruit = this.grid[match.y][match.x + i];
                    if (fruit) {
                        const posKey = `${fruit.x},${fruit.y}`;
                        if (!matchedPositions.has(posKey)) {
                            fruitsToRemove.push(fruit);
                            matchedPositions.add(posKey);
                        }
                    }
                }
            } else {
                for (let i = 0; i < 3; i++) {
                    const fruit = this.grid[match.y + i][match.x];
                    if (fruit) {
                        const posKey = `${fruit.x},${fruit.y}`;
                        if (!matchedPositions.has(posKey)) {
                            fruitsToRemove.push(fruit);
                            matchedPositions.add(posKey);
                        }
                    }
                }
            }
        });

        console.log(`Kaldırılacak meyve sayısı: ${fruitsToRemove.length}`);

        // Meyveleri yok et ve puan ekle
        fruitsToRemove.forEach(fruit => {
            if (fruit && fruit.sprite) {
                fruit.sprite.destroy();
                this.grid[fruit.y][fruit.x] = null;
                this.score += 100;
                console.log(`Meyve kaldırıldı: (${fruit.x},${fruit.y}), yeni puan: ${this.score}`);
            }
        });

        this.scoreText.setText(`PUAN: ${this.score}`);
        
        // Boşlukları doldur
        this.fillEmptySpaces();
    }

    fillEmptySpaces() {
        console.log('Boşluklar dolduruluyor...');
        const startX = 200;
        const startY = 150;

        // Meyveleri aşağı kaydır
        for (let x = 0; x < this.gridSize; x++) {
            let emptySpaces = 0;
            for (let y = this.gridSize - 1; y >= 0; y--) {
                if (this.grid[y][x] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const fruit = this.grid[y][x];
                    this.grid[y + emptySpaces][x] = fruit;
                    this.grid[y][x] = null;
                    fruit.y = y + emptySpaces;
                    fruit.sprite.setData('y', y + emptySpaces);
                    
                    this.tweens.add({
                        targets: fruit.sprite,
                        y: startY + (y + emptySpaces) * this.cellSize,
                        duration: 300,
                        ease: 'Bounce.Out'
                    });
                }
            }

            // Yukarıdan yeni meyveler ekle
            for (let y = 0; y < emptySpaces; y++) {
                const fruitType = Phaser.Math.RND.pick(this.fruitTypes);
                const fruit = this.add.image(
                    startX + x * this.cellSize,
                    startY - (emptySpaces - y) * this.cellSize,
                    fruitType
                ).setScale(0.4)
                 .setInteractive({ useHandCursor: true })
                 .setData('x', x)
                 .setData('y', y);

                fruit.on('pointerdown', () => {
                    console.log(`Yeni meyve tıklandı: (${x}, ${y})`);
                    this.selectFruit(fruit);
                });
                
                this.grid[y][x] = { 
                    sprite: fruit, 
                    type: fruitType, 
                    x: x, 
                    y: y 
                };

                this.tweens.add({
                    targets: fruit,
                    y: startY + y * this.cellSize,
                    duration: 400,
                    ease: 'Back.Out',
                    delay: y * 100
                });
            }
        }

        console.log('Yeni meyveler eklendi, tekrar kontrol edilecek...');
        // Yeni meyveler yerleştikten sonra tekrar kontrol et
        this.time.delayedCall(800, () => {
            console.log('Gecikmeli eşleşme kontrolü');
            this.checkMatches(true);
            this.canPlay = true;
        });
    }

    updateMoves() {
        this.movesLeft--;
        console.log(`Kalan hamle: ${this.movesLeft}`);
        this.movesText.setText(`HAMLE: ${this.movesLeft}`);

        if (this.movesLeft <= 0) {
            console.log('Hamle bitti, oyun sonu');
            this.gameOver();
        }
    }

    gameOver() {
        console.log('Oyun bitti ekranı gösteriliyor');
        this.canPlay = false;
        
        const overlay = this.add.rectangle(400, 300, 500, 300, 0x000000, 0.8);
        
        this.add.text(400, 250, 'OYUN BİTTİ!', {
            fontSize: '48px',
            fill: '#ff5555',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);
        
        this.add.text(400, 320, `SKOR: ${this.score}`, {
            fontSize: '36px',
            fill: '#ffff55',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);
        
        // Yeniden başlat butonu
        const restartButton = this.add.rectangle(400, 380, 200, 50, 0x00aa00)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(400, 380, 'YENİDEN BAŞLAT', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);
        
        restartButton.on('pointerdown', () => {
            console.log('Yeniden başlatılıyor...');
            this.scene.restart();
        });
    }

    update() {
        // Oyun loop - şimdilik boş
    }
}