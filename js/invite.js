// ============= ARKADAŞ DAVET SİSTEMİ =============
let inviteData = {
    count: parseInt(localStorage.getItem('inviteCount') || '0'),
    earned: parseInt(localStorage.getItem('inviteEarned') || '0'),
    refCode: localStorage.getItem('inviteRefCode') || '12345'
};

function updateInviteStats() {
    // Modal için
    if (document.getElementById('modalInviteCount')) {
        document.getElementById('modalInviteCount').textContent = inviteData.count;
        document.getElementById('modalInviteEarned').textContent = inviteData.earned + ' Jeton';
    }
    // Sonraki hedef
    let nextGoal = '';
    if (inviteData.count < 3) nextGoal = '3 arkadaş';
    else if (inviteData.count < 5) nextGoal = '5 arkadaş';
    else nextGoal = 'Tüm ödüller toplandı! 🎉';
    if (document.getElementById('nextGoal')) document.getElementById('nextGoal').textContent = nextGoal;
    
    // Ödül durumlarını güncelle
    if (document.getElementById('reward1')) {
        document.getElementById('reward1').classList.toggle('completed', inviteData.count >= 1);
        document.getElementById('reward3').classList.toggle('completed', inviteData.count >= 3);
        document.getElementById('reward5').classList.toggle('completed', inviteData.count >= 5);
    }
}

function showInviteModal() {
    let modal = document.getElementById('inviteModal');
    if (!modal) {
        const modalHtml = `
            <div class="invite-modal" id="inviteModal">
                <div class="invite-card">
                    <h2>👥 Arkadaşını Davet Et</h2>
                    <div class="invite-link-box">
                        <p>🔗 Davet Linkin:</p>
                        <div class="link-input-group">
                            <input type="text" id="modalInviteLink" readonly>
                            <button class="copy-btn" onclick="copyInviteLink()">📋 KOPYALA</button>
                        </div>
                    </div>
                    <div class="rewards-grid">
                        <div class="reward-item" id="reward1"><div class="count">1</div><div class="prize">30 Jeton</div></div>
                        <div class="reward-item" id="reward3"><div class="count">3</div><div class="prize">100 Jeton<br>+ Buz</div></div>
                        <div class="reward-item" id="reward5"><div class="count">5</div><div class="prize">200 Jeton<br>+2 Kalp</div></div>
                    </div>
                    <div class="stats-box">
                        <div class="stats-row"><span>📊 Davet Ettiğin:</span><span id="modalInviteCount">0</span></div>
                        <div class="stats-row"><span>💰 Kazandığın:</span><span id="modalInviteEarned">0</span></div>
                        <div class="stats-row"><span>🎯 Sonraki Hedef:</span><span id="nextGoal">3 arkadaş</span></div>
                    </div>
                    <button class="close-modal" onclick="closeInviteModal()">✖</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    modal = document.getElementById('inviteModal');
    const link = `https://fruitcombine.com/ref/${inviteData.refCode}`;
    if (document.getElementById('modalInviteLink')) document.getElementById('modalInviteLink').value = link;
    
    updateInviteStats();
    modal.classList.add('active');
}

function closeInviteModal() {
    const modal = document.getElementById('inviteModal');
    if (modal) modal.classList.remove('active');
}

function copyInviteLink() {
    const linkInput = document.getElementById('inviteLink') || document.getElementById('inviteLinkSettings') || document.getElementById('modalInviteLink');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
        showToast('📋 Davet linki kopyalandı!');
    }
}

function calculateEarned(count) {
    let earned = 0;
    if (count >= 1) earned += 30;
    if (count >= 3) earned += 100;
    if (count >= 5) earned += 200;
    return earned;
}

function addInvite() {
    inviteData.count++;
    inviteData.earned = calculateEarned(inviteData.count);
    localStorage.setItem('inviteCount', inviteData.count);
    localStorage.setItem('inviteEarned', inviteData.earned);
    updateInviteStats();
    showToast('🎁 Yeni davet kazanıldı!');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateInviteStats();
});

window.addInvite = addInvite;