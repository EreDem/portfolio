import { useEffect, useState } from "react";

function Player() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") setY((y) => Math.max(0, y - 10));
      if (e.key === "ArrowDown") setY((y) => Math.min(150, y + 10));
      if (e.key === "ArrowLeft") setX((x) => Math.max(0, x - 10));
      if (e.key === "ArrowRight") setX((x) => Math.min(150, x + 10));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const PlayerIcon = (
    <svg width="100" height="100">
      <rect x={x} y={y} width="100" height="100" fill="red" />
    </svg>
  );

  return <div>{PlayerIcon}</div>;
}

export default Player;
