import { useState } from "react";
import "./App.css";
import Player from "./PlayerLayer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Player />
      </div>
    </>
  );
}

export default App;
