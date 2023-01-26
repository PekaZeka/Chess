/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect, useMemo, ReactElement, MouseEvent } from "react";
import Tile from "../Tile/Tile";
import "./chessboard.css";

interface Piece {
  image: string;
  x: number;
  y: number;
}

const pieces: Piece[] = [];
let activePiece: HTMLElement | null = null;

for (let p = 0; p < 2; p += 1) {
  const pieceColor = p === 0 ? "black" : "white";
  const x = p === 0 ? 7 : 0;

  pieces.push({ image: `assets/images/${pieceColor}_rook.png`, x, y: 0 });
  pieces.push({
    image: `assets/images/${pieceColor}_knight.png`,
    x,
    y: 1,
  });
  pieces.push({
    image: `assets/images/${pieceColor}_bishop.png`,
    x,
    y: 2,
  });
  pieces.push({
    image: `assets/images/${pieceColor}_queen.png`,
    x,
    y: 3,
  });
  pieces.push({ image: `assets/images/${pieceColor}_king.png`, x, y: 4 });
  pieces.push({
    image: `assets/images/${pieceColor}_bishop.png`,
    x,
    y: 5,
  });
  pieces.push({
    image: `assets/images/${pieceColor}_knight.png`,
    x,
    y: 6,
  });
  pieces.push({ image: `assets/images/${pieceColor}_rook.png`, x, y: 7 });
}
for (let i = 0; i < 8; i += 1) {
  pieces.push({ image: "assets/images/white_pawn.png", x: 1, y: i });
  pieces.push({ image: "assets/images/black_pawn.png", x: 6, y: i });
}
function grabPiece(e: MouseEvent) {
  const element = e.target as HTMLElement;
  if (element.classList.contains("chess_piece")) {
    const x = e.clientX - 50;
    const y = e.clientY - 50;
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    activePiece = element;
  }
}
function movePiece(e: MouseEvent) {
  if (activePiece) {
    const x = e.clientX - 50;
    const y = e.clientY - 50;
    activePiece.style.position = "absolute";
    activePiece.style.left = `${x}px`;
    activePiece.style.top = `${y}px`;
  }
}
function dropPiece() {
  if (activePiece) activePiece = null;
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
        let image: string = "";

        pieces.forEach((p) => {
          if (p.x === i && p.y === j) {
            image = p.image;
          }
        });

        newBoard.push(
          <Tile key={`${i},${j}`} image={image} coordinates={coordinates} />
        );
      }
    }
    setBoard(newBoard);
  }, [horizontalAxis, verticalAxis]);

  const verticalAxisItems = verticalAxis.map((item) => (
    <div key={item}>{item}</div>
  ));
  const horizontalAxisItems = horizontalAxis.map((item) => (
    <div key={item}>{item}</div>
  ));

  return (
    <div
      className="Chessboard"
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={() => dropPiece()}
    >
      <div className="vertical">{verticalAxisItems}</div>
      <div>
        <div className="board">{board}</div>
        <div className="horizontal">{horizontalAxisItems}</div>
      </div>
    </div>
  );
}

export default Chessboard;
