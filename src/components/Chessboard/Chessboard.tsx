import { useState, useEffect, useMemo, ReactElement } from "react";
import Tile from "../Tile/Tile";
import "./chessboard.css";

function Chessboard() {
  const [board, setBoard] = useState<ReactElement[]>([]);
  const verticalAxis: string[] = useMemo(
    () => ["1", "2", "3", "4", "5", "6", "7", "8"],
    []
  );
  const horizontalAxis: string[] = useMemo(
    () => ["a", "b", "c", "d", "e", "f", "g", "h"],
    []
  );

  useEffect(() => {
    const newBoard = [];
    for (let i = verticalAxis.length - 1; i >= 0; i -= 1) {
      for (let j = 0; j < horizontalAxis.length; j += 1) {
        const coordinates = i + j + 2;
        newBoard.push(<Tile coordinates={coordinates} />);
      }
    }
    setBoard(newBoard);
  }, [horizontalAxis, verticalAxis]);

  const verticalAxisItems = verticalAxis.map((item) => <div>{item}</div>);
  const horizontalAxisItems = horizontalAxis.map((item) => <div>{item}</div>);

  return (
    <div className="Chessboard">
      <div className="vertical">{verticalAxisItems}</div>
      <div>
        <div className="board">{board}</div>
        <div className="horizontal">{horizontalAxisItems}</div>
      </div>
    </div>
  );
}

export default Chessboard;
