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

// get backgrounds for rooms
let backgroundStartRoom = new Image();
backgroundStartRoom.src = "imgs/backgroundStartRoom.png";

let backgroundProjectRoom = new Image();
backgroundProjectRoom.src = "imgs/backgroundProjectRoom.png";

let backgroundSitex = new Image();
backgroundSitex.src = "imgs/backgroundSitex.png";

let currentBackground = backgroundStartRoom;

// player hitbox
const playerHitBox = {
  x: 133,
  y: 100,
  width: 15,
  height: 28,
  color: "rgba(0, 0, 0, 0)",
};
// create objects and room
// initialize rooms
let startRoom = []; // start room objects
let projectsRoom = []; // projects room objects
// objects in the start room
const floorObject = {
  x: 0,
  y: 162,
  width: 320,
  height: 30,
  color: "rgba(00, 0, 0, 0.0)",
  collidable: true, // can collide with player
  type: "obj",
};
const deskObject = {
  x: 26,
  y: 139,
  width: 65,
  height: 2,
  color: "rgba(0, 0, 0, 0.0)",
  collidable: true, // can collide with player
  type: "obj",
};
const shelfObject = {
  x: 221,
  y: 114,
  width: 39,
  height: 2,
  color: "rgba(0, 0, 0, 0.0)",
  collidable: true, // can collide with player
  type: "obj",
};
const wallShelfObject = {
  x: 105,
  y: 78,
  width: 74,
  height: 3,
  color: "rgba(0, 0, 0, 0.0)",
  collidable: true, // can collide with player
  type: "obj",
};
const doorProjects = {
  x: 280,
  y: 125,
  width: 20,
  height: 36,
  color: "rgba(0,0,0,0)",
  collidable: false,
  type: "door",
  leadsTo: "projectsRoom",
  leadsToBackground: backgroundProjectRoom, // leads to projects room
};
startRoom = [
  floorObject,
  deskObject,
  shelfObject,
  wallShelfObject,
  doorProjects,
];
const doorStart = {
  x: 30,
  y: 125,
  width: 5,
  height: 36,
  color: "rgba(0,0,0,0)",
  collidable: false,
  type: "door",
  leadsTo: "startRoom",
  leadsToBackground: backgroundStartRoom, // leads to projects room
};
// objects in the projects room
const sitexObject = {
  x: 90,
  y: 130,
  width: 20,
  height: 31,
  color: "rgba(0, 0, 0, 0)",
  collidable: false, // can collide with player
  type: "hologram",
  background: backgroundSitex,
};
projectsRoom = [floorObject, sitexObject, doorStart];

let currentRoom = startRoom;

// function to manage/switch between player sprites
// global variable to give sprites time before switching
let spriteClock = 20;
function spriteManager(moving_left, moving_right, jump_allowed) {
  spriteClock--;
  // reset spriteclock
  if (spriteClock <= 0) spriteClock = 20;
  // Check if we need the jump sprites
  if (jump_allowed) {
    // player on floor
    if (moving_left) {
      // switch between sprites
      // clock decides which one
      if (currentSprite == spriteLeft1 && spriteClock >= 10)
        currentSprite = spriteLeft2;
      else if (spriteClock < 10) currentSprite = spriteLeft1;
    }
    if (moving_right) {
      // switch between sprites
      // clock decides which one
      if (currentSprite == spriteRight1 && spriteClock >= 10)
        currentSprite = spriteRight2;
      else if (spriteClock < 10) currentSprite = spriteRight1;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw background
  ctx.drawImage(currentBackground, 0, 0, canvas.width, canvas.height);
  // draw all objects
  //   for loop to draw all objects
  for (let obj of currentRoom) {
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
    playerHitBox.x - 6,
    playerHitBox.y - 4,
    32,
    32
  );
}

// #region game logic

// variables
// movement variables
let movingLeft = false;
let movingRight = false;
// jumping variables
let jumping = false;
let jumpAllowed = false; // allow jumping only when on the ground
let jumpHeight = 20; // height of the jump
// gravity variable
let gravity = 4;

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
    // stop moving when leaving the screen
    if (playerHitBox.x <= 0) {
      playerHitBox.x = 0; // prevent going off screen
    } else playerHitBox.x -= 2; // move left
  }
  if (movingRight) {
    if (playerHitBox.x + playerHitBox.width >= 320) {
      playerHitBox.x = 320 - playerHitBox.height; // prevent going off screen
    } else {
      playerHitBox.x += 2; // move right
    }
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
      jumpHeight = 20; // reset jump height
    } else {
      jumpHeight -= 1; // decrease jump height
    }
  }

  // apply gravity
  playerHitBox.y += gravity;

  // check for collision with the object
  for (let obj of currentRoom) {
    // collision from top to not fall through objects
    if (
      playerHitBox.y + playerHitBox.height + 4 > obj.y &&
      playerHitBox.y < obj.y
    ) {
      if (
        (playerHitBox.x > obj.x ||
          playerHitBox.x + playerHitBox.width > obj.x) &&
        playerHitBox.x < obj.x + obj.width
      ) {
        if (obj.collidable) {
          playerHitBox.y = obj.y - playerHitBox.height;
          jumpAllowed = true;
        }
      }
    }
    // collision on x axis is only necessary for doors and holograms
    if (
      playerHitBox.x + playerHitBox.width + 2 > obj.x &&
      playerHitBox.x < obj.x
    ) {
      if (
        (playerHitBox.y > obj.y ||
          playerHitBox.y + playerHitBox.height > obj.y) &&
        playerHitBox.y < obj.y + obj.height
      ) {
        if (!obj.collidable) {
          // change room & background when colliding with door
          if (obj.type == "door") {
            if (obj.leadsTo == "projectsRoom") currentRoom = projectsRoom;
            if (obj.leadsTo == "startRoom") currentRoom = startRoom;
            currentBackground = obj.leadsToBackground;
          }
          // change background when colliding with hologram
          if (obj.type == "hologram") {
            currentBackground == obj.background
              ? (currentBackground = backgroundProjectRoom)
              : (currentBackground = obj.background);
          }
        }
      }
    }
  }
}
// #endregion

// region rendering

// cap frames per second
let lastTime = 0;
const frameDuration = 1000 / 60; // 60 FPS

// game loop
function gameLoop(timstamp) {
  if (timstamp - lastTime >= frameDuration) {
    update(); // update game state
    draw(); // draw the scene
    lastTime = timstamp; // update lastTime to current timestamp
  }
  requestAnimationFrame(gameLoop); // call gameLoop again for the next frame
}

gameLoop(); // start the game loop
