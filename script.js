const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const highScoreBtn = document.getElementById('highScoreBtn');
const highScoreDisplay = document.getElementById('highScoreDisplay');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let bird;
let pipes;
let frame;
let score;
let gameOver;
let animationId;
let highScore = 0;

// Pipe properties
const pipeWidth = 60;
const pipeGap = 150;
const pipeColor = '#4CAF50'; // cool green

// Initialize game
function init() {
    bird = {
        x: 80,
        y: canvasHeight/2,
        width: 30,
        height: 30,
        color: '#FFD700', // gold
        gravity: 0.6,
        lift: -7, // easier jump
        velocity: 0
    };
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    document.getElementById('score').innerText = "Score: 0";
    document.getElementById('gameOver').style.display = 'none';
    highScoreDisplay.style.display = 'none';
    cancelAnimationFrame(animationId);
}

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
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvasHeight - this.bottom, this.width, this.bottom);
    };

    this.update = function() {
        this.x -= 2;
        if (!this.passed && this.x + this.width < bird.x) {
            score++;
            document.getElementById('score').innerText = "Score: " + score;
            this.passed = true;
        }
    };
}

// Handle input
function jump() {
    bird.velocity = bird.lift;
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});
canvas.addEventListener('click', jump);

// Draw loop
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw bird
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Add pipes
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

        // Remove off-screen
        if (pipes[i].x + pipes[i].width < 0) pipes.splice(i,1);
    }

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Boundary check
    if (bird.y + bird.height > canvasHeight || bird.y < 0) {
        gameOver = true;
    }

    // Game over
    if (gameOver) {
        document.getElementById('gameOver').style.display = 'block';
        if(score > highScore) highScore = score;
        return; // stop loop
    }

    frame++;
    animationId = requestAnimationFrame(draw);
}

// Start button
startBtn.addEventListener('click', () => {
    init();
    draw();
});

// High score button
highScoreBtn.addEventListener('click', () => {
    highScoreDisplay.style.display = 'block';
    highScoreDisplay.innerText = "High Score: " + highScore;
});

// Initialize once
init();
