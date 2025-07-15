// get canvas element
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set size of the canvas
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

// temporary player object
const player = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  color: "blue",
};
// temporary object
const objectFloor = {
  x: 50,
  y: 800,
  width: 1000,
  height: 10,
  color: "red",
};
// temporary object
const object = {
  x: 300,
  y: 700,
  width: 500,
  height: 10,
  color: "green",
};
// temporary object
const object2 = {
  x: 600,
  y: 500,
  width: 10,
  height: 300,
  color: "yellow",
};

// Keep list of all Objects in room for collision detection
const objects = [objectFloor, object, object2];

// function to draw scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  ctx.fillStyle = player.color; // set player color
  ctx.fillRect(player.x, player.y, player.width, player.height); // draw player
  //   for loop to draw all objects
  for (let obj of objects) {
    ctx.fillStyle = obj.color; // set object color
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height); // draw object
  }
}

// #region game logic

// variables
// movement variables
let movingLeft = false;
let movingRight = false;
let speedBoost = 1.5;
// jumping variables
let jumping = false;
let jumpAllowed = false; // allow jumping only when on the ground
let jumpHeight = 30; // height of the jump
// gravity variable
let gravity = 10;

// Add event listener for keydown events
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      jumping = true; // move up
      break;
    case "ArrowLeft":
      movingRight = true; // move left
      break;
    case "ArrowRight":
      movingLeft = true; // move right
      break;
  }
});
// Add event listener for keyup events
document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      movingRight = false; // stop moving left
      break;
    case "ArrowRight":
      movingLeft = false; // stop moving right
      break;
  }
});

function update() {
  // update player position based on input
  if (movingLeft) {
    player.x += 5; // move left
  }
  if (movingRight) {
    player.x -= 5; // move right
  }
  if (jumping && jumpAllowed) {
    gravity *= -1; // jump up
    jumpAllowed = false; // prevent further jumps until landing
  }

  //jump logic
  if (jumping) {
    if (jumpHeight == 0) {
      jumping = false; // stop jumping
      gravity *= -1; // reset gravity
      jumpHeight = 30; // reset jump height
    } else {
      jumpHeight -= 1; // decrease jump height
    }
  }

  // apply gravity
  player.y += gravity;

  // check for collision with the object
  for (let obj of objects) {
    // Check for collision on the x-axis
    if (
      (player.x > obj.x && player.x <= obj.x + obj.width) ||
      (player.x + player.width >= obj.x &&
        player.x + player.width <= obj.x + obj.width)
    ) {
      // check for collision on the y-axis from above
      if (
        player.y + player.height + gravity >= obj.y &&
        player.y + gravity < obj.y
      ) {
        player.y = obj.y - player.height; // place player on top of the object
        jumpAllowed = true; // allow jumping again
      }
      // check for collision on the y-axis from below
      else if (
        player.y - 50 <= obj.y + obj.height &&
        player.y + player.height >= obj.y + obj.height &&
        jumping
      ) {
        player.y = obj.y + obj.height; // place player below the object
        console.log("collided from below");
        jumpHeight = 0;
      }
    }
    // do same for vertical collision
    // Check for collision on the y-axis
    if (
      (player.y > obj.y && player.y <= obj.y + obj.height) ||
      (player.y + player.height >= obj.y &&
        player.y + player.height <= obj.y + obj.height)
    ) {
      // check for collision on the x-axis from the left
      if (
        player.x + player.width + 5 > obj.x &&
        player.x + 5 < obj.x
      ) {
        player.x = obj.x - player.width; // place player to the left of the object
      }
      // check for collision on the x-axis from the right
      else if (
        player.x - 5 < obj.x + obj.width &&
        player.x + player.width > obj.x + obj.width
      ) {
        player.x = obj.x + obj.width; // place player to the right of the object
      }
    }
  }
}
// #endregion

// region rendering
// game loop
function gameLoop() {
  update(); // update game state
  draw(); // draw the scene
  requestAnimationFrame(gameLoop); // call gameLoop again for the next frame
}

gameLoop(); // start the game loop
