import { useState, useEffect, useMemo, ReactElement } from "react";
import Tile from "../Tile/Tile";
import {
  black_bishop,
  black_king,
  black_knight,
  black_pawn,
  black_queen,
  black_rook,
  white_bishop,
  white_king,
  white_knight,
  white_pawn,
  white_queen,
  white_rook,
} from "./pieces";
import "./chessboard.css";

interface Piece {
  image: string;
  x: number;
  y: number;
}

const pieces: Piece[] = [];

pieces.push({ image: white_rook, x: 0, y: 7 });
pieces.push({ image: white_knight, x: 1, y: 7 });
pieces.push({ image: white_bishop, x: 2, y: 7 });
pieces.push({ image: white_queen, x: 3, y: 7 });
pieces.push({ image: white_king, x: 4, y: 7 });
pieces.push({ image: white_bishop, x: 5, y: 7 });
pieces.push({ image: white_knight, x: 6, y: 7 });
pieces.push({ image: white_rook, x: 7, y: 7 });

pieces.push({ image: black_rook, x: 0, y: 0 });
pieces.push({ image: black_knight, x: 1, y: 0 });
pieces.push({ image: black_bishop, x: 2, y: 0 });
pieces.push({ image: black_queen, x: 3, y: 0 });
pieces.push({ image: black_king, x: 4, y: 0 });
pieces.push({ image: black_bishop, x: 5, y: 0 });
pieces.push({ image: black_knight, x: 6, y: 0 });
pieces.push({ image: black_rook, x: 7, y: 0 });
for (let i = 0; i < pieces.length; i += 1) {
  pieces.push({ image: white_pawn, x: i, y: 1 });
  pieces.push({ image: black_pawn, x: i, y: 6 });
}

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
        let Image: string = "";

        pieces.forEach((p) => {
          if (p.x === i && p.y === j) {
            Image = p.image;
          }
        });

        newBoard.push(<Tile image={Image} coordinates={coordinates} />);
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
