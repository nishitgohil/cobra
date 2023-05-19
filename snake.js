// Set up the canvas
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const gameLoop = setInterval(update, 100);
// Define the size of each cell in the grid
const cellSize = 20;

// Calculate the number of cells in the horizontal and vertical directions
const gridWidth = Math.floor(canvasWidth / cellSize);
const gridHeight = Math.floor(canvasHeight / cellSize);

// Initialize the snake's initial position and direction
let snake = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 }
];
let direction = "right";

// Define obstacle variants
const obstacleVariants = [
  { x: 8, y: 5, color: "gray", size: 20 },
  { x: 8, y: 6, color: "blue", size: 15 },
  { x: 8, y: 7, color: "purple", size: 25 },
  // Add more obstacle variants here
];

// Initialize the obstacles
let obstacles = obstacleVariants.map(variant => ({ ...variant }));

// Function to draw the obstacles
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;

    // Draw a circle obstacle
    ctx.beginPath();
    ctx.arc(
      obstacle.x * cellSize + cellSize / 2,
      obstacle.y * cellSize + cellSize / 2,
      obstacle.size / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

  
  });
}

// Function to check if the snake has collided with an obstacle
// function isCollision(head) {
//   for (let i = 1; i < snake.length; i++) {
//     if (snake[i].x === head.x && snake[i].y === head.y) {
//       return true;
//     }
//   }
  
//   for (let i = 0; i < obstacles.length; i++) {
//     if (obstacles[i].x === head.x && obstacles[i].y === head.y) {
//       return true;
//     }
//   }
  
  
//   return false;
// }

// Function to check if the snake's head collides with an obstacle
function isCollisionWithObstacle() {
  const head = snake[0];

  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x === head.x && obstacles[i].y === head.y) {
      return true;
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x === head.x && obstacles[i].y === head.y) {
      return true;
    }
  }
  return false;
}

// Initialize the food's position
let food = { x: 10, y: 10 };

// Function to draw a cell
function drawCell(x, y) {
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

// Function to draw the snake
function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach(segment => drawCell(segment.x, segment.y));
}

// Function to draw the food
function drawFood() {
  ctx.fillStyle = "red";
  drawCell(food.x, food.y);
}

// Function to update the game state
function update() {
  // Move the snake
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case "up":
      head.y = (head.y - 1 + gridHeight) % gridHeight;
      break;
    case "down":
      head.y = (head.y + 1) % gridHeight;
      break;
    case "left":
      head.x = (head.x - 1 + gridWidth) % gridWidth;
      break;
    case "right":
      head.x = (head.x + 1) % gridWidth;
      break;
  }
  snake.unshift(head);

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    // Generate new food
    food = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
  } else {
    // Remove the tail segment
    snake.pop();
  }

  // Check if the snake has collided with the walls or itself
  if (
    head.x < 0 ||
    head.x >= gridWidth ||
    head.y < 0 ||
    head.y >= gridHeight ||
    isCollision(head)
  ) {
    clearInterval(gameLoop);
    alert("Game over!");
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw the snake and food
  drawSnake();
  drawFood();
  drawObstacles();
}

// Function to check if the snake has collided with itself
function isCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

// Add event listener to handle touch events
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("keydown", handleKeyDown);

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Function to handle touch start event
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

// Function to handle touch move event
function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
  
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  
  // Check the larger component to determine the predominant direction
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "left") {
      direction = "right";
    } else if (dx < 0 && direction !== "right") {
      direction = "left";
    }
  } else {
    if (dy > 0 && direction !== "up") {
      direction = "down";
    } else if (dy < 0 && direction !== "down") {
      direction = "up";
    }
  }
}

// Function to handle keydown events
function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") {
        direction = "up";
      }
      break;
    case "ArrowDown":
      if (direction !== "up") {
        direction = "down";
      }
      break;
    case "ArrowLeft":
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case "ArrowRight":
      if (direction !== "left") {
        direction = "right";
      }
      break;
  }
}
// Start
