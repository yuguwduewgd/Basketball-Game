const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const angleInput = document.getElementById('angle');
const powerInput = document.getElementById('power');
const angleVal = document.getElementById('angleVal');
const powerVal = document.getElementById('powerVal');
const scoreEl = document.getElementById('score');
const shootBtn = document.getElementById('shootBtn');

let score = 0;

// Ball and hoop properties
const ballRadius = 12;
const hoop = {
  x: 700,
  y: 220,
  width: 60,
  height: 8,
  rimX: 700 + 10,
  rimY: 220,
  rimWidth: 40
};

let ball = {
  x: 100,
  y: 420,
  vx: 0,
  vy: 0,
  inAir: false
};

let currentAngle = parseInt(angleInput.value);
let currentPower = parseInt(powerInput.value);

// Update display values
angleVal.textContent = currentAngle;
powerVal.textContent = currentPower;

angleInput.addEventListener('input', () => {
  currentAngle = parseInt(angleInput.value);
  angleVal.textContent = currentAngle;
});
powerInput.addEventListener('input', () => {
  currentPower = parseInt(powerInput.value);
  powerVal.textContent = currentPower;
});

shootBtn.addEventListener('click', shootBall);
document.addEventListener('keydown', (e) => {
  if (e.code === "Space") shootBall();
});

function shootBall() {
  if (ball.inAir) return;
  const angleRad = currentAngle * Math.PI / 180;
  ball.vx = Math.cos(angleRad) * currentPower;
  ball.vy = -Math.sin(angleRad) * currentPower;
  ball.inAir = true;
}

function resetBall() {
  ball.x = 100;
  ball.y = 420;
  ball.vx = 0;
  ball.vy = 0;
  ball.inAir = false;
}

// Physics constants
const gravity = 0.5;
const groundY = 432;

function update() {
  if (ball.inAir) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;

    // Rim collision (simple check)
    if (
      ball.x + ballRadius > hoop.rimX &&
      ball.x - ballRadius < hoop.rimX + hoop.rimWidth &&
      ball.y + ballRadius > hoop.rimY && 
      ball.y - ballRadius < hoop.rimY + 10 &&
      ball.vy > 0
    ) {
      // Ball passed through the rim (scored)
      score++;
      scoreEl.textContent = score;
      setTimeout(resetBall, 800);
      ball.inAir = false;
    }
    // Ground collision
    if (ball.y + ballRadius > groundY) {
      ball.y = groundY - ballRadius;
      setTimeout(resetBall, 800);
      ball.inAir = false;
    }
  }
}

function drawHoop() {
  // Backboard
  ctx.fillStyle = "#666";
  ctx.fillRect(hoop.x + hoop.width - 8, hoop.y - 30, 8, 60);
  // Rim
  ctx.strokeStyle = "#e06020";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(hoop.rimX, hoop.rimY);
  ctx.lineTo(hoop.rimX + hoop.rimWidth, hoop.rimY);
  ctx.stroke();
}

function drawCourt() {
  // Ground
  ctx.fillStyle = '#f8e6b5';
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
  // 3pt arc (decorative)
  ctx.strokeStyle = '#aaa';
  ctx.beginPath();
  ctx.arc(hoop.x - 80, groundY, 120, Math.PI, 0);
  ctx.stroke();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#e06020";
  ctx.fill();
  ctx.strokeStyle = "#b24913";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCourt();
  drawHoop();
  drawBall();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
