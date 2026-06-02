const canvas = document.getElementById("rainCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --------------------
// RAIN
// --------------------
const raindrops = [];
const rainCount = 1000;

class Raindrop {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.length = Math.random() * 25 + 10;
        this.speed = Math.random() * 12 + 10;
        this.opacity = Math.random() * 0.6 + 0.3;
    }

    update() {
        this.y += this.speed;
        this.x -= 2;

        if (this.y > canvas.height) {
            this.reset();
            this.y = -20;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 180, 255, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 4, this.y + this.length);
        ctx.stroke();
    }
}

for (let i = 0; i < rainCount; i++) {
    raindrops.push(new Raindrop());
}

// --------------------
// CLOUDS
// --------------------
const clouds = [];

class Cloud {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * 120;

        this.width = Math.random() * 250 + 250;
        this.height = Math.random() * 50 + 60;

        this.speed = Math.random() * 0.05 + 0.01;
    }

    update() {
        this.x += this.speed;

        if (this.x > canvas.width + this.width) {
            this.x = -this.width;
        }
    }

    draw() {
        ctx.fillStyle = "rgba(25,25,25,0.95)";

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.height * 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.25, this.y - 20, this.height, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.5, this.y - 10, this.height * 1.2, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.75, this.y - 20, this.height, 0, Math.PI * 2);
        ctx.arc(this.x + this.width, this.y, this.height * 0.8, 0, Math.PI * 2);

        ctx.fill();
    }
}

// MORE CLOUDS
for (let i = 0; i < 15; i++) {
    clouds.push(new Cloud());
}

// --------------------
// LIGHTNING
// --------------------
let lightningAlpha = 0;
let lightningPath = [];

function createLightning() {
    lightningAlpha = 0.9;
    lightningPath = [];

    let x = Math.random() * canvas.width;
    let y = 0;

    lightningPath.push({ x, y });

    while (y < canvas.height * 0.7) {
        x += Math.random() * 40 - 20;
        y += Math.random() * 35;

        lightningPath.push({ x, y });
    }
}

setInterval(() => {
    if (Math.random() > 0.3) {
        createLightning();
    }
}, 2500);

function drawLightning() {
    if (lightningAlpha <= 0 || lightningPath.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(lightningPath[0].x, lightningPath[0].y);

    for (let point of lightningPath) {
        ctx.lineTo(point.x, point.y);
    }

    ctx.strokeStyle = `rgba(255,255,255,${lightningAlpha})`;
    ctx.lineWidth = 3;

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ffffff";

    ctx.stroke();
}

// --------------------
// ANIMATION
// --------------------
function animate() {
    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
    });

    // Rain Glow
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#00aaff";

    // Rain
    raindrops.forEach(drop => {
        drop.update();
        drop.draw();
    });

    // Lightning flash
    if (lightningAlpha > 0) {
        ctx.fillStyle = `rgba(255,255,255,${lightningAlpha * 0.25})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawLightning();

        lightningAlpha -= 0.03;
    }

    requestAnimationFrame(animate);
}

animate();

// --------------------
// RESIZE
// --------------------
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});