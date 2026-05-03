const LevelManager = {
    getLevelConfig(level) {
        // Her seviyede zorluğu artıran dinamik matematiksel model
        return {
            level: level,
            targetCount: 10 + (level * 2), // Her seviye +2 meyve ister
            moves: Math.max(10, 25 - Math.floor(level / 2)), // Hamle sayısı azalır
            duration: Math.max(30, 90 - (level * 2)), // Süre kısalır
            speed: 2 + (level * 0.2), // Meyve düşüş hızı artar
            targetFruit: this.getRandomFruit()
        };
    },
    
    getRandomFruit() {
        const fruits = ['apple', 'strawberry', 'banana', 'orange'];
        return fruits[Math.floor(Math.random() * fruits.length)];
    }
};