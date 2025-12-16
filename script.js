const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const highScoreBtn = document.getElementById('highScoreBtn');
const highScoreDisplay = document.getElementById('highScoreDisplay');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game variables
let bird, pipes, frame, score, gameOver, animationId, highScore;

// Bird settings
const birdSize = 30;
const birdColor = '#FFD700';
const gravity = 0.6;
const lift = -7;

// Pipe settings
const pipeWidth = 60;
const pipeGap = 150;
const pipeColor = '#4CAF50';

// Initialize game
function init() {
    bird = {
        x: 80,
        y: canvasHeight/2,
        width: birdSize,
        height: birdSize,
        velocity: 0,
        rotation: 0
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

// Input
function flap() {
    bird.velocity = lift;
}
document.addEventListener('keydown', e => { if(e.code === 'Space') flap(); });
canvas.addEventListener('click', flap);

// Pipe constructor
class Pipe {
    constructor(x) {
        this.x = x;
        this.top = Math.random() * (canvasHeight - pipeGap - 100) + 50;
        this.bottom = canvasHeight - this.top - pipeGap;
        this.width = pipeWidth;
        this.passed = false;
    }

    draw() {
        ctx.fillStyle = pipeColor;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvasHeight - this.bottom, this.width, this.bottom);
    }

    update() {
        this.x -= 2;
        if (!this.passed && this.x + this.width < bird.x) {
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
            this.passed = true;
        }
    }
}

// Draw bird with rotation
function drawBird() {
    ctx.save();
    ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
    ctx.rotate(Math.min(Math.PI/4, bird.velocity / 10)); // tilt based on velocity
    ctx.fillStyle = birdColor;
    ctx.fillRect(-bird.width/2, -bird.height/2, bird.width, bird.height);
    ctx.restore();
}

// Game loop
function draw() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);

    // Bird physics
    bird.velocity += gravity;
    bird.y += bird.velocity;

    drawBird();

    // Add new pipes
    if (frame % 90 === 0) pipes.push(new Pipe(canvasWidth));

    // Update and draw pipes
    for (let i = pipes.length -1; i >=0; i--) {
        pipes[i].update();
        pipes[i].draw();

        // Collision
        if (bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].top || bird.y + bird.height > canvasHeight - pipes[i].bottom)) {
            gameOver = true;
        }

        if (pipes[i].x + pipes[i].width < 0) pipes.splice(i,1);
    }

    // Boundaries
    if (bird.y + bird.height > canvasHeight || bird.y < 0) gameOver = true;

    // Game over
    if(gameOver){
        document.getElementById('gameOver').style.display = 'block';
        if(!highScore || score > highScore) highScore = score;
        return;
    }

    frame++;
    animationId = requestAnimationFrame(draw);
}

// Start button
startBtn.addEventListener('click', () => { init(); draw(); });

// High score button
highScoreBtn.addEventListener('click', () => {
    highScoreDisplay.style.display = 'block';
    highScoreDisplay.innerText = `High Score: ${highScore || 0}`;
});

// Initialize game
init();
