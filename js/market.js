const Market = {
    coins: 50, // Başlangıç jetonu
    items: [
        { id: 'coin_100', price: '29.99 TL', amount: 100, type: 'coin' },
        { id: 'infinite_hearts', price: '49.99 TL', amount: 60, type: 'time_heart' }
    ],

    buyItem(itemId) {
        // Play Store Entegrasyonu Tetikleyici
        console.log(itemId + " için ödeme başlatılıyor...");
        
        // Ödeme Başarılı Varsayalım:
        this.processPayment(itemId);
    },

    processPayment(itemId) {
        // Ödeme onaylandıktan sonra hesaba yatır
        if(itemId.includes('coin')) {
            this.coins += 100;
            alert("Ödeme Başarılı! 100 Jeton Eklendi.");
        }
        updateUI();
    },

    usePowerUp(type) {
        if (type === 'freeze' && this.coins >= 5) {
            this.coins -= 5;
            freezeGame();
        } else if (type === 'extra_moves' && this.coins >= 4) {
            this.coins -= 4;
            moves += 5;
        }
        updateUI();
    }
};