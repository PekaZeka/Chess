/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useRef } from "react";
import "./chessboard.css";
import Tile from "../Tile/Tile";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from "../../Constants";
import { Piece, Position } from "../../models";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

export default function Chessboard({ playMove, pieces }: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(
    new Position(-1, -1)
  );
  const chessboardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );

      const currentPiece = pieces.find((p) => p.samePosition(grabPosition));

      if (currentPiece) {
        const succes = playMove(currentPiece.clone(), new Position(x, y));

        if (!succes) {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  const board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j -= 1) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i += 1) {
      const coordinates = j + i + 2;
      const piece = pieces.find((p) => p.samePosition(new Position(i, j)));
      const image = piece ? piece.image : undefined;
      const currentPiece =
        activePiece != null
          ? pieces.find((p) => p.samePosition(grabPosition))
          : undefined;
      const highlight = currentPiece?.possibleMoves
        ? currentPiece.possibleMoves.some((p) =>
            p.samePosition(new Position(i, j))
          )
        : false;

      board.push(
        <Tile
          key={`${i},${j}`}
          image={image}
          coordinates={coordinates}
          highlight={highlight}
        />
      );
    }
  }

  const verticalAxisItems = VERTICAL_AXIS.map((item) => (
    <div className="axis_items" key={item}>
      {item}
    </div>
  ));
  const horizontalAxisItems = HORIZONTAL_AXIS.map((item) => (
    <div className="axis_items" key={item}>
      {item}
    </div>
  ));

  return (
    <div className="Chessboard">
      <div className="vertical">{verticalAxisItems}</div>
      <div>
        <div
          className="board"
          onMouseDown={(e) => grabPiece(e)}
          onMouseMove={(e) => movePiece(e)}
          onMouseUp={(e) => dropPiece(e)}
          ref={chessboardRef}
        >
          {board}
        </div>
        <div className="horizontal">{horizontalAxisItems}</div>
      </div>
    </div>
  );
}
