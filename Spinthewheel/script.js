let hasSpun = false;

function getTelegramUser() {
    // Get user ID from Telegram Web App
    return window.Telegram.WebApp.initDataUnsafe;
}

async function checkIfAlreadySpun(userId) {
    // Replace with your Firebase URL later
    const response = await fetch(`https://YOUR-FIREBASE.firebaseio.com/spins/${userId}.json`);
    const data = await response.json();
    return data !== null;
}

async function saveSpinResult(userId, prize) {
    // Replace with your Firebase URL later
    await fetch(`https://YOUR-FIREBASE.firebaseio.com/spins/${userId}.json`, {
        method: 'PUT',
        body: JSON.stringify({ prize: prize, timestamp: Date.now() })
    });
}

async function spinWheel() {
    const user = getTelegramUser();
    
    if (!user || !user.user) {
        document.getElementById('result').innerText = "Please open in Telegram!";
        return;
    }
    
    const userId = user.user.id;
    
    // Check if already spun
    if (await checkIfAlreadySpun(userId)) {
        document.getElementById('result').innerText = "You have already spun!";
        return;
    }
    
    if (hasSpun) return;
    hasSpun = true;
    
    document.getElementById('spinBtn').disabled = true;
    
    // Random spin (0 to 360 + random segment)
    const segments = 6;
    const degrees = Math.floor(Math.random() * 360) + (360 * 5);
    const rotation = 360 * 5 + Math.floor(Math.random() * 6) * 60 + 30;
    
    document.getElementById('wheel').style.transform = `rotate(${rotation}deg)`;
    
    // Calculate prize
    setTimeout(async () => {
        const prizeIndex = Math.floor((rotation % 360) / 60);
        const prizes = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Prize 5", "Prize 6"];
        const prize = prizes[prizeIndex];
        
        document.getElementById('result').innerText = `🎉 You won: ${prize}! 🎉`;
        
        // Save to database
        await saveSpinResult(userId, prize);
        
        // Notify Telegram
        window.Telegram.WebApp.close();
    }, 4000);
}

// Initialize Telegram Web App
window.Telegram.WebApp.ready();