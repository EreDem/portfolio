import { useEffect, useState, useRef } from "react";
import * as Assets from "./assets.jsx";

function Player() {
  const [x, setX] = useState(800);
  const [y, setY] = useState(0);
  const [moving, setMoving] = useState({ left: false, right: false });
  const [jumping, setJumping] = useState(false);
  // detects if player is ready to jump
  const [onFloor, setOnFloor] = useState(true);
  // accelerate player instead of moving at constant speed
  const [speedBoost, setSpeedBoost] = useState(1);
  // gravity direction, turn around when jumping
  const [grav, setGrav] = useState(50);
  // state array of all objects needed for collision logic
  const [objects, setObjects] = useState([{ x: 400, y: 800, w: 500, h: 5 }]);

  const gravRef = useRef(grav);
  useEffect(() => {
    gravRef.current = grav;
  }, [grav]);

  const onFloorRef = useRef(onFloor);
  useEffect(() => {
    onFloorRef.current = onFloor;
  }, [onFloor]);

  // player movement logic
  useEffect(() => {
    // simulate gravity
    const gravityInterval = setInterval(() => {
      setY((y) => Math.min(window.innerHeight - 100, y + gravRef.current));
    }, 30);

    const handleKeyDown = (e) => {
      // left and right movement
      if (e.key === "ArrowLeft") setMoving((m) => ({ ...m, left: true }));
      if (e.key === "ArrowRight") setMoving((m) => ({ ...m, right: true }));
      // jump
      if (e.key === "ArrowUp" && onFloorRef) {
        setJumping(true);
        setGrav(-50);
        setTimeout(() => {
          setGrav(50); // Reset gravity after 0.3 seconds
        }, 300);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft") setMoving((m) => ({ ...m, left: false }));
      if (e.key === "ArrowRight") setMoving((m) => ({ ...m, right: false }));
      setSpeedBoost(1); // Reset speed when key is released
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(gravityInterval);
    };
  }, []);

  // move player
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (moving.left) {
        setSpeedBoost((s) => Math.min(1.5, s * 1.05));
        setX((x) => Math.max(0, x - 10 * speedBoost));
      }
      if (moving.right) {
        setSpeedBoost((s) => Math.min(1.5, s * 1.05));
        setX((x) => Math.min(window.innerWidth - 100, x + 10 * speedBoost));
      }
    }, 30);

    return () => clearInterval(moveInterval);
  }, [moving, speedBoost, jumping]);

  // collision logic
  // Idea: Save all objects of a room in a list and iterate through it, look for collisions

  // use objecttop, playertop etc to make it more readable

  useEffect(() => {
    objects.forEach((obj) => {
      // collision top line of player
      if (
        (x + 100 >= obj.x && x <= obj.x + obj.w) ||
        (x + 100 >= obj.x && x <= obj.x) ||
        (x + 100 >= obj.x + obj.w && x <= obj.x + obj.w)
      ) {
        if (y + 100 + 10 >= obj.y && y <= obj.y + obj.h) {
          console.log("Collision with object");
          setY(obj.y);
          setOnFloor(true);
          setGrav(0); // Reset gravity
        }
        if (y - 10 <= obj.y + obj.h && y + 100 >= obj.y + obj.h) {
          console.log("Collision with object");
          setY(obj.y);
          setOnFloor(true);
          setGrav(50);
        }
        console.log("Collision with top of object");
        setY(obj.y - 100);
        setOnFloor(true);
        setGrav(0); // Reset gravity
      } else {
        setOnFloor(false);
        setGrav(50); // Reset gravity if not on floor
      }
      console.log("Player Y:", y, "Object Y:", obj.y);
    });
  }, [x, y, jumping, objects]);

  // objects

  return (
    <div>
      {Assets.PlayerIcon(x, y)}
      {/* add objects to the scene */}
      {Assets.Object}
    </div>
  );
}

export default Player;
