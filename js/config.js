// Oyun Konfigürasyonu
const CONFIG = {
    VERSION: '1.2.0',
    
    // Başlangıç değerleri
    INITIAL_JETON: 50,
    INITIAL_LEVEL: 1,
    INITIAL_MOVES: 30,
    INITIAL_TIME: 60,
    
    // Meyveler
    FRUITS: [
        { id: 'strawberry', name: 'Çilek', emoji: '🍓', color: '#ff4d4d', baseScore: 10 },
        { id: 'banana', name: 'Muz', emoji: '🍌', color: '#ffeb3b', baseScore: 15 },
        { id: 'apple', name: 'Elma', emoji: '🍎', color: '#f44336', baseScore: 12 },
        { id: 'orange', name: 'Portakal', emoji: '🍊', color: '#ff9800', baseScore: 12 },
        { id: 'pear', name: 'Armut', emoji: '🍐', color: '#8bc34a', baseScore: 15 }
    ],
    
    // Özel nesneler
    SPECIALS: {
        BOMB: { id: 'bomb', name: 'Bomba', emoji: '💣' },
        ICE: { id: 'ice', name: 'Buz', emoji: '❄️' }
    },
    
    // HIZLANDIRILMIŞ DÜŞÜŞ SÜRELERİ
    FALL_SPEEDS: {
        LEVEL_1: 700,
        LEVEL_10: 500,
        LEVEL_20: 350,
        LEVEL_30: 250,
        LEVEL_50: 180,
        LEVEL_100: 120
    },
    
    // GÜÇ MALİYETLERİ
    POWER_COSTS: {
        ICE: 5,
        TARGET_BOOST: 4,
        TIME_BOOST: 6,
        LEVEL_SKIP: 8
    },
    
    // Yıldız sınırları
    STAR_THRESHOLDS: {
        ONE_STAR: 50,
        TWO_STARS: 75,
        THREE_STARS: 100
    }
};

// Oyun durumu
let gameState = {
    currentLevel: 1,
    jeton: 50,
    moves: 30,
    timeLeft: 60,
    collectedFruits: {},
    targetFruits: {},
    isPaused: false,
    isIceActive: false,
    fallingSpeed: 700,
    soundEnabled: true,
    musicEnabled: true
};

// Seviye hedefleri oluştur - e.JPG'deki gibi 57 hedef
function generateLevelTargets(level) {
    // Ana hedef çilek - 57 olarak ayarlandı (e.JPG'deki gibi)
    return [
        { fruit: 'strawberry', count: 57 }
    ];
}

// Düşüş hızını hesapla
function calculateFallSpeed(level) {
    if (level <= 10) return CONFIG.FALL_SPEEDS.LEVEL_1;
    if (level <= 20) return CONFIG.FALL_SPEEDS.LEVEL_10;
    if (level <= 30) return CONFIG.FALL_SPEEDS.LEVEL_20;
    if (level <= 50) return CONFIG.FALL_SPEEDS.LEVEL_30;
    if (level <= 100) return CONFIG.FALL_SPEEDS.LEVEL_50;
    return CONFIG.FALL_SPEEDS.LEVEL_100;
}