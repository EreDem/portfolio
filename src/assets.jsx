// This file will contain all objects to keep the main jsx files clean
export const PlayerIcon = (x, y) => (
  <svg
    width="100"
    height="100"
    style={{
      position: "absolute",
      left: x,
      top: y,
    }}
  >
    <rect width="100" height="100" fill="red" />
  </svg>
);

export const Object = (
  <svg
    width="500"
    height="5"
    style={{
      position: "absolute",
      left: 400,
      top: 800,
    }}
  >
    <rect width="500" height="5"></rect>
  </svg>
);
