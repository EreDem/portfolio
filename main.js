// get canvas element
const canvas = document.getElementById("canvas");
canvas.style.imageRendering = "pixelated";
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Set size of the canvas
canvas.width = 320;
canvas.height = 180;
// fit to display size
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

// get all player sprites
const spriteIdle = new Image();
spriteIdle.src = "imgs/idleSprite.png";
const spriteRight1 = new Image();
spriteRight1.src = "imgs/spriteRight1.png";
const spriteRight2 = new Image();
spriteRight2.src = "imgs/spriteRight2.png";
const spriteLeft1 = new Image();
spriteLeft1.src = "imgs/spriteLeft1.png";
const spriteLeft2 = new Image();
spriteLeft2.src = "imgs/spriteLeft2.png";
const spriteJumpRight = new Image();
spriteJumpRight.src = "imgs/spriteJumpRight.png";
const spriteJumpLeft = new Image();
spriteJumpLeft.src = "imgs/spriteJumpLeft.png";

// variable to control which sprite is drawn
let currentSprite = spriteIdle;

// player hitbox
const playerHitBox = {
  x: 50,
  y: 50,
  width: 32,
  height: 32,
  color: "rgba(0, 0, 0, 0.0)",
};
objects = [];
// create objects and room

// function to manage/switch between player sprites
// global variable to give sprites time before switching
let spriteClock = 30;
function spriteManager(moving_left, moving_right, jump_allowed) {
  spriteClock--;
  console.log(spriteClock);
  // reset spriteclock
  if (spriteClock <= 0) spriteClock = 30;
  // Check if we need the jump sprites
  if (jump_allowed) {
    // player on floor
    if (moving_left) {
      // switch between sprites
      // clock decides which one
      if (currentSprite == spriteLeft1 && spriteClock >= 15)
        currentSprite = spriteLeft2;
      else if (spriteClock < 15) currentSprite = spriteLeft1;
    }
    if (moving_right) {
      // switch between sprites
      // clock decides which one
      if (currentSprite == spriteRight1 && spriteClock >= 15)
        currentSprite = spriteRight2;
      else if (spriteClock < 15) currentSprite = spriteRight1;
    } else if (!movingLeft && !movingRight) {
      currentSprite = spriteIdle;
    }
  } else if (!jump_allowed) {
    // player in air
    if (moving_left) {
      currentSprite = spriteJumpLeft;
    } else {
      currentSprite = spriteJumpRight;
    }
  }
}

// function to draw scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  //   for loop to draw all objects
  for (let obj of objects) {
    ctx.fillStyle = obj.color; // set object color
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height); // draw object
  }
  ctx.fillStyle = playerHitBox.color; // set player color
  // draw player
  ctx.fillRect(
    playerHitBox.x,
    playerHitBox.y,
    playerHitBox.width,
    playerHitBox.height
  );
  ctx.drawImage(
    currentSprite,
    0,
    0,
    32,
    32,
    playerHitBox.x,
    playerHitBox.y,
    32,
    32
  );
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
      movingLeft = true; // move left
      break;
    case "ArrowRight":
      movingRight = true; // move right
      break;
  }
});
// Add event listener for keyup events
document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      movingLeft = false; // stop moving left
      break;
    case "ArrowRight":
      movingRight = false; // stop moving right
      break;
  }
});

function update() {
  // update player sprite
  spriteManager(movingLeft, movingRight, jumpAllowed);
  // update player position based on input
  if (movingLeft) {
    playerHitBox.x -= 5; // move left
  }
  if (movingRight) {
    playerHitBox.x += 5; // move right
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
  playerHitBox.y += gravity;

  // check for collision with the object
  for (let obj of objects) {
    // Check for collision on the x-axis
    if (
      (playerHitBox.x > obj.x && playerHitBox.x <= obj.x + obj.width) ||
      (playerHitBox.x + playerHitBox.width >= obj.x &&
        playerHitBox.x + playerHitBox.width <= obj.x + obj.width)
    ) {
      // check for collision on the y-axis from above
      if (
        playerHitBox.y + playerHitBox.height + gravity >= obj.y &&
        playerHitBox.y + gravity < obj.y
      ) {
        // Not all objects should be collidable
        if (obj.collidable) {
          playerHitBox.y = obj.y - playerHitBox.height; // place player on top of the object
          jumpAllowed = true; // allow jumping again
        } else if (obj.objectType == "door") objects = obj.leadsTo;
      }
      // check for collision on the y-axis from below
      else if (
        playerHitBox.y - 50 <= obj.y + obj.height &&
        playerHitBox.y + playerHitBox.height >= obj.y + obj.height &&
        jumping
      ) {
        if (obj.collidable) {
          playerHitBox.y = obj.y + obj.height; // place player below the object
          jumpHeight = 0;
        } else if (obj.objectType == "door") objects = obj.leadsTo;
      }
    }
    // do same for vertical collision
    // Check for collision on the y-axis
    if (
      (playerHitBox.y > obj.y && playerHitBox.y <= obj.y + obj.height) ||
      (playerHitBox.y + playerHitBox.height >= obj.y &&
        playerHitBox.y + playerHitBox.height <= obj.y + obj.height)
    ) {
      // check for collision on the x-axis from the left
      if (
        playerHitBox.x + playerHitBox.width + 5 > obj.x &&
        playerHitBox.x + 5 < obj.x
      ) {
        if (obj.collidable) playerHitBox.x = obj.x - playerHitBox.width;
        // place player to the left of the object
        else if (obj.objectType == "door") objects = obj.leadsTo;
      }
      // check for collision on the x-axis from the right
      else if (
        playerHitBox.x - 5 < obj.x + obj.width &&
        playerHitBox.x + playerHitBox.width > obj.x + obj.width
      ) {
        if (obj.collidable) playerHitBox.x = obj.x + obj.width;
        // place player to the right of the object
        else if (obj.objectType == "door") objects = obj.leadsTo;
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
