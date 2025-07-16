const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const landing = document.getElementById("landing-screen");
const startBtn = document.getElementById("start-btn");

// Input flags
let rightPressed = false;
let leftPressed = false;

// Game state variables
let x, y, dx, dy, ballRadius;
let paddleHeight, paddleWidth, paddleX;
let brickRowCount, brickColumnCount, brickWidth, brickHeight;
let brickPadding, brickOffsetTop, brickOffsetLeft;
let bricks = [];

// Start the game after clicking "Start Game"
startBtn.addEventListener("click", () => {
  landing.style.display = "none";
  canvas.style.display = "block";
  initGame();
});

function initGame() {
  // Ball
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  ballRadius = 10;

  // Paddle
  paddleHeight = 10;
  paddleWidth = 75;
  paddleX = (canvas.width - paddleWidth) / 2;

  // Bricks
  brickRowCount = 5;
  brickColumnCount = 3;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;

  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  draw(); // Start the game loop
}

// Handle keyboard input
document.addEventListener("keydown", e => {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
  if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
  if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
});

// Drawing functions
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Ball movement and wall collisions
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("💥 Game Over!");
      document.location.reload();
      return;
    }
  }

  x += dx;
  y += dy;

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  if (leftPressed && paddleX > 0) paddleX -= 7;

  requestAnimationFrame(draw);
}
