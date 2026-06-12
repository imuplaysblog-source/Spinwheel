let hasSpun = false;
const options = ["God", "Demon", "Human", "Elfs", "Vikings"];

function getTelegramUser() {
    return window.Telegram.WebApp.initDataUnsafe;
}

async function spinWheel() {
    const user = getTelegramUser();
    
    if (!user || !user.user) {
        document.getElementById('result').innerText = "Please open in Telegram!";
        return;
    }
    
    const userId = user.user.id;
    
    if (hasSpun) return;
    hasSpun = true;
    
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    btn.innerText = "SPINNING...";
    
    // Calculate random result
    const randomDegree = Math.floor(Math.random() * 360);
    const spins = 5;
    const totalRotation = (spins * 360) + randomDegree;
    
    // Apply rotation
    const wheel = document.getElementById('wheel');
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    // Calculate prize after animation
    setTimeout(() => {
        // Normalize the angle (0-360)
        const actualDegree = randomDegree % 360;
        
        // Calculate which segment (5 segments = 72 degrees each)
        // The arrow points down, so we need to calculate from the opposite side
        const segmentIndex = Math.floor((360 - actualDegree + 36) % 360 / 72);
        
        const result = options[segmentIndex];
        
        document.getElementById('result').innerText = `🎉 You got: ${result}! 🎉`;
        btn.innerText = result;
        
        // Close after showing result
        setTimeout(() => {
            window.Telegram.WebApp.close();
        }, 2000);
        
    }, 5000);
}

// Initialize Telegram Web App
window.Telegram.WebApp.ready();