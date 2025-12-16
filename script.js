const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Bird properties
const bird = {
    x: 80,
    y: canvasHeight/2,
    width: 30,
    height: 30,
    color: '#FFD700', // cool gold
    gravity: 0.6,
    lift: -7,
    velocity: 0
};

// Pipe properties
const pipeWidth = 60;
const pipeGap = 150;
const pipeColor = '#4CAF50'; // cool green
let pipes = [];

let frame = 0;
let score = 0;
let gameOver = false;

// Handle input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') bird.velocity = bird.lift;
});
canvas.addEventListener('click', () => bird.velocity = bird.lift);

// Pipe constructor
function Pipe(x) {
    const topHeight = Math.random() * (canvasHeight - pipeGap - 100) + 50;
    this.x = x;
    this.top = topHeight;
    this.bottom = canvasHeight - topHeight - pipeGap;
    this.width = pipeWidth;
    this.passed = false;

    this.draw = function() {
        ctx.fillStyle = pipeColor;
        // Top pipe
        ctx.fillRect(this.x, 0, this.width, this.top);
        // Bottom pipe
        ctx.fillRect(this.x, canvasHeight - this.bottom, this.width, this.bottom);
    };

    this.update = function() {
        this.x -= 2; // pipe speed
        if (!this.passed && this.x + this.width < bird.x) {
            score++;
            document.getElementById('score').innerText = "Score: " + score;
            this.passed = true;
        }
    };
}

// Game loop
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw bird
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Add new pipes
    if (frame % 90 === 0) {
        pipes.push(new Pipe(canvasWidth));
    }

    // Update and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].draw();

        // Collision
        if (bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvasHeight - pipes[i].bottom)) {
            gameOver = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipes[i].width < 0) pipes.splice(i,1);
    }

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvasHeight || bird.y < 0) {
        gameOver = true;
    }

    // Game Over
    if (gameOver) {
        document.getElementById('gameOver').style.display = 'block';
        return; // stop the loop
    }

    frame++;
    requestAnimationFrame(draw);
}

// Start game
draw();
