import React, { useState } from "react";
import Buttons from "./Buttons";
import { directions, itemType, movePlayer } from "./functions";
import GameOver from "./GameOver";
import { getMaze } from "./mazes";
import { useInterval } from "./useInterval";
import { useKeyPress } from "./useKeyPress";

function App() {
  const [maze, setMaze] = useState(getMaze);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState(directions.IDLE);

  useKeyPress("ArrowUp", () => setDirection(directions.UP));
  useKeyPress("ArrowDown", () => setDirection(directions.DOWN));
  useKeyPress("ArrowLeft", () => setDirection(directions.LEFT));
  useKeyPress("ArrowRight", () => setDirection(directions.RIGHT));

  useInterval(() => {
    goToDirection();
  }, 400);

  function goToDirection() {
    const updatedMaze = movePlayer(maze, direction, onMove);
    setMaze(updatedMaze);
  }

  function onMove(item) {
    if (item.type === itemType.DOT) setScore(score + 1);
    if (item.type === itemType.FOOD) setScore(score + 10);
  }

  function resetGame() {
    setMaze(getMaze());
    setScore(0);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>My KPN Game</h1>

      <div>SCORE: {score}</div>

      <div>
        {maze.reachedExit && <GameOver score={score} tryAgain={resetGame} />}
      </div>

      <svg width={maze.width} height={maze.height}>
        <rect width={maze.width} height={maze.height} />

        {maze.items.map(function (item) {
          return <Item item={item} />;
        })}
      </svg>

      <Buttons buttonClicked={(direction) => setDirection(direction)} />
    </div>
  );
}

function Item({ item }) {
  if (item.type === itemType.PLAYER)
    return <circle r="7" fill="yellow" cx={item.x} cy={item.y} />;
  if (item.type === itemType.FOOD)
    return <circle r="7" fill="green" cx={item.x} cy={item.y} />;
  if (item.type === itemType.DOT)
    return <circle r="2" fill="green" cx={item.x} cy={item.y} />;
  if (item.type === itemType.EXIT || item.type === itemType.NONE) return null;
  else
    return (
      <rect
        width="20"
        height="20"
        x={item.x}
        y={item.y}
        fill="brown"
        rx="5"
        ry="5"
        stroke="black"
      />
    );
}

export default App;
